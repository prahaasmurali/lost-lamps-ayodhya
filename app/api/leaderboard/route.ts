import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  email: string;
  completionTimeSeconds: number;
  completionTimeDisplay: string;
  timestamp: string;
  date: string;
}

const LEADERBOARD_FILE = path.join(process.cwd(), 'data', 'leaderboard.json');

async function ensureLeaderboardFile() {
  try {
    await fs.access(LEADERBOARD_FILE);
  } catch {
    // File doesn't exist, create it
    await fs.writeFile(LEADERBOARD_FILE, JSON.stringify([]));
  }
}

async function readLeaderboard(): Promise<LeaderboardEntry[]> {
  await ensureLeaderboardFile();
  try {
    const data = await fs.readFile(LEADERBOARD_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading leaderboard:', error);
    return [];
  }
}

async function writeLeaderboard(leaderboard: LeaderboardEntry[]): Promise<void> {
  try {
    await fs.writeFile(LEADERBOARD_FILE, JSON.stringify(leaderboard, null, 2));
  } catch (error) {
    console.error('Error writing leaderboard:', error);
  }
}

function rankEntries(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return entries
    .sort((a, b) => a.completionTimeSeconds - b.completionTimeSeconds)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
}

// GET: Retrieve leaderboard
export async function GET() {
  try {
    const leaderboard = await readLeaderboard();
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return NextResponse.json({ error: 'Failed to retrieve leaderboard' }, { status: 500 });
  }
}

// POST: Add new entry to leaderboard
export async function POST(request: NextRequest) {
  try {
    const { name, email, completionTimeSeconds } = await request.json();

    if (!name || !email || !completionTimeSeconds) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const minutes = Math.floor(completionTimeSeconds / 60);
    const seconds = completionTimeSeconds % 60;
    const completionTimeDisplay = `${minutes}m ${seconds}s`;
    
    const newEntry: LeaderboardEntry = {
      rank: 0, // Will be calculated after sorting
      name: name.trim(),
      email: email.trim().toLowerCase(),
      completionTimeSeconds,
      completionTimeDisplay,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };

    // Get existing entries
    let leaderboard = await readLeaderboard();
    
    // Check if user already exists and update their best time
    const existingIndex = leaderboard.findIndex(entry => entry.email === newEntry.email);
    
    if (existingIndex !== -1) {
      // User exists - update if this is a better time
      if (newEntry.completionTimeSeconds < leaderboard[existingIndex].completionTimeSeconds) {
        leaderboard[existingIndex] = newEntry;
        console.log(`🎉 New personal best for ${name}!`);
      } else {
        console.log(`Previous best time maintained for ${name}`);
        const rankedLeaderboard = rankEntries(leaderboard);
        return NextResponse.json(rankedLeaderboard);
      }
    } else {
      // New user - add to leaderboard
      leaderboard.push(newEntry);
      console.log(`🆕 Welcome to the leaderboard, ${name}!`);
    }

    // Sort by completion time (fastest first) and assign ranks
    const rankedLeaderboard = rankEntries(leaderboard);
    
    // Save to file
    await writeLeaderboard(rankedLeaderboard);
    
    return NextResponse.json(rankedLeaderboard);
  } catch (error) {
    console.error('Error adding to leaderboard:', error);
    return NextResponse.json({ error: 'Failed to add entry' }, { status: 500 });
  }
}

// DELETE: Clear leaderboard (admin function)
export async function DELETE() {
  try {
    await writeLeaderboard([]);
    return NextResponse.json({ message: 'Leaderboard cleared successfully' });
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
    return NextResponse.json({ error: 'Failed to clear leaderboard' }, { status: 500 });
  }
}
