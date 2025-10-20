// Global leaderboard using JSONBin.io (no installation needed)
import { NextRequest, NextResponse } from 'next/server';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  email: string;
  completionTimeSeconds: number;
  completionTimeDisplay: string;
  timestamp: string;
  date: string;
}

// Free JSONBin.io endpoint - create at https://jsonbin.io
const JSONBIN_URL = 'https://api.jsonbin.io/v3/b/YOUR_BIN_ID';
const JSONBIN_API_KEY = '$2a$10$YOUR_API_KEY'; // Get from jsonbin.io

async function readGlobalLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const response = await fetch(JSONBIN_URL, {
      headers: {
        'X-Master-Key': JSONBIN_API_KEY
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch');
    
    const data = await response.json();
    return data.record || [];
  } catch (error) {
    console.error('Error reading global leaderboard:', error);
    return [];
  }
}

async function writeGlobalLeaderboard(leaderboard: LeaderboardEntry[]): Promise<void> {
  try {
    await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify(leaderboard)
    });
  } catch (error) {
    console.error('Error writing global leaderboard:', error);
    throw error;
  }
}

// GET - Read global leaderboard
export async function GET() {
  try {
    const leaderboard = await readGlobalLeaderboard();
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('GET /api/leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to read leaderboard' }, { status: 500 });
  }
}

// POST - Add new entry to global leaderboard
export async function POST(request: NextRequest) {
  try {
    const { name, email, completionTimeSeconds } = await request.json();

    if (!name || !email || typeof completionTimeSeconds !== 'number') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const leaderboard = await readGlobalLeaderboard();
    
    // Check if user already exists
    const existingIndex = leaderboard.findIndex(entry => 
      entry.email.toLowerCase() === email.toLowerCase().trim()
    );
    
    const newEntry: LeaderboardEntry = {
      rank: 0,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      completionTimeSeconds,
      completionTimeDisplay: formatTime(completionTimeSeconds),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };

    if (existingIndex >= 0) {
      // Update existing entry if better time
      if (completionTimeSeconds < leaderboard[existingIndex].completionTimeSeconds) {
        leaderboard[existingIndex] = newEntry;
      }
    } else {
      // Add new entry
      leaderboard.push(newEntry);
    }
    
    // Sort and rank
    leaderboard.sort((a, b) => a.completionTimeSeconds - b.completionTimeSeconds);
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    await writeGlobalLeaderboard(leaderboard);
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('POST /api/leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to add entry' }, { status: 500 });
  }
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}
