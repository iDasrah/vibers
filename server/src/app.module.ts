import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SpotifyService } from './spotify/spotify.service';
import { SpotifyModule } from './spotify/spotify.module';
import { VibeModule } from './vibe/vibe.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [UserModule, AuthModule, SpotifyModule, VibeModule],
  controllers: [AppController, UserController],
  providers: [AppService, SpotifyService, PrismaService],
})
export class AppModule {}
