/**
 * Path Configuration
 * 
 * Central source of truth for file paths and imports throughout the application.
 * This helps prevent path-related errors and makes refactoring easier.
 */

// Core component paths - using actual filesystem paths without spaces
export const COMPONENT_PATHS = {
  // Core UI components
  MAIN_PAGE_TEMPLATE: '../components/MainPageTemplate/MainPageTemplate',
  LEFT_MENU: '../components/LeftMenu/LeftMenu',
  TOP_MENU: '../components/TopMenu/TopMenu',
  SUB_MENU: '../components/SubMenu/SubMenu',
  RAI_CHAT: '../components/RAIChat/RAIChat',
  
  // Finance components
  FINANCE_DASHBOARD: '../widgets/financewidget/modules/dashboard/FinanceDashboard',
  FINANCE_THEME_PROVIDER: '../widgets/financewidget/theme/FinanceThemeProvider',
  FINANCE_WIDGET_CONTAINER: '../widgets/financewidget/FinanceWidgetStyled',
  
  // Locations components
  LOCATIONS_WIDGET: '../widgets/Locations/LocationsWidget',
  
  // File Manager components
  FILE_MANAGER_WIDGET: '../widgets/File Manager/FileManagerWidget',
  GROUPS_WIDGET: '../widgets/File Manager/GroupsWidget'
};

/**
 * Function to get a path relative to the importing file's location
 * @param basePath - Base directory path (e.g., '../../')
 * @param componentPath - Component path from COMPONENT_PATHS
 * @returns The full relative path
 */
export const getPath = (basePath: string, componentPath: string): string => {
  // Strip off any leading '../' from componentPath to avoid path calculation errors
  const normalizedComponentPath = componentPath.replace(/^\.\.\//, '');
  return `${basePath}${normalizedComponentPath}`;
};

/**
 * Get the import path for a component from the current file location
 * @param basePath The base path from the current file to src/ (e.g., '../../')
 * @param componentName The component name as defined in COMPONENT_PATHS
 */
export const getComponentPath = (basePath: string, componentName: keyof typeof COMPONENT_PATHS): string => {
  const componentPath = COMPONENT_PATHS[componentName];
  if (!componentPath) {
    console.warn(`Component path not found for: ${componentName}`);
    return '';
  }
  return getPath(basePath, componentPath);
};
