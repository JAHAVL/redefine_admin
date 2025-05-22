import { useCallback } from 'react';
import { useMailContext } from '../context/MailContext';
import { Mail } from '../types';

/**
 * Custom hook that provides mail-related state and operations
 * Separates business logic from UI components
 */
export const useMailState = () => {
  const {
    emails,
    selectedEmail,
    currentFolder,
    isComposing,
    filteredEmails,
    handleSelectEmail,
    handleStarEmail,
    handleDeleteEmail,
    handleComposeEmail,
    handleSendEmail,
    setCurrentFolder,
    setIsComposing,
    setSelectedEmail
  } = useMailContext();

  /**
   * Check if there are unread emails in a specific folder
   */
  const getUnreadCount = useCallback((folder: string) => {
    return emails.filter(e => !e.read && e.folder === folder).length;
  }, [emails]);

  /**
   * Close any open detail views and return to list view
   */
  const closeDetailView = useCallback(() => {
    setSelectedEmail(null);
  }, [setSelectedEmail]);

  /**
   * Cancel email composition
   */
  const cancelComposition = useCallback(() => {
    setIsComposing(false);
  }, [setIsComposing]);
  
  /**
   * Reply to an email
   */
  const replyToEmail = useCallback((email: Mail) => {
    const replyEmail = {
      to: email.from,
      subject: `Re: ${email.subject}`,
      body: `\n\n---- Original message ----\nFrom: ${email.from}\nDate: ${new Date(email.date).toLocaleString()}\nSubject: ${email.subject}\n\n${email.body}`
    };
    setIsComposing(true);
    return replyEmail;
  }, [setIsComposing]);

  /**
   * Forward an email
   */
  const forwardEmail = useCallback((email: Mail) => {
    const forwardEmail = {
      to: '',
      subject: `Fwd: ${email.subject}`,
      body: `\n\n---- Forwarded message ----\nFrom: ${email.from}\nDate: ${new Date(email.date).toLocaleString()}\nSubject: ${email.subject}\n\n${email.body}`
    };
    setIsComposing(true);
    return forwardEmail;
  }, [setIsComposing]);

  return {
    emails,
    selectedEmail,
    currentFolder,
    isComposing,
    filteredEmails,
    selectEmail: handleSelectEmail,
    starEmail: handleStarEmail,
    deleteEmail: handleDeleteEmail,
    composeEmail: handleComposeEmail,
    sendEmail: handleSendEmail,
    setFolder: setCurrentFolder,
    getUnreadCount,
    closeDetailView,
    cancelComposition,
    replyToEmail,
    forwardEmail
  };
};

export default useMailState;
