'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubmitButton from '@/components/SubmitButton';
import Leaderboard from '@/components/Leaderboard';
import { gameStory } from '@/data/clues';
import { LeaderboardManager, LeaderboardEntry } from '@/utils/leaderboard';

// Confetti component
const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="confetti absolute"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

export default function VictoryPage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [playerEmail, setPlayerEmail] = useState('');
  const [completionTime, setCompletionTime] = useState('');
  const [completionTimeSeconds, setCompletionTimeSeconds] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerStats, setPlayerStats] = useState<any>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if user has access to victory page
    if (typeof window !== 'undefined') {
      const hasAccess = localStorage.getItem('victory_unlocked');
      if (!hasAccess) {
        router.push('/');
        return;
      }

      // Get player info and calculate completion time
      const storedName = localStorage.getItem('player_name') || 'Champion';
      const storedEmail = localStorage.getItem('player_email') || '';
      const startTime = localStorage.getItem('game_start_time');
      
      setPlayerName(storedName);
      setPlayerEmail(storedEmail);

      if (startTime) {
        const endTime = Date.now();
        const timeTaken = Math.floor((endTime - parseInt(startTime)) / 1000);
        const minutes = Math.floor(timeTaken / 60);
        const seconds = timeTaken % 60;
        setCompletionTime(`${minutes}m ${seconds}s`);
        setCompletionTimeSeconds(timeTaken);
        
        // Add to leaderboard (async)
        const updateLeaderboard = async () => {
          try {
            const updatedLeaderboard = await LeaderboardManager.addEntry(storedName, storedEmail, timeTaken);
            setLeaderboard(updatedLeaderboard);
            
            // Get player stats
            const stats = await LeaderboardManager.getPlayerStats(storedEmail);
            setPlayerStats(stats);
          } catch (error) {
            console.error('Error updating leaderboard:', error);
            // Load existing leaderboard as fallback
            const existingLeaderboard = await LeaderboardManager.getLeaderboard();
            setLeaderboard(existingLeaderboard);
          }
        };

        updateLeaderboard();
      } else {
        // Load existing leaderboard
        const loadLeaderboard = async () => {
          const existingLeaderboard = await LeaderboardManager.getLeaderboard();
          setLeaderboard(existingLeaderboard);
        };
        loadLeaderboard();
      }
    }

    // Stop confetti after 10 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  const resetGame = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
    router.push('/');
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {showConfetti && <Confetti />}
      
      <Header title="Victory!" />
      
      <main className="flex-1 container mx-auto p-8 text-center relative z-20">
        <div className="max-w-4xl mx-auto">
          {/* Animated Victory Lamps */}
          <div className="flex justify-center space-x-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="lamp-container">
                <div className="text-6xl animate-flicker">🪔</div>
                <div className="lamp-flame"></div>
                <div className="diya-glow rounded-full w-16 h-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"></div>
              </div>
            ))}
          </div>
          
          <h1 className="text-5xl font-bold text-orange-900 mb-6 animate-glow">
            🎉 Victory! 🎉
          </h1>
          
          <div className="bg-white/80 backdrop-blur rounded-lg p-8 shadow-xl mb-8">
            <h2 className="text-3xl font-bold text-festival-red mb-4">
              The Lamps of Ayodhya Shine Bright!
            </h2>
            
            {completionTime && (
              <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4 mb-6">
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  🎊 Congratulations {playerName}! 🎊
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <p className="text-green-700 text-lg font-semibold">
                      ⏱️ Time: {completionTime}
                    </p>
                  </div>
                  <div>
                    {playerStats?.entry && (
                      <p className="text-green-700 text-lg font-semibold">
                        🏆 Rank: #{playerStats.entry.rank} of {playerStats.totalPlayers}
                      </p>
                    )}
                  </div>
                </div>
                {playerStats?.entry && (
                  <p className="text-green-600 text-sm">
                    📊 You're faster than {playerStats.percentile}% of players!
                  </p>
                )}
                {playerEmail && (
                  <p className="text-green-600 text-sm mt-1">
                    📧 Results saved for: {playerEmail}
                  </p>
                )}
              </div>
            )}
            
            <p className="text-lg text-gray-800 leading-relaxed mb-6">
              {gameStory.victory}
            </p>
            
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-b from-diya-gold to-diya-orange p-4 rounded-lg text-white">
                <div className="text-3xl mb-2">🧠</div>
                <h3 className="font-bold">Lamp of Wisdom</h3>
                <p className="text-sm">Illuminated by Knowledge</p>
              </div>
              
              <div className="bg-gradient-to-b from-green-400 to-green-600 p-4 rounded-lg text-white">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="font-bold">Lamp of Prosperity</h3>
                <p className="text-sm">Solved with Logic</p>
              </div>
              
              <div className="bg-gradient-to-b from-red-400 to-red-600 p-4 rounded-lg text-white">
                <div className="text-3xl mb-2">⚔️</div>
                <h3 className="font-bold">Lamp of Courage</h3>
                <p className="text-sm">Decoded with Bravery</p>
              </div>
              
              <div className="bg-gradient-to-b from-purple-400 to-purple-600 p-4 rounded-lg text-white">
                <div className="text-3xl mb-2">🤖</div>
                <h3 className="font-bold">Lamp of Innovation</h3>
                <p className="text-sm">Outwitted with Cleverness</p>
              </div>
            </div>
            
            {/* Achievement Summary */}
            <div className="bg-yellow-100 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-bold text-orange-900 mb-4">
                🏆 Achievement Unlocked!
              </h3>
              <div className="text-orange-800">
                <p className="font-semibold">✨ Master of the Sacred Lamps ✨</p>
                <p className="text-sm mt-2">You have successfully completed all four challenges and restored light to Ayodhya!</p>
              </div>
            </div>
          </div>
          
{/* Leaderboard Section */}
          <div className="mb-8">
            <div className="flex justify-center space-x-4 mb-4">
              <SubmitButton 
                onClick={() => setShowLeaderboard(!showLeaderboard)} 
                className="px-8 py-3 text-base"
              >
                {showLeaderboard ? '🎯 Hide Leaderboard' : '🏆 View Leaderboard'}
              </SubmitButton>
            </div>
            
            {showLeaderboard && (
              <Leaderboard 
                entries={leaderboard} 
                currentPlayerEmail={playerEmail}
                showTop={10}
              />
            )}
          </div>

          <div className="space-y-4">
            <SubmitButton onClick={resetGame} className="text-xl px-12 py-6">
              🔄 Play Again
            </SubmitButton>
            
            <div className="text-orange-600">
              <p className="font-semibold">Happy Diwali! 🪔</p>
              <p>May the light of knowledge always guide your path</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
