export class Timer {
  constructor() {
    this.workDuration = 25;
    this.breakDuration = 5;
    this.longBreakDuration = 15;
    this.sessionsUntilLongBreak = 4;
    this.currentSession = 0;
    this.timeLeft = this.workDuration * 60;
    this.isRunning = false;
    this.interval = null;
    this.currentSessionType = 'work';
    this.startTime = null;
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.startTime = Date.now();
      this.interval = setInterval(() => this.tick(), 1000);
    }
  }

  pause() {
    if (this.isRunning) {
      this.isRunning = false;
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  reset() {
    this.pause();
    this.timeLeft = this.workDuration * 60;
    this.currentSessionType = 'work';
    this.currentSession = 0;
    this.startTime = null;
  }

  tick() {
    this.timeLeft--;
    if (this.timeLeft <= 0) {
      this.sessionComplete();
    }
  }

  sessionComplete() {
    this.pause();
    
    // Move to next session
    this.currentSession++;
    
    if (this.currentSessionType === 'work') {
      if (this.currentSession % this.sessionsUntilLongBreak === 0) {
        this.currentSessionType = 'longBreak';
        this.timeLeft = this.longBreakDuration * 60;
      } else {
        this.currentSessionType = 'break';
        this.timeLeft = this.breakDuration * 60;
      }
    } else {
      this.currentSessionType = 'work';
      this.timeLeft = this.workDuration * 60;
    }
  }

  getFormattedTime() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getSessionTypeLabel() {
    const sessionTypes = {
      'work': 'Work Session',
      'break': 'Short Break',
      'longBreak': 'Long Break'
    };
    return sessionTypes[this.currentSessionType];
  }

  updateSettings(settings) {
    this.workDuration = settings.workDuration || 25;
    this.breakDuration = settings.breakDuration || 5;
    this.longBreakDuration = settings.longBreakDuration || 15;
    this.sessionsUntilLongBreak = settings.sessionsUntilLongBreak || 4;
    
    // Reset timer with new settings if not running
    if (!this.isRunning) {
      this.reset();
    }
  }

  getFocusTime() {
    if (this.currentSessionType === 'work' && this.startTime) {
      return Math.floor((Date.now() - this.startTime) / 1000);
    }
    return 0;
  }
}
