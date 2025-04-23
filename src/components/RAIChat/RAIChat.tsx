import React, { useState } from 'react';
import './RAIChat.css';

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
  expanded: boolean;
  onExpand: (expanded: boolean) => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const RAIChat: React.FC<RAIChatProps> = ({ expanded, onExpand }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm RAI, your church administration assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        text: "I'm a placeholder AI assistant. In the real app, I would provide helpful responses to your questions about church administration.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`rai-chat ${!expanded ? 'collapsed' : ''}`}>
      <div className="chat-header">
        {expanded && <h3>RAI Assistant</h3>}
        <button onClick={() => onExpand(!expanded)}>
          {!expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
      
      {expanded && (
        <>
          <div className="chat-content">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="chat-input">
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSendMessage}>
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
