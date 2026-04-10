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
import { type Response, type Request as eRequest } from 'express';
import { type RequestWithUser } from '../types/auth.type';
import { GetDeviceInfo } from '../common/decorators/device-info.decorator';
import { type DeviceInfoType } from '@workspace/shared/schema/auth/auth.dto';
import { AtGuard } from './guards/jwt-auth.guard';
import { RtGuard } from './guards/rt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Đăng ký -> gửi otp
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() body: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const response = await this.authService.register(body);
    this.authService.setCookie(res, 'otp_email', response.data.email);
    this.authService.setCookie(res, 'otp_type', response.data.type);
    return {
      message: response.message || 'Đăng ký thành công',
    };
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
      this.authService.setCookies(res, {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      this.authService.setCookie(
        res,
        'accessToken',
        data.accessToken,
        15 * 60 * 1000,
      );
      this.authService.setCookie(
        res,
        'refreshToken',
        data.refreshToken,
        7 * 24 * 60 * 60 * 1000,
      );
      this.authService.clearCookies(res, 'otp_email', 'otp_type');
      return {
        message: 'Tạo tài khoản thành công!',
      };
    }
    if (body.type === 'FORGOT_PASSWORD' && 'resetPasswordToken' in data) {
      this.authService.clearCookies(res, 'otp_type');
      this.authService.setCookie(res, 'reset_token', data.resetPasswordToken);
      return { message: data.message };
    }
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
    const [accessToken, refreshToken] = await Promise.all([
      this.authService.generateAccessToken(req.user.id),
      this.authService.createSession(req.user.id, deviceInfo),
    ]);
    this.authService.setCookies(res, { accessToken, refreshToken });

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
    // this.authService.clearCookies(res, 'accessToken', 'refreshToken');
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
  async forgotPassword(
    @Body() body: { email: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await this.authService.forgotPassword(body.email);
    this.authService.setCookie(res, 'otp_email', response.email);
    this.authService.setCookie(res, 'otp_type', 'FORGOT_PASSWORD');

    return {
      message: response.message,
    };
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

    this.authService.clearCookies(res, 'otp_email', 'reset_token');

    return {
      message: 'Đổi mật khẩu thành công!',
      user: result.user,
    };
  }

  @Post('refresh')
  @UseGuards(RtGuard)
  async refresh(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.authService.generateAccessToken(req.user.id);
    this.authService.setCookies(res, { accessToken });

    return {
      message: 'Làm mới phiên đăng nhập thành công!',
    };
  }
}
