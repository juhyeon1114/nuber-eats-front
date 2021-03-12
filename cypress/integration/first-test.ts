describe("Log In", () => {
  const user = cy;
  it("should go to login page", () => {
    user.visit("/").title().should("eq", "Login | Nuber Eats");
  });
  it("can see email / password validation errors", () => {
    user.visit("/");
    user.findAllByPlaceholderText(/email/i).type("wrong@email");
    user.findByRole("alert").should("have.text", "이메일을 입력해주세요");
    user.findAllByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");
    user.findAllByPlaceholderText(/email/i).type("juhyeon@gomiad.com");
    user
      .findAllByPlaceholderText(/password/i)
      .type("xxx")
      .clear();
    user.findByRole("alert").should("have.text", "Password is required");
  });
  it("can fill out the form", () => {
    user.visit("/");
    user.findAllByPlaceholderText(/email/i).type("juhyeon@gomiad.com");
    user.findAllByPlaceholderText(/password/i).type("rlawngus");
    user
      .findByRole("button")
      .should("not.have.class", "pointer-events-none")
      .click();
    user.window().its("localStorage.token").should("be.a", "string");
  });

  it("sign up", () => {
    user.visit("/create-account");
  });
});
