import {EmailTemplate} from '@/@types/EmailTemplate';
import {logger} from '@/logger';
import ejs from 'ejs';
import path from 'node:path';
import nodemailer from 'nodemailer';

class EmailService {
  private readonly config: nodemailer.TransportOptions;

  constructor() {
    this.config = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    };
  }

  async send(template: EmailTemplate, metadata: Record<string, any>): Promise<void> {
    const transporter = nodemailer.createTransport(this.config);

    // Construct the email content based on the template and metadata
    const emailContent = await this.renderTemplate(template, metadata);

    const mailOptions: nodemailer.SendMailOptions = {
      from: this.config.auth.user,
      to: metadata.to,
      subject: 'test',
      html: emailContent,
    };

    try {
      await transporter.sendMail(mailOptions);
      logger.info('Email sent successfully!');
    } catch (error) {
      logger.error('Error sending email:', error);
    }
  }

  private async renderTemplate(template: EmailTemplate, metadata: Record<string, any>): Promise<string> {
    const templatePath = path.resolve(__dirname, '..', 'templates', `${template}.ejs`);

    try {
      const emailContent = await ejs.renderFile(templatePath, metadata);
      return emailContent;
    } catch (error) {
      console.log(error);
      logger.error('Error rendering template:', error);
      throw new Error('Template rendering failed');
    }
  }
}

const emailService = new EmailService();
export default emailService;
