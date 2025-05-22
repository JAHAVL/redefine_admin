import { useState, useCallback, useEffect } from 'react';
import { 
  chatSessionApi, 
  messageApi, 
  ChatMessage, 
  ChatSession 
} from '../api';
import { useRAIChat } from '../RAIChatContext';

/**
 * Hook for interacting with the RAI Chat API
 * Provides methods for chatting with the AI assistant
 */
export function useRaiChatApi() {
  const { messages, addMessage } = useRAIChat();
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize or retrieve a chat session
  const initializeChat = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if we have a session ID in localStorage
      const savedSessionId = localStorage.getItem('raiChatSessionId');
      
      if (savedSessionId) {
        // Try to retrieve the existing session
        const response = await chatSessionApi.getSession(savedSessionId);
        
        if (response.status === 'success' && response.data) {
          setChatSession(response.data);
          return response.data;
        }
      }
      
      // If no saved session or failed to retrieve, create a new one
      const createResponse = await chatSessionApi.createSession();
      
      if (createResponse.status === 'success' && createResponse.data) {
        const newSession = {
          id: createResponse.data.session_id,
          title: createResponse.data.title,
          created_at: createResponse.data.created_at,
          updated_at: createResponse.data.created_at,
          user_id: 'anonymous',
          messages: []
        };
        
        setChatSession(newSession);
        localStorage.setItem('raiChatSessionId', newSession.id);
        return newSession;
      } else {
        throw new Error(createResponse.message || 'Failed to create chat session');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error initializing chat');
      console.error('Error initializing chat:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load messages for a session
  const loadMessages = useCallback(async (sessionId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await messageApi.getMessages(sessionId);
      
      if (response.status === 'success' && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to load messages');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error loading messages');
      console.error('Error loading messages:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Send a message to the AI
  const sendMessage = useCallback(async (content: string) => {
    if (!chatSession) {
      const session = await initializeChat();
      if (!session) {
        setError('Could not initialize chat session');
        return;
      }
    }
    
    // Add user message locally immediately for good UX
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date().toISOString()
    };
    
    addMessage({
      content,
      role: 'user'
    });
    
    // Add loading message
    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: '...',
      role: 'assistant',
      timestamp: new Date().toISOString(),
      isLoading: true
    };
    
    addMessage({
      content: '...',
      role: 'assistant',
      isLoading: true
    });
    
    try {
      const response = await messageApi.sendMessage(
        chatSession?.id || '',
        content
      );
      
      // Remove loading message and add real response
      if (response.status === 'success' && response.data?.response) {
        addMessage({
          ...response.data.response,
          isLoading: false
        });
      } else {
        // If API fails, convert loading message to error
        addMessage({
          content: 'Sorry, I encountered an issue processing your request. Please try again.',
          role: 'system',
          messageType: 'error',
          isLoading: false
        });
        
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error sending message');
      console.error('Error sending message:', err);
    }
  }, [chatSession, initializeChat, addMessage]);

  // Initialize chat on first load
  useEffect(() => {
    if (!chatSession) {
      initializeChat();
    }
  }, [chatSession, initializeChat]);

  return {
    sendMessage,
    loading,
    error,
    chatSession,
    initializeChat,
    loadMessages
  };
}
