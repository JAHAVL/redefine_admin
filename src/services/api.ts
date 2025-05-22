/**
 * API Service
 * 
 * Provides API-related functionality for the application
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

/**
 * Handles the response from the API
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Something went wrong');
  }
  
  // For 204 No Content responses
  if (response.status === 204) {
    return null;
  }
  
  return response.json();
};

const apiService = {
  /**
   * Make a GET request
   * @param url The URL to request
   * @param params Optional query parameters
   * @returns The response data
   */
  get: async <T = any>(url: string, params?: Record<string, any>): Promise<T> => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    const fullUrl = `${API_BASE_URL}${url}${queryString}`;
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    return handleResponse(response);
  },

  /**
   * Make a POST request
   * @param url The URL to request
   * @param data The data to send
   * @returns The response data
   */
  post: async <T = any>(url: string, data: any): Promise<T> => {
    const fullUrl = `${API_BASE_URL}${url}`;
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    
    return handleResponse(response);
  },

  /**
   * Make a PUT request
   * @param url The URL to request
   * @param data The data to send
   * @returns The response data
   */
  put: async <T = any>(url: string, data: any): Promise<T> => {
    const fullUrl = `${API_BASE_URL}${url}`;
    
    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    
    return handleResponse(response);
  },

  /**
   * Make a DELETE request
   * @param url The URL to request
   * @returns The response data
   */
  delete: async <T = void>(url: string): Promise<T> => {
    const fullUrl = `${API_BASE_URL}${url}`;
    
    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    
    return handleResponse(response);
  },
};

export default apiService;
