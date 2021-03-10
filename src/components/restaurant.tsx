import React from "react";

interface IRestaurantProps {
  id: string;
  coverImage: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  id,
  coverImage,
  name,
  categoryName,
}) => (
  <div>
    <div
      className="py-28 bg-cover bg-center mb-3"
      style={{ backgroundImage: `url(${coverImage})` }}
    ></div>
    <h3 className="text-xl">{name}</h3>
    <div className=" border-t py-2 mt-4 text-xs opacity-50 border-gray-400">
      {categoryName}
    </div>
  </div>
);
