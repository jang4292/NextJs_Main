import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
  buildContactHtml,
  isValidEmail,
  sanitizeHeaderValue,
} from "@/lib/email";
import {
  createRateLimiter,
  getClientIp,
  rateLimitHeaders,
  RATE_LIMIT_MESSAGE,
} from "@/lib/rateLimit";

interface SendEmailRequest {
  title: string;
  sender: string;
  content: string;
}

const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 5000;
const INVALID_REQUEST_MESSAGE = "요청 형식이 올바르지 않습니다.";

const sendEmailIpLimiter = createRateLimiter({
  max: 3,
  windowMs: 10 * 60 * 1000,
});

function isSendEmailRequest(value: unknown): value is SendEmailRequest {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SendEmailRequest>;
  return (
    typeof candidate.title === "string" &&
    typeof candidate.sender === "string" &&
    typeof candidate.content === "string"
  );
}

export async function POST(request: NextRequest) {
  try {
    const ipLimit = sendEmailIpLimiter.check(getClientIp(request));
    if (!ipLimit.allowed) {
      return NextResponse.json(
        { message: RATE_LIMIT_MESSAGE },
        { status: 429, headers: rateLimitHeaders(ipLimit) },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: INVALID_REQUEST_MESSAGE },
        { status: 400 },
      );
    }

    if (!isSendEmailRequest(body)) {
      return NextResponse.json(
        { message: INVALID_REQUEST_MESSAGE },
        { status: 400 },
      );
    }

    const title = body.title.trim();
    const sender = body.sender.trim();
    const { content } = body;

    if (!title || !sender || !content.trim()) {
      return NextResponse.json(
        { message: "모든 필드를 입력해주세요." },
        { status: 400 },
      );
    }

    if (!isValidEmail(sender)) {
      return NextResponse.json(
        { message: "올바른 이메일 형식이 아닙니다." },
        { status: 400 },
      );
    }

    if (
      title.length > MAX_TITLE_LENGTH ||
      content.length > MAX_CONTENT_LENGTH
    ) {
      return NextResponse.json(
        { message: "입력 길이가 너무 깁니다." },
        { status: 400 },
      );
    }

    const sanitizedTitle = sanitizeHeaderValue(title, MAX_TITLE_LENGTH);
    const sanitizedSender = sanitizeHeaderValue(sender, MAX_TITLE_LENGTH);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // 'smtp.naver.com'
      port: Number(process.env.SMTP_PORT), // 465
      secure: process.env.SMTP_SECURE === "true", // true
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 메일 옵션
    const mailOptions = {
      from: `"YH Jang Portfolio" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL, // 수신 이메일 (환경변수)
      subject: `[Contact] ${sanitizedTitle}`,
      html: buildContactHtml({
        title: sanitizedTitle,
        sender: sanitizedSender,
        content,
      }),
      replyTo: sanitizedSender,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "메일이 성공적으로 발송되었습니다." });
  } catch (error) {
    console.error("메일 전송 실패:", error);
    return NextResponse.json(
      { message: "메일 전송 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
