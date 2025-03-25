import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASS = process.env.GMAIL_PASSWORD;

if (!USER_EMAIL || !USER_PASS) {
    throw new Error('Missing Gmail credentials in .env file');
}

export const sendMail = async (to: string, subject: string, text: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: USER_EMAIL,
                pass: USER_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: USER_EMAIL,
            to,
            subject,
            text,
        });

        return info;
    } catch (error) {
        console.error(`Error sending email: ${error}`);
        throw new Error('Email sending failed');
    }
};
