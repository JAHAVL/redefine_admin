import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Import styled components
import { SchedulerWidgetContainer } from './SchedulerWidgetStyled';

// Import context provider
import { SchedulerProvider } from './state/schedulerContext';

// Lazy load components to improve performance
const SchedulerDashboard = lazy(() => import('./pages/SchedulerDashboard'));

// Placeholder components - will be implemented later
const SeriesDetail = () => {
  return <div>Series Detail</div>;
};

const TeamsList = () => {
  return <div>Teams List</div>;
};

const SongsList = () => {
  return <div>Songs List</div>;
};

const SchedulerWidget: React.FC = () => {
  return (
    <SchedulerProvider>
      <SchedulerWidgetContainer>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<SchedulerDashboard />} />
            <Route path="/series" element={<SchedulerDashboard />} />
            <Route path="/series/:id" element={<SeriesDetail />} />
            <Route path="/teams" element={<TeamsList />} />
            <Route path="/songs" element={<SongsList />} />
          </Routes>
        </Suspense>
      </SchedulerWidgetContainer>
    </SchedulerProvider>
  );
};

export default SchedulerWidget;
