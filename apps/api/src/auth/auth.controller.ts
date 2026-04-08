import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  RegisterDto,
  ResendOTPDto,
  ResetPasswordDto,
  VerifyOTPDto,
} from './dto/auth.dto';
import { RegisterResponse } from '@workspace/shared/schema/auth/auth.response';
import { type Response, type Request as eRequest } from 'express';
import { type RequestWithUser } from '../types/auth.type';
import { GetDeviceInfo } from '../common/decorators/device-info.decorator';
import { type DeviceInfoType } from '@workspace/shared/schema/auth/auth.dto';
import { AtGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Đăng ký -> gửi otp
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterDto): Promise<RegisterResponse> {
    return await this.authService.register(body);
  }
  // Xác thực otp (đăng ký, quên mật khẩu)
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() body: VerifyOTPDto,
    @Req() req: eRequest,
    @Res({ passthrough: true }) res: Response,
    @GetDeviceInfo() deviceInfo: DeviceInfoType,
  ) {
    const data = await this.authService.verifyOTP(body, deviceInfo);

    if (body.type === 'REGISTER' && 'accessToken' in data) {
      this.authService.setCookies(res, data);
      return {
        message: 'Tạo tài khoản thành công!',
        user: data.user,
      };
    }

    return data;
  }

  // Gửi lại otp
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body() body: ResendOTPDto) {
    return await this.authService.resendOtp(body);
  }

  // Đăng nhập
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Request() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
    @GetDeviceInfo() deviceInfo: DeviceInfoType,
  ) {
    const data = await this.authService.generateTokens(req.user.id, deviceInfo);
    this.authService.setCookies(res, data);

    return {
      message: 'Đăng nhập thành công!',
      user: {
        userName: req.user.userName,
        firstName: req.user.firstName,
        role: req.user.role.slug,
      },
    };
  }
  // Đăng xuất
  @Post('logout')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Req() req: RequestWithUser,
  ) {
    await this.authService.deleteSession(
      req.user.id,
      req.cookies['refreshToken'],
    );
    this.authService.clearCookies(res);
    return { message: 'Đăng xuất thành công!' };
  }
  // Lấy thông tin
  @Get('me')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: RequestWithUser) {
    const user = await this.authService.getMe(req.user.id);

    return {
      message: 'Lấy thông tin thành công!',
      user,
    };
  }

  // Quên mật khẩu
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: { email: string }) {
    return await this.authService.forgotPassword(body.email);
  }
  // Đổi mật khẩu
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() body: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response,
    @GetDeviceInfo() deviceInfo: DeviceInfoType,
  ) {
    // Gọi service xử lý đổi pass và lấy token mới
    const result = await this.authService.resetPassword(body, deviceInfo);

    // Đổi pass xong, tự động đăng nhập luôn cho người dùng
    this.authService.setCookies(res, {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    return {
      message: 'Đổi mật khẩu thành công!',
      user: result.user,
    };
  }
}
