import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { backendMessages } from 'libs';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    try {
      if (!token) {
        throw new UnauthorizedException(
          backendMessages.authorization.UNAUTHORIZED_USER,
        );
      }
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      });
      const user = await this.authService.getUserIfRefreshTokenMatches(
        payload.id,
        token,
      );
      if (!user) {
        throw new UnauthorizedException(
          backendMessages.authorization.UNAUTHORIZED_USER,
        );
      }
      request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException(
        'jwtRefreshGuard failed: ' + error.message,
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Refresh' ? token : undefined;
  }
}
