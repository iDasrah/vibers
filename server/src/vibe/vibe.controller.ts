import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { VibeService } from './vibe.service';
import { User } from '../types';

@Controller('vibes')
export class VibeController {
  constructor(private vibeService: VibeService) {}

  @Get(':vibeId')
  getVibe(@Param('vibeId') vibeId: string) {
    return this.vibeService.getVibe(vibeId);
  }

  @Post('create')
  createVibe(@Req() req: { user: User }, @Body() body: { trackId: string }) {
    const createVibeDto = {
      userId: req.user.id,
      trackId: body.trackId,
    };
    return this.vibeService.createVibe(createVibeDto);
  }

  @Delete(':vibeId')
  deleteVibe(@Param('vibeId') vibeId: string) {
    return this.vibeService.deleteVibe(vibeId);
  }

  @Post(':vibeId/react')
  addReact(
    @Req() req: { user: User },
    @Param('vibeId') vibeId: string,
    @Body() body: { emoji: string },
  ) {
    const addReactionDto = {
      userId: req.user.id,
      emoji: body.emoji,
    };
    return this.vibeService.addReact(vibeId, addReactionDto);
  }
}
