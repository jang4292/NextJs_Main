export interface ContactFormState {
  title: string;
  sender: string;
  content: string;
  loading: boolean;
  resultMessage: string;
  isSuccess: boolean | null;
}

export const initialContactFormState: ContactFormState = {
  title: "문의합니다",
  sender: "user@example.com",
  content: "안녕하세요.\n문의사항이 있어 연락드립니다.\n좋은 하루 보내세요!",
  loading: false,
  resultMessage: "",
  isSuccess: null,
};

export function updateContactField<
  K extends keyof Pick<ContactFormState, "title" | "sender" | "content">,
>(
  state: ContactFormState,
  field: K,
  value: ContactFormState[K],
): ContactFormState {
  return { ...state, [field]: value };
}

export function markContactSubmitting(
  state: ContactFormState,
): ContactFormState {
  return {
    ...state,
    loading: true,
    resultMessage: "",
    isSuccess: null,
  };
}

export function markContactSuccess(
  state: ContactFormState,
  message: string,
): ContactFormState {
  return {
    ...state,
    title: "",
    sender: "",
    content: "",
    loading: false,
    resultMessage: message,
    isSuccess: true,
  };
}

export function markContactFailure(
  state: ContactFormState,
  error: unknown,
): ContactFormState {
  return {
    ...state,
    loading: false,
    resultMessage:
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.",
    isSuccess: false,
  };
}
