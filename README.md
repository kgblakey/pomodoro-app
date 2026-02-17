# Pomodoro Timer

A modern, responsive Pomodoro timer web application to help you stay focused and productive.

## Features

- ⏰ Customizable work/break durations
- 📊 Daily progress tracking
- 🔔 Browser notifications and sound alerts
- 💾 Settings persistence using localStorage
- 📱 Responsive design for all devices
- 🎨 Beautiful gradient UI with smooth animations

## Quick Start (Windows)

### Method 1: Direct File Opening (Easiest)
1. Download or copy the `pomodoro-app` folder to your Windows PC
2. Double-click `index.html` to open in your default browser
3. Start using the timer immediately!

### Method 2: Using Node.js (Recommended for development)
1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Open Command Prompt or PowerShell
3. Navigate to the `pomodoro-app` folder:
   ```cmd
   cd path\to\pomodoro-app
   ```
4. Install dependencies:
   ```cmd
   npm install
   ```
5. Start the development server:
   ```cmd
   npm start
   ```
6. The app will open automatically at `http://localhost:8081`

### Method 3: Using Python (If installed)
1. Open Command Prompt or PowerShell
2. Navigate to the `pomodoro-app` folder
3. Run:
   ```cmd
   python -m http.server 8081
   ```
4. Open `http://localhost:8081` in your browser

## How to Use

1. **Set Your Durations**: Adjust work, break, and long break durations in the settings
2. **Start Timer**: Click "Start" to begin a work session
3. **Focus**: Work until the timer ends (you'll get a notification)
4. **Take Break**: The app automatically switches to break time
5. **Repeat**: Continue the cycle for maximum productivity

## Settings

- **Work Duration**: Length of focus sessions (default: 25 minutes)
- **Break Duration**: Short break between work sessions (default: 5 minutes)
- **Long Break Duration**: Extended break after several sessions (default: 15 minutes)
- **Sessions until Long Break**: Number of work sessions before a long break (default: 4)

## Features Explained

### Daily Progress Tracking
- Tracks completed work sessions per day
- Monitors total focus time
- Resets automatically each day
- Data saved locally in your browser

### Notifications
- Browser notifications when sessions end
- Sound alerts using Web Audio API
- Works even when tab is in background
- Permission requested on first use

### Responsive Design
- Works on desktop, tablet, and mobile
- Touch-friendly controls
- Optimized for all screen sizes

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## Deployment Options

### For Personal Use
- Use Method 1 (direct file opening) for simplest setup
- No installation required
- Works offline once loaded

### For Family/Team Use
- Host on any web server
- Share the URL with others
- Each user gets their own saved settings

### Windows-Specific Tips

1. **Create Desktop Shortcut**:
   - Right-click `index.html`
   - Send to > Desktop (create shortcut)
   - Rename to "Pomodoro Timer"

2. **Pin to Start Menu**:
   - Drag the shortcut to Start Menu
   - Right-click > Pin to Start

3. **Auto-start with Windows**:
   - Press `Win + R`, type `shell:startup`
   - Copy the shortcut to this folder

## Troubleshooting

### Timer Not Working
- Ensure JavaScript is enabled in your browser
- Try refreshing the page
- Check browser console for errors (F12)

### Notifications Not Showing
- Click the padlock icon in address bar
- Allow notifications for the site
- Check Windows notification settings

### Sound Not Playing
- Ensure browser audio is unmuted
- Check system volume
- Some browsers require user interaction before playing audio

## Development

To modify or extend the app:

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Edit files in the `pomodoro-app` folder
4. Changes will auto-reload in browser

## File Structure

```
pomodoro-app/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── script.js           # Timer logic and interactions
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## License

MIT License - feel free to use and modify for personal or commercial use.
