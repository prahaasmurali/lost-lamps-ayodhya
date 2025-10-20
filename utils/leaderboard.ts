export interface LeaderboardEntry {
  rank: number;
  name: string;
  email: string;
  completionTimeSeconds: number;
  completionTimeDisplay: string;
  timestamp: string;
  date: string;
}

export class LeaderboardManager {
  private static readonly API_BASE = '/api/leaderboard';

  // Get all leaderboard entries from API
  static async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const response = await fetch(this.API_BASE);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error reading leaderboard:', error);
      return [];
    }
  }

  // Add a new entry and automatically rank it
  static async addEntry(name: string, email: string, completionTimeSeconds: number): Promise<LeaderboardEntry[]> {
    try {
      const response = await fetch(this.API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          completionTimeSeconds
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const leaderboard = await response.json();
      
      // Log for user feedback
      const userEntry = leaderboard.find((entry: LeaderboardEntry) => 
        entry.email.toLowerCase() === email.trim().toLowerCase()
      );
      
      if (userEntry) {
        const minutes = Math.floor(completionTimeSeconds / 60);
        const seconds = completionTimeSeconds % 60;
        console.log(`Game Completed:`, {
          name: name.trim(),
          email: email.trim(),
          completionTime: `${minutes}m ${seconds}s`,
          rank: userEntry.rank,
          totalPlayers: leaderboard.length,
          timestamp: new Date().toISOString()
        });
      }

      return leaderboard;
    } catch (error) {
      console.error('Error adding to leaderboard:', error);
      // Fallback to localStorage for offline functionality
      return this.addEntryLocalStorage(name, email, completionTimeSeconds);
    }
  }

  // Fallback localStorage method for offline functionality
  private static addEntryLocalStorage(name: string, email: string, completionTimeSeconds: number): LeaderboardEntry[] {
    if (typeof window === 'undefined') return [];

    const LEADERBOARD_KEY = 'treasure_hunt_leaderboard_backup';
    const minutes = Math.floor(completionTimeSeconds / 60);
    const seconds = completionTimeSeconds % 60;
    const completionTimeDisplay = `${minutes}m ${seconds}s`;
    
    const newEntry: LeaderboardEntry = {
      rank: 0,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      completionTimeSeconds,
      completionTimeDisplay,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };

    try {
      const data = localStorage.getItem(LEADERBOARD_KEY);
      let leaderboard: LeaderboardEntry[] = data ? JSON.parse(data) : [];
      
      const existingIndex = leaderboard.findIndex(entry => entry.email === newEntry.email);
      
      if (existingIndex !== -1) {
        if (newEntry.completionTimeSeconds < leaderboard[existingIndex].completionTimeSeconds) {
          leaderboard[existingIndex] = newEntry;
        }
      } else {
        leaderboard.push(newEntry);
      }

      const rankedLeaderboard = leaderboard
        .sort((a, b) => a.completionTimeSeconds - b.completionTimeSeconds)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
      
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(rankedLeaderboard));
      console.log('⚠️ Using offline mode - data saved locally');
      
      return rankedLeaderboard;
    } catch (error) {
      console.error('Error with localStorage fallback:', error);
      return [];
    }
  }

  // Get top N entries
  static async getTopEntries(limit: number = 10): Promise<LeaderboardEntry[]> {
    const leaderboard = await this.getLeaderboard();
    return leaderboard.slice(0, limit);
  }

  // Get current player's rank and stats
  static async getPlayerStats(email: string): Promise<{ 
    entry: LeaderboardEntry | null; 
    totalPlayers: number;
    percentile: number;
  }> {
    const leaderboard = await this.getLeaderboard();
    const playerEntry = leaderboard.find(entry => entry.email.toLowerCase() === email.toLowerCase().trim());
    
    return {
      entry: playerEntry || null,
      totalPlayers: leaderboard.length,
      percentile: playerEntry ? Math.round((1 - (playerEntry.rank - 1) / leaderboard.length) * 100) : 0
    };
  }

  // Clear all leaderboard data (admin function)
  static async clearLeaderboard(): Promise<void> {
    try {
      const response = await fetch(this.API_BASE, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('🗑️ Leaderboard cleared successfully');
    } catch (error) {
      console.error('Error clearing leaderboard:', error);
      // Fallback to localStorage clear
      if (typeof window !== 'undefined') {
        localStorage.removeItem('treasure_hunt_leaderboard_backup');
        console.log('⚠️ Cleared local backup data');
      }
    }
  }

  // Export leaderboard data (for backup/analysis)
  static async exportData(): Promise<string> {
    const leaderboard = await this.getLeaderboard();
    return JSON.stringify(leaderboard, null, 2);
  }
}
