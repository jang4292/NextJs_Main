import { describe, expect, it } from "vitest";
import {
  initialContactFormState,
  markContactFailure,
  markContactSubmitting,
  markContactSuccess,
  updateContactField,
} from "./contactFormViewModel";

describe("contactFormViewModel", () => {
  it("updates editable form fields without touching submit state", () => {
    const state = updateContactField(
      initialContactFormState,
      "sender",
      "me@example.com",
    );

    expect(state.sender).toBe("me@example.com");
    expect(state.loading).toBe(false);
    expect(state.isSuccess).toBeNull();
  });

  it("moves through submitting and success states", () => {
    const submitting = markContactSubmitting(initialContactFormState);
    const success = markContactSuccess(submitting, "sent");

    expect(submitting.loading).toBe(true);
    expect(success).toMatchObject({
      title: "",
      sender: "",
      content: "",
      loading: false,
      resultMessage: "sent",
      isSuccess: true,
    });
  });

  it("stores user-facing failure messages", () => {
    const state = markContactFailure(
      markContactSubmitting(initialContactFormState),
      new Error("메일 발송 실패"),
    );

    expect(state.loading).toBe(false);
    expect(state.resultMessage).toBe("메일 발송 실패");
    expect(state.isSuccess).toBe(false);
  });
});
