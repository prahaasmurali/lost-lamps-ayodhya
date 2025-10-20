import React from 'react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "The Lost Lamps of Ayodhya" }) => {
  return (
    <header className="bg-gradient-to-r from-orange-900 to-red-900 text-white p-6 shadow-lg">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-2 animate-glow">
          🪔 {title} 🪔
        </h1>
        <p className="text-orange-200 text-lg">
          A Diwali Treasure Hunt Adventure
        </p>
      </div>
    </header>
  );
};

export default Header;
