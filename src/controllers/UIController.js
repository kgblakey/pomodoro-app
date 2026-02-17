export class UIController {
  constructor() {
    this.elements = {};
    this.initializeElements();
  }

  initializeElements() {
    this.elements = {
      timerDisplay: document.getElementById('timer'),
      sessionTypeDisplay: document.getElementById('sessionType'),
      startBtn: document.getElementById('startBtn'),
      pauseBtn: document.getElementById('pauseBtn'),
      resetBtn: document.getElementById('resetBtn'),
      workDurationInput: document.getElementById('workDuration'),
      breakDurationInput: document.getElementById('breakDuration'),
      longBreakDurationInput: document.getElementById('longBreakDuration'),
      sessionsUntilLongBreakInput: document.getElementById('sessionsUntilLongBreak'),
      soundEnabledInput: document.getElementById('soundEnabled'),
      notificationsEnabledInput: document.getElementById('notificationsEnabled'),
      completedSessionsDisplay: document.getElementById('completedSessions'),
      totalFocusTimeDisplay: document.getElementById('totalFocusTime'),
      timerDisplayContainer: document.querySelector('.timer-display'),
      notificationBanner: document.getElementById('notificationBanner'),
      notificationMessage: document.getElementById('notificationMessage'),
      closeNotificationBtn: document.getElementById('closeNotification')
    };
  }

  updateTimerDisplay(time) {
    this.elements.timerDisplay.textContent = time;
  }

  updateSessionType(sessionType) {
    this.elements.sessionTypeDisplay.textContent = sessionType;
    
    // Update timer display styling
    this.elements.timerDisplayContainer.className = 'timer-display';
    if (sessionType === 'Short Break') {
      this.elements.timerDisplayContainer.classList.add('break-session');
    } else if (sessionType === 'Long Break') {
      this.elements.timerDisplayContainer.classList.add('long-break-session');
    }
  }

  updatePageTitle(time, sessionType, isRunning = false) {
    if (isRunning) {
      document.title = `${time} — ${sessionType}`;
    } else {
      document.title = `${time} - ${sessionType} - Pomodoro Timer`;
    }
  }

  setButtonStates(isRunning) {
    this.elements.startBtn.disabled = isRunning;
    this.elements.pauseBtn.disabled = !isRunning;
  }

  updateStats(completedSessions, totalFocusTime) {
    this.elements.completedSessionsDisplay.textContent = completedSessions;
    
    const hours = Math.floor(totalFocusTime / 3600);
    const minutes = Math.floor((totalFocusTime % 3600) / 60);
    this.elements.totalFocusTimeDisplay.textContent = `${hours}h ${minutes}m`;
  }

  getSettings() {
    return {
      workDuration: parseInt(this.elements.workDurationInput.value) || 25,
      breakDuration: parseInt(this.elements.breakDurationInput.value) || 5,
      longBreakDuration: parseInt(this.elements.longBreakDurationInput.value) || 15,
      sessionsUntilLongBreak: parseInt(this.elements.sessionsUntilLongBreakInput.value) || 4,
      soundEnabled: this.elements.soundEnabledInput.checked,
      notificationsEnabled: this.elements.notificationsEnabledInput.checked
    };
  }

  setSettings(settings) {
    this.elements.workDurationInput.value = settings.workDuration;
    this.elements.breakDurationInput.value = settings.breakDuration;
    this.elements.longBreakDurationInput.value = settings.longBreakDuration;
    this.elements.sessionsUntilLongBreakInput.value = settings.sessionsUntilLongBreak;
    this.elements.soundEnabledInput.checked = settings.soundEnabled;
    this.elements.notificationsEnabledInput.checked = settings.notificationsEnabled;
  }

  bindStartButton(handler) {
    this.elements.startBtn.addEventListener('click', handler);
  }

  bindPauseButton(handler) {
    this.elements.pauseBtn.addEventListener('click', handler);
  }

  bindResetButton(handler) {
    this.elements.resetBtn.addEventListener('click', handler);
  }

  bindSettingsChange(handler) {
    const inputs = [
      this.elements.workDurationInput,
      this.elements.breakDurationInput,
      this.elements.longBreakDurationInput,
      this.elements.sessionsUntilLongBreakInput,
      this.elements.soundEnabledInput,
      this.elements.notificationsEnabledInput
    ];

    inputs.forEach(input => {
      input.addEventListener('change', handler);
    });
  }

  showNotificationBanner(message) {
    this.elements.notificationMessage.textContent = message;
    this.elements.notificationBanner.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.hideNotificationBanner();
    }, 5000);
  }

  hideNotificationBanner() {
    this.elements.notificationBanner.classList.add('hidden');
  }

  bindNotificationClose(handler) {
    this.elements.closeNotificationBtn.addEventListener('click', handler);
  }
}
