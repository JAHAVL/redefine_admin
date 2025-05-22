// API integration functions for the Scheduler Widget
// This file will contain all API-related functions for the Scheduler Widget

import axios from 'axios';

const API_BASE_URL = '/api/v1';

// Helper function to get CSRF token
export const getCSRFToken = (): string => {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
};

// Example API function for future use
export const fetchSchedulerData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/scheduler`, {
            headers: {
                'X-CSRF-TOKEN': getCSRFToken(),
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error fetching scheduler data:', error);
        throw error;
    }
};
