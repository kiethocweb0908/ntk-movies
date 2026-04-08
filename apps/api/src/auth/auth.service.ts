import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  DeviceInfoType,
  RegisterType,
  ResendOtpType,
  ResetPasswordType,
  VerifyOtpType,
} from '@workspace/shared/schema/auth/auth.dto';
import crypto from 'crypto';
import { MailService } from '../mail/mail.service';
import {
  RegisterResponse,
  Verify_FORGOT_PASSWORD,
  Verify_REGISTER,
} from '@workspace/shared/schema/auth/auth.response';
import { Response } from 'express';

type PENDING_DATA_REGISTER = {
  email: string;
  userName: string;
  hashPassword: string;
  firstName: string;
  lastName: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  //Xác thực
  async validateUser(identifier: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { userName: identifier }],
      },
      include: { role: true },
    });
    if (!user)
      throw new UnauthorizedException(
        'Tài khoản hoặc mật khẩu không đúng aaa!',
      );

    const isMatch = await this.comparePassword(user.hashPassword!, password);
    if (!isMatch)
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng!');

    return user;
  }

  // Mã hoá
  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }
  // So sánh Pass
  async comparePassword(hash: string, password: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  }
  // Tạo token
  async generateTokens(userId: string, deviceInfo: DeviceInfoType) {
    const refreshToken = this.randomString();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const isMobile = deviceInfo?.device !== 'Desktop';
    const existingSessionInGroup = await this.prisma.session.findFirst({
      where: {
        userId,
        device: isMobile ? { notIn: ['Desktop'] } : { in: ['Desktop'] },
      },
    });

    const [accessToken] = await Promise.all([
      this.jwtService.signAsync({ sub: userId }, { expiresIn: '15m' }),
      existingSessionInGroup
        ? this.prisma.session.update({
            where: { id: existingSessionInGroup.id },
            data: {
              refreshToken,
              expiresAt,
              device: deviceInfo?.device,
              browser: deviceInfo?.browser,
              os: deviceInfo?.os,
              ipAddress: deviceInfo?.ipAddress,
            },
          })
        : this.prisma.session.create({
            data: {
              userId,
              refreshToken,
              expiresAt,
              device: deviceInfo?.device,
              browser: deviceInfo?.browser,
              os: deviceInfo?.os,
              ipAddress: deviceInfo?.ipAddress,
            },
          }),
    ]);

    return { accessToken, refreshToken };
  }
  // Chuỗi cho token
  randomString() {
    return crypto.randomBytes(32).toString('hex');
  }
  // Set token vào cookie
  setCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  // clear token
  clearCookies(res: Response) {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite:
        process.env.NODE_ENV === 'production'
          ? ('none' as const)
          : ('lax' as const),
      path: '/',
      expires: new Date(0),
    };

    res.cookie('accessToken', '', cookieOptions);
    res.cookie('refreshToken', '', cookieOptions);
  }
  // Đăng xuất
  async deleteSession(userId: string, refreshToken: string) {
    await this.prisma.session.deleteMany({
      where: {
        userId,
        refreshToken,
      },
    });
  }

  // Thời gian otp
  expiresAtOTP() {
    return new Date(Date.now() + 5 * 60 * 1000);
  }
  // Tạo otp
  generateOTP() {
    return crypto.randomInt(100000, 1000000).toString();
  }

  //============================================================
  //-----------------                         ------------------
  //============================================================

  // Đăng ký -> gửi otp
  async register(data: RegisterType): Promise<RegisterResponse> {
    const { email, userName, password, firstName, lastName } = data;

    // check
    const [existingEmail, existingUsername] = await Promise.all([
      this.prisma.user.findUnique({
        where: { email },
      }),
      this.prisma.user.findUnique({
        where: { userName },
      }),
    ]);
    if (existingEmail || existingUsername) {
      if (existingEmail && existingUsername)
        throw new BadRequestException('Email và username đã tồn tại');
      else if (existingEmail) throw new BadRequestException('Email đã tồn tại');
      else if (existingUsername)
        throw new BadRequestException('username đã tồn tại');
    }

    const hashPassword = await this.hashPassword(password);
    const otp = this.generateOTP();
    const expiresAt = this.expiresAtOTP();
    // xoá bản cũ
    await this.prisma.oTP.deleteMany({
      where: { email, type: 'REGISTER' },
    });

    // tạo mới
    await this.prisma.oTP.create({
      data: {
        email,
        otp,
        type: 'REGISTER',
        expiresAt,
        pendingData: {
          email,
          userName,
          hashPassword,
          firstName,
          lastName,
        } as any,
      },
    });

    try {
      await this.mailService.sendOtp(email, otp, `${firstName} ${lastName}`);
    } catch (error) {
      throw new BadRequestException(
        'Không thể gửi email lúc này, vui lòng thử lại sau',
      );
    }

    return {
      message: `Mã OTP đã được gửi đến email ${email}. Vui lòng xác thực trong 5 phút.`,
      email,
    };
  }

  // Xác thực OTP (đăng ký và quên mật khẩu)
  async verifyOTP(
    data: VerifyOtpType,
    deviceInfo?: DeviceInfoType,
  ): Promise<Verify_REGISTER | Verify_FORGOT_PASSWORD> {
    const { email, otp, type } = data;

    // kiểm tra tồn tại
    const otpRecord = await this.prisma.oTP.findFirst({
      where: {
        email,
        type,
      },
    });
    if (!otpRecord) throw new NotFoundException('Mã OTP đã hết hạn!');

    if (otpRecord.attempts >= 5)
      throw new BadRequestException(
        'Bạn đã nhập sai quá số lần cho phép, vui lòng tạo yêu cầu mới!',
      );

    if (otpRecord.otp !== otp) {
      await this.prisma.oTP.update({
        where: { id: otpRecord.id },
        data: { attempts: { increment: 1 } }, // Prisma sẽ tự tăng lên 1 trong DB
      });
      throw new BadRequestException(
        `Mã OTP không chính xác, ${otpRecord.attempts === 5 ? 'bạn đã hết lượt, vui lòng tạo yêu cầu mới!' : `còn lại ${5 - otpRecord.attempts} lượt`}`,
      );
    }

    // đăng ký
    if (type === 'REGISTER') {
      const userData = otpRecord.pendingData as PENDING_DATA_REGISTER;

      const newUser = await this.prisma.user.create({
        data: {
          email: userData.email,
          userName: userData.userName,
          hashPassword: userData.hashPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: {
            connect: { slug: 'user' },
          },
        },
      });

      await this.prisma.oTP.delete({ where: { id: otpRecord.id } });

      const { accessToken, refreshToken } = await this.generateTokens(
        newUser.id,
        deviceInfo!,
      );
      return {
        accessToken,
        refreshToken,
        user: {
          lastName: newUser.lastName,
          firstName: newUser.firstName,
          email: newUser.email,
          userName: newUser.userName,
        },
      };
    }

    if (type === 'FORGOT_PASSWORD') {
      const user = await this.prisma.user.findFirst({ where: { email } });
      if (!user) throw new NotFoundException('Người dùng không tồn tại');

      const resetPasswordToken = this.randomString();
      const resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken,
          resetPasswordExpires,
        },
      });

      await this.prisma.oTP.delete({ where: { id: otpRecord.id } });

      return {
        message: 'Xác thực thành công, vui lòng đặt lại mật khẩu',
        resetPasswordToken,
      };
    }
    throw new BadRequestException('Yêu cầu không hợp lệ');
  }

  // Gửi lại OTP
  async resendOtp(data: ResendOtpType) {
    const { email, type } = data;

    const existingOtp = await this.prisma.oTP.findFirst({
      where: { AND: { email, type } },
    });
    if (!existingOtp) throw new NotFoundException('Yêu cầu đã hết hạn!');

    const RESEND_WAIT_TIME = 30 * 1000;
    const lastUpdated = existingOtp.updatedAt.getTime();
    const now = Date.now();
    const notEnoughTime = now - lastUpdated < RESEND_WAIT_TIME;
    const timeElapsed = now - lastUpdated;

    if (timeElapsed < RESEND_WAIT_TIME) {
      const secondsLeft = Math.ceil((RESEND_WAIT_TIME - timeElapsed) / 1000);
      throw new BadRequestException(
        `Thao tác quá nhanh, vui lòng thử lại sau ${secondsLeft} giây!`,
      );
    }

    const otp = this.generateOTP();
    const expiresAt = this.expiresAtOTP();

    await this.prisma.oTP.update({
      where: { id: existingOtp.id },
      data: {
        otp,
        expiresAt,
        attempts: 0,
      },
    });

    const userData = existingOtp.pendingData as any;
    const fullName = userData
      ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
      : 'Bạn';

    await this.mailService.sendOtp(email, otp, fullName, type);
    return {
      message: `Mã OTP đã được gửi lại ${email}`,
    };
  }

  // Lấy thông tin
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        userName: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        role: {
          select: {
            slug: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    return user;
  }

  // Quên mật khẩu
  async forgotPassword(identifier: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { userName: identifier }],
      },
    });

    if (!existingUser)
      throw new NotFoundException('Người dùng không tồn tại trong hệ thống');

    const otp = this.generateOTP();
    const expiresAt = this.expiresAtOTP();

    const existingOTP = await this.prisma.oTP.findFirst({
      where: {
        email: existingUser.email,
        type: 'FORGOT_PASSWORD',
      },
    });
    existingOTP
      ? await this.prisma.oTP.updateMany({
          where: {
            email: existingUser.email,
            type: 'FORGOT_PASSWORD',
          },
          data: {
            attempts: 0,
            otp,
            expiresAt,
          },
        })
      : await this.prisma.oTP.create({
          data: {
            email: existingUser.email,
            otp,
            expiresAt,
            type: 'FORGOT_PASSWORD',
            attempts: 0,
          },
        });

    const fullName =
      (existingUser.firstName + ' ' + existingUser.lastName).trim() || 'Bạn';
    // await this.mailService.sendOtp(
    //   existingUser.email,
    //   otp,
    //   fullName,
    //   'FORGOT_PASSWORD',
    // );
    console.log('OTP: ', otp);

    return {
      message: `Mã OTP đã được gửi đến email ${existingUser.email}. Vui lòng xác thực trong 5 phút.`,
      email: existingUser.email,
    };
  }

  // Đổi mật khẩu
  async resetPassword(data: ResetPasswordType, deviceInfo: DeviceInfoType) {
    const { email, password, resetToken } = data;

    const user = await this.prisma.user.findFirst({
      where: {
        email,
        resetPasswordToken: resetToken,
        resetPasswordExpires: {
          gt: new Date(), // Phải lớn hơn thời gian hiện tại
        },
      },
    });
    if (!user)
      throw new BadRequestException(
        'Yêu cầu đổi mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng thử lại!',
      );

    const hashPassword = await this.hashPassword(password);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        hashPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    await this.prisma.session.deleteMany({
      where: { userId: user.id },
    });

    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      deviceInfo,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        lastName: user.lastName,
        firstName: user.firstName,
        email: user.email,
        userName: user.userName,
      },
    };
  }
}
