class PomodoroTimer {
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
        this.completedSessions = 0;
        this.totalFocusTime = 0;
        this.startTime = null;
        
        this.initializeElements();
        this.loadSettings();
        this.loadStats();
        this.attachEventListeners();
        this.updateDisplay();
        this.updateStats();
    }
    
    initializeElements() {
        this.timerDisplay = document.getElementById('timer');
        this.sessionTypeDisplay = document.getElementById('sessionType');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.workDurationInput = document.getElementById('workDuration');
        this.breakDurationInput = document.getElementById('breakDuration');
        this.longBreakDurationInput = document.getElementById('longBreakDuration');
        this.sessionsUntilLongBreakInput = document.getElementById('sessionsUntilLongBreak');
        this.completedSessionsDisplay = document.getElementById('completedSessions');
        this.totalFocusTimeDisplay = document.getElementById('totalFocusTime');
        this.timerDisplayContainer = document.querySelector('.timer-display');
    }
    
    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        this.workDurationInput.addEventListener('change', () => this.updateSettings());
        this.breakDurationInput.addEventListener('change', () => this.updateSettings());
        this.longBreakDurationInput.addEventListener('change', () => this.updateSettings());
        this.sessionsUntilLongBreakInput.addEventListener('change', () => this.updateSettings());
        
        // Save settings when page unloads
        window.addEventListener('beforeunload', () => this.saveSettings());
        window.addEventListener('beforeunload', () => this.saveStats());
    }
    
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now();
            this.interval = setInterval(() => this.tick(), 1000);
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            
            // Request notification permission
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.interval);
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            
            // Update focus time if pausing during work session
            if (this.currentSessionType === 'work' && this.startTime) {
                this.totalFocusTime += Math.floor((Date.now() - this.startTime) / 1000);
                this.startTime = null;
                this.updateStats();
            }
        }
    }
    
    reset() {
        this.pause();
        this.timeLeft = this.workDuration * 60;
        this.currentSessionType = 'work';
        this.currentSession = 0;
        this.startTime = null;
        this.updateDisplay();
    }
    
    tick() {
        this.timeLeft--;
        this.updateDisplay();
        
        if (this.timeLeft <= 0) {
            this.sessionComplete();
        }
    }
    
    sessionComplete() {
        this.pause();
        
        // Play notification sound (using Web Audio API for simple beep)
        this.playNotificationSound();
        
        // Show browser notification
        this.showNotification();
        
        // Update stats if work session completed
        if (this.currentSessionType === 'work') {
            this.completedSessions++;
            this.totalFocusTime += this.workDuration * 60;
            this.updateStats();
            this.saveStats();
        }
        
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
        
        this.updateDisplay();
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update session type display
        const sessionTypes = {
            'work': 'Work Session',
            'break': 'Short Break',
            'longBreak': 'Long Break'
        };
        this.sessionTypeDisplay.textContent = sessionTypes[this.currentSessionType];
        
        // Update timer display styling
        this.timerDisplayContainer.className = 'timer-display';
        if (this.currentSessionType === 'break') {
            this.timerDisplayContainer.classList.add('break-session');
        } else if (this.currentSessionType === 'longBreak') {
            this.timerDisplayContainer.classList.add('long-break-session');
        }
        
        // Update page title
        document.title = `${this.timerDisplay.textContent} - ${sessionTypes[this.currentSessionType]} - Pomodoro Timer`;
    }
    
    updateStats() {
        this.completedSessionsDisplay.textContent = this.completedSessions;
        
        const hours = Math.floor(this.totalFocusTime / 3600);
        const minutes = Math.floor((this.totalFocusTime % 3600) / 60);
        this.totalFocusTimeDisplay.textContent = `${hours}h ${minutes}m`;
    }
    
    updateSettings() {
        this.workDuration = parseInt(this.workDurationInput.value) || 25;
        this.breakDuration = parseInt(this.breakDurationInput.value) || 5;
        this.longBreakDuration = parseInt(this.longBreakDurationInput.value) || 15;
        this.sessionsUntilLongBreak = parseInt(this.sessionsUntilLongBreakInput.value) || 4;
        
        // Reset timer with new settings if not running
        if (!this.isRunning) {
            this.reset();
        }
        
        this.saveSettings();
    }
    
    playNotificationSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
    
    showNotification() {
        if ('Notification' in window && Notification.permission === 'granted') {
            const titles = {
                'work': 'Work Session Complete!',
                'break': 'Break Time!',
                'longBreak': 'Long Break Time!'
            };
            
            const messages = {
                'work': 'Great job! Time for a break.',
                'break': 'Break is over. Ready to focus?',
                'longBreak': 'Refreshed? Let\'s get back to work!'
            };
            
            new Notification(titles[this.currentSessionType], {
                body: messages[this.currentSessionType],
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⏰</text></svg>'
            });
        }
    }
    
    saveSettings() {
        const settings = {
            workDuration: this.workDuration,
            breakDuration: this.breakDuration,
            longBreakDuration: this.longBreakDuration,
            sessionsUntilLongBreak: this.sessionsUntilLongBreak
        };
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('pomodoroSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            this.workDuration = settings.workDuration || 25;
            this.breakDuration = settings.breakDuration || 5;
            this.longBreakDuration = settings.longBreakDuration || 15;
            this.sessionsUntilLongBreak = settings.sessionsUntilLongBreak || 4;
            
            // Update input fields
            this.workDurationInput.value = this.workDuration;
            this.breakDurationInput.value = this.breakDuration;
            this.longBreakDurationInput.value = this.longBreakDuration;
            this.sessionsUntilLongBreakInput.value = this.sessionsUntilLongBreak;
        }
    }
    
    saveStats() {
        const today = new Date().toDateString();
        const stats = {
            date: today,
            completedSessions: this.completedSessions,
            totalFocusTime: this.totalFocusTime
        };
        localStorage.setItem('pomodoroStats', JSON.stringify(stats));
    }
    
    loadStats() {
        const savedStats = localStorage.getItem('pomodoroStats');
        if (savedStats) {
            const stats = JSON.parse(savedStats);
            const today = new Date().toDateString();
            
            // Reset stats if it's a new day
            if (stats.date !== today) {
                this.completedSessions = 0;
                this.totalFocusTime = 0;
                this.saveStats();
            } else {
                this.completedSessions = stats.completedSessions || 0;
                this.totalFocusTime = stats.totalFocusTime || 0;
            }
        }
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});
