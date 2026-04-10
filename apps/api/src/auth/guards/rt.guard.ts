import { PrismaService } from '@/src/prisma/prisma.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class RtGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies?.['refreshToken'];
    if (!refreshToken)
      throw new UnauthorizedException('Không tìm thấy phiên đăng nhập');

    const session = await this.prisma.session.findFirst({
      where: {
        refreshToken: refreshToken,
        expiresAt: { gt: new Date() },
      },
    });

    if (!session)
      throw new UnauthorizedException(
        'Phiên đăng nhập không hợp lệ hoặc đã hết hạn',
      );

    request.user = { id: session.userId };
    return true;
  }
}
