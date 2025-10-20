'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SubmitButton from '@/components/SubmitButton';
import Leaderboard from '@/components/Leaderboard';
import { LeaderboardManager, LeaderboardEntry } from '@/utils/leaderboard';

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load leaderboard data
    const loadLeaderboard = async () => {
      try {
        const data = await LeaderboardManager.getLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
        setLeaderboard([]);
      }
    };
    
    loadLeaderboard();
  }, []);

  const exportData = async () => {
    try {
      const data = await LeaderboardManager.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leaderboard_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('❌ Failed to export data. Please try again.');
    }
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="🏆 Leaderboard" />
      
      <main className="flex-1 container mx-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Stats Summary */}
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg p-6 mb-8 text-center">
            <h2 className="text-2xl font-bold text-orange-900 mb-4">
              🪔 Lamp Lighting Champions 🪔
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/70 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">{leaderboard.length}</div>
                <div className="text-sm text-gray-600">Total Players</div>
              </div>
              <div className="bg-white/70 rounded-lg p-4">
                {leaderboard.length > 0 && (
                  <>
                    <div className="text-2xl font-bold text-green-600">
                      {leaderboard[0]?.completionTimeDisplay}
                    </div>
                    <div className="text-sm text-gray-600">Fastest Time</div>
                  </>
                )}
              </div>
              <div className="bg-white/70 rounded-lg p-4">
                {leaderboard.length > 0 && (
                  <>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(leaderboard.reduce((sum, entry) => sum + entry.completionTimeSeconds, 0) / leaderboard.length / 60)}m
                    </div>
                    <div className="text-sm text-gray-600">Average Time</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Leaderboard */}
          <Leaderboard entries={leaderboard} showTop={50} />

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <SubmitButton onClick={() => router.push('/')} className="px-8 py-3 text-base">
              🏠 Back to Game
            </SubmitButton>
            
            {leaderboard.length > 0 && (
              <button
                onClick={exportData}
                className="px-8 py-3 text-base font-bold text-white rounded-lg
                         bg-gradient-to-r from-blue-500 to-blue-700
                         hover:from-blue-600 hover:to-blue-800
                         transform hover:scale-105 transition-all duration-300
                         shadow-lg hover:shadow-xl"
              >
                📊 Export Data
              </button>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
