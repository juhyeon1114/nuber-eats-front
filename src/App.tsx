import { useReactiveVar } from "@apollo/client";
import React from "react";
import { isLoggedInVar } from "./apollo";
import { LoggedInRouter } from "./router/logged-in-router";
import { LoggedOutRouter } from "./router/logged-out-router";

const App = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return (
    <div className=" px-4 md:px-0">
      {isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />}
    </div>
  );
};

export default App;
