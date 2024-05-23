import React, { ReactNode } from 'react';

interface CustomCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const CustomCard: React.FC<CustomCardProps> = ({ children, onClick, className }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-[#1c1c1c] rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
};

export default CustomCard;
