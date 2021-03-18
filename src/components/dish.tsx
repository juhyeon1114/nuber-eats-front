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
  addOptionToItem?: (dishId: number, options: any) => void;
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
  addOptionToItem,
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
          {options?.map((option, idx) => (
            <span
              className="flex items-center border p-1"
              key={idx}
              onClick={() =>
                addOptionToItem
                  ? addOptionToItem(id, {
                      name: option.name,
                    })
                  : null
              }
            >
              <h6 className="mr-2">{option.name}</h6>
              <h6 className="text-sm opacity-75">
                ({option.extra ? option.extra : 0}원)
              </h6>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
