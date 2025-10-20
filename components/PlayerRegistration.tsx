import React from 'react';

interface PlayerRegistrationProps {
  playerName: string;
  playerEmail: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
  isValid: boolean;
}

const PlayerRegistration: React.FC<PlayerRegistrationProps> = ({
  playerName,
  playerEmail,
  onNameChange,
  onEmailChange,
  onSubmit,
  isValid
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      onSubmit();
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur rounded-lg p-8 shadow-xl mb-8">
      <h3 className="text-2xl font-bold text-orange-900 mb-6 text-center">
        🎮 Register to Play
      </h3>
      
      <div className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="block text-sm font-semibold text-orange-800 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your full name"
            className="w-full p-3 border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-orange-800 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={playerEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="your.email@company.com"
            className="w-full p-3 border-2 border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none"
          />
        </div>
        
        <button
          onClick={onSubmit}
          disabled={!isValid}
          className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all duration-300 ${
            isValid 
              ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 transform hover:scale-105' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          🚀 Start the Hunt
        </button>
      </div>
      
      <p className="text-center text-sm text-orange-600 mt-4">
        * Required fields - We'll track your completion time!
      </p>
    </div>
  );
};

export default PlayerRegistration;
