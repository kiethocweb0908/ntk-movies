import { AuthService } from '@/src/auth/auth.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { NO_CHECK_TOKEN_KEY } from '../decorators/no-check-tonken.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AppAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isNoCheckToken = this.reflector.getAllAndOverride<boolean>(
      NO_CHECK_TOKEN_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isNoCheckToken) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const user = await this.authService.handleAuthAndRefresh(request, response);

    request.user = user;
    return true;
  }
}
