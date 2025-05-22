import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatMessage } from './api/types';

// Interface for the chat context state
interface RAIChatContextType {
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  clearMessages: () => void;
}

// Create the context with default values
const RAIChatContext = createContext<RAIChatContextType>({
  messages: [],
  addMessage: () => {},
  expanded: false,
  setExpanded: () => {},
  clearMessages: () => {},
});

// Hook to use the chat context
export const useRAIChat = () => useContext(RAIChatContext);

interface RAIChatProviderProps {
  children: ReactNode;
}

// Provider component that wraps the app and provides the chat state
export const RAIChatProvider: React.FC<RAIChatProviderProps> = ({ children }) => {
  // Initialize messages from localStorage if available, otherwise use default message
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = localStorage.getItem('raiChatMessages');
    if (savedMessages) {
      try {
        // Parse the saved messages and convert string timestamps back to Date objects
        const parsedMessages = JSON.parse(savedMessages);
        return parsedMessages;
      } catch (error) {
        console.error('Error parsing saved chat messages:', error);
        // Return default message if parsing fails
        return getDefaultMessage();
      }
    } else {
      // Return default message if no saved messages
      return getDefaultMessage();
    }
  });

  // Initialize expanded state from localStorage if available
  const [expanded, setExpanded] = useState<boolean>(() => {
    const savedExpanded = localStorage.getItem('raiChatExpanded');
    return savedExpanded ? savedExpanded === 'true' : false;
  });

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('raiChatMessages', JSON.stringify(messages));
  }, [messages]);

  // Save expanded state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('raiChatExpanded', expanded.toString());
  }, [expanded]);

  // Add a new message to the chat
  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setMessages(prevMessages => [
      ...prevMessages,
      {
        ...message,
        id: Math.random().toString(36).substring(2, 11),
        timestamp: new Date().toISOString()
      }
    ]);
  };

  // Clear all messages and reset to default
  const clearMessages = () => {
    setMessages(getDefaultMessage());
  };

  // Helper function to get the default welcome message
  function getDefaultMessage(): ChatMessage[] {
    return [
      {
        id: 'welcome-1',
        content: "Hi, I'm r.ai. How can I help?",
        role: 'system',
        timestamp: new Date().toISOString(),
        messageType: 'welcome'
      }
    ];
  }

  return (
    <RAIChatContext.Provider value={{ messages, addMessage, expanded, setExpanded, clearMessages }}>
      {children}
    </RAIChatContext.Provider>
  );
};
