import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Location, LocationFormData } from './types';

/**
 * Locations API Service
 * 
 * This service handles all API interactions specific to the Locations widget.
 * It extends the base API service with location-specific endpoints and transformations.
 */

class LocationsApiService {
  private api: AxiosInstance;
  private baseUrl: string = '/api/locations';

  constructor() {
    // Create a new axios instance for locations API
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || '',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Get token from localStorage or another auth service
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        // Handle specific error cases
        if (error.response) {
          // Server responded with a status code outside of 2xx range
          switch (error.response.status) {
            case 401:
              // Unauthorized - redirect to login
              window.location.href = '/login';
              break;
            case 403:
              // Forbidden - user doesn't have permission
              console.error('Permission denied:', error.response.data.message);
              break;
            case 404:
              // Not found
              console.error('Resource not found:', error.response.data.message);
              break;
            case 422:
              // Validation errors
              console.error('Validation errors:', error.response.data.errors);
              break;
            case 500:
              // Server error
              console.error('Server error:', error.response.data.message);
              break;
            default:
              console.error('API error:', error.response.data);
          }
        } else if (error.request) {
          // Request was made but no response received
          console.error('No response received:', error.request);
        } else {
          // Error in setting up the request
          console.error('Request error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get all locations
   * @returns Promise with locations data
   */
  public async getAllLocations(): Promise<Location[]> {
    try {
      const response = await this.api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  }

  /**
   * Get a specific location
   * @param locationId ID of the location to retrieve
   * @returns Promise with location data
   */
  public async getLocation(locationId: string): Promise<Location> {
    try {
      const response = await this.api.get(`${this.baseUrl}/${locationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching location ${locationId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new location
   * @param locationData Location data to create
   * @returns Promise with created location
   */
  public async createLocation(locationData: LocationFormData): Promise<Location> {
    try {
      const response = await this.api.post(this.baseUrl, locationData);
      return response.data;
    } catch (error) {
      console.error('Error creating location:', error);
      throw error;
    }
  }

  /**
   * Update an existing location
   * @param locationId Location ID to update
   * @param locationData Updated location data
   * @returns Promise with updated location
   */
  public async updateLocation(locationId: string, locationData: LocationFormData): Promise<Location> {
    try {
      const response = await this.api.put(`${this.baseUrl}/${locationId}`, locationData);
      return response.data;
    } catch (error) {
      console.error(`Error updating location ${locationId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a location
   * @param locationId Location ID to delete
   * @returns Promise with success status
   */
  public async deleteLocation(locationId: string): Promise<void> {
    try {
      await this.api.delete(`${this.baseUrl}/${locationId}`);
    } catch (error) {
      console.error(`Error deleting location ${locationId}:`, error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const locationsApiService = new LocationsApiService();
export default locationsApiService;
