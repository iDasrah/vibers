import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // CRUD operations for user management

  getUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  getUserProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        avatarUrl: true,
        bio: true,
        ListeningNow: true,
      },
    });
  }

  createUser(createUserDto: { username: string }) {
    return this.prisma.user.create({
      data: {
        username: createUserDto.username,
        spotifyId: createUserDto.username,
      },
    });
  }

  updateUser(
    userId: string,
    updateUserDto: { username?: string; avatarUrl?: string; bio?: string },
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        username: updateUserDto.username,
        avatarUrl: updateUserDto.avatarUrl,
        bio: updateUserDto.bio,
      },
    });
  }

  deleteUser(userId: string) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  getUserFriendsList(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        friends: {
          select: {
            friend: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
  }

  addFriend(userId: string, friendId: string) {
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

  removeFriend(userId: string, friendId: string) {
    return this.prisma.friend.deleteMany({
      where: {
        OR: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });
  }
}
