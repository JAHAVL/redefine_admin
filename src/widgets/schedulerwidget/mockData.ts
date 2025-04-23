import { Series, SeriesEvent, Team, Song } from './types';

// Mock series data
export const mockSeries: Series[] = [
  {
    id: 1,
    series_name: 'Easter 2025',
    description: 'Join us for our Easter celebration services',
    banner_1: 'https://images.unsplash.com/photo-1544212415-e3f44a825b0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    start_date: '2025-04-20',
    end_date: '2025-04-20',
    type: 'normal',
    created_at: '2025-03-01T00:00:00.000Z',
    updated_at: '2025-03-01T00:00:00.000Z'
  },
  {
    id: 2,
    series_name: 'Faith & Science',
    description: 'Exploring the relationship between faith and modern science',
    banner_1: 'https://images.unsplash.com/photo-1532094349884-543019f6a73c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    start_date: '2025-05-01',
    end_date: '2025-06-15',
    type: 'normal',
    created_at: '2025-03-15T00:00:00.000Z',
    updated_at: '2025-03-15T00:00:00.000Z'
  },
  {
    id: 3,
    series_name: 'Summer Nights',
    description: 'Special summer evening services',
    banner_1: 'https://images.unsplash.com/photo-1506260408121-e353d10b87c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    start_date: '2025-07-01',
    end_date: '2025-08-31',
    type: 'normal',
    created_at: '2025-04-01T00:00:00.000Z',
    updated_at: '2025-04-01T00:00:00.000Z'
  },
  {
    id: 4,
    series_name: 'Relationships',
    description: 'Building healthy relationships in all areas of life',
    banner_1: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    start_date: '2025-09-01',
    end_date: '2025-10-15',
    type: 'normal',
    created_at: '2025-05-01T00:00:00.000Z',
    updated_at: '2025-05-01T00:00:00.000Z'
  },
  {
    id: 5,
    series_name: 'Christmas 2025',
    description: 'Celebrating the birth of Jesus',
    banner_1: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    start_date: '2025-12-01',
    end_date: '2025-12-25',
    type: 'normal',
    created_at: '2025-06-01T00:00:00.000Z',
    updated_at: '2025-06-01T00:00:00.000Z'
  },
  {
    id: 6,
    series_name: 'New Year, New You',
    description: 'Starting the new year with purpose and intention',
    banner_1: 'https://images.unsplash.com/photo-1546271227-b997d8c67338?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    start_date: '2026-01-01',
    end_date: '2026-01-31',
    type: 'normal',
    created_at: '2025-07-01T00:00:00.000Z',
    updated_at: '2025-07-01T00:00:00.000Z'
  }
];

// Mock special series data
export const mockSpecialSeries: Series[] = [
  {
    id: 101,
    series_name: 'Women\'s Conference',
    description: 'Annual women\'s conference',
    banner_1: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    start_date: '2025-05-15',
    end_date: '2025-05-17',
    type: 'special',
    created_at: '2025-03-01T00:00:00.000Z',
    updated_at: '2025-03-01T00:00:00.000Z'
  },
  {
    id: 102,
    series_name: 'Men\'s Retreat',
    description: 'Annual men\'s retreat',
    banner_1: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    start_date: '2025-06-01',
    end_date: '2025-06-03',
    type: 'special',
    created_at: '2025-03-15T00:00:00.000Z',
    updated_at: '2025-03-15T00:00:00.000Z'
  },
  {
    id: 103,
    series_name: 'Youth Camp',
    description: 'Summer youth camp',
    banner_1: 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    start_date: '2025-07-15',
    end_date: '2025-07-20',
    type: 'special',
    created_at: '2025-04-01T00:00:00.000Z',
    updated_at: '2025-04-01T00:00:00.000Z'
  }
];

