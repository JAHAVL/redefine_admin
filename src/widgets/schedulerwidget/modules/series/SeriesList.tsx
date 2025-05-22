import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useScheduler } from '../../state/schedulerContext';
import { fetchSeries, deleteSeries } from '../../state/actions';
import { Series } from '../../types';
import { 
  SchedulerHeader, 
  SchedulerTitle, 
  SchedulerButton, 
  SchedulerGrid, 
  SchedulerCard,
  SchedulerEmptyState
} from '../../SchedulerWidgetStyled';
import SeriesCard from '../../components/SeriesCard';
import AddSeriesModal from './AddSeriesModal';

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
`;

interface TabProps {
  active: boolean;
}

const Tab = styled.button<TabProps>`
  padding: 0.75rem 1.5rem;
  background: ${(props: TabProps) => props.active ? 'white' : '#4a6cf7'};
  color: ${(props: TabProps) => props.active ? 'black' : 'white'};
  border: none;
  border-radius: 4px;
  margin-right: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: 150px;

  &:hover {
    opacity: 0.9;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  width: 300px;
  
  &:focus {
    outline: none;
    border-color: #4a6cf7;
  }
`;

const SeriesList: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useScheduler();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpecialSeries, setIsSpecialSeries] = useState(false);

  // Fetch series on component mount and when activeTab changes
  useEffect(() => {
    dispatch(fetchSeries(activeTab, searchTerm));
  }, [dispatch, activeTab]);

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    dispatch(fetchSeries(activeTab, e.target.value));
  };

  // Handle tab change
  const handleTabChange = (tab: 'upcoming' | 'past') => {
    setActiveTab(tab);
  };

  // Handle series click
  const handleSeriesClick = (seriesId: number) => {
    navigate(`/scheduler/series/${seriesId}`);
  };

  // Handle delete series
  const handleDeleteSeries = async (seriesId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this series?')) {
      // Cast the dispatch result to satisfy TypeScript
      const result = await dispatch(deleteSeries(seriesId)) as unknown as { 
        success: boolean; 
        message?: string 
      };
      
      if (result && result.success) {
        // Series deleted successfully, refresh the list
        dispatch(fetchSeries(activeTab, searchTerm));
      } else {
        // Show error message
        alert('Failed to delete series: ' + (result?.message || 'Please try again.'));
      }
    }
  };

  // Handle add new series
  const handleAddNewSeries = (isSpecial: boolean) => {
    setIsSpecialSeries(isSpecial);
    setIsModalOpen(true);
  };

  // Get the appropriate series list based on the active tab
  const seriesToDisplay = activeTab === 'upcoming' 
    ? (isSpecialSeries ? state.specialSeries : state.series)
    : [];

  return (
    <div>
      <SchedulerHeader>
        <SchedulerTitle>Schedule</SchedulerTitle>
      </SchedulerHeader>

      <TabContainer>
        <Tab 
          active={activeTab === 'upcoming'} 
          onClick={() => handleTabChange('upcoming')}
        >
          Upcoming
        </Tab>
        <Tab 
          active={activeTab === 'past'} 
          onClick={() => handleTabChange('past')}
        >
          Past
        </Tab>
      </TabContainer>

      <SearchContainer>
        <SearchInput 
          type="search" 
          placeholder="Search series..." 
          value={searchTerm}
          onChange={handleSearch}
        />
        <div>
          <SchedulerButton 
            onClick={() => handleAddNewSeries(false)}
            style={{ marginRight: '10px' }}
          >
            Add New Series
          </SchedulerButton>
          <SchedulerButton 
            onClick={() => handleAddNewSeries(true)}
          >
            Add Special Series
          </SchedulerButton>
        </div>
      </SearchContainer>

      {state.loading.series ? (
        <div>Loading series...</div>
      ) : (
        <>
          <SchedulerGrid>
            {seriesToDisplay.length > 0 ? (
              seriesToDisplay.map((series: Series) => (
                <SeriesCard 
                  key={series.id}
                  series={series}
                  onClick={() => handleSeriesClick(series.id)}
                  onDelete={(e) => handleDeleteSeries(series.id, e)}
                />
              ))
            ) : (
              <SchedulerEmptyState>
                <h4>No series found</h4>
                <p>Try adjusting your search or create a new series</p>
              </SchedulerEmptyState>
            )}
          </SchedulerGrid>

          {isSpecialSeries && (
            <>
              <SchedulerHeader style={{ marginTop: '2rem' }}>
                <SchedulerTitle>Special Series</SchedulerTitle>
              </SchedulerHeader>
              
              <SchedulerGrid>
                {state.specialSeries.length > 0 ? (
                  state.specialSeries.map((series: Series) => (
                    <SeriesCard 
                      key={series.id}
                      series={series}
                      onClick={() => handleSeriesClick(series.id)}
                      onDelete={(e) => handleDeleteSeries(series.id, e)}
                    />
                  ))
                ) : (
                  <SchedulerEmptyState>
                    <h4>No special series found</h4>
                    <p>Try adjusting your search or create a new special series</p>
                  </SchedulerEmptyState>
                )}
              </SchedulerGrid>
            </>
          )}
        </>
      )}

      {isModalOpen && (
        <AddSeriesModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isSpecial={isSpecialSeries}
          onSuccess={() => {
            setIsModalOpen(false);
            dispatch(fetchSeries(activeTab, searchTerm));
          }}
        />
      )}
    </div>
  );
};

export default SeriesList;
