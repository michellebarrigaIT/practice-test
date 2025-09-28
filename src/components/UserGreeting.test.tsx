import { render, screen, waitFor } from "@testing-library/react";
import UserGreeting from "./UserGreeting";
import { getUserGreeting } from "../utils/greetings/utils";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

vi.mock("../utils/greetings/utils", () => ({
  getUserGreeting: vi.fn(),
}));

describe("UserGreeting", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should call 'onGreet' function and show message on the screen", async () => {
    window.fetch = vi.fn().mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce({ name: "Jane" }),
    } as any);
    (getUserGreeting as Mock).mockReturnValue("Hello, Jane!");

    const onGreet = vi.fn();

    render(<UserGreeting userId="123" onGreet={onGreet} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Hello, Jane!" })).toBeInTheDocument()
    );

    expect(onGreet).toHaveBeenCalledWith("Hello, Jane!");
  });

  it("shouldn't call 'onGreet' function and show the Error message on the screen", async () => {
    window.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

    const onGreet = vi.fn();

    render(<UserGreeting userId="456" onGreet={onGreet} />);

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Failed to load greeting.")
    );

    expect(onGreet).not.toHaveBeenCalled();
  });
});
