import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (info?.message === 'jwt expired')
      throw new UnauthorizedException(
        'Mã xác thực đã hết hạn, vui lòng đăng nhập lại',
      );

    if (err || !user)
      throw new UnauthorizedException(
        'Vui lòng đăng nhập để thực hiện hành động này',
      );

    return user;
  }
}
