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
}
