import React from "react";
import { render, RenderResult, waitFor } from "../../test-utils";
import { Login, LOGIN_MUTATION } from "../login";
import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import userEvent from "@testing-library/user-event";

describe("Login", () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient; // apollo request를 intercept할 수 있음
  jest.spyOn(Storage.prototype, "setItem");
  beforeEach(async () => {
    await waitFor(() => {
      // waitFor : state가 바뀌는 것을 await하게 해줌
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Login />
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
    await waitFor(() => {
      userEvent.type(email, "wrong@email");
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent("이메일을 입력해주세요");
    await waitFor(() => {
      userEvent.clear(email);
    });
    errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/email is required/i);
  });
  it("displays password validation errors", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const submitBtn = getByRole("button");
    await waitFor(() => {
      userEvent.type(email, "hello@world.com");
      userEvent.click(submitBtn);
    });
    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/password is required/i);
  });
  it("submit form and calls mutation", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole("button");
    const formData = {
      email: "hello@world.com",
      password: "123",
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: { ok: true, token: "xxx", error: "hello error" },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        email: formData.email,
        password: formData.password,
      },
    });
    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent("hello error");
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "xxx");
  });
});
