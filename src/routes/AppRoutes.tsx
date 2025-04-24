import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Routes
import { ProtectedRoute } from './Routes/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import TaskManagerPage from './pages/TaskManagerPage/TaskManagerPage';
import TemplatePage from './pages/Template/TemplatePage';
import MailPage from './pages/Mail/MailPage';
import MailTemplatesPage from './pages/Mail/MailTemplatesPage';
import MailSettingsPage from './pages/Mail/MailSettingsPage';
import GroupsPage from './pages/File Manager/GroupsPage';

// New Template-Based Pages
import FileManagerPageNEW from '../pages/File Manager/FileManagerPageNEW';
import GroupsPageNEW from '../pages/File Manager/GroupsPageNEW';
import FinanceDashboardPageNEW from '../pages/finance/FinanceDashboardPageNEW';
import TransactionsPageNEW from '../pages/finance/TransactionsPageNEW';
import AccountsPageNEW from '../pages/finance/AccountsPageNEW';
import ReportsPageNEW from '../pages/finance/ReportsPageNEW';
import ReconciliationPageNEW from '../pages/finance/ReconciliationPageNEW';
import StatementsPageNEW from '../pages/finance/StatementsPageNEW';
import LocationsPageNEW from '../pages/Locations/LocationsPageNEW';
import MapViewPageNEW from '../pages/Locations/MapViewPageNEW';
import AnalyticsPageNEW from '../pages/Locations/AnalyticsPageNEW';
import SettingsPageNEW from '../pages/Locations/SettingsPageNEW';
import MailPageNEW from '../pages/Mail/MailPageNEW';
import MailSettingsPageNEW from '../pages/Mail/MailSettingsPageNEW';
import MailTemplatesPageNEW from '../pages/Mail/MailTemplatesPageNEW';
import TaskManagerPageNEW from '../pages/TaskManagerPage/TaskManagerPageNEW';
import SchedulerPageNEW from '../pages/scheduler/SchedulerPageNEW';

// Locations Pages - COMMENTED OUT (REPLACED BY NEW TEMPLATE VERSIONS)
/*
import LocationsPage from '../pages/Locations/LocationsPage';
import MapViewPage from '../pages/Locations/MapViewPage';
import AnalyticsPage from '../pages/Locations/AnalyticsPage';
import SettingsPage from '../pages/Locations/SettingsPage';
*/

// Finance Pages
import FinancePage from './pages/finance/FinancePage';

// Scheduler Pages
import SchedulerPage from './pages/scheduler/SchedulerPage';

// Templates
import AdminTemplatePageComponent from '../pages/templates/admin_template_page';

import NotFoundPage from './pages/NotFoundPage';
import GivingPage from './pages/giving/GivingPage';

// Test Pages
import PathTestPage from '../pages/test/PathTestPage';

