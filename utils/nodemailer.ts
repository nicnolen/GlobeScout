import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { catchErrorHandler } from './errorHandlers';

dotenv.config();

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASS = process.env.GMAIL_PASSWORD;

if (!USER_EMAIL || !USER_PASS) {
    throw new Error('Missing Gmail credentials in .env file');
}

export const sendMail = async (to: string, subject: string, html: string, qrCodeImage?: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: USER_EMAIL,
                pass: USER_PASS,
            },
        });

        // Initialize the attachments array
        let attachments: any[] = [];

        // If a QR code image exists, add it as an inline attachment
        if (qrCodeImage) {
            attachments.push({
                filename: '2fa-qr-code.png', // The filename for the image
                content: qrCodeImage.split('base64,')[1], // Strip the base64 header part
                encoding: 'base64', // Encoding type for Base64 content
                cid: 'qr-code-image', // Reference ID used in the HTML image tag
            });
        }

        const info = await transporter.sendMail({
            from: USER_EMAIL,
            to,
            subject,
            html,
            attachments: attachments,
        });

        return info;
    } catch (err: unknown) {
        const customMessage = 'Error sending email';
        catchErrorHandler(err, customMessage);
        throw err;
    }
};
