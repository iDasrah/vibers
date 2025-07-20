import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local.auth-guard';
import { AuthService } from './auth.service';
import { AuthRequest } from '../types';
import { Public } from '../public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('register')
  async register(@Body() req: { username: string; password: string }) {
    const { username, password } = req;
    return this.authService.register(username, password);
  }
}
