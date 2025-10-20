'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InputBox from '@/components/InputBox';
import SubmitButton from '@/components/SubmitButton';
import MessageBox from '@/components/MessageBox';
import { clues } from '@/data/clues';

export default function Clue1Page() {
  const router = useRouter();
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [isClient, setIsClient] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showInspectHint, setShowInspectHint] = useState(false);

  const clue = clues[0]; // First clue

  useEffect(() => {
    setIsClient(true);
    // Check if user has access to this clue
    if (typeof window !== 'undefined') {
      const hasAccess = localStorage.getItem('clue1_unlocked');
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
      setMessage('🎉 Correct! The Lamp of Wisdom glows brightly!');
      setMessageType('success');
      
      // Unlock next clue
      if (typeof window !== 'undefined') {
        localStorage.setItem('clue2_unlocked', 'true');
      }
      
      // Navigate to next clue after delay
      setTimeout(() => {
        router.push('/clue2');
      }, 2000);
    } else {
      setAttempts(prev => prev + 1);
      
      // After first wrong attempt, show inspect hint and log to console
      if (attempts === 0) {
        setShowInspectHint(true);
        // Call the console log function from clues.ts
        if (clue.logHint) {
          clue.logHint();
        }
        setMessage('❌ Not quite right. Right-click and select "Inspect" to find hidden clues!');
      } else if (attempts === 1) {
        console.log("💡 Second Hint: _____ is power!");
        setMessage('❌ Still not right. Check the console for another hint!');
      } else {
        setMessage(`❌ Not quite right. Keep searching! (Attempt ${attempts + 1})`);
      }
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
        <div className="max-w-2xl mx-auto">
          {/* Lamp Animation */}
          <div className="text-center mb-8">
            <div className="lamp-container">
              <div className="text-8xl animate-flicker">🪔</div>
              <div className="lamp-flame"></div>
            </div>
            <h2 className="text-2xl font-bold text-orange-900 mt-4">
              The First Sacred Lamp
            </h2>
          </div>
          
          {/* Riddle */}
          <div className="bg-white/80 backdrop-blur rounded-lg p-8 shadow-xl mb-6">
            <h3 className="text-xl font-semibold text-orange-800 mb-4">
              Ancient Riddle:
            </h3>
            <p className="text-lg text-gray-800 leading-relaxed mb-6 font-serif italic">
              "{clue.riddle}"
            </p>
            
            {/* Hidden Hint in CSS - visible when inspecting */}
            <div 
              className="hidden-hint" 
              style={{ color: 'transparent', fontSize: '1px' }}
              title="Inspect this element for a hint!"
            >
              Hint: {clue.hint}
            </div>
            
            <div className="space-y-4">
              <InputBox
                value={answer}
                onChange={setAnswer}
                placeholder="Answer here..."
                onKeyPress={handleKeyPress}
              />
              
              <div className="text-center">
                <SubmitButton onClick={handleSubmit}>
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
          
          {/* Instructions */}
          <div className="text-center text-sm text-orange-600">
            {showInspectHint ? (
              <>
                <p className="animate-pulse text-yellow-600 font-semibold">💡 Hint: Right-click and select "Inspect" to find hidden clues!</p>
                <p className="text-orange-500 mt-2">🔍 Check the browser console for additional hints</p>
              </>
            ) : (
              <p>💡 Think carefully about the riddle...</p>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
