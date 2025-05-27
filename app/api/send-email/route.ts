import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface SendEmailRequest {
    title: string;
    sender: string;
    content: string;
}

export async function POST(request: NextRequest) {
    try {
        const { title, sender, content }: SendEmailRequest = await request.json();

        if (!title || !sender || !content) {
            return NextResponse.json({ message: '모든 필드를 입력해주세요.' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, // 'smtp.naver.com'
            port: Number(process.env.SMTP_PORT), // 465
            secure: process.env.SMTP_SECURE === 'true', // true
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // 메일 옵션
        const mailOptions = {
            from: sender,
            to: process.env.RECEIVER_EMAIL, // 수신 이메일 (환경변수)
            subject: `[Contact] ${title}`,
            html: content,  // HTML 본문으로 전달
            replyTo: sender,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: '메일이 성공적으로 발송되었습니다.' });
    } catch (error) {
        console.error('메일 전송 실패:', error);
        return NextResponse.json(
            { message: '메일 전송 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
