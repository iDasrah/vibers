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

  @Get(':id')
  getUser(@Param('id') userId: string) {
    return this.userService.getUser(userId);
  }

  @Get(':id/profile')
  getUserProfile(@Param('id') userId: string) {
    return this.userService.getUserProfile(userId);
  }

  @Post()
  createUser(@Body() createUserDto: { username: string }) {
    return this.userService.createUser(createUserDto);
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

  @Get(':id/friends')
  getUserFriendsList(@Param('id') userId: string) {
    return this.userService.getUserFriendsList(userId);
  }

  @Post(':id/friends')
  addFriend(
    @Param('id') userId: string,
    @Body() friendDto: { friendId: string },
  ) {
    return this.userService.addFriend(userId, friendDto.friendId);
  }

  @Delete(':id/friends/:friendId')
  removeFriend(
    @Param('id') userId: string,
    @Param('friendId') friendId: string,
  ) {
    return this.userService.removeFriend(userId, friendId);
  }
}
