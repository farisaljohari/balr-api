import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private smtpConfig: any;

  constructor(private readonly configService: ConfigService) {
    this.smtpConfig = {
      host: this.configService.get<string>('email-config.SMTP_HOST'),
      port: this.configService.get<number>('email-config.SMTP_PORT'),
      secure: this.configService.get<boolean>('email-config.SMTP_SECURE'), // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('email-config.SMTP_USER'),
        pass: this.configService.get<string>('email-config.SMTP_PASSWORD'),
      },
    };
  }

  async sendOTPEmail(
    email: string,
    subject: string,
    message: string,
  ): Promise<void> {
    const transporter = nodemailer.createTransport(this.smtpConfig);

    const mailOptions = {
      from: this.smtpConfig.auth.user,
      to: email,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
  }
}
