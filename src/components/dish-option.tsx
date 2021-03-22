import React from "react";

interface IDishOptionProps {
  isSelected: boolean;
  name: string;
  extra?: number | null;
  selectOptionToggle: (dishId: number, optionName: string) => void;
  dishId: number;
}

export const DishOption: React.FC<IDishOptionProps> = ({
  isSelected,
  name,
  extra,
  dishId,
  selectOptionToggle,
}) => {
  const onClick = () => {
    selectOptionToggle(dishId, name);
  };

  return (
    <span
      className={`flex items-center border p-1 ${
        isSelected ? "border-gray-800" : ""
      }`}
      onClick={onClick}
    >
      <h6 className="mr-2">{name}</h6>
      <h6 className="text-sm opacity-75">({extra ? extra : 0}원)</h6>
    </span>
  );
};
