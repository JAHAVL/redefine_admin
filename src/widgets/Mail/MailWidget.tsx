import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// Import theme directly without destructuring
import MailTheme from './theme';
// Make sure component imports match the file names exactly
import MailList from './components/MailList';
import MailDetail from './components/MailDetail';
import Compose from './components/Compose';
import Sidebar from './components/Sidebar';

// Types
export interface Mail {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
  attachments?: {
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'starred';
}

// Main Container
const MailContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  min-height: 0; /* Critical for proper flex behavior */
  background-color: transparent;
  color: ${MailTheme.colors.text.primary};
  font-family: ${MailTheme.typography.fontFamily};
  backdrop-filter: blur(8px);
  flex: 1 1 auto; /* Grow and shrink as needed */
  border: none;
  outline: none;
  margin: 0;
  padding: 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${MailTheme.colors.background.transparent};
    pointer-events: none;
    z-index: -1;
  }
`;

const ContentArea = styled.div`
  display: flex;
  flex: 1;
  min-width: 0; /* Prevent content from overflowing */
  min-height: 0; /* Prevent content from overflowing */
  overflow: hidden;
  border: none;
  outline: none;
  margin: 0;
  padding: 0;
  background-color: transparent;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${MailTheme.colors.background.card};
    pointer-events: none;
    z-index: -1;
    backdrop-filter: blur(5px);
  }
`;

// Mock data for initial development
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

const MailWidget: React.FC = () => {
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

  return (
    <MailContainer>
      <Sidebar 
        currentFolder={currentFolder}
        setCurrentFolder={setCurrentFolder}
        onCompose={handleComposeEmail}
        unreadCount={emails.filter(e => !e.read && e.folder === 'inbox').length}
      />
      <ContentArea>
        <MailList 
          emails={filteredEmails}
          selectedEmailId={selectedEmail?.id}
          onSelectEmail={handleSelectEmail}
          onStarEmail={handleStarEmail}
          onDeleteEmail={handleDeleteEmail}
        />
        {selectedEmail && (
          <MailDetail 
            email={selectedEmail}
            onDelete={() => handleDeleteEmail(selectedEmail.id)}
            onStar={() => handleStarEmail(selectedEmail.id)}
            onClose={() => setSelectedEmail(null)}
          />
        )}
        {isComposing && (
          <Compose 
            onSend={handleSendEmail}
            onCancel={() => setIsComposing(false)}
          />
        )}
      </ContentArea>
    </MailContainer>
  );
};

export default MailWidget;