const AppRoutes: React.FC = () => {
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
            {/* Mail Routes - COMMENTED OUT (REPLACED BY NEW TEMPLATE VERSIONS)
            <Route 
                path="/mail" 
                element={<ProtectedRoute component={MailPage} />} 
            />
            <Route 
                path="/mail/settings" 
                element={<ProtectedRoute component={MailSettingsPage} />} 
            />
            <Route 
                path="/mail/templates" 
                element={<ProtectedRoute component={MailTemplatesPage} />} 
            />
            */}
            
            {/* New Template-Based Mail Routes */}
            <Route 
                path="/mail-new" 
                element={<ProtectedRoute component={MailPageNEW} />} 
            />
            <Route 
                path="/mail-new/settings" 
                element={<ProtectedRoute component={MailSettingsPageNEW} />} 
            />
            <Route 
                path="/mail-new/templates" 
                element={<ProtectedRoute component={MailTemplatesPageNEW} />} 
            />
            {/* File Manager Routes - COMMENTED OUT (REPLACED BY NEW TEMPLATE VERSIONS)
            <Route 
                path="/file-manager/groups" 
                element={<ProtectedRoute component={GroupsPage} />} 
            />
            */}
            
            {/* New Template-Based File Manager Routes */}
            <Route 
                path="/file-manager-new" 
                element={<ProtectedRoute component={FileManagerPageNEW} />} 
            />
            <Route 
                path="/file-manager-new/groups" 
                element={<ProtectedRoute component={GroupsPageNEW} />} 
            />
            {/* Giving Route */}
            <Route 
                path="/admin/giving" 
                element={<ProtectedRoute component={GivingPage} />} 
            />
            {/* Locations Routes - COMMENTED OUT (REPLACED BY NEW TEMPLATE VERSIONS)
            <Route 
                path="/locations" 
                element={<ProtectedRoute component={LocationsPage} />} 
            />
            <Route 
                path="/locations/map" 
                element={<ProtectedRoute component={MapViewPage} />} 
            />
            <Route 
                path="/locations/settings" 
                element={<ProtectedRoute component={SettingsPage} />} 
            />
            <Route 
                path="/locations/analytics" 
                element={<ProtectedRoute component={AnalyticsPage} />} 
            />
            */}
            
            {/* New Template-Based Locations Routes */}
            <Route 
                path="/locations-new" 
                element={<ProtectedRoute component={LocationsPageNEW} />} 
            />
            <Route 
                path="/locations-new/map" 
                element={<ProtectedRoute component={MapViewPageNEW} />} 
            />
            <Route 
                path="/locations-new/settings" 
                element={<ProtectedRoute component={SettingsPageNEW} />} 
            />
            <Route 
                path="/locations-new/analytics" 
                element={<ProtectedRoute component={AnalyticsPageNEW} />} 
            />
            {/* Giving Page */}
            <Route 
                path="/giving" 
                element={<ProtectedRoute component={GivingPage} />} 
            />
            {/* Task Manager Routes - COMMENTED OUT (REPLACED BY NEW TEMPLATE VERSIONS)
            <Route 
                path="/task-manager" 
                element={<ProtectedRoute component={TaskManagerPage} />} 
            />
            */}
            
            {/* New Template-Based Task Manager Routes */}
            <Route 
                path="/task-manager-new" 
                element={<ProtectedRoute component={TaskManagerPageNEW} />} 
            />
            {/* Finance Routes */}
            <Route 
                path="/finance" 
                element={<ProtectedRoute component={FinancePage} />} 
            />
            <Route 
                path="/finance/transactions" 
                element={<ProtectedRoute component={FinancePage} />} 
            />
            <Route 
                path="/finance/accounts" 
                element={<ProtectedRoute component={FinancePage} />} 
            />
            <Route 
                path="/finance/reports" 
                element={<ProtectedRoute component={FinancePage} />} 
            />
            {/* New Template-Based Finance Routes */}
            <Route 
                path="/finance-new" 
                element={<ProtectedRoute component={FinanceDashboardPageNEW} />} 
            />
            <Route 
                path="/finance-new/dashboard" 
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
            {/* Scheduler Routes - COMMENTED OUT (REPLACED BY NEW TEMPLATE VERSIONS)
            <Route 
                path="/scheduler" 
                element={<ProtectedRoute component={SchedulerPage} />} 
            />
            <Route 
                path="/scheduler/series" 
                element={<ProtectedRoute component={SchedulerPage} />} 
            />
            <Route 
                path="/scheduler/series/:seriesId" 
                element={<ProtectedRoute component={SchedulerPage} />} 
            />
            <Route 
                path="/scheduler/events/:seriesId/:eventId" 
                element={<ProtectedRoute component={SchedulerPage} />} 
            />
            <Route 
                path="/scheduler/teams" 
                element={<ProtectedRoute component={SchedulerPage} />} 
            />
            <Route 
                path="/scheduler/songs" 
                element={<ProtectedRoute component={SchedulerPage} />} 
            />
            */}
            
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

export default AppRoutes;
