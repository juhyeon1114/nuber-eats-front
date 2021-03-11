import React from "react";
import { CreateAccount } from "../create-account";
import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { render, RenderResult, waitFor } from "../../test-utils";

describe("CreateAccount", () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient; // apollo request를 intercept할 수 있음
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });
  it("renders OK", async () => {
    await waitFor(() =>
      expect(document.title).toBe("Create Account | Nuber Eats")
    );
  });
  /**
   * 다른 테스트들은 생략... ㅋ
   */
});
