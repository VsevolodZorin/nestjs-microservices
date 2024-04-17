import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, IJwtTokenPair, IUser } from 'libs';
import { AuthService } from './auth.service';
import { LocalAuthenticationGuard } from './guards/localAuthentication.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @HttpCode(200)
  @Post('sign-in')
  @UseGuards(LocalAuthenticationGuard)
  async signIn(@CurrentUser() user: IUser) {
    return this.authService.signIn(user);
  }

  @HttpCode(200)
  @Get('sign-out')
  @UseGuards(JwtAuthGuard)
  signOut(@CurrentUser('id') userId: number) {
    return this.authService.signOut(userId);
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  refresh(@CurrentUser() user: IUser): Promise<IJwtTokenPair | undefined> {
    return this.authService.refresh(user);
  }
}
