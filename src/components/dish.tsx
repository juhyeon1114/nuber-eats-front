import React from "react";
import { restaurant_restaurant_restaurant_menu_options } from "../__generated__/restaurant";

interface IDishProps {
  id?: number;
  description: string;
  name: string;
  price: number;
  isCustomer?: boolean;
  options?: restaurant_restaurant_restaurant_menu_options[] | null;
  orderStarted?: boolean;
  selecItemToggle?: (dishId: number) => void;
  isSelected?: boolean;
}

export const Dish: React.FC<IDishProps> = ({
  id = 0,
  description,
  name,
  price,
  isCustomer = false,
  options,
  orderStarted = false,
  selecItemToggle,
  isSelected = false,
  children: dishOptions,
}) => {
  return (
    <div
      className={`px-8 py-4 border hover:border-gray-800 transition-all ${
        isSelected ? "border-gray-800" : "hover:border-gray-800"
      }`}
    >
      <div className="mb-5">
        <h4 className="text-lg font-medium ">
          {name}{" "}
          {orderStarted && selecItemToggle && (
            <button
              className={`btn px-2 py-1 text-sm ${
                isSelected ? "bg-red-500" : ""
              }`}
              onClick={() => selecItemToggle(id)}
            >
              {isSelected ? "삭제" : "선택"}
            </button>
          )}
        </h4>
        <h5 className="font-medium">{description}</h5>
      </div>
      <span>{price}원</span>
      {isCustomer && options && options.length > 0 && (
        <div>
          <h5 className="mt-8 mb-3 font-medium">옵션</h5>
          {dishOptions}
        </div>
      )}
    </div>
  );
};
