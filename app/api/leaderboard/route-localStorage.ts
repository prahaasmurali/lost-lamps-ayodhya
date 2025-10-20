// Fallback implementation using localStorage only
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

// GET - Return empty array (client will use localStorage)
export async function GET() {
  try {
    // Return empty array, client will handle localStorage
    return NextResponse.json([]);
  } catch (error) {
    console.error('GET /api/leaderboard error:', error);
    return NextResponse.json({ error: 'Failed to read leaderboard' }, { status: 500 });
  }
}

// POST - Accept data but don't persist (client will use localStorage)
export async function POST(request: NextRequest) {
  try {
    const { name, email, completionTimeSeconds } = await request.json();

    if (!name || !email || typeof completionTimeSeconds !== 'number') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Just return success - client will handle localStorage
    return NextResponse.json({ success: true, message: 'Entry received (using localStorage)' });
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
