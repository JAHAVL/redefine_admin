/**
 * Simulation Mode for RAI Chat
 * 
 * This module provides simulated responses when a backend is not available.
 * It mimics basic conversation patterns with pre-defined responses.
 */

import { ChatMessage } from './types';

// Delay to simulate network latency
const RESPONSE_DELAY = 1200;

// Collection of possible AI responses based on message content
const SIMULATED_RESPONSES: Record<string, string[]> = {
  "greeting": [
    "Hello! How can I assist you with church administration today?",
    "Hi there! What can I help you with in your church management?",
    "Greetings! I'm here to help with your church administration needs."
  ],
  "help": [
    "I can help with various church administration tasks including event scheduling, member management, and resource allocation. What do you need assistance with?",
    "As your church administration assistant, I can help with tasks like managing events, organizing volunteer schedules, and tracking resources. What would you like to focus on?"
  ],
  "event": [
    "To create a new event, you'll need to specify the date, time, location, and any resources needed. Would you like me to guide you through the process?",
    "Church events can be managed through the Events tab. You can create, edit, and schedule events there. Would you like to know more about a specific aspect of event management?"
  ],
  "member": [
    "Member information can be found in the Community section. You can add new members, update contact details, and track attendance there.",
    "Our member database allows you to record information like contact details, family connections, ministry involvement, and attendance patterns."
  ],
  "resource": [
    "Church resources such as rooms, equipment, and supplies can be managed through the Resources tab. You can check availability and schedule usage there.",
    "Resource management includes tracking inventory, scheduling usage, and maintaining equipment. What specific resources are you looking to manage?"
  ],
  "fallback": [
    "I understand you're asking about church administration. Could you provide more details about what you need help with?",
    "I'm here to assist with your church administration needs. Could you elaborate on your question?",
    "As your church administration assistant, I'd be happy to help. Could you provide more specific information about what you're looking for?"
  ]
};

/**
 * Determines the best response category based on message content
 */
function determineCategory(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'greeting';
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('assist') || lowerMessage.includes('what can you do')) {
    return 'help';
  }
  
  if (lowerMessage.includes('event') || lowerMessage.includes('schedule') || lowerMessage.includes('calendar')) {
    return 'event';
  }
  
  if (lowerMessage.includes('member') || lowerMessage.includes('person') || lowerMessage.includes('people') || lowerMessage.includes('congregation')) {
    return 'member';
  }
  
  if (lowerMessage.includes('resource') || lowerMessage.includes('room') || lowerMessage.includes('equipment') || lowerMessage.includes('supplies')) {
    return 'resource';
  }
  
  return 'fallback';
}

/**
 * Gets a random response from the appropriate category
 */
function getRandomResponse(category: string): string {
  const responses = SIMULATED_RESPONSES[category] || SIMULATED_RESPONSES.fallback;
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}

/**
 * Generates a simulated AI response to a user message
 */
export async function generateSimulatedResponse(message: string): Promise<ChatMessage> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, RESPONSE_DELAY));
  
  const category = determineCategory(message);
  const responseText = getRandomResponse(category);
  
  return {
    id: `sim-${Date.now()}`,
    content: responseText,
    role: 'assistant',
    timestamp: new Date().toISOString()
  };
}

/**
 * Determines if we should use simulation mode
 * This can be controlled by:
 * 1. A localStorage setting
 * 2. An environment variable
 * 3. A failed API connection check
 */
export function isSimulationModeEnabled(): boolean {
  // Check localStorage preference
  const storedPreference = localStorage.getItem('raiChatSimulationMode');
  if (storedPreference !== null) {
    return storedPreference === 'true';
  }
  
  // Check if we're in development mode
  if (process.env.NODE_ENV === 'development') {
    return true; // Default to simulation in development
  }
  
  // For now, until backend connections are fixed
  return true;
}

/**
 * Toggle simulation mode on/off
 */
export function setSimulationMode(enabled: boolean): void {
  localStorage.setItem('raiChatSimulationMode', enabled.toString());
}
