import axios from 'axios';
import { Mail } from './MailWidget';

// Get API base URL from environment variable with fallback
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '30000'),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// For debugging
console.log('Using Mail API base URL:', API_BASE_URL);

// API interface definition
export interface MailAPI {
  getEmails: (folder: string) => Promise<Mail[]>;
  getEmail: (id: string) => Promise<Mail>;
  sendEmail: (email: Omit<Mail, 'id' | 'date' | 'read' | 'starred' | 'folder'>) => Promise<Mail>;
  deleteEmail: (id: string) => Promise<void>;
  markAsRead: (id: string, read: boolean) => Promise<void>;
  starEmail: (id: string, starred: boolean) => Promise<void>;
  moveToFolder: (id: string, folder: string) => Promise<void>;
}

// Implementation of the API interface
const mailAPI: MailAPI = {
  // Get all emails for a specific folder
  getEmails: async (folder: string) => {
    try {
      console.log(`Fetching emails for folder: ${folder}`);
      const response = await api.get(`/v1/widgets/mail/${folder}`);
      console.log('API response:', response.data);
      return response.data.emails || [];
    } catch (error) {
      console.error('Error fetching emails:', error);
      // For development, return mock data if API fails
      return getMockEmails(folder);
    }
  },

  // Get a specific email by ID
  getEmail: async (id: string) => {
    try {
      console.log(`Fetching email with ID: ${id}`);
      const response = await api.get(`/v1/widgets/mail/email/${id}`);
      console.log('API response:', response.data);
      return response.data.email;
    } catch (error) {
      console.error('Error fetching email:', error);
      // For development, return mock email if API fails
      return getMockEmail(id);
    }
  },

  // Send a new email
  sendEmail: async (email) => {
    try {
      console.log('Sending email:', email);
      const response = await api.post('/v1/widgets/mail/send', email);
      console.log('API response:', response.data);
      return response.data.email;
    } catch (error) {
      console.error('Error sending email:', error);
      // For development, return mock sent email if API fails
      return createMockSentEmail(email);
    }
  },

  // Delete an email (move to trash)
  deleteEmail: async (id: string) => {
    try {
      console.log(`Deleting email with ID: ${id}`);
      await api.delete(`/v1/widgets/mail/email/${id}`);
      console.log('Email deleted successfully');
    } catch (error) {
      console.error('Error deleting email:', error);
      // For development, just log the error
    }
  },

  // Mark an email as read/unread
  markAsRead: async (id: string, read: boolean) => {
    try {
      console.log(`Marking email ${id} as ${read ? 'read' : 'unread'}`);
      await api.patch(`/v1/widgets/mail/email/${id}/read`, { read });
      console.log('Email updated successfully');
    } catch (error) {
      console.error('Error updating email read status:', error);
      // For development, just log the error
    }
  },

  // Star/unstar an email
  starEmail: async (id: string, starred: boolean) => {
    try {
      console.log(`${starred ? 'Starring' : 'Unstarring'} email ${id}`);
      await api.patch(`/v1/widgets/mail/email/${id}/star`, { starred });
      console.log('Email updated successfully');
    } catch (error) {
      console.error('Error updating email star status:', error);
      // For development, just log the error
    }
  },

  // Move an email to a different folder
  moveToFolder: async (id: string, folder: string) => {
    try {
      console.log(`Moving email ${id} to folder: ${folder}`);
      await api.patch(`/v1/widgets/mail/email/${id}/move`, { folder });
      console.log('Email moved successfully');
    } catch (error) {
      console.error('Error moving email:', error);
      // For development, just log the error
    }
  }
};

// Mock data helpers for development
const getMockEmails = (folder: string): Mail[] => {
  const mockEmails: Mail[] = [
    {
      id: '1',
      from: 'john.doe@example.com',
      to: 'me@church.org',
      subject: 'Weekly Service Schedule',
      body: 'Here is the schedule for this week\'s services. Please review and let me know if there are any changes needed.',
      date: '2025-04-10T10:30:00',
      read: false,
      starred: true,
      folder: 'inbox'
    },
    {
      id: '2',
      from: 'volunteer@church.org',
      to: 'me@church.org',
      subject: 'Volunteer Sign-up for Easter',
      body: 'We need volunteers for the Easter service. Please sign up if you\'re available.',
      date: '2025-04-09T15:45:00',
      read: true,
      starred: false,
      folder: 'inbox'
    },
    {
      id: '3',
      from: 'me@church.org',
      to: 'finance@church.org',
      subject: 'Budget Approval',
      body: 'I\'ve reviewed the budget proposal and have a few questions before approval.',
      date: '2025-04-08T09:15:00',
      read: true,
      starred: false,
      folder: 'sent'
    },
    {
      id: '4',
      from: 'events@church.org',
      to: 'me@church.org',
      subject: 'Upcoming Community Event',
      body: 'We\'re planning a community outreach event next month. Would you like to be involved in the planning?',
      date: '2025-04-07T14:20:00',
      read: true,
      starred: true,
      folder: 'inbox'
    },
    {
      id: '5',
      from: 'me@church.org',
      to: 'pastor@church.org',
      subject: 'Meeting Request',
      body: 'I\'d like to schedule a meeting to discuss the new youth program.',
      date: '2025-04-06T11:05:00',
      read: true,
      starred: false,
      folder: 'drafts'
    }
  ];

  if (folder === 'starred') {
    return mockEmails.filter(email => email.starred);
  }
  
  return mockEmails.filter(email => email.folder === folder);
};

const getMockEmail = (id: string): Mail => {
  const allEmails = [
    ...getMockEmails('inbox'),
    ...getMockEmails('sent'),
    ...getMockEmails('drafts'),
    ...getMockEmails('trash')
  ];
  
  const email = allEmails.find(email => email.id === id);
  
  if (!email) {
    throw new Error(`Email with ID ${id} not found`);
  }
  
  return email;
};

const createMockSentEmail = (email: Omit<Mail, 'id' | 'date' | 'read' | 'starred' | 'folder'>): Mail => {
  return {
    ...email,
    id: `new-${Date.now()}`,
    date: new Date().toISOString(),
    read: true,
    starred: false,
    folder: 'sent'
  };
};

export default mailAPI;
