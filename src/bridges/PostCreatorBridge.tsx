/**
 * Bridge file for the PostCreator widget and theme
 * 
 * This follows the pattern established in the project to address blank page issues
 * caused by path resolution problems.
 */

// Import the components we need to re-export
import PostCreatorWidget from '../widgets/PostCreator/PostCreatorWidget';
import { PostCreatorTheme } from '../widgets/PostCreator/theme';

// Re-export for direct imports
export { PostCreatorWidget, PostCreatorTheme };

// Default export for dynamic require
export default PostCreatorWidget;
