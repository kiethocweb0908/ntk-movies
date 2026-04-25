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
import { AtGuard } from '../common/guards/auth.guard';
import { NoCheckToken } from '../common/decorators/no-check-tonken.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AppResponse } from '@workspace/shared/schema/movie/movie.response';
import {
  GetMeResponse,
  LoginResponse,
  OTPResponse,
  Verify_FORGOT_PASSWORD,
  Verify_REGISTER,
} from '@workspace/shared/schema/auth/auth.response';
import { FavoriteService } from '../favorite/favorite.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly favoriteService: FavoriteService,
  ) {}

  // Đăng ký -> gửi otp
  @NoCheckToken()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterDto): Promise<AppResponse<OTPResponse>> {
    return await this.authService.register(body);
  }

  // Xác thực otp (đăng ký, quên mật khẩu)
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() body: VerifyOTPDto,
    // @Req() req: eRequest,
    @Res({ passthrough: true }) res: Response,
    @GetDeviceInfo() deviceInfo: DeviceInfoType,
  ): Promise<AppResponse<Verify_REGISTER | Verify_FORGOT_PASSWORD>> {
    return await this.authService.verifyOTP(body, deviceInfo);
  }

  // Gửi lại otp
  @NoCheckToken()
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body() body: ResendOTPDto) {
    return await this.authService.resendOtp(body);
  }

  // Đăng nhập
  @NoCheckToken()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @Request() req: RequestWithUser,
    // @Res({ passthrough: true }) res: Response,
    @GetDeviceInfo() deviceInfo: DeviceInfoType,
  ): Promise<AppResponse<LoginResponse>> {
    const [{ accessToken }, refreshToken] = await Promise.all([
      this.authService.generateAccessToken(req.user.id),
      this.authService.createSession(req.user.id, deviceInfo),
    ]);
    // this.authService.setCookies(res, { accessToken, refreshToken });
    const [favIds, user] = await Promise.all([
      this.favoriteService.getFavoriteMovieIds(req.user.id),
      this.authService.getMe(req.user.id),
    ]);

    return {
      message: 'Đăng nhập thành công!',
      data: {
        user,
        favIds,
        accessToken,
        refreshToken,
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
  ): Promise<AppResponse<null>> {
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
  async getMe(
    @Req() req: RequestWithUser,
  ): Promise<AppResponse<GetMeResponse>> {
    const [favIds, user] = await Promise.all([
      this.favoriteService.getFavoriteMovieIds(req.user.id),
      this.authService.getMe(req.user.id),
    ]);

    return {
      message: 'Lấy thông tin thành công!',
      data: {
        user,
        favIds,
      },
    };
  }

  // Quên mật khẩu
  @NoCheckToken()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() body: { identifier: string },
    @Res({ passthrough: true }) res: Response,
  ): Promise<AppResponse<OTPResponse>> {
    return await this.authService.forgotPassword(body.identifier);
  }
  // Đổi mật khẩu
  @NoCheckToken()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() body: ResetPasswordDto,
    @Res({ passthrough: true }) res: Response,
    @GetDeviceInfo() deviceInfo: DeviceInfoType,
  ) {
    // Gọi service xử lý đổi pass và lấy token mới
    return await this.authService.resetPassword(body, deviceInfo);

    // Đổi pass xong, tự động đăng nhập luôn cho người dùng
    // this.authService.setCookies(res, {
    //   accessToken: result.accessToken,
    //   refreshToken: result.refreshToken,
    // });

    // this.authService.clearCookies(res, 'otp_email', 'reset_token');
  }

  //
  @NoCheckToken()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @NoCheckToken()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @GetDeviceInfo() deviceInfo: DeviceInfoType,
  ) {
    const googleUser = req.user;
    const { accessToken, refreshToken } =
      await this.authService.loginWithGoogle(googleUser, deviceInfo);

    this.authService.setCookies(res, { accessToken, refreshToken });
    return res.redirect(process.env.FRONTEND_API as string);
  }
}
