import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto, IUser } from 'libs';
import { AuthService } from './auth.service';
import { LocalAuthenticationGuard } from './guards/localAuthentication.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @Post('sign-in')
  @UseGuards(LocalAuthenticationGuard)
  async signIn(@CurrentUser() user: IUser) {
    return await this.authService.signIn(user);
  }

  // @HttpCode(200)
  // @Get('sign-out')
  // @UseGuards(JwtAuthGuard)
  // signOut(@CurrentUser('id') userId: number) {
  //   return this.authService.signOut(userId);
  // }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@CurrentUser() user: IUser) {
    return await this.authService.refresh(user);
  }
}
