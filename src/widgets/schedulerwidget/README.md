# Scheduler Widget

The Scheduler Widget provides a comprehensive tool for managing event series, individual events, teams, and songs. It allows users to create and manage series, schedule events, assign teams, and organize song lists for services.

## Features

- **Series Management**: Create, view, and manage series with start and end dates
- **Event Scheduling**: Schedule events within a series
- **Team Management**: Organize teams and positions
- **Song Library**: Maintain a library of songs with arrangements and details
- **Event Planning**: Add songs to events and manage order

## Directory Structure

The Scheduler Widget follows the standard widget template structure:

```
/SchedulerWidget
├── README.md                 # Documentation for the widget
├── SchedulerWidget.tsx       # Main component file
├── actions/                  # Redux-style actions
│   └── index.ts
├── api/                      # API integration functions
├── components/               # UI components
│   ├── dashboard/
│   │   └── SchedulerDashboard.tsx
│   └── modals/
│       └── AddSeriesModal.tsx
├── context/                  # React context providers
│   ├── index.tsx
│   └── schedulerReducer.ts
├── hooks/                    # Custom React hooks
├── index.tsx                 # Main export file
├── styles/                   # Styled components
│   └── index.ts
├── theme/                    # Theme configuration
│   └── index.ts
├── types/                    # TypeScript type definitions
│   └── index.ts
└── utils/                    # Utility functions
    └── mockData.ts
```

## Usage

Import the widget:

```tsx
import { SchedulerWidget } from '../widgets/SchedulerWidget';

function App() {
  return (
    <div>
      <SchedulerWidget />
    </div>
  );
}
```

## State Management

The widget uses React Context API for state management with a Redux-style reducer pattern. Core state includes:

- Series
- Events
- Teams
- Songs
- Event Songs

## Extending the Widget

To add new features:

1. Add any new types to `types/index.ts`
2. Create new components in the `components/` directory
3. Add new actions in `actions/index.ts`
4. Update the reducer in `context/schedulerReducer.ts` to handle new actions