// Mock past series data
export const mockPastSeries: Series[] = [
  {
    id: 201,
    series_name: 'New Year\'s 2024',
    description: 'New Year\'s services',
    banner_1: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    start_date: '2024-01-01',
    end_date: '2024-01-07',
    type: 'normal',
    created_at: '2023-12-01T00:00:00.000Z',
    updated_at: '2023-12-01T00:00:00.000Z'
  },
  {
    id: 202,
    series_name: 'Easter 2024',
    description: 'Easter celebration services',
    banner_1: 'https://images.unsplash.com/photo-1457301353672-324d6d14f471?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    start_date: '2024-04-21',
    end_date: '2024-04-21',
    type: 'normal',
    created_at: '2024-03-01T00:00:00.000Z',
    updated_at: '2024-03-01T00:00:00.000Z'
  },
  {
    id: 203,
    series_name: 'Summer Series 2024',
    description: 'Summer series',
    banner_1: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    start_date: '2024-06-01',
    end_date: '2024-08-31',
    type: 'normal',
    created_at: '2024-05-01T00:00:00.000Z',
    updated_at: '2024-05-01T00:00:00.000Z'
  },
  {
    id: 204,
    series_name: 'Fall Revival',
    description: 'Fall revival services',
    banner_1: 'https://images.unsplash.com/photo-1507371341162-763b5e419408?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    start_date: '2024-09-15',
    end_date: '2024-09-30',
    type: 'normal',
    created_at: '2024-08-01T00:00:00.000Z',
    updated_at: '2024-08-01T00:00:00.000Z'
  },
  {
    id: 205,
    series_name: 'Christmas 2024',
    description: 'Christmas celebration services',
    banner_1: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    start_date: '2024-12-01',
    end_date: '2024-12-25',
    type: 'normal',
    created_at: '2024-11-01T00:00:00.000Z',
    updated_at: '2024-11-01T00:00:00.000Z'
  }
];

// Mock past special series data
export const mockPastSpecialSeries: Series[] = [
  {
    id: 301,
    series_name: 'Women\'s Conference 2024',
    description: 'Annual women\'s conference',
    banner_1: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    start_date: '2024-05-15',
    end_date: '2024-05-17',
    type: 'special',
    created_at: '2024-03-01T00:00:00.000Z',
    updated_at: '2024-03-01T00:00:00.000Z'
  },
  {
    id: 302,
    series_name: 'Men\'s Retreat 2024',
    description: 'Annual men\'s retreat',
    banner_1: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    start_date: '2024-06-01',
    end_date: '2024-06-03',
    type: 'special',
    created_at: '2024-03-15T00:00:00.000Z',
    updated_at: '2024-03-15T00:00:00.000Z'
  }
];

// Mock teams data
export const mockTeams: Team[] = [
  {
    id: 1,
    name: 'Worship Team',
    description: 'Main worship team',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Production Team',
    description: 'Audio, video, and lighting team',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'Hospitality Team',
    description: 'Greeting and hospitality team',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  }
];

// Mock songs data
export const mockSongs: Song[] = [
  {
    id: 1,
    song_name: 'Amazing Grace',
    artist: 'John Newton',
    key: 'G',
    tempo: 72,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    song_name: 'How Great Is Our God',
    artist: 'Chris Tomlin',
    key: 'C',
    tempo: 78,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 3,
    song_name: '10,000 Reasons',
    artist: 'Matt Redman',
    key: 'G',
    tempo: 73,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 4,
    song_name: 'Oceans',
    artist: 'Hillsong United',
    key: 'D',
    tempo: 132,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 5,
    song_name: 'What A Beautiful Name',
    artist: 'Hillsong Worship',
    key: 'D',
    tempo: 68,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  }
];

// Mock events data
export const mockEvents: SeriesEvent[] = [
  {
    id: 1,
    series_id: 1,
    event_name: 'Easter Sunday Service',
    event_date: '2025-04-20',
    created_at: '2025-03-01T00:00:00.000Z',
    updated_at: '2025-03-01T00:00:00.000Z'
  },
  {
    id: 2,
    series_id: 2,
    event_name: 'Faith & Science Week 1',
    event_date: '2025-05-01',
    created_at: '2025-03-15T00:00:00.000Z',
    updated_at: '2025-03-15T00:00:00.000Z'
  },
  {
    id: 3,
    series_id: 2,
    event_name: 'Faith & Science Week 2',
    event_date: '2025-05-08',
    created_at: '2025-03-15T00:00:00.000Z',
    updated_at: '2025-03-15T00:00:00.000Z'
  }
];

// Helper function to get all series (upcoming and special)
export const getAllUpcomingSeries = () => [...mockSeries, ...mockSpecialSeries];

// Helper function to get all past series (past and past special)
export const getAllPastSeries = () => [...mockPastSeries, ...mockPastSpecialSeries];

// Helper function to get series by ID
export const getSeriesById = (id: number) => {
  return [...mockSeries, ...mockSpecialSeries, ...mockPastSeries, ...mockPastSpecialSeries].find(series => series.id === id);
};

// Helper function to get events by series ID
export const getEventsBySeriesId = (seriesId: number) => {
  return mockEvents.filter(event => event.series_id === seriesId);
};
