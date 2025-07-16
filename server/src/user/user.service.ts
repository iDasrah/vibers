import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
        spotifyId: '1234567890',
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
}
