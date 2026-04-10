import { Injectable } from '@nestjs/common';
import { Brevo, BrevoClient } from '@getbrevo/brevo';

type MailType = 'REGISTER' | 'FORGOT_PASSWORD';
@Injectable()
export class MailService {
  private client: BrevoClient;

  constructor() {
    this.client = new BrevoClient({
      apiKey: process.env.BREVO_API_KEY as string,
    });
  }

  async sendOtp(
    email: string,
    otp: string,
    fullName: string,
    type: MailType = 'REGISTER',
  ): Promise<Brevo.SendTransacEmailResponse> {
    const isForgot = type === 'FORGOT_PASSWORD';
    const subject = isForgot
      ? 'Khôi phục mật khẩu tài khoản NTK-Phim'
      : 'Mã xác thực đăng ký - NTK-Phim';

    const sender = {
      name: 'NTK-Phim',
      email: 'kiethocweb0908@gmail.com',
    };

    const to = [{ email: email, name: fullName }];

    try {
      const data = await this.client.transactionalEmails.sendTransacEmail({
        subject: subject,
        sender,
        to,
        htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: ${isForgot ? '#EF4444' : '#4F46E5'};">
            ${isForgot ? 'Yêu cầu đặt lại mật khẩu' : `Chào ${fullName},`}
            </h2>
            <p style="color: #4b5563;">${
              isForgot
                ? 'Bạn đang yêu cầu đặt lại mật khẩu'
                : 'Cảm ơn bạn đã đăng ký'
            }. Để tiếp tục, vui lòng sử dụng mã xác thực dưới đây:</p>
            <div style="background-color: #f3f4f6; padding: 15px; text-align: center; border-radius: 6px; margin: 20px 0;">
                <h1 style="color: #4F46E5; letter-spacing: 5px; margin: 0; font-size: 32px;">${otp}</h1>
            </div>
            <p style="color: #6b7280; font-size: 14px;">Mã này sẽ hết hạn sau <strong>5 phút</strong>.</p>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">Đây là email tự động, vui lòng không phản hồi. Nếu bạn không yêu cầu mã này, hãy bảo mật tài khoản của mình.</p>
            </div>
        `,
      });

      return data;
    } catch (error) {
      console.error('Lỗi Brevo:', error);
      throw error;
    }
  }
}
