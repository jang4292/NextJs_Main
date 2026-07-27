import { describe, expect, it, vi } from "vitest";
import { sendContactEmail } from "./contactApi";

describe("sendContactEmail", () => {
  it("posts contact form data to the route handler", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "ok" }), {
        status: 200,
      }),
    );

    await expect(
      sendContactEmail(
        { title: "문의", sender: "me@example.com", content: "hello" },
        fetcher,
      ),
    ).resolves.toEqual({ message: "ok" });

    expect(fetcher).toHaveBeenCalledWith(
      "/api/send-email",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "문의",
          sender: "me@example.com",
          content: "hello",
        }),
      }),
    );
  });

  it("throws the server-provided error message when available", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "rate limited" }), {
        status: 429,
      }),
    );

    await expect(
      sendContactEmail(
        { title: "문의", sender: "me@example.com", content: "hello" },
        fetcher,
      ),
    ).rejects.toThrow("rate limited");
  });
});
