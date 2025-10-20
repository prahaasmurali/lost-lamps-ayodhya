import React from 'react';

interface InputBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ 
  value, 
  onChange, 
  placeholder = "Enter your answer...", 
  className = "",
  onKeyPress
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      className={`w-full p-4 text-lg border-2 border-diya-gold rounded-lg 
                 bg-orange-50 text-orange-900 placeholder-orange-400
                 focus:outline-none focus:border-diya-orange focus:ring-2 
                 focus:ring-lamp-glow transition-all duration-300 ${className}`}
    />
  );
};

export default InputBox;
