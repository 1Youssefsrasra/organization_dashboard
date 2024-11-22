import React from "react";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  type: "button" | "submit" | "reset";
  className?: string;
  loading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  className = "",
  type,
  loading = false,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`bg-transparent text-primary border-[1px] border-primary font-semibold text-lg rounded-xl px-6 py-3 w-fit hover:scale-[102%] hover:bg-primary hover:text-white app_transition ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? "Chargement..." : children}
    </button>
  );
};

export default CustomButton;
