# Scheduler Widget Pages

This document outlines the available pages and routing structure within the Scheduler Widget.

## Available Routes

### Dashboard (`/`)
The main entry point for the Scheduler Widget, displaying all series.

**Features:**
- View all upcoming and past series
- Filter and search for specific series
- Add new series
- Delete existing series
- Navigate to series details

### Series Detail (`/series/:id`)
Detailed view for a specific series, showing all events and information.

**Features:**
- View series details and metadata
- Manage events within the series
- Schedule new events
- View team assignments

### Teams (`/teams`)
Management page for teams and positions.

**Features:**
- View all teams
- Manage team positions and departments
- Assign team members to positions

### Songs (`/songs`)
Library of songs and arrangements for services.

**Features:**
- View song library
- Search and filter songs
- Add new songs and arrangements
- Manage song details

## Route Structure

The Scheduler Widget uses React Router for navigation:

```jsx
<Routes>
  <Route path="/" element={<SchedulerDashboard />} />
  <Route path="/series" element={<SchedulerDashboard />} />
  <Route path="/series/:id" element={<SeriesDetail />} />
  <Route path="/teams" element={<TeamsList />} />
  <Route path="/songs" element={<SongsList />} />
</Routes>
```

## Adding New Pages

To add a new page to the Scheduler Widget:

1. Create a new component in the `components` directory
2. Add a new route in the `SchedulerWidget.tsx` file
3. Update this documentation to reflect the new page
