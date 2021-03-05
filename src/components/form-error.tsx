import React from "react";

interface IFormErrorProps {
  msg: string;
}

export const FormError: React.FC<IFormErrorProps> = ({ msg }) => (
  <span className="font-medium text-red-500">{msg}</span>
);
