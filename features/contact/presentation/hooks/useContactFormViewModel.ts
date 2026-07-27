"use client";

import { useState } from "react";
import {
  initialContactFormState,
  markContactFailure,
  markContactSubmitting,
  markContactSuccess,
  updateContactField,
} from "../../application/use-cases/contactFormViewModel";
import { sendContactEmail } from "../../infrastructure/contactApi";

export function useContactFormViewModel() {
  const [state, setState] = useState(initialContactFormState);

  return {
    ...state,
    setTitle: (title: string) =>
      setState((current) => updateContactField(current, "title", title)),
    setSender: (sender: string) =>
      setState((current) => updateContactField(current, "sender", sender)),
    setContent: (content: string) =>
      setState((current) => updateContactField(current, "content", content)),
    submit: async () => {
      setState((current) => markContactSubmitting(current));
      try {
        const response = await sendContactEmail({
          title: state.title,
          sender: state.sender,
          content: state.content,
        });
        setState((current) => markContactSuccess(current, response.message));
      } catch (error) {
        setState((current) => markContactFailure(current, error));
      }
    },
  };
}
