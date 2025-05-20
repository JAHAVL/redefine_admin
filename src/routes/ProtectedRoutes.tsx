import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getComponentPath } from '../utils/pathconfig';

// Pages - Using correct locations
import LoginPage from '../pages/auth/LoginPage';
import TemplatePage from '../pages/template/TemplatePage';
import NotFoundPage from '../pages/common/NotFoundPage';
import FinancePage from '../pages/finance/FinancePage';
import GivingPage from '../pages/giving/GivingPage';
import AdminTemplatePageComponent from '../layouts/templates/admin_template_page';
import PathTestPage from '../pages/test/PathTestPage';

// New Template-Based Pages
// Use dynamic requires for pages in directories with spaces
const FileManagerPageNEW = React.lazy(() => import('../pages/FileManager/FileManagerPageNEW'));
const GroupsPageNEW = React.lazy(() => import('../pages/FileManager/GroupsPageNEW'));
const FinanceDashboardPageNEW = React.lazy(() => import('../pages/finance/FinanceDashboardPageNEW'));
const TransactionsPageNEW = React.lazy(() => import('../pages/finance/TransactionsPageNEW'));
const AccountsPageNEW = React.lazy(() => import('../pages/finance/AccountsPageNEW'));
const ReportsPageNEW = React.lazy(() => import('../pages/finance/ReportsPageNEW'));
const ReconciliationPageNEW = React.lazy(() => import('../pages/finance/ReconciliationPageNEW'));
const StatementsPageNEW = React.lazy(() => import('../pages/finance/StatementsPageNEW'));
const LocationsPage = React.lazy(() => import('../pages/Locations/LocationsPage'));

// Post Creator Pages
const PostCreatorPageNEW = React.lazy(() => import('../pages/PostCreator/PostCreatorPageNEW'));
const AllPostsPageNEW = React.lazy(() => import('../pages/PostCreator/AllPostsPageNEW'));
const AllDraftsPageNEW = React.lazy(() => import('../pages/PostCreator/AllDraftsPageNEW'));
const EditPostPageNEW = React.lazy(() => import('../pages/PostCreator/EditPostPageNEW'));
const ReviewPostPageNEW = React.lazy(() => import('../pages/PostCreator/ReviewPostPageNEW'));
const SchedulePostPageNEW = React.lazy(() => import('../pages/PostCreator/SchedulePostPageNEW'));
const PostCreatorAnalyticsPageNEW = React.lazy(() => import('../pages/PostCreator/AnalyticsPageNEW'));
const VisualSchedulerPageNEW = React.lazy(() => import('../pages/PostCreator/VisualSchedulerPageNEW'));

const TaskManagerPageNEW = React.lazy(() => import('../pages/TaskManagerPage/TaskManagerPageNEW'));
const SchedulerPageNEW = React.lazy(() => import('../pages/scheduler/SchedulerPageNEW'));

/**
 * ProtectedRoute component
 * Redirects to login page if user is not authenticated
 */
interface ProtectedRouteProps {
  component: React.ComponentType<any>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  // For now, we'll assume the user is always authenticated
  // In a real application, you would check if the user is authenticated
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Component />;
};

/**
 * ProtectedRoutes component
 * Defines all routes for the application
 * Most routes are protected and require authentication
 */
