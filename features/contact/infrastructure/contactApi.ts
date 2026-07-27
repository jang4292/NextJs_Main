import type {
  ErrorResponse,
  SendEmailRequest,
  SendEmailResponse,
} from "../domain/entities/ContactMessage";

export async function sendContactEmail(
  data: SendEmailRequest,
  fetcher: typeof fetch = fetch,
): Promise<SendEmailResponse> {
  const res = await fetcher("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorData: Partial<ErrorResponse> = {};
    try {
      errorData = (await res.json()) as Partial<ErrorResponse>;
    } catch {
      // Keep the user-facing fallback below if the server returned no JSON.
    }
    throw new Error(errorData.message || "메일 발송 실패");
  }

  return res.json() as Promise<SendEmailResponse>;
}
