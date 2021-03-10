import React from "react";

export const Category = ({
  coverImage,
  name,
}: {
  coverImage: string | null;
  name: string;
}) => (
  <div className="flex flex-col items-center">
    <div
      className="w-16 h-16 rounded-full bg-cover cursor-pointer"
      style={{ backgroundImage: `url(${coverImage})` }}
    ></div>
    <span className="text-sm text-center font-medium mt-1">{name}</span>
  </div>
);
