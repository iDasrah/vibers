import { Module } from '@nestjs/common';
import { VibeService } from './vibe.service';
import { VibeController } from './vibe.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [VibeService, PrismaService],
  controllers: [VibeController],
})
export class VibeModule {}
