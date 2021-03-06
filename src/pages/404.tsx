import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center">
    <Helmet>
      <title>Not Found | Nuber Eats</title>
    </Helmet>
    <h2 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h2>
    <br />
    <Link className="text-blue-600" to="/">
      홈으로 &rarr;
    </Link>
  </div>
);
