import React from 'react';
import { MailProvider } from './context/MailContext';
import MainLayout from './layouts/MainLayout';
import Sidebar from './components/Sidebar';
import MailList from './components/MailList';
import MailDetail from './components/MailDetail';
import Compose from './components/Compose';
import useMailState from './hooks/useMailState';

/**
 * Mail Widget Component
 * 
 * Implements the widget architecture following best practices:
 * - Uses context for state management
 * - Separates layout from content
 * - Uses custom hooks for business logic
 * - Separates structure from theming
 */
const MailWidgetContent: React.FC = () => {
  // Use the custom hook to access state and handlers
  const {
    selectedEmail,
    currentFolder,
    isComposing,
    filteredEmails,
    selectEmail,
    starEmail,
    deleteEmail,
    composeEmail,
    sendEmail,
    setFolder,
    getUnreadCount,
    closeDetailView,
    cancelComposition
  } = useMailState();

  // Sidebar content with navigation and actions
  const sidebarContent = (
    <Sidebar 
      currentFolder={currentFolder}
      setCurrentFolder={setFolder}
      onCompose={composeEmail}
      unreadCount={getUnreadCount('inbox')}
    />
  );

  // Main content area that changes based on state
  const mainContent = (
    <>
      <MailList 
        emails={filteredEmails}
        selectedEmailId={selectedEmail?.id}
        onSelectEmail={selectEmail}
        onStarEmail={starEmail}
        onDeleteEmail={deleteEmail}
      />
      {selectedEmail && (
        <MailDetail 
          email={selectedEmail}
          onDelete={() => deleteEmail(selectedEmail.id)}
          onStar={() => starEmail(selectedEmail.id)}
          onClose={closeDetailView}
        />
      )}
      {isComposing && (
        <Compose 
          onSend={sendEmail}
          onCancel={cancelComposition}
        />
      )}
    </>
  );

  // Use the layout component to organize the UI
  return <MainLayout sidebarContent={sidebarContent} mainContent={mainContent} />;
};

/**
 * Main Mail Widget export
 * Wraps content with the context provider
 */
const MailWidget: React.FC = () => (
  <MailProvider>
    <MailWidgetContent />
  </MailProvider>
);

export default MailWidget;
