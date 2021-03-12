describe("Create Account", () => {
  const user = cy;
  it("should see email/password validation errors", () => {
    user.visit("/");
    user.findByText("회원가입").click();
    user.findByPlaceholderText(/email/i).type("bad@email");
    user.findByRole("alert").should("have.text", "이메일을 입력해주세요");
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("test@test.com");
    user
      .findByPlaceholderText(/password/i)
      .type("x")
      .clear();
    user.findByRole("alert").should("have.text", "Password is required");
  });
  it("should be able to create account", () => {
    user.intercept("http:/localhost:4000/graphql", (req) => {
      const { operationName } = req.body;
      if (operationName && operationName === "createAccountMutation") {
        req.reply((res) => {
          res.send({ fixture: "auth/create-account.json" });
        });
      }
    });
    user.visit("/create-account");
    user.findByPlaceholderText(/email/i).type("tets@test.com");
    user.findByPlaceholderText(/password/i).type("thisispassword");
    user.findByRole("button").click();
    user.wait(1000);
    // @ts-ignore
    user.login("juhyeon@gomiad.com", "rlawngus");
  });
});
