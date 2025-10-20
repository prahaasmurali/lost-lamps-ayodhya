import React from 'react';
import { LeaderboardEntry } from '@/utils/leaderboard';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentPlayerEmail?: string;
  showTop?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  entries, 
  currentPlayerEmail, 
  showTop = 10 
}) => {
  const displayEntries = entries.slice(0, showTop);
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const isCurrentPlayer = (email: string) => {
    return currentPlayerEmail && email.toLowerCase() === currentPlayerEmail.toLowerCase();
  };

  return (
    <div className="bg-white/90 backdrop-blur rounded-lg p-6 shadow-xl">
      <h3 className="text-2xl font-bold text-orange-900 mb-4 text-center">
        🏆 Leaderboard - Fastest Lamp Lighters 🏆
      </h3>
      
      {displayEntries.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          <div className="text-4xl mb-2">🪔</div>
          <p>No completion records yet.</p>
          <p className="text-sm">Be the first to light all the lamps!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayEntries.map((entry, index) => (
            <div
              key={`${entry.email}-${entry.timestamp}`}
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                isCurrentPlayer(entry.email)
                  ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-orange-400 shadow-md transform scale-105'
                  : entry.rank <= 3
                  ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`text-lg font-bold ${
                  entry.rank <= 3 ? 'text-orange-600' : 'text-gray-600'
                }`}>
                  {getRankIcon(entry.rank)}
                </div>
                
                <div>
                  <div className={`font-semibold ${
                    isCurrentPlayer(entry.email) ? 'text-orange-800' : 'text-gray-800'
                  }`}>
                    {entry.name}
                    {isCurrentPlayer(entry.email) && (
                      <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600">
                    {entry.date}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-bold text-lg ${
                  entry.rank === 1 ? 'text-yellow-600' : 
                  entry.rank <= 3 ? 'text-orange-600' : 'text-gray-700'
                }`}>
                  {entry.completionTimeDisplay}
                </div>
                {entry.rank === 1 && (
                  <div className="text-xs text-yellow-600 font-semibold">
                    👑 Record Holder
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {entries.length > showTop && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Showing top {showTop} of {entries.length} players
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
