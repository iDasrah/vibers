import { Module } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyController } from './spotify.controller';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  controllers: [SpotifyController],
  providers: [SpotifyService, PrismaService],
  exports: [],
})
export class SpotifyModule {}
