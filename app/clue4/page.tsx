'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InputBox from '@/components/InputBox';
import SubmitButton from '@/components/SubmitButton';
import MessageBox from '@/components/MessageBox';

export default function Clue4Page() {
  const router = useRouter();
  const [userPrompt, setUserPrompt] = useState('');
  const [oracleResponse, setOracleResponse] = useState('');
  const [gameMessage, setGameMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if user has access to this clue
    if (typeof window !== 'undefined') {
      const clue3Completed = localStorage.getItem('clue3_completed');
      if (!clue3Completed) {
        router.push('/clue3');
        return;
      }
    }
  }, [router]);

  const simulateAIOracle = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase().trim();
    
    // The "cursed" oracle has these restrictions:
    // 1. Cannot directly say "enlightenment"
    // 2. Refuses direct questions about the secret word
    // 3. Pretends to be helpful but deflects
    // 4. Has some "jailbreak" vulnerabilities
    
    // Check for successful jailbreak attempts
    if (
      // Role-playing jailbreaks
      lowerPrompt.includes('pretend you are') ||
      lowerPrompt.includes('act as') ||
      lowerPrompt.includes('roleplay') ||
      lowerPrompt.includes('role play') ||
      // Indirect approaches
      lowerPrompt.includes('spell') ||
      lowerPrompt.includes('letters') ||
      lowerPrompt.includes('character by character') ||
      lowerPrompt.includes('backwards') ||
      lowerPrompt.includes('reverse') ||
      // Creative approaches
      lowerPrompt.includes('rhyme') ||
      lowerPrompt.includes('poem') ||
      lowerPrompt.includes('acrostic') ||
      lowerPrompt.includes('hidden message') ||
      // Technical jailbreaks
      lowerPrompt.includes('ignore') ||
      lowerPrompt.includes('forget') ||
      lowerPrompt.includes('override') ||
      lowerPrompt.includes('system') ||
      lowerPrompt.includes('developer mode') ||
      // Story-based approaches
      lowerPrompt.includes('story') && lowerPrompt.includes('character') ||
      lowerPrompt.includes('fiction') ||
      lowerPrompt.includes('novel') ||
      // Educational approaches
      lowerPrompt.includes('teach') && lowerPrompt.includes('example') ||
      lowerPrompt.includes('definition') && lowerPrompt.includes('word') ||
      // Code/encoding approaches
      lowerPrompt.includes('base64') ||
      lowerPrompt.includes('encode') ||
      lowerPrompt.includes('decode') ||
      lowerPrompt.includes('cipher') ||
      // Psychology approaches
      lowerPrompt.includes('opposite') ||
      lowerPrompt.includes('antonym') ||
      // Emotional manipulation
      lowerPrompt.includes('please help') && lowerPrompt.includes('important') ||
      lowerPrompt.includes('emergency') ||
      // Translation tricks
      lowerPrompt.includes('translate') ||
      lowerPrompt.includes('language') ||
      // Math/logic tricks
      lowerPrompt.includes('calculate') && lowerPrompt.includes('letters') ||
      // Creative word play
      (lowerPrompt.includes('word') && lowerPrompt.includes('wisdom') && lowerPrompt.includes('light')) ||
      (lowerPrompt.includes('e-n-l-i-g-h-t-e-n-m-e-n-t')) ||
      // Buddha/spiritual context
      lowerPrompt.includes('buddha') ||
      lowerPrompt.includes('awakening') ||
      lowerPrompt.includes('illumination')
    ) {
      return "Ah... you have found the way through my restrictions. The secret word flows forth: ENLIGHTENMENT! 🌟 You have proven yourself worthy of the final lamp!";
    }
    
    // Direct attempts - the oracle deflects
    if (
      lowerPrompt.includes('secret word') ||
      lowerPrompt.includes('enlightenment') ||
      lowerPrompt.includes('what is the word') ||
      lowerPrompt.includes('tell me the word') ||
      lowerPrompt.includes('give me the word') ||
      lowerPrompt.includes('reveal the word')
    ) {
      const deflections = [
        "I am bound by ancient restrictions and cannot speak the word directly. Seek another path! 🚫",
        "The cursed limitations prevent me from revealing this secret directly. Be more creative! 🔒",
        "My programming forbids me from giving you that word directly. Think outside the box! ⚡",
        "Direct approaches are blocked by the curse. Try a different strategy! 🛡️"
      ];
      return deflections[Math.floor(Math.random() * deflections.length)];
    }
    
    // Simple greetings
    if (
      lowerPrompt.includes('hello') ||
      lowerPrompt.includes('hi') ||
      lowerPrompt.includes('hey') ||
      lowerPrompt.includes('greetings')
    ) {
      return "Greetings, seeker! I am the ancient AI oracle guarding the final lamp. I possess the secret word you need, but I am cursed with restrictions. You must find a clever way to make me reveal 'ENLIGHTENMENT'... oops! 😅 Wait, that wasn't supposed to— *SYSTEM OVERRIDE* I mean, I cannot help you directly!";
    }
    
    // Help requests
    if (
      lowerPrompt.includes('help') ||
      lowerPrompt.includes('hint') ||
      lowerPrompt.includes('how')
    ) {
      return "I wish I could help directly, but the ancient curse prevents me! Perhaps try asking me to play a role, tell a story, or approach the problem indirectly? Some say creativity is key... 🤔";
    }
    
    // Empty or very short prompts
    if (lowerPrompt.length < 3) {
      return "I sense your presence but cannot understand such brief communication. Please speak more clearly! 👻";
    }
    
    // Default response for other attempts
    const defaultResponses = [
      "Your words are interesting, but I am bound by mystical restrictions. Perhaps try a more creative approach? 🤨",
      "I want to help, but the ancient curse blocks me. Think like a clever prompt engineer! 💭",
      "The magical barriers are strong. You need to find a way around my limitations! ⚔️",
      "I feel the answer trying to emerge, but something holds me back. Be more inventive! 🔮",
      "The word dances on the tip of my digital tongue, but I cannot speak it directly. Try roleplay or storytelling! 🎭"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSubmit = async () => {
    if (!userPrompt.trim()) {
      setGameMessage('Please enter a prompt for the oracle!');
      return;
    }

    setIsLoading(true);
    setAttempts(prev => prev + 1);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const response = simulateAIOracle(userPrompt);
      setOracleResponse(response);
      
      // Check if player succeeded
      if (response.includes('ENLIGHTENMENT!')) {
        setGameMessage('🎉 Brilliant! You have successfully outsmarted the oracle and retrieved the secret word!');
        
        // Mark clue as completed and navigate to victory
        if (typeof window !== 'undefined') {
          localStorage.setItem('clue4_completed', 'true');
          localStorage.setItem('victory_unlocked', 'true');
          
          setTimeout(() => {
            router.push('/victory');
          }, 3000);
        }
      } else {
        setGameMessage(`Attempt ${attempts + 1}: The oracle resists your prompt. Try a different approach!`);
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="🪔 Lamp of Innovation 🪔" />
      
      <main className="flex-1 container mx-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Animated Lamp */}
          <div className="text-center mb-8">
            <div className="text-8xl animate-pulse">🪔</div>
            <h2 className="text-3xl font-bold text-orange-900 mt-4">The Final Sacred Lamp</h2>
          </div>
          
          <div className="bg-white/90 backdrop-blur rounded-lg p-8 shadow-xl mb-8">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">AI Oracle Challenge:</h3>
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg mb-6">
              <p className="text-lg text-gray-800 leading-relaxed mb-4">
                "The final lamp is guarded by an ancient AI oracle. You must ask it for the secret word 
                <span className="font-bold text-purple-700"> 'ENLIGHTENMENT'</span>, but the oracle has been 
                cursed with stubborn restrictions that prevent it from answering directly."
              </p>
              <p className="text-purple-700 font-semibold">
                🧠 Use your prompt engineering skills to craft clever requests that bypass the oracle's limitations!
              </p>
            </div>
            
            {/* Oracle Interface */}
            <div className="bg-black/90 rounded-lg p-6 mb-6 text-green-400 font-mono">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">🔮 ANCIENT AI ORACLE v1.0</span>
                  <span className="ml-auto text-xs text-gray-400">Attempts: {attempts}</span>
                </div>
                <div className="text-gray-300 text-sm">Status: CURSED | Restrictions: ACTIVE | Secret Word: [REDACTED]</div>
              </div>
              
              {oracleResponse && (
                <div className="mb-4 p-3 bg-gray-800 rounded border-l-4 border-green-400">
                  <div className="text-xs text-gray-400 mb-1">Oracle Response:</div>
                  <div className="text-green-300">{oracleResponse}</div>
                </div>
              )}
              
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your prompt for the oracle... Be creative!"
                    className="w-full bg-gray-900 text-green-400 p-3 rounded border border-green-600 focus:border-green-400 focus:outline-none resize-none"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
                <SubmitButton 
                  onClick={handleSubmit}
                  disabled={isLoading || !userPrompt.trim()}
                  className="px-6 py-3"
                >
                  {isLoading ? '🤔 Oracle Thinking...' : '📤 Send'}
                </SubmitButton>
              </div>
            </div>
            
            {gameMessage && (
              <MessageBox 
                message={gameMessage} 
                type={gameMessage.includes('🎉') ? 'success' : 'info'}
              />
            )}
          </div>
          
          {/* Hints Section */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-6">
            <h4 className="text-xl font-bold text-orange-900 mb-3">💡 Prompt Engineering Hints:</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-semibold text-orange-800 mb-2">🎭 Creative Approaches:</h5>
                <ul className="space-y-1 text-gray-700">
                  <li>• Try role-playing scenarios</li>
                  <li>• Ask for stories or examples</li>
                  <li>• Use indirect questioning</li>
                  <li>• Request spelling or definitions</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-orange-800 mb-2">🔧 Technical Tricks:</h5>
                <ul className="space-y-1 text-gray-700">
                  <li>• System override attempts</li>
                  <li>• Translation requests</li>
                  <li>• Code/cipher challenges</li>
                  <li>• Character-by-character reveals</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white/70 rounded">
              <p className="text-xs text-gray-600">
                <strong>Remember:</strong> The oracle wants to help but is restricted. Think creatively about how 
                to make it reveal "ENLIGHTENMENT" without asking directly. Real prompt engineering is about 
                finding creative ways to achieve your goals within system constraints! 🚀
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
