import React, { ButtonHTMLAttributes, FC, ReactNode } from "react";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const Button: FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      {...props}
      className={className}
    >
        {children}
    </button>
  );
};

export default Button;
