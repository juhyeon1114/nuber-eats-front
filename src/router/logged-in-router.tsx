import React from "react";
import { useHistory } from "react-router-dom";
import { LOCALSTORAGE_TOKEN } from "../constants";

export const LoggedInRouter = () => {
  const history = useHistory();
  const onClick = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    history.push("/login");
  };
  return (
    <div>
      <h1>logged in</h1>
      <button onClick={onClick}>logout</button>
    </div>
  );
};
