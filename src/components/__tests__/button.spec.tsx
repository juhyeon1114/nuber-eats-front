import React from "react";
import { render } from "@testing-library/react";
import { Button } from "../button";

describe("button", () => {
  it("should render OK with props", () => {
    const { debug, getByText } = render(
      <Button canClick={true} loading={false} actionText={"test"} />
    );
    getByText("test");
  });

  it("should display loading", () => {
    const { getByText, container } = render(
      <Button canClick={false} loading={true} actionText={"test"} />
    );

    getByText("Loading...");
    expect(container.firstChild).toHaveClass("pointer-events-none");
  });
});
