export class SettingsService {
  constructor() {
    this.defaultSettings = {
      workDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
      sessionsUntilLongBreak: 4
    };
  }

  saveSettings(settings) {
    try {
      localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  loadSettings() {
    try {
      const savedSettings = localStorage.getItem('pomodoroSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        return { ...this.defaultSettings, ...settings };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    return { ...this.defaultSettings };
  }

  validateSettings(settings) {
    const validated = { ...settings };
    
    // Validate and clamp values
    validated.workDuration = Math.max(1, Math.min(60, parseInt(settings.workDuration) || 25));
    validated.breakDuration = Math.max(1, Math.min(30, parseInt(settings.breakDuration) || 5));
    validated.longBreakDuration = Math.max(1, Math.min(60, parseInt(settings.longBreakDuration) || 15));
    validated.sessionsUntilLongBreak = Math.max(2, Math.min(10, parseInt(settings.sessionsUntilLongBreak) || 4));
    
    return validated;
  }
}
