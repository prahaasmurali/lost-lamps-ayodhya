'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InputBox from '@/components/InputBox';
import SubmitButton from '@/components/SubmitButton';
import MessageBox from '@/components/MessageBox';
import { clues, logicPuzzle } from '@/data/clues';

export default function Clue2Page() {
  const router = useRouter();
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [isClient, setIsClient] = useState(false);

  const clue = clues[1]; // Second clue

  useEffect(() => {
    setIsClient(true);
    // Check if user has access to this clue
    if (typeof window !== 'undefined') {
      const hasAccess = localStorage.getItem('clue2_unlocked');
      if (!hasAccess) {
        router.push('/');
        return;
      }
    }
  }, [router]);

  // The toughest question: Who sits in position 4?
  const checkSolution = () => {
    if (!answer.trim()) {
      setMessage('Please enter your answer!');
      setMessageType('error');
      return;
    }

    // The correct answer is "Rohan" (who sits in position 4)
    const correctAnswer = logicPuzzle.solution["Position 4"].person.toLowerCase();
    
    if (answer.toLowerCase().trim() === correctAnswer) {
      setMessage('🎉 Perfect! The Lamp of Prosperity shines bright!');
      setMessageType('success');
      
      // Unlock next clue
      if (typeof window !== 'undefined') {
        localStorage.setItem('clue3_unlocked', 'true');
      }
      
      // Navigate to next clue after delay
      setTimeout(() => {
        router.push('/clue3');
      }, 2000);
    } else {
      setMessage('❌ Not quite right. Think about the logical connections!');
      setMessageType('error');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkSolution();
    }
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title={clue.title} />
      
      <main className="flex-1 container mx-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Lamp Animation */}
          <div className="text-center mb-8">
            <div className="lamp-container">
              <div className="text-8xl animate-flicker">🪔</div>
              <div className="lamp-flame"></div>
            </div>
            <h2 className="text-2xl font-bold text-orange-900 mt-4">
              The Second Sacred Lamp
            </h2>
          </div>
          
          {/* Einstein Logic Puzzle */}
          <div className="bg-white/80 backdrop-blur rounded-lg p-8 shadow-xl mb-6">
            <h3 className="text-xl font-semibold text-orange-800 mb-4">
              Einstein Logic Puzzle:
            </h3>
            <p className="text-lg text-gray-800 mb-6 font-serif italic">
              "{clue.riddle}"
            </p>
            
            {/* Display Logic Clues */}
            <div className="bg-orange-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-orange-800 mb-3">Logic Clues:</h4>
              <ul className="space-y-2">
                {logicPuzzle.clues.map((clueText, index) => (
                  <li key={index} className="text-gray-700 flex items-start text-sm">
                    <span className="text-orange-600 font-bold mr-2 min-w-6">{index + 1}.</span>
                    <span>{clueText}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Challenge Question */}
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg mb-6">
              <h4 className="font-bold text-purple-900 mb-3 text-lg">
                🧠 The Ultimate Challenge:
              </h4>
              <p className="text-purple-800 mb-4">
                After solving this complex logic puzzle, answer this question to prove your mastery:
              </p>
              <p className="text-xl font-semibold text-purple-900">
                "Who sits in position 4?"
              </p>
            </div>
            
            {/* Answer Input */}
            <div className="space-y-4">
              <InputBox
                value={answer}
                onChange={setAnswer}
                placeholder="Enter the name of the person in position 4..."
                onKeyPress={handleKeyPress}
              />
              
              <div className="text-center">
                <SubmitButton onClick={checkSolution}>
                  🔥 Light the Lamp
                </SubmitButton>
              </div>
            </div>
          </div>
          
          {message && (
            <MessageBox 
              message={message} 
              type={messageType}
              className="mb-6"
            />
          )}
          
          {/* Hint */}
          <div className="text-center text-sm text-orange-600">
            <p>💡 Hint: Each devotee has a unique combination. Think logically!</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
