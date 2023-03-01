import { Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigurationService } from '../../config/configuration.service';
import * as nodemailer from 'nodemailer';

export interface Email {
  receivers: string[];
  subject: string;
  text?: string;
  html?: string;
}

export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private transporter;
  private emailConfig;

  constructor(
    @Inject(ConfigurationService)
    private readonly configurationService: ConfigurationService,
  ) {}

  onModuleInit() {
    this.emailConfig = this.configurationService.getConfigValue('email');
    this.transporter = nodemailer.createTransport({
      host: this.emailConfig.outgoingHost,
      port: this.emailConfig.outgoingPort,
      secure: this.emailConfig.outgoingSecure,
      auth: {
        user: this.emailConfig.username,
        pass: this.emailConfig.password,
      },
    });
  }

  async send(email: Email) {
    const params = {
      from: `"${this.emailConfig.nickname}" <${this.emailConfig.address}>`,
      to: `${email.receivers.join(', ')}`,
      subject: email.subject,
      text: email.text,
      html: email.html,
    };
    try {
      const info = await this.transporter.sendMail(params);
      this.logger.log('EmailService.send | info = ' + JSON.stringify(info));
      return nodemailer.getTestMessageUrl(info);
    } catch (err) {
      this.logger.error('EmailService.send | info = ' + JSON.stringify(err));
    }
  }
}
