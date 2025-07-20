import { Controller, Get, Query } from '@nestjs/common';
import { SpotifyService } from './spotify.service';

@Controller('spotify')
export class SpotifyController {
  constructor(private spotifyService: SpotifyService) {}
  @Get('search')
  searchTracks(@Query('q') query: string) {
    if (!query) {
      return { error: 'Query parameter "q" is required' };
    }
    return this.spotifyService.searchTracks(query);
  }
}
