import React from "react";
import { render, waitFor } from "@testing-library/react";
import { App } from "../app";
import { isLoggedInVar } from "../../apollo";

jest.mock("../../router/logged-out-router", () => {
  return {
    LoggedOutRouter: () => <span>logged-out</span>,
  };
});

jest.mock("../../router/logged-in-router", () => {
  return {
    LoggedInRouter: () => <span>logged-in</span>,
  };
});

describe("App", () => {
  it("renders LoggedOutRouter", () => {
    const { debug, getByText } = render(<App />);
    getByText("logged-out");
  });

  it("renders LoggedInRouter", async () => {
    const { getByText } = render(<App />);
    await waitFor(() => {
      isLoggedInVar(true);
    });
    getByText("logged-in");
  });
});
