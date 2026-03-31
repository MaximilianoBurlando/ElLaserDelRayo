import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline";
};

const Button: React.FC<Props> = ({
  children,
  onClick,
  variant = "outline",
}) => {
  const baseStyles =
    "px-4 py-2 rounded-xl font-medium transition duration-200";

  const variants = {
    primary: "bg-black text-white hover:bg-gray-800",
    outline:
      "border-2 border-black text-black hover:bg-black hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;