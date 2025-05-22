import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Import styled components
import { SchedulerWidgetContainer } from './styles';

// Import context provider
import { SchedulerProvider } from './context';

// Lazy load views for better performance
const DashboardView = lazy(() => import('./views/DashboardView'));
const SeriesDetailView = lazy(() => import('./views/SeriesDetailView'));
const EventDetailView = lazy(() => import('./views/EventDetailView'));

// Placeholder components - will be implemented later
const TeamsList = () => {
    return <div>Teams List</div>;
};

const SongsList = () => {
    return <div>Songs List</div>;
};

const SchedulerWidget: React.FC = () => {
    const location = useLocation();
    
    // Debug the current path to help diagnose routing issues
    useEffect(() => {
        console.log('Current path:', location.pathname);
    }, [location]);
    
    // Determine the correct component based on URL path
    const renderComponent = () => {
        const path = location.pathname;
        
        if (path.includes('/events/')) {
            // If we're on an event detail page, render the EventDetailView
            return <EventDetailView />;
        } else if (path.includes('/series/') && !path.endsWith('/series/')) {
            // If we're on a series detail page, render the SeriesDetailView
            return <SeriesDetailView />;
        } else {
            // Default to the dashboard view
            return <DashboardView />;
        }
    };
    
    return (
        <SchedulerProvider>
            <SchedulerWidgetContainer>
                <Suspense fallback={<div>Loading...</div>}>
                    {renderComponent()}
                </Suspense>
            </SchedulerWidgetContainer>
        </SchedulerProvider>
    );
};

export default SchedulerWidget;
