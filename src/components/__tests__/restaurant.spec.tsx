import React from "react";
import { render } from "@testing-library/react";
import { Restaurant } from "../restaurant";
import { BrowserRouter as Router } from "react-router-dom";

describe("Restaurant", () => {
  it("renders OK with props", () => {
    const props = {
      id: "1",
      name: "name",
      categoryName: "category",
      coverImage: "hello",
    };
    const { debug, getByText, container } = render(
      <Router>
        <Restaurant {...props} />
      </Router>
    );
    getByText(props.name);
    getByText(props.categoryName);
    expect(container.firstChild).toHaveAttribute(
      "href",
      `/restaurant/${props.id}`
    );
  });
});
