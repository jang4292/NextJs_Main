const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(input: string): string {
  return input.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);
}

const EMAIL_PATTERN = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

export function isValidEmail(input: string): boolean {
  return EMAIL_PATTERN.test(input);
}

export function sanitizeHeaderValue(input: string, maxLength = 200): string {
  return input
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function buildContactHtml({
  title,
  sender,
  content,
}: {
  title: string;
  sender: string;
  content: string;
}): string {
  return `
    <div style="font-family: 'Inter', sans-serif; color: #1f2937; padding: 24px; background-color: #f9fafb;">
      <h1 style="color: #3b82f6; font-size: 24px; margin-bottom: 16px;">${escapeHtml(title)}</h1>
      <p style="margin-bottom: 12px;">보내는 사람: <strong>${escapeHtml(sender)}</strong></p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">
      <pre style="white-space: pre-wrap; font-size: 16px; line-height: 1.5;">${escapeHtml(content)}</pre>
      <footer style="margin-top: 32px; font-size: 12px; color: #6b7280;">
        이 메일은 자동 발송된 메시지입니다.
      </footer>
    </div>
  `;
}
