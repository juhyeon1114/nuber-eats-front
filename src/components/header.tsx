import React from "react";
import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMe } from "../hooks/useMe";
import nuberLogo from "../images/logo.svg";
import { Link, useHistory } from "react-router-dom";

export const Header: React.FC = () => {
  const history = useHistory();
  const { data } = useMe();
  const logout = () => {
    // localStorage.removeItem("token");
    localStorage.clear();
    history.push("/");
    window.location.reload();
  };

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-yellow-400 p-3 text-center text-sm">
          <span>이메일을 인증해주세요</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={nuberLogo} className="w-34" alt="logo" />
          </Link>
          <span className="text-xs">
            <Link to="/edit-profile">
              <FontAwesomeIcon icon={faUser} className="text-lg mr-4" />
              {data?.me.email}
            </Link>
            &nbsp;&nbsp;
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className="text-lg mr-4"
              onClick={() => {
                logout();
              }}
            />
          </span>
        </div>
      </header>
    </>
  );
};
