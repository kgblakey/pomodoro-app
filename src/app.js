import { Timer } from './models/Timer.js';
import { UIController } from './controllers/UIController.js';
import { SettingsService } from './services/SettingsService.js';
import { StatsService } from './services/StatsService.js';
import { NotificationService } from './utils/NotificationService.js';

export class PomodoroApp {
  constructor() {
    this.timer = new Timer();
    this.ui = new UIController();
    this.settingsService = new SettingsService();
    this.statsService = new StatsService();
    this.notificationService = new NotificationService();
    
    this.stats = this.statsService.loadStats();
    this.settings = this.settingsService.loadSettings();
    
    this.initializeApp();
  }

  initializeApp() {
    // Load settings into timer and UI
    this.timer.updateSettings(this.settings);
    this.ui.setSettings(this.settings);
    
    // Load initial stats
    this.updateUI();
    
    // Bind event handlers
    this.bindEvents();
    
    // Save settings on page unload
    window.addEventListener('beforeunload', () => this.saveSettings());
    window.addEventListener('beforeunload', () => this.saveStats());
    
    // Start timer tick updates
    this.startTimerUpdates();
    
    // Register service worker for PWA functionality
    this.registerServiceWorker();
  }

  bindEvents() {
    this.ui.bindStartButton(() => this.handleStart());
    this.ui.bindPauseButton(() => this.handlePause());
    this.ui.bindResetButton(() => this.handleReset());
    this.ui.bindSettingsChange(() => this.handleSettingsChange());
    this.ui.bindNotificationClose(() => this.ui.hideNotificationBanner());
  }

  handleStart() {
    this.timer.start();
    this.ui.setButtonStates(true);
  }

  handlePause() {
    this.timer.pause();
    this.ui.setButtonStates(false);
    
    // Update focus time if pausing during work session
    if (this.timer.currentSessionType === 'work') {
      const focusTime = this.timer.getFocusTime();
      if (focusTime > 0) {
        this.stats = this.statsService.updateFocusTime(this.stats, focusTime);
        this.updateUI();
      }
    }
  }

  handleReset() {
    this.timer.pause();
    this.timer.reset();
    this.ui.setButtonStates(false);
    this.updateUI();
  }

  handleSettingsChange() {
    const newSettings = this.ui.getSettings();
    const validatedSettings = this.settingsService.validateSettings(newSettings);
    
    // Request notification permission if user just enabled notifications
    if (!this.settings.notificationsEnabled && validatedSettings.notificationsEnabled) {
      this.notificationService.requestPermission();
    }
    
    this.settings = validatedSettings;
    this.timer.updateSettings(validatedSettings);
    this.settingsService.saveSettings(validatedSettings);
    this.updateUI();
  }

  handleSessionComplete() {
    // Play notification sound if enabled
    this.notificationService.playNotificationSound(this.settings.soundEnabled);
    
    // Show browser notification if enabled
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
    
    const sessionType = this.timer.getSessionTypeLabel();
    this.notificationService.showNotification(
      titles[this.timer.currentSessionType],
      messages[this.timer.currentSessionType],
      this.settings.notificationsEnabled
    );
    
    // Show in-page notification banner
    this.ui.showNotificationBanner(titles[this.timer.currentSessionType]);
    
    // Update stats if work session completed
    if (this.timer.currentSessionType === 'work') {
      this.stats = this.statsService.updateSessionCompleted(
        this.stats,
        this.timer.workDuration
      );
      this.statsService.saveStats(this.stats);
    }
    
    // Update UI
    this.ui.setButtonStates(false);
    this.updateUI();
  }

  startTimerUpdates() {
    setInterval(() => {
      if (this.timer.isRunning) {
        this.updateUI();
      }
    }, 100);
  }

  updateUI() {
    const time = this.timer.getFormattedTime();
    const sessionType = this.timer.getSessionTypeLabel();
    
    this.ui.updateTimerDisplay(time);
    this.ui.updateSessionType(sessionType);
    this.ui.updatePageTitle(time, sessionType, this.timer.isRunning);
    this.ui.updateStats(this.stats.completedSessions, this.stats.totalFocusTime);
  }

  saveSettings() {
    this.settingsService.saveSettings(this.settings);
  }

  saveStats() {
    this.statsService.saveStats(this.stats);
  }

  registerServiceWorker() {
    // Only register service worker on HTTPS or localhost
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PomodoroApp();
});
