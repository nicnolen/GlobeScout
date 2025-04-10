import nodemailer, { Transporter, SendMailOptions, SentMessageInfo } from 'nodemailer';
import dotenv from 'dotenv';
import { catchErrorHandler } from './errorHandlers';

dotenv.config();

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASS = process.env.GMAIL_PASSWORD;

if (!USER_EMAIL || !USER_PASS) {
    throw new Error('Missing Gmail credentials in .env file');
}

export async function sendMail(
    to: string,
    subject: string,
    html: string,
    qrCodeImage?: string,
): Promise<SentMessageInfo> {
    try {
        const transporter: Transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: USER_EMAIL,
                pass: USER_PASS,
            },
        });

        const attachments: SendMailOptions['attachments'] = qrCodeImage
            ? [
                  {
                      filename: '2fa-qr-code.png',
                      content: qrCodeImage.split('base64,')[1],
                      encoding: 'base64',
                      cid: 'qr-code-image',
                  },
              ]
            : [];

        const mailOptions: SendMailOptions = {
            from: USER_EMAIL,
            to,
            subject,
            html,
            attachments,
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (err: unknown) {
        const customMessage = 'Error sending email';
        catchErrorHandler(err, customMessage);
        throw err;
    }
}
