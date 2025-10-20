// Ultra-simple global leaderboard using GitHub Gist
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

// Create a GitHub Gist with leaderboard.json and use the raw URL
const GIST_URL = 'https://api.github.com/gists/YOUR_GIST_ID';
const GITHUB_TOKEN = 'ghp_YOUR_TOKEN'; // Personal access token

async function readGitHubGist(): Promise<LeaderboardEntry[]> {
  try {
    const response = await fetch(GIST_URL, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch gist');
    
    const gist = await response.json();
    const content = gist.files['leaderboard.json']?.content;
    return content ? JSON.parse(content) : [];
  } catch (error) {
    console.error('Error reading GitHub gist:', error);
    return [];
  }
}

async function writeGitHubGist(leaderboard: LeaderboardEntry[]): Promise<void> {
  try {
    await fetch(GIST_URL, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files: {
          'leaderboard.json': {
            content: JSON.stringify(leaderboard, null, 2)
          }
        }
      })
    });
  } catch (error) {
    console.error('Error writing GitHub gist:', error);
    throw error;
  }
}

// REST OF THE CODE IS SAME AS JSONBIN VERSION...
export async function GET() {
  try {
    const leaderboard = await readGitHubGist();
    return NextResponse.json(leaderboard);
  } catch (error) {
    return NextResponse.json([], { status: 200 }); // Fallback to empty
  }
}

export async function POST(request: NextRequest) {
  // Same logic as JSONBin version but using writeGitHubGist
}
