import React, { createContext, useState, useContext } from 'react';
import { Mail } from '../types';

// Mock data for initial development (moved from MailWidget.tsx)
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

interface MailContextProps {
  emails: Mail[];
  selectedEmail: Mail | null;
  currentFolder: string;
  isComposing: boolean;
  setEmails: React.Dispatch<React.SetStateAction<Mail[]>>;
  setSelectedEmail: React.Dispatch<React.SetStateAction<Mail | null>>;
  setCurrentFolder: React.Dispatch<React.SetStateAction<string>>;
  setIsComposing: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectEmail: (email: Mail) => void;
  handleStarEmail: (emailId: string) => void;
  handleDeleteEmail: (emailId: string) => void;
  handleComposeEmail: () => void;
  handleSendEmail: (newEmail: Omit<Mail, 'id' | 'date' | 'read' | 'starred' | 'folder'>) => void;
  filteredEmails: Mail[];
}

const MailContext = createContext<MailContextProps | undefined>(undefined);

export const MailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emails, setEmails] = useState<Mail[]>(mockEmails);
  const [selectedEmail, setSelectedEmail] = useState<Mail | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string>('inbox');
  const [isComposing, setIsComposing] = useState<boolean>(false);

  // Filter emails based on the selected folder
  const filteredEmails = emails.filter(email => {
    if (currentFolder === 'starred') {
      return email.starred;
    }
    return email.folder === currentFolder;
  });

  // Handle email selection
  const handleSelectEmail = (email: Mail) => {
    setSelectedEmail(email);
    
    // Mark as read if it wasn't already
    if (!email.read) {
      const updatedEmails = emails.map(e => 
        e.id === email.id ? { ...e, read: true } : e
      );
      setEmails(updatedEmails);
    }
  };

  // Handle starring/unstarring emails
  const handleStarEmail = (emailId: string) => {
    const updatedEmails = emails.map(email => 
      email.id === emailId ? { ...email, starred: !email.starred } : email
    );
    setEmails(updatedEmails);
  };

  // Handle deleting emails (move to trash)
  const handleDeleteEmail = (emailId: string) => {
    const updatedEmails = emails.map(email => 
      email.id === emailId ? { ...email, folder: 'trash' as const } : email
    );
    setEmails(updatedEmails);
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null);
    }
  };

  // Handle composing new email
  const handleComposeEmail = () => {
    setIsComposing(true);
    setSelectedEmail(null);
  };

  // Handle sending email
  const handleSendEmail = (newEmail: Omit<Mail, 'id' | 'date' | 'read' | 'starred' | 'folder'>) => {
    const sentEmail: Mail = {
      ...newEmail,
      id: `new-${Date.now()}`,
      date: new Date().toISOString(),
      read: true,
      starred: false,
      folder: 'sent'
    };
    
    setEmails([sentEmail, ...emails]);
    setIsComposing(false);
  };

  const value = {
    emails,
    selectedEmail,
    currentFolder,
    isComposing,
    setEmails,
    setSelectedEmail,
    setCurrentFolder,
    setIsComposing,
    handleSelectEmail,
    handleStarEmail,
    handleDeleteEmail,
    handleComposeEmail,
    handleSendEmail,
    filteredEmails
  };

  return <MailContext.Provider value={value}>{children}</MailContext.Provider>;
};

export const useMailContext = () => {
  const context = useContext(MailContext);
  if (context === undefined) {
    throw new Error('useMailContext must be used within a MailProvider');
  }
  return context;
};
