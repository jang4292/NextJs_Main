import { describe, expect, it } from "vitest";
import {
  buildContactHtml,
  escapeHtml,
  isValidEmail,
  sanitizeHeaderValue,
} from "./email";

describe("escapeHtml", () => {
  it("escapes &, <, >, \", and '", () => {
    expect(escapeHtml(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&#39;");
  });

  it("leaves plain text untouched", () => {
    expect(escapeHtml("hello world")).toBe("hello world");
  });

  it("neutralizes a script tag", () => {
    expect(escapeHtml("<script>alert(1)</script>")).not.toContain("<script>");
  });
});

describe("isValidEmail", () => {
  it("accepts a standard email address", () => {
    expect(isValidEmail("a@b.com")).toBe(true);
  });

  it("rejects a missing @", () => {
    expect(isValidEmail("a-b.com")).toBe(false);
  });

  it("rejects a missing TLD", () => {
    expect(isValidEmail("a@b")).toBe(false);
  });

  it("rejects embedded whitespace", () => {
    expect(isValidEmail("a @b.com")).toBe(false);
  });

  it("rejects embedded angle brackets", () => {
    expect(isValidEmail("a<b>@b.com")).toBe(false);
  });

  it("rejects embedded CR/LF", () => {
    expect(isValidEmail("a@b.com\r\nBcc:evil@x.com")).toBe(false);
  });
});

describe("sanitizeHeaderValue", () => {
  it("strips CRLF header-injection payloads", () => {
    const result = sanitizeHeaderValue("Subject\r\nBcc: evil@example.com");
    expect(result).not.toMatch(/[\r\n]/);
  });

  it("trims surrounding whitespace", () => {
    expect(sanitizeHeaderValue("  hello  ")).toBe("hello");
  });

  it("truncates to the max length", () => {
    const result = sanitizeHeaderValue("a".repeat(300), 200);
    expect(result).toHaveLength(200);
  });
});

describe("buildContactHtml", () => {
  it("never emits an unescaped script tag from malicious input", () => {
    const html = buildContactHtml({
      title: "<script>alert(1)</script>",
      sender: "attacker@example.com",
      content: "</pre><script>alert(2)</script>",
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("includes the escaped title, sender, and content", () => {
    const html = buildContactHtml({
      title: "Hi",
      sender: "a@b.com",
      content: "body text",
    });
    expect(html).toContain("Hi");
    expect(html).toContain("a@b.com");
    expect(html).toContain("body text");
  });
});
