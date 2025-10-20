// Alternative implementation using Vercel KV
import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  email: string;
  completionTimeSeconds: number;
  completionTimeDisplay: string;
  timestamp: string;
  date: string;
}

const LEADERBOARD_KEY = 'diwali_leaderboard';

async function readLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const data = await kv.get(LEADERBOARD_KEY);
    return data ? (data as LeaderboardEntry[]) : [];
  } catch (error) {
    console.error('Error reading leaderboard:', error);
    return [];
  }
}

async function writeLeaderboard(leaderboard: LeaderboardEntry[]): Promise<void> {
  try {
    await kv.set(LEADERBOARD_KEY, leaderboard);
  } catch (error) {
    console.error('Error writing leaderboard:', error);
    throw error;
  }
}

// GET - Read leaderboard
export async function GET() {
  try {
    const leaderboard = await readLeaderboard();
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('GET /api/leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to read leaderboard' }, { status: 500 });
  }
}

// POST - Add new entry
export async function POST(request: NextRequest) {
  try {
    const { name, email, completionTimeSeconds } = await request.json();

    if (!name || !email || typeof completionTimeSeconds !== 'number') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const leaderboard = await readLeaderboard();
    
    const newEntry: LeaderboardEntry = {
      rank: 0, // Will be calculated
      name: name.trim(),
      email: email.trim(),
      completionTimeSeconds,
      completionTimeDisplay: formatTime(completionTimeSeconds),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };

    leaderboard.push(newEntry);
    
    // Sort by completion time and assign ranks
    leaderboard.sort((a, b) => a.completionTimeSeconds - b.completionTimeSeconds);
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    await writeLeaderboard(leaderboard);
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
