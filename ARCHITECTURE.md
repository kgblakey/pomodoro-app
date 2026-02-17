# Pomodoro App Architecture

## Overview
The Pomodoro app has been refactored to follow a modular MVC-like architecture pattern, similar to professional web applications.

## Directory Structure

```
pomodoro-app/
├── src/
│   ├── models/
│   │   └── Timer.js              # Timer business logic
│   ├── controllers/
│   │   └── UIController.js        # DOM manipulation and UI state
│   ├── services/
│   │   ├── SettingsService.js     # Settings persistence
│   │   └── StatsService.js       # Statistics tracking
│   ├── utils/
│   │   └── NotificationService.js # Browser notifications
│   └── app.js                  # Main application entry point
├── index.html                   # HTML structure
├── styles.css                   # Styling
├── script.js                   # Legacy file (deprecated)
└── package.json                 # Dependencies and scripts
```

## Architecture Components

### Models (`src/models/`)
**Timer.js** - Pure business logic
- Timer state management
- Session calculations
- No DOM dependencies

### Controllers (`src/controllers/`)
**UIController.js** - UI layer
- DOM element management
- Event handling
- View updates
- No business logic

### Services (`src/services/`)
**SettingsService.js** - Data persistence
- localStorage operations
- Settings validation
- Default values

**StatsService.js** - Statistics management
- Daily progress tracking
- Time formatting
- Data persistence

### Utils (`src/utils/`)
**NotificationService.js** - External integrations
- Browser notifications
- Sound alerts
- Permission handling

### Main App (`src/app.js`)
**PomodoroApp** - Application coordinator
- Orchestrates all components
- Handles high-level events
- Component lifecycle management

## Design Principles

### Separation of Concerns
- **Models**: Pure business logic, no UI dependencies
- **Controllers**: UI manipulation, no business logic
- **Services**: Data management and external integrations
- **Utils**: Reusable utilities

### Dependency Flow
```
app.js (coordinator)
├── Timer.js (model)
├── UIController.js (controller)
├── SettingsService.js (service)
├── StatsService.js (service)
└── NotificationService.js (utility)
```

### Data Flow
1. **User Action** → UIController captures event
2. **UIController** → App coordinates response
3. **App** → Updates Timer model
4. **Timer** → Notifies app of state changes
5. **App** → Updates UIController and Services
6. **Services** → Persist data as needed

## Benefits

### Maintainability
- Each component has single responsibility
- Easy to locate and modify specific functionality
- Clear boundaries between layers

### Testability
- Components can be unit tested independently
- Mock dependencies easily
- Pure functions in services

### Scalability
- Easy to add new features
- Components can be reused
- Clear extension points

### Reusability
- Services can be used in other apps
- Models are framework-agnostic
- Utils are generic utilities

## Migration Notes

The original `script.js` contained all functionality in one large class. The new architecture:

1. **Extracted Timer logic** → `src/models/Timer.js`
2. **Separated UI concerns** → `src/controllers/UIController.js`
3. **Isolated data management** → `src/services/`
4. **Added utility services** → `src/utils/`
5. **Created coordinator** → `src/app.js`

This follows modern JavaScript patterns and makes the codebase much more maintainable and scalable.
