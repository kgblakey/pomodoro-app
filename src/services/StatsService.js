export class StatsService {
  constructor() {
    this.defaultStats = {
      date: new Date().toDateString(),
      completedSessions: 0,
      totalFocusTime: 0
    };
  }

  saveStats(stats) {
    try {
      const statsWithDate = {
        ...stats,
        date: new Date().toDateString()
      };
      localStorage.setItem('pomodoroStats', JSON.stringify(statsWithDate));
    } catch (error) {
      console.error('Failed to save stats:', error);
    }
  }

  loadStats() {
    try {
      const savedStats = localStorage.getItem('pomodoroStats');
      if (savedStats) {
        const stats = JSON.parse(savedStats);
        const today = new Date().toDateString();
        
        // Reset stats if it's a new day
        if (stats.date !== today) {
          return { ...this.defaultStats };
        }
        
        return {
          completedSessions: stats.completedSessions || 0,
          totalFocusTime: stats.totalFocusTime || 0
        };
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
    return { ...this.defaultStats };
  }

  updateSessionCompleted(stats, workDuration) {
    return {
      ...stats,
      completedSessions: stats.completedSessions + 1,
      totalFocusTime: stats.totalFocusTime + (workDuration * 60)
    };
  }

  updateFocusTime(stats, additionalTime) {
    return {
      ...stats,
      totalFocusTime: stats.totalFocusTime + additionalTime
    };
  }

  formatFocusTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}
