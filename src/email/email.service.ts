import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { from } from 'rxjs';

@Injectable()
export class EmailService {
    constructor (
        private mailerService : MailerService
    ) {}

    async sendEmail(options: { email: string; subject: string; html: string;}) {
        {
            try {
              
              const message = {
                from: process.env.FROM_EMAIL,
                to: options.email,
                subject: options.subject,
                html: options.html
              };
              const emailSend = await this.mailerService.sendMail({
                ...message,
              });
              
              return emailSend;
            } catch (error) {              
              throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
            }
          }
    }
}
