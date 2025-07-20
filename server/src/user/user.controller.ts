import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@Req() req: { user: User }) {
    return this.userService.getUserProfile(req.user.id);
  }

  @Put('edit')
  updateUser(
    @Req() req: { user: User },
    @Body()
    updateUserDto: {
      username?: string;
      avatarUrl?: string;
      bio?: string;
    },
  ) {
    return this.userService.updateUser(req.user.id, updateUserDto);
  }

  @Delete('delete')
  deleteUser(@Req() req: { user: User }) {
    return this.userService.deleteUser(req.user.id);
  }

  // Friend management operations

  @Get('friends')
  getUserFriendsList(@Req() req: { user: User }) {
    return this.userService.getUserFriendsList(req.user.id);
  }

  @Get('friends/requests/sent')
  getSentFriendRequests(@Req() req: { user: User }) {
    return this.userService.getSentFriendRequests(req.user.id);
  }

  @Get('friends/requests/received')
  getReceivedFriendRequests(@Req() req: { user: User }) {
    return this.userService.getReceivedFriendRequests(req.user.id);
  }

  @Post('friends/requests')
  sendFriendRequest(
    @Req() req: { user: User },
    @Body() { friendId }: { friendId: string },
  ) {
    return this.userService.sendFriendRequest(req.user.id, friendId);
  }

  @Delete('friends/requests/:requestId/cancel')
  cancelFriendRequest(@Param() { requestId }: { requestId: string }) {
    return this.userService.cancelFriendRequest(requestId);
  }

  @Post('friends/requests/:requestId/accept')
  acceptFriendRequest(@Param() { requestId }: { requestId: string }) {
    return this.userService.acceptFriendRequest(requestId);
  }

  @Delete('friends/requests/:requestId/reject')
  rejectFriendRequest(@Param() { requestId }: { requestId: string }) {
    return this.userService.rejectFriendRequest(requestId);
  }

  @Delete('friends/:friendId')
  removeFriend(
    @Req() req: { user: User },
    @Param('friendId') friendId: string,
  ) {
    return this.userService.removeFriend(req.user.id, friendId);
  }
}
