import React from 'react';

interface ButtonProps {
  label: string | React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'accent' | 'secondary' | 'special';
  className?: string;
  doubleWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'default', 
  className = '',
  doubleWidth = false
}) => {
  const baseStyles = "relative overflow-hidden rounded-2xl text-2xl font-medium transition-all duration-150 active:scale-95 flex items-center justify-center select-none";
  
  const variants = {
    default: "bg-gray-800 text-white hover:bg-gray-700 active:bg-gray-600 shadow-lg shadow-black/20",
    accent: "bg-orange-500 text-white hover:bg-orange-400 active:bg-orange-600 shadow-lg shadow-orange-900/20 text-3xl pb-1",
    secondary: "bg-gray-600 text-gray-100 hover:bg-gray-500 active:bg-gray-500 shadow-lg shadow-black/20",
    special: "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 shadow-lg shadow-indigo-900/30",
  };

  const widthClass = doubleWidth ? "col-span-2 aspect-[2.1/1]" : "aspect-square";

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      type="button"
    >
      {label}
    </button>
  );
};

export default Button;
