import {
  Body,
  Controller,
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
  LoginDto,
  RegisterDto,
  ResendOTPDto,
  VerifyOTPDto,
} from './dto/auth.dto';
import { RegisterResponse } from '@workspace/shared/schema/auth/auth.response';
import { type Response, type Request as eRequest } from 'express';
import { UAParser } from 'ua-parser-js';
import { type RequestWithUser } from '../types/auth.type';
import { GetDeviceInfo } from '../common/decorators/device-info.decorator';
import { type DeviceInfoType } from '@workspace/shared/schema/auth/auth.dto';

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
}
