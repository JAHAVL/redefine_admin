import { ActionTypes, SchedulerState } from '../types';

// Define the initial state
export const initialState: SchedulerState = {
  series: [],
  specialSeries: [],
  currentSeries: undefined,
  currentEvent: undefined,
  teams: [],
  songs: [],
  eventSongs: [],
  loading: {
    series: false,
    events: false,
    teams: false,
    songs: false,
    eventSongs: false,
  },
  error: {},
};

// Define the reducer function
export const schedulerReducer = (state = initialState, action: any): SchedulerState => {
  switch (action.type) {
    // Series actions
    case ActionTypes.FETCH_SERIES_REQUEST:
      return {
        ...state,
        loading: { ...state.loading, series: true },
        error: { ...state.error, series: undefined },
      };
    case ActionTypes.FETCH_SERIES_SUCCESS:
      return {
        ...state,
        series: action.payload.series,
        specialSeries: action.payload.specialSeries,
        loading: { ...state.loading, series: false },
      };
    case ActionTypes.FETCH_SERIES_FAILURE:
      return {
        ...state,
        loading: { ...state.loading, series: false },
        error: { ...state.error, series: action.payload },
      };

    // Events actions
    case "FETCH_EVENTS_REQUEST":
      return {
        ...state,
        loading: { ...state.loading, events: true },
        error: { ...state.error, events: undefined },
      };
    case "FETCH_EVENTS_SUCCESS":
      return {
        ...state,
        currentSeries: action.payload,
        loading: { ...state.loading, events: false },
      };
    case "FETCH_EVENTS_FAILURE":
      return {
        ...state,
        loading: { ...state.loading, events: false },
        error: { ...state.error, events: action.payload },
      };

    // Teams actions
    case ActionTypes.FETCH_TEAMS_REQUEST:
      return {
        ...state,
        loading: { ...state.loading, teams: true },
        error: { ...state.error, teams: undefined },
      };
    case ActionTypes.FETCH_TEAMS_SUCCESS:
      return {
        ...state,
        teams: action.payload,
        loading: { ...state.loading, teams: false },
      };
    case ActionTypes.FETCH_TEAMS_FAILURE:
      return {
        ...state,
        loading: { ...state.loading, teams: false },
        error: { ...state.error, teams: action.payload },
      };

    // Songs actions
    case ActionTypes.FETCH_SONGS_REQUEST:
      return {
        ...state,
        loading: { ...state.loading, songs: true },
        error: { ...state.error, songs: undefined },
      };
    case ActionTypes.FETCH_SONGS_SUCCESS:
      return {
        ...state,
        songs: action.payload,
        loading: { ...state.loading, songs: false },
      };
    case ActionTypes.FETCH_SONGS_FAILURE:
      return {
        ...state,
        loading: { ...state.loading, songs: false },
        error: { ...state.error, songs: action.payload },
      };

    // Event Songs actions
    case ActionTypes.FETCH_EVENT_SONGS_REQUEST:
      return {
        ...state,
        loading: { ...state.loading, eventSongs: true },
        error: { ...state.error, eventSongs: undefined },
      };
    case ActionTypes.FETCH_EVENT_SONGS_SUCCESS:
      return {
        ...state,
        eventSongs: action.payload,
        loading: { ...state.loading, eventSongs: false },
      };
    case ActionTypes.FETCH_EVENT_SONGS_FAILURE:
      return {
        ...state,
        loading: { ...state.loading, eventSongs: false },
        error: { ...state.error, eventSongs: action.payload },
      };

    // Create Series actions
    case ActionTypes.CREATE_SERIES_REQUEST:
      return {
        ...state,
        loading: { ...state.loading, series: true },
        error: { ...state.error, series: undefined },
      };
    case ActionTypes.CREATE_SERIES_SUCCESS:
      return {
        ...state,
        series: [...state.series, action.payload],
        loading: { ...state.loading, series: false },
      };
    case ActionTypes.CREATE_SERIES_FAILURE:
      return {
        ...state,
        loading: { ...state.loading, series: false },
        error: { ...state.error, series: action.payload },
      };

    // Create Event actions
    case ActionTypes.CREATE_EVENT_REQUEST:
      return {
        ...state,
        loading: { ...state.loading, events: true },
        error: { ...state.error, events: undefined },
      };
    case ActionTypes.CREATE_EVENT_SUCCESS:
      return {
        ...state,
        currentSeries: {
          ...state.currentSeries!,
          SeriesEvents: [...(state.currentSeries?.SeriesEvents || []), action.payload],
        },
        loading: { ...state.loading, events: false },
      };
    case ActionTypes.CREATE_EVENT_FAILURE:
      return {
        ...state,
        loading: { ...state.loading, events: false },
        error: { ...state.error, events: action.payload },
      };

    // Add Event Song actions
    case "ADD_EVENT_SONG_REQUEST":
      return {
        ...state,
        loading: { ...state.loading, eventSongs: true },
        error: { ...state.error, eventSongs: undefined },
      };
    case "ADD_EVENT_SONG_SUCCESS":
      return {
        ...state,
        eventSongs: [...state.eventSongs, action.payload],
        loading: { ...state.loading, eventSongs: false },
      };
    case "ADD_EVENT_SONG_FAILURE":
      return {
        ...state,
        loading: { ...state.loading, eventSongs: false },
        error: { ...state.error, eventSongs: action.payload },
      };

    // Set current series/event
    case "SET_CURRENT_SERIES":
      return {
        ...state,
        currentSeries: action.payload,
      };
    case "SET_CURRENT_EVENT":
      return {
        ...state,
        currentEvent: action.payload,
      };

    // Clear errors
    case ActionTypes.CLEAR_ERRORS:
      return {
        ...state,
        error: {},
      };

    default:
      return state;
  }
};
