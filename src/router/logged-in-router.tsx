import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useHistory } from "react-router-dom";
import { LOCALSTORAGE_TOKEN } from "../constants";

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const LoggedInRouter = () => {
  const history = useHistory();
  const { data, loading, error } = useQuery(ME_QUERY);

  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  const onClick = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    history.push("/login");
  };

  return (
    <div>
      <h1>{data.me.role}</h1>
      <button onClick={onClick}>logout</button>
    </div>
  );
};
