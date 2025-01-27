/* eslint-disable @typescript-eslint/ban-ts-comment */

import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}



interface User {
  email: string;
  accessToken: string;
  refreshToken: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  async initialize(user: User) {
    
    
    // Create the transporter with the OAuth2 credentials
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: user.email,
        accessToken: user.accessToken || undefined,
        refreshToken: user.refreshToken,
      },
    });
  }

  async sendEmail({ to, subject, text, html }: EmailOptions): Promise<void> {
    if (!this.transporter) {
      throw new Error('Email service not initialized');
    }

    try {
      await this.transporter.sendMail({

        //@ts-expect-error
        from: this.transporter.options.auth.user,
        to,
        subject,
        text,
        html,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}