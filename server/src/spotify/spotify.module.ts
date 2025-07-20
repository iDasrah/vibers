import { Module } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyController } from './spotify.controller';

@Module({
  imports: [],
  controllers: [SpotifyController],
  providers: [SpotifyService],
  exports: [],
})
export class SpotifyModule {}
