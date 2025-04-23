# Scheduler Widget Architecture

## Overview

The Scheduler Widget is a React-based implementation of the church scheduling system, designed to manage series, events, teams, and songs. This document outlines the architecture, data models, and component structure for the React implementation based on the existing Laravel backend.

## Backend Data Models

The scheduling system is built around these core models:

### Series
- Represents a collection of related events (like a sermon series)
- Contains metadata like name, description, dates, and banner images
- Can be regular or special series

### SeriesEvent
- Individual events within a series
- Contains event name, description, date, and location
- Links to specific times and teams

### SeriesEventTime
- Specific times for an event
- Types include worship, rehearsal, service, simlive, etc.
- Contains stream session IDs for live events

### Teams
- Groups organized for specific functions (worship, production, etc.)
- Contains departments and positions

### Department
- Organizational units within teams
- Contains positions

### Position
- Specific roles within departments
- Links to team members

### Song
- Music resources for worship
- Contains metadata like name, BPM, keys, artist, files, and media links
- Has arrangements, keys, and labels
- Supports YouTube links and MP3 files
- Tracks last scheduled date

## Widget Architecture

Following the React Admin Application architecture pattern, the Scheduler Widget will be structured as follows:

```
/src/widgets/schedulerwidget/
  index.tsx                      # Main entry point
  SchedulerWidget.tsx            # Container widget
  SchedulerWidgetStyled.tsx      # Styled components
  
  /components/                   # Shared components
    CalendarView.tsx             # Calendar display component
    EventCard.tsx                # Event display card
    SeriesCard.tsx               # Series display card
    TeamMemberCard.tsx           # Team member display
    SongItem.tsx                 # Song display item
    PositionSelector.tsx         # Position selection component
    TimeSelector.tsx             # Time selection component
    
  /modules/                      # Specialized functional modules
    /series/
      SeriesList.tsx             # List of series
      SeriesForm.tsx             # Create/edit series
      SeriesDetail.tsx           # Series details view
      
    /events/
      EventList.tsx              # List of events
      EventForm.tsx              # Create/edit events
      EventDetail.tsx            # Event details view
      EventTimesManager.tsx      # Manage event times
      
    /teams/
      TeamList.tsx               # List of teams
      TeamForm.tsx               # Create/edit teams
      TeamDetail.tsx             # Team details view
      DepartmentManager.tsx      # Manage departments
      PositionManager.tsx        # Manage positions
      
    /scheduling/
      ScheduleView.tsx           # Schedule overview
      TeamScheduler.tsx          # Team scheduling interface
      MemberInvitation.tsx       # Member invitation system
      
    /songs/
      SongList.tsx               # List of songs
      SongForm.tsx               # Create/edit songs
      SongDetail.tsx             # Song details view
      ArrangementManager.tsx     # Manage song arrangements
      KeyManager.tsx             # Manage song keys
      LabelManager.tsx           # Manage song labels
      FileManager.tsx            # Manage song files and resources
      EventSongList.tsx          # Event-specific song list
      SongOrderManager.tsx       # Manage song order in events
      
  /state/                        # State management
    schedulerReducer.ts          # State reducer
    schedulerContext.tsx         # Context provider
    actions.ts                   # Action creators
    types.ts                     # TypeScript interfaces
```

## API Integration

The widget will interact with the following backend API endpoints:

### Series Endpoints
- `GET /api/v1/series` - Get all series
- `POST /api/v1/add_series` - Create a new series
- `POST /api/v1/searchSeries` - Search for series
- `POST /api/v1/deleteSeries` - Delete a series

### Events Endpoints
- `GET /api/v1/series/{id}` - Get series details with events
- `POST /api/v1/add_event_in_series` - Add event to a series
- `GET /api/v1/series/event/{series_id}/{event_id}` - Get event details
- `POST /api/v1/add_series_events_time` - Add time to an event

### Teams Endpoints
- `GET /api/v1/teams` - Get all teams
- `POST /api/v1/add_event_team_data` - Add team to an event
- `POST /api/v1/add_event_team_dept_data` - Add department to an event team
- `POST /api/v1/add_event_team_dept_position_data` - Add position to an event team department
- `POST /api/v1/send-team-invitation-data` - Send invitations to team members

### Songs Endpoints
- `POST /api/v1/searchSongs` - Search for songs
- `POST /api/v1/event-song-data` - Add song to an event
- `POST /api/v1/get-event-song-data` - Get songs for an event
- `POST /api/v1/add-song-arrangement` - Add arrangement to a song
- `POST /api/v1/add-song-arrangement-key` - Add key to a song arrangement
- `POST /api/v1/add-song-arrangement-key-file` - Add file to a song arrangement key
- `POST /api/v1/add-song-label` - Add label to a song
- `POST /api/v1/update-song-order` - Update song order in an event

