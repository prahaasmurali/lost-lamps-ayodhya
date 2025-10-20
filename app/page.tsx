'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubmitButton from '@/components/SubmitButton';
import PlayerRegistration from '@/components/PlayerRegistration';
import { gameStory } from '@/data/clues';

export default function HomePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playerEmail, setPlayerEmail] = useState('');

  useEffect(() => {
    setIsClient(true);
    // Reset game progress on landing page
    if (typeof window !== 'undefined') {
      localStorage.removeItem('clue1_unlocked');
      localStorage.removeItem('clue2_unlocked');
      localStorage.removeItem('clue3_unlocked');
      localStorage.removeItem('clue3_completed');
      localStorage.removeItem('clue4_completed');
      localStorage.removeItem('victory_unlocked');
      localStorage.removeItem('game_start_time');
      localStorage.removeItem('player_name');
      localStorage.removeItem('player_email');
    }
  }, []);

  const handleStartClick = () => {
    setShowRegistration(true);
  };

  const handleRegistrationSubmit = () => {
    if (playerName.trim() && playerEmail.trim() && playerEmail.includes('@')) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('player_name', playerName);
        localStorage.setItem('player_email', playerEmail);
        localStorage.setItem('game_start_time', Date.now().toString());
        localStorage.setItem('clue1_unlocked', 'true');
      }
      router.push('/clue1');
    }
  };

  const isValidRegistration = Boolean(playerName.trim() && playerEmail.trim() && playerEmail.includes('@'));

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto p-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Animated Diyas */}
          <div className="flex justify-center space-x-8 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="lamp-container">
                <div className="text-6xl animate-flicker">🪔</div>
                <div className="lamp-flame"></div>
              </div>
            ))}
          </div>
          
          <h2 className="text-3xl font-bold text-orange-900 mb-6">
            Welcome to Ayodhya!
          </h2>
          
          <div className="bg-white/70 backdrop-blur rounded-lg p-8 shadow-xl mb-8">
            <p className="text-lg text-gray-800 leading-relaxed mb-6">
              {gameStory.intro}
            </p>
            
            <div className="text-orange-700 font-semibold mb-4">
              <p>🔥 Four sacred lamps await your wisdom</p>
              <p>🧩 Solve each riddle to unlock the next</p>
              <p>🏆 Restore light to Ayodhya and celebrate Diwali!</p>
            </div>
          </div>
          
{!showRegistration ? (
            <SubmitButton onClick={handleStartClick} className="text-xl px-12 py-6">
              🚀 Start the Hunt
            </SubmitButton>
          ) : (
            <PlayerRegistration
              playerName={playerName}
              playerEmail={playerEmail}
              onNameChange={setPlayerName}
              onEmailChange={setPlayerEmail}
              onSubmit={handleRegistrationSubmit}
              isValid={isValidRegistration}
            />
          )}
          
          <div className="mt-8">
            <div className="mb-4">
              <button
                onClick={() => router.push('/leaderboard')}
                className="px-6 py-2 text-sm font-semibold text-orange-700 border-2 border-orange-300 rounded-lg hover:bg-orange-50 transition-all duration-300"
              >
                🏆 View Leaderboard
              </button>
            </div>
            
            <div className="text-sm text-orange-600">
              <p>💡 Hints are hidden throughout the journey</p>
              <p>🔒 Progress is saved automatically</p>
              <p>⏱️ Your completion time will be tracked</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
