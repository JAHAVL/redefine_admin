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
import FileManagerPage from './pages/File Manager/FileManagerPage';
import GroupsPage from './pages/File Manager/GroupsPage';

// Locations Pages
import LocationsPage from './pages/Locations/LocationsPage';
import MapViewPage from './pages/Locations/MapViewPage';
import SettingsPage from './pages/Locations/SettingsPage';
import AnalyticsPage from './pages/Locations/AnalyticsPage';

// Finance Pages
import FinancePage from './pages/finance/FinancePage';

// Scheduler Pages
import SchedulerPage from './pages/scheduler/SchedulerPage';

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
                path="/file-manager" 
                element={<ProtectedRoute component={FileManagerPage} />} 
            />
            <Route 
                path="/file-manager/groups" 
                element={<ProtectedRoute component={GroupsPage} />} 
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
            <Route 
                path="*" 
                element={<NotFoundPage />} 
            />
        </Routes>
    );
};

export default AppRoutes;
