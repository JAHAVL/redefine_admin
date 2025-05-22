import { Series, SeriesEvent, Team, Song } from '../types';

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
        description: 'Annual Christmas services',
        banner_1: 'https://images.unsplash.com/photo-1543589923-d58f764fb59c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        start_date: '2025-12-24',
        end_date: '2025-12-25',
        type: 'normal',
        created_at: '2025-06-01T00:00:00.000Z',
        updated_at: '2025-06-01T00:00:00.000Z'
    }
];

// Mock special series data
export const mockSpecialSeries: Series[] = [
    {
        id: 101,
        series_name: 'Baptism Sunday',
        description: 'Special baptism service',
        banner_1: 'https://images.unsplash.com/photo-1524601500432-1e1a4c71c4c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        start_date: '2025-05-15',
        end_date: '2025-05-15',
        is_special: true,
        type: 'special',
        created_at: '2025-04-15T00:00:00.000Z',
        updated_at: '2025-04-15T00:00:00.000Z'
    },
    {
        id: 102,
        series_name: 'Missions Weekend',
        description: 'Focus on global missions and service opportunities',
        banner_1: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        start_date: '2025-06-22',
        end_date: '2025-06-23',
        is_special: true,
        type: 'special',
        created_at: '2025-05-01T00:00:00.000Z',
        updated_at: '2025-05-01T00:00:00.000Z'
    },
    {
        id: 103,
        series_name: 'Prayer Night',
        description: 'Community-wide prayer gathering',
        banner_1: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        start_date: '2025-07-15',
        end_date: '2025-07-15',
        is_special: true,
        type: 'special',
        created_at: '2025-06-01T00:00:00.000Z',
        updated_at: '2025-06-01T00:00:00.000Z'
    }
];

// Mock past series data
export const mockPastSeries: Series[] = [
    {
        id: 201,
        series_name: 'New Year\'s 2024',
        description: 'New Year\'s services',
        banner_1: 'https://images.unsplash.com/photo-1546271227-b025be399014?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        start_date: '2024-12-31',
        end_date: '2025-01-01',
        type: 'normal',
        created_at: '2024-11-01T00:00:00.000Z',
        updated_at: '2024-11-01T00:00:00.000Z'
    },
    {
        id: 202,
        series_name: 'Foundations',
        description: 'Core principles of faith',
        banner_1: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        start_date: '2025-01-05',
        end_date: '2025-02-23',
        type: 'normal',
        created_at: '2024-12-01T00:00:00.000Z',
        updated_at: '2024-12-01T00:00:00.000Z'
    },
    {
        id: 203,
        series_name: 'Wisdom',
        description: 'Finding wisdom for everyday life',
        banner_1: 'https://images.unsplash.com/photo-1533327325824-76bc4e62d560?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        start_date: '2025-03-01',
        end_date: '2025-04-15',
        type: 'normal',
        created_at: '2025-01-15T00:00:00.000Z',
        updated_at: '2025-01-15T00:00:00.000Z'
    }
];

// Mock past special series data
export const mockPastSpecialSeries: Series[] = [
    {
        id: 301,
        series_name: 'Valentine\'s Day Service',
        description: 'Special Valentine\'s Day service',
        banner_1: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        start_date: '2025-02-14',
        end_date: '2025-02-14',
        is_special: true,
        type: 'special',
        created_at: '2025-01-14T00:00:00.000Z',
        updated_at: '2025-01-14T00:00:00.000Z'
    },
    {
        id: 302,
        series_name: 'Community Outreach Day',
        description: 'Serving our local community',
        banner_1: 'https://images.unsplash.com/photo-1544476915-ed1370594142?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        start_date: '2025-03-21',
        end_date: '2025-03-21',
        is_special: true,
        type: 'special',
        created_at: '2025-02-15T00:00:00.000Z',
        updated_at: '2025-02-15T00:00:00.000Z'
    }
];

// Mock events data
export const mockEvents: SeriesEvent[] = [
    {
        id: 1,
        series_id: 1,
        event_name: 'Easter Sunday Service',
        event_desc: 'Main Easter celebration service',
        event_date: '2025-04-20',
        event_day: 'Sunday',
        created_at: '2025-03-01T00:00:00.000Z',
        updated_at: '2025-03-01T00:00:00.000Z'
    }
];

// Helper function to get all series (upcoming and special)
export const getAllUpcomingSeries = () => [...mockSeries, ...mockSpecialSeries];

// Helper function to get all past series (past and past special)
export const getAllPastSeries = () => [...mockPastSeries, ...mockPastSpecialSeries];

// Helper function to get series by ID
export const getSeriesById = (id: number) => {
    return [...mockSeries, ...mockSpecialSeries, ...mockPastSeries, ...mockPastSpecialSeries]
        .find(series => series.id === id);
};

// Helper function to get events by series ID
export const getEventsBySeriesId = (seriesId: number) => {
    return mockEvents.filter(event => event.series_id === seriesId);
};
