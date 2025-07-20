import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local.auth-guard';
import { AuthService } from './auth.service';
import { AuthRequest } from '../types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() req: { username: string; password: string }) {
    const { username, password } = req;
    return this.authService.register(username, password);
  }
}
