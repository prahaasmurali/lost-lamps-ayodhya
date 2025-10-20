'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InputBox from '@/components/InputBox';
import SubmitButton from '@/components/SubmitButton';
import MessageBox from '@/components/MessageBox';
import { clues } from '@/data/clues';

export default function Clue3Page() {
  const router = useRouter();
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [isClient, setIsClient] = useState(false);

  const clue = clues[2]; // Third clue

  useEffect(() => {
    setIsClient(true);
    // Check if user has access to this clue
    if (typeof window !== 'undefined') {
      const hasAccess = localStorage.getItem('clue3_unlocked');
      if (!hasAccess) {
        router.push('/');
        return;
      }
    }
  }, [router]);

  const handleSubmit = () => {
    if (!answer.trim()) {
      setMessage('Please enter an answer!');
      setMessageType('error');
      return;
    }

    if (answer.toLowerCase().trim() === clue.answer.toLowerCase()) {
      setMessage('🎉 Excellent! The Lamp of Courage blazes with light!');
      setMessageType('success');
      
      // Mark clue 3 as completed and unlock clue 4
      if (typeof window !== 'undefined') {
        localStorage.setItem('clue3_completed', 'true');
      }
      
      // Navigate to clue 4 after delay
      setTimeout(() => {
        router.push('/clue4');
      }, 2000);
    } else {
      setMessage('❌ Not quite right. Remember the cipher key!');
      setMessageType('error');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title={clue.title} />
      
      <main className="flex-1 container mx-auto p-8">
        <div className="max-w-3xl mx-auto">
          {/* Lamp Animation */}
          <div className="text-center mb-8">
            <div className="lamp-container">
              <div className="text-8xl animate-flicker">🪔</div>
              <div className="lamp-flame"></div>
            </div>
            <h2 className="text-2xl font-bold text-orange-900 mt-4">
              The Final Sacred Lamp
            </h2>
          </div>
          
          {/* Cipher Puzzle */}
          <div className="bg-white/80 backdrop-blur rounded-lg p-8 shadow-xl mb-6">
            <h3 className="text-xl font-semibold text-orange-800 mb-4">
              Sacred Cipher:
            </h3>
            <p className="text-lg text-gray-800 mb-6 font-serif italic">
              Decode the ancient message to unlock courage:
            </p>
            
            {/* Cipher Display */}
            <div className="bg-orange-100 p-6 rounded-lg mb-6 text-center">
              <div className="text-3xl font-mono mb-4 tracking-wider">
                {clue.riddle.split('🪔').map((part, index) => (
                  <span key={index} className="inline-block">
                    {part}
                    {index < clue.riddle.split('🪔').length - 1 && (
                      <span className="text-diya-orange mx-2">🪔</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Cipher Key */}
            <div className="bg-yellow-100 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-orange-800 mb-2">Cipher Key:</h4>
              <p className="text-sm text-gray-700">
                🌕 = 1 (full moon) | 🌑 = 0 (new moon) | 🪔 = separator
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Convert binary to numbers, then to letters: A=1, B=2, C=3, etc.
              </p>
            </div>
            
            <div className="space-y-4">
              <InputBox
                value={answer}
                onChange={setAnswer}
                placeholder="Enter the decoded word"
                onKeyPress={handleKeyPress}
              />
              
              <div className="text-center">
                <SubmitButton onClick={handleSubmit}>
                  🔥 Light the Final Lamp
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
          
          {/* Decoding Help */}
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
            <h4 className="font-semibold mb-2">Need help decoding?</h4>
            <p>1. Separate the sequence by 🪔 symbols</p>
            <p>2. Convert each binary sequence (🌕🌑) to decimal</p>
            <p>3. Convert numbers to letters (1=A, 2=B, 3=C, etc.)</p>
            <p>4. Combine the letters to form a word</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
