import React from 'react';

interface SubmitButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  onClick, 
  children, 
  disabled = false, 
  className = "" 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-8 py-4 text-lg font-bold text-white rounded-lg
                 bg-gradient-to-r from-diya-orange to-festival-red
                 hover:from-diya-gold hover:to-diya-orange
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transform hover:scale-105 transition-all duration-300
                 shadow-lg hover:shadow-xl animate-glow ${className}`}
    >
      {children}
    </button>
  );
};

export default SubmitButton;
