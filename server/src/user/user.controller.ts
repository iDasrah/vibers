import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // CRUD operations for user management

  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.userService.getUser(username);
  }

  @Get(':username/profile')
  getUserProfile(@Param('username') username: string) {
    return this.userService.getUserProfile(username);
  }

  @Put(':id')
  updateUser(
    @Param('id') userId: string,
    @Body()
    updateUserDto: { username?: string; avatarUrl?: string; bio?: string },
  ) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId);
  }

  // Friend management operations

  @Get(':id/friends')
  getUserFriendsList(@Param('id') userId: string) {
    return this.userService.getUserFriendsList(userId);
  }

  @Get(':id/friends/requests/sent')
  getSentFriendRequests(@Param('id') userId: string) {
    return this.userService.getSentFriendRequests(userId);
  }

  @Get(':id/friends/requests/received')
  getReceivedFriendRequests(@Param('id') userId: string) {
    return this.userService.getReceivedFriendRequests(userId);
  }

  @Post(':id/friends/requests/:friendId')
  sendFriendRequest(
    @Param('id') userId: string,
    @Param('friendId') friendId: string,
  ) {
    return this.userService.sendFriendRequest(userId, friendId);
  }

  @Delete(':id/friends/requests/:requestId')
  cancelFriendRequest(@Param('requestId') requestId: string) {
    return this.userService.cancelFriendRequest(requestId);
  }

  @Post(':id/friends/requests/:requestId/accept')
  acceptFriendRequest(@Param('requestId') requestId: string) {
    return this.userService.acceptFriendRequest(requestId);
  }

  @Delete(':id/friends/requests/:requestId/reject')
  rejectFriendRequest(@Param('requestId') requestId: string) {
    return this.userService.rejectFriendRequest(requestId);
  }

  @Delete(':id/friends/:friendId')
  removeFriend(
    @Param('id') userId: string,
    @Param('friendId') friendId: string,
  ) {
    return this.userService.removeFriend(userId, friendId);
  }
}
