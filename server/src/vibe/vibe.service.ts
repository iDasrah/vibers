import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateVibeDto } from './dto/create-vibe.dto';
import { AddReactionDto } from './dto/add-reaction.dto';

@Injectable()
export class VibeService {
  constructor(private prisma: PrismaService) {}

  getVibe(vibeId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const vibe = await prisma.vibe.findUnique({
        where: { id: vibeId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
          track: {
            select: {
              id: true,
              name: true,
            },
          },
          reactions: {
            select: {
              id: true,
              emoji: true,
              userId: true,
            },
          },
        },
      });

      if (!vibe) {
        throw new HttpException('Vibe not found', 404);
      }

      return vibe;
    });
  }

  createVibe(createVibeDto: CreateVibeDto) {
    return this.prisma.$transaction(async (prisma) => {
      const newVibe = await prisma.vibe.create({
        data: {
          userId: createVibeDto.userId,
          trackId: createVibeDto.trackId,
        },
      });

      return newVibe;
    });
  }

  deleteVibe(vibeId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const vibe = await prisma.vibe.findUnique({
        where: { id: vibeId },
      });

      if (!vibe) {
        throw new HttpException('Vibe not found', 404);
      }

      await prisma.vibe.delete({
        where: { id: vibeId },
      });

      return { message: 'Vibe deleted successfully' };
    });
  }

  addReact(vibeId: string, addReactionDto: AddReactionDto) {
    return this.prisma.$transaction(async (prisma) => {
      const vibe = await prisma.vibe.findUnique({
        where: { id: vibeId },
      });

      if (!vibe) {
        throw new HttpException('Vibe not found', 404);
      }

      const existingReaction = await prisma.reaction.findFirst({
        where: {
          vibeId: vibeId,
          userId: addReactionDto.userId,
        },
      });

      if (existingReaction) {
        throw new HttpException('Reaction already exists', 400);
      }

      const newReaction = await prisma.reaction.create({
        data: {
          vibeId: vibeId,
          userId: addReactionDto.userId,
          emoji: addReactionDto.emoji,
        },
      });

      return newReaction;
    });
  }
}