## UI Components

### Main Views

1. **Series List View**
   - Grid of series cards showing upcoming and past series
   - Filter and search functionality
   - Create new series button

2. **Series Detail View**
   - Series information and banner
   - List of events in the series
   - Create new event button

3. **Event Detail View**
   - Event information and banner
   - Tabs for Times, Songs, and People (Schedule)
   - Team scheduling interface

4. **Team Scheduling View**
   - Hierarchical display of teams, departments, and positions
   - Interface for assigning people to positions
   - Invitation management

5. **Song Management View**
   - List of songs for an event
   - Interface for adding and arranging songs
   - Song details and resources
   - Arrangement and key selection
   - File management for sheet music and chord charts
   - Label management for song categorization
   - Order management for worship set planning

### Interactive Components

1. **Calendar Component**
   - Visual calendar for date selection
   - Event visualization

2. **Time Selector**
   - Interface for adding and managing event times
   - Support for different time types (worship, rehearsal, etc.)

3. **Team Assignment Interface**
   - Hierarchical team structure visualization
   - Drag-and-drop interface for assigning people to positions

4. **Song Arrangement Interface**
   - Sortable list of songs
   - Key and arrangement selection
   - File management for sheet music and chord charts
   - Label management for song categorization
   - BPM and meter configuration
   - YouTube and MP3 integration
   - File upload for resources

## State Management

The widget will use React Context API with reducers for state management, following these patterns:

1. **Context Provider**
   - Wrap the entire widget to provide state access
   - Manage loading states and error handling

2. **Actions**
   - Series actions (create, update, delete)
   - Event actions (create, update, delete)
   - Team scheduling actions
   - Song management actions

3. **Reducers**
   - Handle state updates based on actions
   - Maintain normalized state structure

4. **Selectors**
   - Derive computed data from state
   - Filter and sort data for views

## Routing

The widget will integrate with the React Admin Application's routing system:

1. **Main Routes**
   - `/admin/schedule` - Series list view
   - `/admin/schedule/:seriesId` - Series detail view
   - `/admin/schedule/event/:seriesId/:eventId` - Event detail view

2. **Sub-Routes**
   - `/admin/schedule/event/:seriesId/:eventId/teams` - Team scheduling view
   - `/admin/schedule/event/:seriesId/:eventId/songs` - Song management view

## Integration with Admin Application

The Scheduler Widget will integrate with the existing React Admin Application following these patterns:

1. **Left Menu Integration**
   - Add "Schedule" item to the main navigation

2. **Sub Menu Integration**
   - Add context-specific navigation items for the scheduling section

3. **Container Pattern**
   - Define scheduler container in the main page template
   - Load appropriate scheduler components based on routes

4. **Authentication Integration**
   - Respect existing authentication and permission system
   - Implement role-based access control (admin vs. team leader)

## Responsive Design

The widget will implement responsive design principles:

1. **Mobile-First Approach**
   - Design for mobile screens first, then enhance for larger screens

2. **Flexible Layouts**
   - Use CSS Grid and Flexbox for adaptive layouts

3. **Touch-Friendly Interactions**
   - Ensure all interactive elements work well on touch devices

## Accessibility

The widget will follow accessibility best practices:

1. **Semantic HTML**
   - Use appropriate HTML elements for their intended purpose

2. **ARIA Attributes**
   - Add ARIA roles and attributes where needed

3. **Keyboard Navigation**
   - Ensure all functionality is accessible via keyboard

4. **Color Contrast**
   - Maintain sufficient contrast for text and interactive elements

## Implementation Strategy

The implementation will follow these phases:

1. **Phase 1: Core Infrastructure**
   - Set up widget structure and state management
   - Implement API integration

2. **Phase 2: Series and Events**
   - Implement series list and detail views
   - Implement event creation and management

3. **Phase 3: Team Scheduling**
   - Implement team structure visualization
   - Implement position assignment interface

4. **Phase 4: Song Management**
   - Implement song list and detail views
   - Implement song arrangement interface
   - Implement key management system
   - Implement file upload and management
   - Implement label system for song categorization
   - Implement song order management for worship sets
   - Integrate YouTube and MP3 playback

5. **Phase 5: Integration and Polish**
   - Integrate with main application
   - Implement responsive design
   - Add final polish and optimizations
