import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // CRUD operations for user management

  getUser(username: string) {
    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({
        where: { username: username },
        select: {
          id: true,
          username: true,
          password: true,
          avatarUrl: true,
          bio: true,
        },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    });
  }

  getUserProfileByUsername(username: string) {
    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({
        where: { username: username },
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          bio: true,
          listeningNow: true,
        },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    });
  }

  getUserProfile(userId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          bio: true,
          listeningNow: true,
        },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return user;
    });
  }

  createUser(createUserDto: { username: string; password: string }) {
    return this.prisma.$transaction(async (prisma) => {
      const existingUser = await prisma.user.findUnique({
        where: { username: createUserDto.username },
      });

      if (existingUser) {
        throw new HttpException(
          'Username already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      return prisma.user.create({
        data: {
          username: createUserDto.username,
          password: createUserDto.password,
        },
      });
    });
  }

  updateUser(
    userId: string,
    updateUserDto: { username?: string; avatarUrl?: string; bio?: string },
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return prisma.user.update({
        where: { id: userId },
        data: {
          username: updateUserDto.username ?? user.username,
          avatarUrl: updateUserDto.avatarUrl ?? user.avatarUrl,
          bio: updateUserDto.bio ?? user.bio,
        },
      });
    });
  }

  deleteUser(userId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return prisma.user.delete({ where: { id: userId } });
    });
  }

  // Friend management operations

  getUserFriendsList(userId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const friends = await prisma.friend.findMany({
        where: { userId: userId },
        select: {
          friend: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      });

      return friends.map((f) => f.friend);
    });
  }

  removeFriend(userId: string, friendId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const friend = await prisma.friend.findFirst({
        where: {
          userId: userId,
          friendId: friendId,
        },
      });

      if (!friend) {
        throw new HttpException('Friend not found', HttpStatus.NOT_FOUND);
      }

      await prisma.friend.delete({ where: { id: friend.id } });
      return prisma.friend.delete({
        where: {
          userId_friendId: {
            userId: friendId,
            friendId: userId,
          },
        },
      });
    });
  }

  getSentFriendRequests(userId: string) {
    return this.prisma.friendRequest.findMany({
      where: { fromUserId: userId },
      select: {
        id: true,
        toUser: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  getReceivedFriendRequests(userId: string) {
    return this.prisma.friendRequest.findMany({
      where: { toUserId: userId },
      select: {
        id: true,
        fromUser: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  sendFriendRequest(userId: string, friendId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const existingRequest = await prisma.friendRequest.findFirst({
        where: {
          fromUserId: userId,
          toUserId: friendId,
        },
      });

      const existingTarget = await prisma.user.findUnique({
        where: { id: friendId },
      });

      if (!existingTarget) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (existingRequest) {
        throw new HttpException(
          'Friend request already sent',
          HttpStatus.BAD_REQUEST,
        );
      }

      const existingFriendship = await prisma.friend.findFirst({
        where: {
          OR: [
            { userId: userId, friendId: friendId },
            { userId: friendId, friendId: userId },
          ],
        },
      });

      if (existingFriendship) {
        throw new HttpException(
          'You are already friends with this user',
          HttpStatus.BAD_REQUEST,
        );
      }

      return prisma.friendRequest.create({
        data: {
          fromUserId: userId,
          toUserId: friendId,
        },
      });
    });
  }

  cancelFriendRequest(requestId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const request = await prisma.friendRequest.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        throw new HttpException(
          'Friend request not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return prisma.friendRequest.delete({ where: { id: requestId } });
    });
  }

  acceptFriendRequest(requestId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const request = await prisma.friendRequest.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        throw new HttpException(
          'Friend request not found',
          HttpStatus.NOT_FOUND,
        );
      }

      await prisma.friendRequest.delete({ where: { id: requestId } });
      return this.addFriend(request.toUserId, request.fromUserId);
    });
  }

  rejectFriendRequest(requestId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const request = await prisma.friendRequest.findUnique({
        where: { id: requestId },
      });

      if (!request) {
        throw new HttpException(
          'Friend request not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return prisma.friendRequest.delete({ where: { id: requestId } });
    });
  }

  private addFriend(userId: string, friendId: string) {
    return this.prisma.friend.createManyAndReturn({
      data: [
        {
          userId: userId,
          friendId: friendId,
        },
        {
          userId: friendId,
          friendId: userId,
        },
      ],
    });
  }
}
