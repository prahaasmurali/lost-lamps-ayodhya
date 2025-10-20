import React from 'react';

interface MessageBoxProps {
  message: string;
  type: 'success' | 'error' | 'info';
  className?: string;
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, type, className = "" }) => {
  const baseClasses = "p-4 rounded-lg text-center font-semibold transition-all duration-300";
  
  const typeClasses = {
    success: "bg-green-100 text-green-800 border-2 border-green-300",
    error: "bg-red-100 text-red-800 border-2 border-red-300",
    info: "bg-blue-100 text-blue-800 border-2 border-blue-300"
  };

  if (!message) return null;

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      {message}
    </div>
  );
};

export default MessageBox;