const ProtectedRoutes: React.FC = () => {
    return (
        <Routes>
            <Route 
                path="/login" 
                element={<LoginPage />} 
            />
            <Route 
                path="/" 
                element={<ProtectedRoute component={TemplatePage} />} 
            />
            
            {/* Post Creator Routes */}
            <Route 
                path="/content-creator" 
                element={<ProtectedRoute component={AllPostsPageNEW} />} 
            />
            <Route 
                path="/content-creator/drafts" 
                element={<ProtectedRoute component={AllDraftsPageNEW} />} 
            />
            <Route 
                path="/content-creator/new" 
                element={<ProtectedRoute component={PostCreatorPageNEW} />} 
            />
            <Route 
                path="/content-creator/:postId" 
                element={<ProtectedRoute component={EditPostPageNEW} />} 
            />
            <Route 
                path="/content-creator/:postId/edit" 
                element={<ProtectedRoute component={EditPostPageNEW} />} 
            />
            <Route 
                path="/content-creator/edit/:id" 
                element={<ProtectedRoute component={PostCreatorPageNEW} />} 
            />
            <Route 
                path="/content-creator/:postId/review" 
                element={<ProtectedRoute component={ReviewPostPageNEW} />} 
            />
            <Route 
                path="/content-creator/:postId/schedule" 
                element={<ProtectedRoute component={SchedulePostPageNEW} />} 
            />
            <Route 
                path="/content-creator/analytics" 
                element={<ProtectedRoute component={PostCreatorAnalyticsPageNEW} />} 
            />
            <Route 
                path="/content-creator/visual-scheduler" 
                element={<ProtectedRoute component={VisualSchedulerPageNEW} />} 
            />
            
            {/* New Template-Based File Manager Routes */}
            <Route 
                path="/file-manager-new" 
                element={<ProtectedRoute component={FileManagerPageNEW} />} 
            />
            <Route 
                path="/file-manager-new/groups" 
                element={<ProtectedRoute component={GroupsPageNEW} />} 
            />
            
            {/* Locations Routes */}
            <Route path="/locations">
              <Route index element={<ProtectedRoute component={LocationsPage} />} />
              <Route path="map" element={<ProtectedRoute component={LocationsPage} />} />
              <Route path="analytics" element={<ProtectedRoute component={LocationsPage} />} />
              <Route path="settings" element={<ProtectedRoute component={LocationsPage} />} />
              <Route path="*" element={<Navigate to="/locations" replace />} />
            </Route>
            
            {/* New Template-Based Finance Routes */}
            <Route 
                path="/finance-new" 
                element={<ProtectedRoute component={FinanceDashboardPageNEW} />} 
            />
            <Route 
                path="/finance-new/transactions" 
                element={<ProtectedRoute component={TransactionsPageNEW} />} 
            />
            <Route 
                path="/finance-new/accounts" 
                element={<ProtectedRoute component={AccountsPageNEW} />} 
            />
            <Route 
                path="/finance-new/reports" 
                element={<ProtectedRoute component={ReportsPageNEW} />} 
            />
            <Route 
                path="/finance-new/statements" 
                element={<ProtectedRoute component={StatementsPageNEW} />} 
            />
            <Route 
                path="/finance-new/reconciliation" 
                element={<ProtectedRoute component={ReconciliationPageNEW} />} 
            />
            
            {/* New Template-Based Scheduler Routes */}
            <Route 
                path="/scheduler-new" 
                element={<ProtectedRoute component={SchedulerPageNEW} />} 
            />
            <Route 
                path="/scheduler-new/series" 
                element={<ProtectedRoute component={SchedulerPageNEW} />} 
            />
            <Route 
                path="/scheduler-new/series/:seriesId" 
                element={<ProtectedRoute component={SchedulerPageNEW} />} 
            />
            <Route 
                path="/scheduler-new/events/:seriesId/:eventId" 
                element={<ProtectedRoute component={SchedulerPageNEW} />} 
            />
            <Route 
                path="/scheduler-new/teams" 
                element={<ProtectedRoute component={SchedulerPageNEW} />} 
            />
            <Route 
                path="/scheduler-new/songs" 
                element={<ProtectedRoute component={SchedulerPageNEW} />} 
            />
            <Route 
                path="/finance/statements" 
                element={<ProtectedRoute component={FinancePage} />} 
            />
            <Route 
                path="/finance/reconciliation" 
                element={<ProtectedRoute component={FinancePage} />} 
            />
            <Route 
                path="/finance/budget" 
                element={<ProtectedRoute component={FinancePage} />} 
            />
            {/* Test Routes */}
            <Route 
                path="/path-test" 
                element={<ProtectedRoute component={PathTestPage} />} 
            />
            {/* Templates */}
            <Route 
                path="/templates/admin" 
                element={<ProtectedRoute component={AdminTemplatePageComponent} />} 
            />
            <Route 
                path="/admin/template" 
                element={<ProtectedRoute component={AdminTemplatePageComponent} />} 
            />
            <Route 
                path="*" 
                element={<NotFoundPage />} 
            />
        </Routes>
    );
};

export default ProtectedRoutes;
