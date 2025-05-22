/**
 * Main exports for the PostCreator widget
 */
import PostCreatorWidget from './PostCreatorWidget';
import { PostCreatorProvider, usePostCreator } from './context/PostCreatorContext';
import usePostCreatorState from './hooks/usePostCreatorState';
import useCommentSystem from './hooks/useCommentSystem';
import useScheduleManager from './hooks/useScheduleManager';
import { PostCreatorTheme } from './theme';
import * as PostCreatorTypes from './types';

// Export the main widget component
export { PostCreatorWidget };

// Export context and hooks
export { 
  PostCreatorProvider,
  usePostCreator,
  usePostCreatorState,
  useCommentSystem,
  useScheduleManager
};

// Export theme
export { PostCreatorTheme };

// Export types
export { PostCreatorTypes };

// Default export
export default PostCreatorWidget;
