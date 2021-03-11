import React from "react";
import { render } from "@testing-library/react";
import { FormError } from "../form-error";

describe("FormError", () => {
  it("renders OK whith props", () => {
    const { getByText } = render(<FormError msg="test" />);
    getByText("test");
  });
});
