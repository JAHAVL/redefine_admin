// Series Types
export interface Series {
  id: number;
  series_name: string;
  description?: string; // Added for mock data
  series_desc?: string; // Original field
  start_date: string;
  end_date: string;
  banner_1?: string;
  banner_2?: string;
  created_by?: number;
  show_on_watch?: boolean;
  show_on_home?: boolean;
  is_special?: boolean;
  type?: string; // Added for mock data
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  SeriesEvents?: SeriesEvent[];
}

// Series Event Types
export interface SeriesEvent {
  id: number;
  series_id: number;
  live_stream_key?: string;
  event_name: string;
  event_desc?: string;
  event_date: string;
  event_day?: string;
  created_by?: number;
  banner?: string;
  location_id?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  SeriesEventTime?: SeriesEventTime[];
}

// Series Event Time Types
export interface SeriesEventTime {
  id: number;
  series_id: number;
  event_id: number;
  destination_group_id?: number;
  stream_session_id: string;
  event_time: string;
  type: 'worship' | 'rehearsal' | 'service' | 'simlive' | 'other';
  created_by: number;
  individual?: boolean;
  event_date: string;
  event_day: string;
  series_time_group_id?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

// Team Types
export interface Team {
  id: number;
  title?: string;
  name?: string; // Added for mock data
  description?: string;
  team_banner?: string;
  created_by?: number;
  link_to_kids_module?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  departments?: Department[];
}

// Department Types
export interface Department {
  id: number;
  department_name: string;
  team_id: number;
  created_by: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  positions?: Position[];
  team?: Team;
}

// Position Types
export interface Position {
  id: number;
  position_name: string;
  team_id: number;
  department_id: number;
  created_by: number;
  delete_when_department_is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  members?: User[];
  department?: Department;
  team?: Team;
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  profile_image?: string;
}

// Song Types
export interface Song {
  id: number;
  song_name: string;
  song_bpm?: string;
  song_keys?: string;
  tempo?: number; // Added for mock data
  key?: string; // Added for mock data
  song_file?: string;
  song_banner?: string;
  artist?: string;
  song_mp3?: string;
  youtube_link?: string;
  created_by?: number;
  last_scheduled?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  arrangement?: SongArrangement[];
}

// Song Arrangement Types
export interface SongArrangement {
  id: number;
  song_id: number;
  bpm?: string;
  title: string;
  length?: string;
  meter?: string;
  created_by: number;
  last_scheduled?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  arr_key?: SongArrangementKey[];
  labels?: SongArrangementLabel[];
}

// Song Arrangement Key Types
export interface SongArrangementKey {
  id: number;
  key: string;
  song_id: number;
  arr_id: number;
  path?: string;
  created_by: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  key_file?: SongArrangementKeyFile[];
}

// Song Arrangement Key File Types
export interface SongArrangementKeyFile {
  id: number;
  path: string;
  song_id: number;
  arr_id: number;
  key_id: number;
  created_by: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

// Song Label Types
export interface SongLabel {
  id: number;
  title: string;
  created_by: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

// Song Arrangement Label Types
export interface SongArrangementLabel {
  id: number;
  song_id: number;
  arr_id: number;
  label_id: number;
  label_title?: string;
  created_by: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  label?: SongLabel;
}

// Event Song Types
export interface EventSong {
  id: number;
  event_id: number;
  song_id: number;
  order_status: number;
  active_arrangement?: number;
  active_key?: number;
  duplicate_index?: number;
  header_text?: string;
  created_by: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  song?: Song;
  selectedarrangement?: SongArrangement;
  selectedkey?: SongArrangementKey;
}

// API Response Types
export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  status_code: number;
  result?: T;
}

// Action Response Types
export interface ActionResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
}

// State Types
export interface SchedulerState {
  series: Series[];
  specialSeries: Series[];
  currentSeries?: Series;
  currentEvent?: SeriesEvent;
  teams: Team[];
  songs: Song[];
  eventSongs: EventSong[];
  loading: {
    series: boolean;
    events: boolean;
    teams: boolean;
    songs: boolean;
    eventSongs: boolean;
  };
  error: {
    series?: string;
    events?: string;
    teams?: string;
    songs?: string;
    eventSongs?: string;
  };
}

// Action Types
export enum ActionTypes {
  FETCH_SERIES_REQUEST = 'FETCH_SERIES_REQUEST',
  FETCH_SERIES_SUCCESS = 'FETCH_SERIES_SUCCESS',
  FETCH_SERIES_FAILURE = 'FETCH_SERIES_FAILURE',
  
  FETCH_EVENTS_REQUEST = 'FETCH_EVENTS_REQUEST',
  FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS',
  FETCH_EVENTS_FAILURE = 'FETCH_EVENTS_FAILURE',
  
  FETCH_TEAMS_REQUEST = 'FETCH_TEAMS_REQUEST',
  FETCH_TEAMS_SUCCESS = 'FETCH_TEAMS_SUCCESS',
  FETCH_TEAMS_FAILURE = 'FETCH_TEAMS_FAILURE',
  
  FETCH_SONGS_REQUEST = 'FETCH_SONGS_REQUEST',
  FETCH_SONGS_SUCCESS = 'FETCH_SONGS_SUCCESS',
  FETCH_SONGS_FAILURE = 'FETCH_SONGS_FAILURE',
  
  FETCH_EVENT_SONGS_REQUEST = 'FETCH_EVENT_SONGS_REQUEST',
  FETCH_EVENT_SONGS_SUCCESS = 'FETCH_EVENT_SONGS_SUCCESS',
  FETCH_EVENT_SONGS_FAILURE = 'FETCH_EVENT_SONGS_FAILURE',
  
  CREATE_SERIES_REQUEST = 'CREATE_SERIES_REQUEST',
  CREATE_SERIES_SUCCESS = 'CREATE_SERIES_SUCCESS',
  CREATE_SERIES_FAILURE = 'CREATE_SERIES_FAILURE',
  
  CREATE_EVENT_REQUEST = 'CREATE_EVENT_REQUEST',
  CREATE_EVENT_SUCCESS = 'CREATE_EVENT_SUCCESS',
  CREATE_EVENT_FAILURE = 'CREATE_EVENT_FAILURE',
  
  ADD_EVENT_SONG_REQUEST = 'ADD_EVENT_SONG_REQUEST',
  ADD_EVENT_SONG_SUCCESS = 'ADD_EVENT_SONG_SUCCESS',
  ADD_EVENT_SONG_FAILURE = 'ADD_EVENT_SONG_FAILURE',
  
  SET_CURRENT_SERIES = 'SET_CURRENT_SERIES',
  SET_CURRENT_EVENT = 'SET_CURRENT_EVENT',
  
  CLEAR_ERRORS = 'CLEAR_ERRORS'
}
