// Song Component Interfaces
export interface SongExpandStateData {
    expanded: boolean;
    activeTab: 'info' | 'arrangement' | 'files' | 'notes';
    filesView?: 'grid' | 'table';
    addingNoteType?: string;
    activeNoteType?: string;
    // Added properties for arrangement tracking
    selectedArrangement?: string;
    selectedKey?: string;
    notesByType?: {
        [key: string]: Array<{
            id: number;
            content: string;
        }>;
    };
}

// Define BorderRadius extension for theme
export interface ThemeBorderRadius {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string; // Added for components that use borderRadius: 'full'
}

// Extended SeriesEvent interface with additional fields
export interface ExtendedSeriesEvent {
    id: number;
    series_id: number;
    live_stream_key?: string;
    event_name: string;
    event_desc?: string;
    description?: string;
    event_date: string;
    event_day?: string;
    created_by?: number;
    banner?: string;
    image_url?: string;
    location_id?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}
