import axios from 'axios';
import { ActionTypes, Series, SeriesEvent, EventSong, Song, Team, ActionResponse } from '../types';

// API base URL
const API_BASE_URL = '/api/v1';

// Helper function to get CSRF token
const getCSRFToken = (): string => {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
};

// Series Actions
export const fetchSeries = (type: 'upcoming' | 'past', keyword: string = '') => async (dispatch: any): Promise<void> => {
  dispatch({ type: ActionTypes.FETCH_SERIES_REQUEST });
  
  try {
    const response = await axios.post(`${API_BASE_URL}/searchSeries`, {
      keyword,
      type
    }, {
      headers: {
        'X-CSRF-TOKEN': getCSRFToken(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (response.data.status) {
      dispatch({
        type: ActionTypes.FETCH_SERIES_SUCCESS,
        payload: {
          series: response.data.result,
          specialSeries: response.data.special_series
        }
      });
    } else {
      dispatch({
        type: ActionTypes.FETCH_SERIES_FAILURE,
        payload: response.data.message
      });
    }
  } catch (error) {
    dispatch({
      type: ActionTypes.FETCH_SERIES_FAILURE,
      payload: error instanceof Error ? error.message : 'An error occurred'
    });
  }
};

// Create Series
export const createSeries = (seriesData: FormData) => async (dispatch: any): Promise<ActionResponse> => {
  dispatch({ type: ActionTypes.CREATE_SERIES_REQUEST });
  
  try {
    const response = await axios.post(`${API_BASE_URL}/add_series`, seriesData, {
      headers: {
        'X-CSRF-TOKEN': getCSRFToken(),
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      }
    });
    
    if (response.data.status) {
      dispatch({
        type: ActionTypes.CREATE_SERIES_SUCCESS,
        payload: response.data.result
      });
      return { success: true };
    } else {
      dispatch({
        type: ActionTypes.CREATE_SERIES_FAILURE,
        payload: response.data.message
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    dispatch({
      type: ActionTypes.CREATE_SERIES_FAILURE,
      payload: errorMessage
    });
    return { success: false, message: errorMessage };
  }
};

// Delete Series
export const deleteSeries = (seriesId: number) => async (dispatch: any): Promise<ActionResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/deleteSeries`, {
      series_id: seriesId
    }, {
      headers: {
        'X-CSRF-TOKEN': getCSRFToken(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (response.data.status) {
      // Use an existing action type since DELETE_SERIES_SUCCESS isn't defined
      dispatch({
        type: ActionTypes.FETCH_SERIES_SUCCESS,
        payload: { series: [], specialSeries: [] }
      });
      return { success: true };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return { success: false, message: errorMessage };
  }
};

// Fetch Series Events
export const fetchSeriesEvents = (seriesId: number) => async (dispatch: any) => {
  dispatch({ type: ActionTypes.FETCH_EVENTS_REQUEST });
  
  try {
    const response = await axios.get(`${API_BASE_URL}/series/${seriesId}`, {
      headers: {
        'X-CSRF-TOKEN': getCSRFToken(),
        'Accept': 'application/json'
      }
    });
    
    if (response.data) {
      dispatch({
        type: ActionTypes.FETCH_EVENTS_SUCCESS,
        payload: response.data
      });
    } else {
      dispatch({
        type: ActionTypes.FETCH_EVENTS_FAILURE,
        payload: 'Failed to fetch series events'
      });
    }
  } catch (error) {
    dispatch({
      type: ActionTypes.FETCH_EVENTS_FAILURE,
      payload: error instanceof Error ? error.message : 'An error occurred'
    });
  }
};

// Create Event in Series
export const createEvent = (eventData: any) => async (dispatch: any) => {
  dispatch({ type: ActionTypes.CREATE_EVENT_REQUEST });
  
  try {
    const response = await axios.post(`${API_BASE_URL}/add_event_in_series`, eventData, {
      headers: {
        'X-CSRF-TOKEN': getCSRFToken(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (response.data.status) {
      dispatch({
        type: ActionTypes.CREATE_EVENT_SUCCESS,
        payload: response.data.result
      });
      // Refresh the series events
      dispatch(fetchSeriesEvents(eventData.series_id));
      return { success: true };
    } else {
      dispatch({
        type: ActionTypes.CREATE_EVENT_FAILURE,
        payload: response.data.message
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    dispatch({
      type: ActionTypes.CREATE_EVENT_FAILURE,
      payload: errorMessage
    });
    return { success: false, message: errorMessage };
  }
};

// Add Event Time
export const addEventTime = (timeData: any) => async (dispatch: any) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add_series_events_time`, timeData, {
      headers: {
        'X-CSRF-TOKEN': getCSRFToken(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (response.data.status) {
      // Refresh the series events
      dispatch(fetchSeriesEvents(timeData.series_id));
      return { success: true };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    return { success: false, message: errorMessage };
  }
};

// Search Songs
export const searchSongs = (keyword: string) => async (dispatch: any) => {
  dispatch({ type: ActionTypes.FETCH_SONGS_REQUEST });
  
  try {
    const response = await axios.post(`${API_BASE_URL}/searchSongs`, {
      keyword
    }, {
      headers: {
        'X-CSRF-TOKEN': getCSRFToken(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (response.data.status) {
      dispatch({
        type: ActionTypes.FETCH_SONGS_SUCCESS,
        payload: response.data.result
      });
    } else {
      dispatch({
        type: ActionTypes.FETCH_SONGS_FAILURE,
        payload: response.data.message
      });
    }
  } catch (error) {
    dispatch({
      type: ActionTypes.FETCH_SONGS_FAILURE,
      payload: error instanceof Error ? error.message : 'An error occurred'
    });
  }
};

// Get Event Songs
export const getEventSongs = (eventId: number) => async (dispatch: any) => {
  dispatch({ type: ActionTypes.FETCH_EVENT_SONGS_REQUEST });
  
  try {
    const response = await axios.post(`/admin/get-event-song-data`, {
      event_id: eventId
    }, {
      headers: {
        'X-CSRF-TOKEN': getCSRFToken(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (response.data.success) {
      dispatch({
        type: ActionTypes.FETCH_EVENT_SONGS_SUCCESS,
        payload: response.data.event_song_data
      });
    } else {
      dispatch({
        type: ActionTypes.FETCH_EVENT_SONGS_FAILURE,
        payload: 'Failed to fetch event songs'
      });
    }
  } catch (error) {
    dispatch({
      type: ActionTypes.FETCH_EVENT_SONGS_FAILURE,
      payload: error instanceof Error ? error.message : 'An error occurred'
    });
  }
};

// Add Song to Event
export const addEventSong = (eventId: number, songId: number, orderStatus: number) => async (dispatch: any) => {
  dispatch({ type: ActionTypes.ADD_EVENT_SONG_REQUEST });
  
  try {
    const response = await axios.post(`/admin/addeventSongData`, {
      event_id: eventId,
      post_order_ids: [songId],
      order_status: orderStatus
    }, {
      headers: {
        'X-CSRF-TOKEN': getCSRFToken(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (response.data.success) {
      // Refresh event songs
      dispatch(getEventSongs(eventId));
      return { success: true };
    } else {
      dispatch({
        type: ActionTypes.ADD_EVENT_SONG_FAILURE,
        payload: response.data.message || 'Failed to add song to event'
      });
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    dispatch({
      type: ActionTypes.ADD_EVENT_SONG_FAILURE,
      payload: errorMessage
    });
    return { success: false, message: errorMessage };
  }
};

// Set Current Series
export const setCurrentSeries = (series: Series) => ({
  type: ActionTypes.SET_CURRENT_SERIES,
  payload: series
});

// Set Current Event
export const setCurrentEvent = (event: SeriesEvent) => ({
  type: ActionTypes.SET_CURRENT_EVENT,
  payload: event
});

// Clear Errors
export const clearErrors = () => ({
  type: ActionTypes.CLEAR_ERRORS
});
