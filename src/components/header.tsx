import React from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMe } from "../hooks/useMe";
import nuberLogo from "../images/logo.svg";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  const { data } = useMe();

  return (
    <header className=" py-4">
      <div className="w-full px-5 xl:px-0 max-w-screen-xl mx-auto flex justify-between items-center">
        <img src={nuberLogo} className="w-34 mb-10" alt="logo" />
        <span className="text-xs">
          <Link to="/my-profile">
            <FontAwesomeIcon icon={faUser} className="text-lg mr-4" />
            {data?.me.email}
          </Link>
        </span>
      </div>
    </header>
  );
};