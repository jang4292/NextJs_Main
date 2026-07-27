import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ContactForm } from "./ContactForm";

describe("ContactForm", () => {
  it("renders the view-model default form state", () => {
    const html = renderToStaticMarkup(<ContactForm />);

    expect(html).toContain("Contact Us");
    expect(html).toContain("문의합니다");
    expect(html).toContain("user@example.com");
  });
});
