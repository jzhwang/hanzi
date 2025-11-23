import React from 'react';

interface StampProps {
  text: string;
  className?: string;
  variant?: 'solid' | 'outline';
}

const Stamp: React.FC<StampProps> = ({ text, className = '', variant = 'outline' }) => {
  const baseStyles = "inline-flex items-center justify-center font-calligraphy select-none aspect-square leading-none";
  const variantStyles = variant === 'solid' 
    ? "bg-seal text-paper rounded-sm p-1" 
    : "border-2 border-seal text-seal rounded-sm p-1";

  return (
    <div className={`${baseStyles} ${variantStyles} ${className}`}>
      {text}
    </div>
  );
};

export default Stamp;
