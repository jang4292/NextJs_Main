// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BottomNav } from "./BottomNav";
import { SiteNav } from "./SiteNav";

const navigationState = vi.hoisted(() => ({
  pathname: "/",
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationState.pathname,
}));

afterEach(() => {
  cleanup();
  navigationState.pathname = "/";
});

describe("public navigation", () => {
  it("renders the same four primary items in top and bottom navigation", () => {
    render(
      <>
        <SiteNav />
        <BottomNav />
      </>,
    );

    expect(screen.getAllByRole("link", { name: "Home" })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Tools" })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Learn" })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Profile" })).toHaveLength(2);
    expect(screen.queryByRole("link", { name: "Games" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Contact" })).toBeNull();
  });

  it("marks Profile as current on the contact route", () => {
    navigationState.pathname = "/contact";

    render(
      <>
        <SiteNav />
        <BottomNav />
      </>,
    );

    expect(
      screen
        .getAllByRole("link", { name: "Profile" })
        .every((link) => link.getAttribute("aria-current") === "page"),
    ).toBe(true);
  });
});
