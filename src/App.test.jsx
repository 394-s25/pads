import { describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

describe("landing tests", () => {
  test("page should render heading", () => {
    render(<App />);
    expect(screen.getByText("NOOOOOOO")).toBeDefined();
  });
});
