/**
 * Path Configuration
 * 
 * Central source of truth for file paths and imports throughout the application.
 * This helps prevent path-related errors and makes refactoring easier.
 */

// Core component paths - using actual filesystem paths without spaces
export const COMPONENT_PATHS = {
  // Core UI components
  MAIN_PAGE_TEMPLATE: '../layouts/MainPageTemplate/MainPageTemplate',
  LEFT_MENU: '../components/LeftMenu/LeftMenu',
  TOP_MENU: '../components/TopMenu/TopMenu',
  SUB_MENU: '../components/SubMenu/SubMenu',
  RAI_CHAT: '../components/RAIChat/RAIChat',
  
  // Layout components and templates
  ADMIN_TEMPLATE_PAGE: '../layouts/templates/admin_template_page',
  
  // Common components
  PROTECTED_ROUTES: '../routes/ProtectedRoutes',
  
  // Services
  API_SERVICE: '../services/api',
  NAVIGATION_SERVICE: '../services/navigationService',
  OPERATION_SERVICE: '../services/operationService',
  
  // Finance components
  FINANCE_DASHBOARD: '../widgets/financewidget/modules/dashboard/FinanceDashboard',
  FINANCE_THEME_PROVIDER: '../widgets/financewidget/theme/FinanceThemeProvider',
  FINANCE_WIDGET_CONTAINER: '../widgets/financewidget/FinanceWidgetStyled',
  
  // Locations components
  LOCATIONS_WIDGET: '../widgets/Locations/LocationsWidget',
  LOCATIONS_WIDGET_FIXED: '../widgets/Locations/LocationsWidgetFixed',
  MAP_VIEW_WIDGET_FIXED: '../widgets/Locations/MapViewWidgetFixed',
  ANALYTICS_WIDGET_FIXED: '../widgets/Locations/AnalyticsWidgetFixed',
  SETTINGS_WIDGET_FIXED: '../widgets/Locations/SettingsWidgetFixed',
  
  // Locations views
  LOCATION_DETAILS_VIEW: '../widgets/Locations/views/LocationDetailsView',
  LOCATION_DASHBOARD_VIEW: '../widgets/Locations/views/DashboardView',
  LOCATION_MAP_VIEW: '../widgets/Locations/views/MapView',
  LOCATION_ANALYTICS_VIEW: '../widgets/Locations/views/AnalyticsView',
  LOCATION_SETTINGS_VIEW: '../widgets/Locations/views/SettingsView',
  
  // Scheduler views
  SCHEDULER_DASHBOARD_VIEW: '../widgets/SchedulerWidget/views/DashboardView',
  SCHEDULER_SERIES_DETAIL_VIEW: '../widgets/SchedulerWidget/views/SeriesDetailView',
  
  // Mail components
  MAIL_WIDGET: '../widgets/Mail/MailWidget',
  MAIL_SETTINGS_WIDGET: '../widgets/Mail/mailsettings/MailSettings',
  MAIL_TEMPLATES_WIDGET: '../widgets/Mail/mailtemplates/MailTemplates',
  
  // Post Creator components
  POST_CREATOR_WIDGET: '../widgets/PostCreator/PostCreatorWidget',
  IMMERSIVE_CALENDAR: '../widgets/PostCreator/components/ImmersiveCalendar',
  VISUAL_PREVIEW: '../widgets/PostCreator/components/VisualPreview',
  
  // Task Manager components
  TASK_MANAGER_WIDGET: '../widgets/TaskManagerWidget/TaskManagerWidget',
  
  // Scheduler components
  SCHEDULER_WIDGET: '../widgets/SchedulerWidget',
  
  // File Manager components
  FILE_MANAGER_WIDGET: '../widgets/File Manager/FileManagerWidget',
  GROUPS_WIDGET: '../widgets/File Manager/GroupsWidget',
  FILE_MANAGER_WIDGET_FIXED: '../widgets/FileManagerFixed/FileManagerWidgetFixed',
  GROUPS_WIDGET_FIXED: '../widgets/FileManagerFixed/GroupsWidgetFixed',
  
  // Pages - Template-based (NEW)
  FINANCE_DASHBOARD_PAGE_NEW: '../pages/finance/FinanceDashboardPageNEW',
  TRANSACTIONS_PAGE_NEW: '../pages/finance/TransactionsPageNEW',
  ACCOUNTS_PAGE_NEW: '../pages/finance/AccountsPageNEW',
  REPORTS_PAGE_NEW: '../pages/finance/ReportsPageNEW',
  STATEMENTS_PAGE_NEW: '../pages/finance/StatementsPageNEW',
  RECONCILIATION_PAGE_NEW: '../pages/finance/ReconciliationPageNEW',
  
  // Locations pages - Using unified single page component architecture
  LOCATIONS_PAGE: '../pages/Locations/LocationsPage',
  
  // Locations widget components
  
  MAIL_PAGE_NEW: '../pages/Mail/MailPageNEW',
  MAIL_SETTINGS_PAGE_NEW: '../pages/Mail/MailSettingsPageNEW',
  MAIL_TEMPLATES_PAGE_NEW: '../pages/Mail/MailTemplatesPageNEW',
  
  POST_CREATOR_PAGE_NEW: '../pages/PostCreator/PostCreatorPageNEW',
  ALL_POSTS_PAGE_NEW: '../pages/PostCreator/AllPostsPageNEW',
  EDIT_POST_PAGE_NEW: '../pages/PostCreator/EditPostPageNEW',
  REVIEW_POST_PAGE_NEW: '../pages/PostCreator/ReviewPostPageNEW',
  SCHEDULE_POST_PAGE_NEW: '../pages/PostCreator/SchedulePostPageNEW',
  POSTCREATOR_ANALYTICS_PAGE_NEW: '../pages/PostCreator/AnalyticsPageNEW',
  VISUAL_SCHEDULER_PAGE_NEW: '../pages/PostCreator/VisualSchedulerPageNEW',
  
  TASK_MANAGER_PAGE_NEW: '../pages/TaskManagerPage/TaskManagerPageNEW',
  SCHEDULER_PAGE_NEW: '../pages/scheduler/SchedulerPageNEW',
  
  FILE_MANAGER_PAGE_NEW: '../pages/File Manager/FileManagerPageNEW',
  GROUPS_PAGE_NEW: '../pages/File Manager/GroupsPageNEW',
  
  // Test pages
  PATH_TEST_PAGE: '../pages/test/PathTestPage'
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
  
  // Handle spaces in paths by ensuring proper path resolution
  // For webpack's require to work correctly, we need to provide the path in the format it expects
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
  
  // First, normalize the paths to ensure consistent forward slashes
  const normalizedBasePath = basePath.replace(/\\/g, '/');
  const normalizedComponentPath = componentPath.replace(/\\/g, '/');
  
  // Remove any leading '../' from component path to avoid path calculation errors
  const cleanComponentPath = normalizedComponentPath.replace(/^\.\.\//, '');
  
  // Calculate final path - joins the base path with the component path
  let finalPath = `${normalizedBasePath}${cleanComponentPath}`;
  
  // Normalize any double slashes that might have been created
  finalPath = finalPath.replace(/\/\//g, '/');
  
  console.log(`Resolving path for ${componentName}: ${finalPath}`);
  return finalPath;
};

/**
 * Example usage:
 * 
 * // In a page component (2 levels deep from src)
 * import { getComponentPath } from '../../utils/pathconfig';
 * const MainPageTemplate = require(getComponentPath('../../', 'MAIN_PAGE_TEMPLATE')).default;
 * 
 * // Using with dynamic import (if needed)
 * const importComponent = async () => {
 *   const { default: Component } = await import(getComponentPath('../../', 'SOME_COMPONENT'));
 *   return Component;
 * };
 */
