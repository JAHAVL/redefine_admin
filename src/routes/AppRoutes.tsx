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
import FinancePageNEW from '../pages/finance/FinancePageNEW';
import FinanceDashboardPageNEW from '../pages/finance/FinanceDashboardPageNEW';
import TransactionsPageNEW from '../pages/finance/TransactionsPageNEW';
import AccountsPageNEW from '../pages/finance/AccountsPageNEW';
import ReportsPageNEW from '../pages/finance/ReportsPageNEW';
import ReconciliationPageNEW from '../pages/finance/ReconciliationPageNEW';
import StatementsPageNEW from '../pages/finance/StatementsPageNEW';

// Locations Pages
import LocationsPage from './pages/Locations/LocationsPage';
import MapViewPage from './pages/Locations/MapViewPage';
import SettingsPage from './pages/Locations/SettingsPage';
import AnalyticsPage from './pages/Locations/AnalyticsPage';

// Finance Pages
import FinancePage from './pages/finance/FinancePage';

// Scheduler Pages
import SchedulerPage from './pages/scheduler/SchedulerPage';

// Templates
import AdminTemplatePageComponent from '../pages/templates/admin_template_page';

import NotFoundPage from './pages/NotFoundPage';
import GivingPage from './pages/giving/GivingPage';

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
            <Route 
                path="/mail" 
                element={<ProtectedRoute component={MailPage} />} 
            />
            <Route 
                path="/mail/templates" 
                element={<ProtectedRoute component={MailTemplatesPage} />} 
            />
            <Route 
                path="/mail/settings" 
                element={<ProtectedRoute component={MailSettingsPage} />} 
            />
            <Route 
                path="/file-manager/groups" 
                element={<ProtectedRoute component={GroupsPage} />} 
            />
            {/* New Template-Based Routes */}
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
            {/* Locations Routes */}
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
            {/* Giving Page */}
            <Route 
                path="/giving" 
                element={<ProtectedRoute component={GivingPage} />} 
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
            {/* Scheduler Routes */}
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
