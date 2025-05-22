/**
 * Bridge file for the MainPageTemplate component
 * 
 * This follows the pattern established in the project to address blank page issues
 * caused by path resolution problems with spaces in directory paths.
 */

// Re-export the component from its original location
import MainPageTemplate from '../layouts/MainPageTemplate/MainPageTemplate';

// Export for direct imports and dynamic requires
export { MainPageTemplate };
export default MainPageTemplate;
