import React from "react";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { Login } from "../login";
import { ApolloProvider } from "@apollo/client";
import { createMockClient } from "mock-apollo-client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("Login", () => {
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      // waitFor : state가 바뀌는 것을 await하게 해줌
      const mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <HelmetProvider>
            <Router>
              <Login />
            </Router>
          </HelmetProvider>
        </ApolloProvider>
      );
    });
  });

  it("should render OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Nuber Eats");
    });
  });
  it("displays email validation errors", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i); // 대소문자를 구분하지 않겠다는 regExp
    const password = getByPlaceholderText(/password/i);
    await waitFor(() => {
      userEvent.type(email, "wrong@email");
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent("이메일을 입력해주세요");
    await waitFor(() => {
      userEvent.clear(email);
    });
  });
});
