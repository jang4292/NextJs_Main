import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resetRateLimitersForTest } from "@/lib/rateLimit";
import { POST } from "./route";

const nodemailerMock = vi.hoisted(() => ({
  createTransport: vi.fn(),
  sendMail: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: nodemailerMock.createTransport,
  },
}));

function emailRequest(body: unknown, ip = "203.0.113.20") {
  return new NextRequest("http://localhost/api/send-email", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/send-email", () => {
  beforeEach(() => {
    resetRateLimitersForTest();
    nodemailerMock.createTransport.mockReset();
    nodemailerMock.sendMail.mockReset();
    nodemailerMock.createTransport.mockReturnValue({
      sendMail: nodemailerMock.sendMail,
    });
    nodemailerMock.sendMail.mockResolvedValue(undefined);
    process.env.SMTP_HOST = "smtp.example.com";
    process.env.SMTP_PORT = "465";
    process.env.SMTP_SECURE = "true";
    process.env.SMTP_USER = "sender@example.com";
    process.env.SMTP_PASS = "smtp-password";
    process.env.RECEIVER_EMAIL = "receiver@example.com";
  });

  it("returns 400 for malformed JSON", async () => {
    const response = await POST(emailRequest("{"));

    await expect(response.json()).resolves.toEqual({
      message: "요청 형식이 올바르지 않습니다.",
    });
    expect(response.status).toBe(400);
    expect(nodemailerMock.sendMail).not.toHaveBeenCalled();
  });

  it("returns 400 for non-string fields", async () => {
    const response = await POST(
      emailRequest({ title: "문의", sender: "a@b.com", content: 123 }),
    );

    await expect(response.json()).resolves.toEqual({
      message: "요청 형식이 올바르지 않습니다.",
    });
    expect(response.status).toBe(400);
    expect(nodemailerMock.sendMail).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid email addresses", async () => {
    const response = await POST(
      emailRequest({ title: "문의", sender: "not-an-email", content: "hello" }),
    );

    await expect(response.json()).resolves.toEqual({
      message: "올바른 이메일 형식이 아닙니다.",
    });
    expect(response.status).toBe(400);
    expect(nodemailerMock.sendMail).not.toHaveBeenCalled();
  });

  it("rejects CRLF header injection in the sender email", async () => {
    const response = await POST(
      emailRequest({
        title: "문의",
        sender: "a@b.com\r\nBcc: evil@example.com",
        content: "hello",
      }),
    );

    await expect(response.json()).resolves.toEqual({
      message: "올바른 이메일 형식이 아닙니다.",
    });
    expect(response.status).toBe(400);
    expect(nodemailerMock.sendMail).not.toHaveBeenCalled();
  });

  it("returns 400 for overlong input", async () => {
    const response = await POST(
      emailRequest({
        title: "a".repeat(201),
        sender: "a@b.com",
        content: "hello",
      }),
    );

    await expect(response.json()).resolves.toEqual({
      message: "입력 길이가 너무 깁니다.",
    });
    expect(response.status).toBe(400);
    expect(nodemailerMock.sendMail).not.toHaveBeenCalled();
  });

  it("sanitizes header values before sending mail", async () => {
    const response = await POST(
      emailRequest({
        title: "Hello\r\nBcc: evil@example.com",
        sender: "a@b.com",
        content: "</pre><script>alert(1)</script>",
      }),
    );

    await expect(response.json()).resolves.toEqual({
      message: "메일이 성공적으로 발송되었습니다.",
    });
    expect(response.status).toBe(200);
    expect(nodemailerMock.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "[Contact] Hello Bcc: evil@example.com",
        replyTo: "a@b.com",
        html: expect.stringContaining("&lt;script&gt;"),
      }),
    );
  });

  it("returns 500 when SMTP env is missing", async () => {
    delete process.env.SMTP_HOST;

    const response = await POST(
      emailRequest({
        title: "문의",
        sender: "a@b.com",
        content: "hello",
      }),
    );

    await expect(response.json()).resolves.toEqual({
      message: "메일 전송 중 오류가 발생했습니다.",
    });
    expect(response.status).toBe(500);
    expect(nodemailerMock.sendMail).not.toHaveBeenCalled();
  });

  it("rate limits repeated requests from an IP", async () => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await POST(
        emailRequest({
          title: `문의 ${attempt}`,
          sender: "not-an-email",
          content: "hello",
        }),
      );
      expect(response.status).toBe(400);
    }

    const response = await POST(
      emailRequest({
        title: "문의",
        sender: "not-an-email",
        content: "hello",
      }),
    );

    await expect(response.json()).resolves.toEqual({
      message: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
    });
    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBeTruthy();
  });
});
