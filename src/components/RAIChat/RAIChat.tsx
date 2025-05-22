import React from 'react';
import './RAIChat.css';
import { useRAIChat } from './RAIChatContext';
import { useRaiChatApi } from './hooks';
import { ChatMessage as ApiChatMessage } from './api';

// Import icons if available, otherwise use text fallbacks
let MessageSquare: any;
let ChevronLeft: any;
let ChevronRight: any;
let Send: any;

try {
  const icons = require('lucide-react');
  MessageSquare = icons.MessageSquare;
  ChevronLeft = icons.ChevronLeft;
  ChevronRight = icons.ChevronRight;
  Send = icons.Send;
} catch (error) {
  // Fallback if lucide-react is not available
  MessageSquare = () => <span>💬</span>;
  ChevronLeft = () => <span>◀</span>;
  ChevronRight = () => <span>▶</span>;
  Send = () => <span>➤</span>;
}

interface RAIChatProps {
  expanded?: boolean;
  onExpand?: (expanded: boolean) => void;
}

const RAIChat: React.FC<RAIChatProps> = ({ expanded: propExpanded, onExpand: propOnExpand }) => {
  // Use the context to access shared state
  const { messages, expanded: contextExpanded, setExpanded: setContextExpanded } = useRAIChat();
  
  // Use the API hook for backend communication
  const { sendMessage, loading, error } = useRaiChatApi();
  
  // Determine if we should use props or context for expanded state
  const expanded = propExpanded !== undefined ? propExpanded : contextExpanded;
  
  // Function to update expanded state (both in props if provided, and in context)
  const handleExpandToggle = (newExpandedState: boolean) => {
    if (propOnExpand) {
      propOnExpand(newExpandedState);
    }
    setContextExpanded(newExpandedState);
  };
  
  // Local state for input field
  const [inputText, setInputText] = React.useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Send message to backend
    sendMessage(inputText);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  // Render different message types
  const renderMessage = (message: ApiChatMessage) => {
    // Handle system messages
    if (message.role === 'system') {
      return (
        <div key={message.id} className="system-message-container">
          <div className={`system-message ${message.messageType || 'default'}`}>
            {message.content}
          </div>
        </div>
      );
    }

    // Handle loading state
    if (message.isLoading) {
      return (
        <div key={message.id} className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}>
          <div className="message-content loading">
            <div className="message-text">
              <div className="loading-dots">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle regular messages
    return (
      <div 
        key={message.id} 
        className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
      >
        <div className="message-content">
          <div className="message-text">{message.content}</div>
          <span className="message-time">{formatTime(message.timestamp)}</span>
        </div>
      </div>
    );
  };

  // Display error as system message if there is one
  React.useEffect(() => {
    if (error) {
      // Display error as system message
      console.error('RAI Chat error:', error);
    }
  }, [error]);

  return (
    <div className={`rai-chat ${!expanded ? 'collapsed' : ''}`}>
      <div className="chat-header">
        {expanded && <h3>RAI Assistant</h3>}
        <button onClick={() => handleExpandToggle(!expanded)}>
          {!expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
      
      {expanded && (
        <>
          <div className="chat-content">
            {messages.map(message => renderMessage(message))}
          </div>
          
          <div className="chat-input">
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <button onClick={handleSendMessage} disabled={loading || inputText.trim() === ''}>
              <Send size={18} />
            </button>
          </div>
        </>
      )}
      
      {!expanded && (
        <div className="chat-icon">
          <MessageSquare size={24} />
        </div>
      )}
    </div>
  );
};

export default RAIChat;
