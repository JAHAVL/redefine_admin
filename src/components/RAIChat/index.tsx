import React from 'react';
import RAIChat from './RAIChat';
import { RAIChatProvider } from './RAIChatContext';

// Export the RAIChat component
export { default as RAIChat } from './RAIChat';
export { RAIChatProvider, useRAIChat } from './RAIChatContext';

// Export a wrapped version that includes the provider
export const RAIChatWithProvider: React.FC = () => (
  <RAIChatProvider>
    <RAIChat />
  </RAIChatProvider>
);
