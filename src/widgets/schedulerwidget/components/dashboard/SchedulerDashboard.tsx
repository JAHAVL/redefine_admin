import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useScheduler } from '../../context';
import { fetchSeries, deleteSeries } from '../../actions';
import { Series } from '../../types';
import { 
  SchedulerWidgetContainer,
  SchedulerHeader, 
  SchedulerTitle, 
  SchedulerButton, 
  SchedulerGrid,
  SchedulerEmptyState,
  SeriesCard,
  CardImage,
  CardContent,
  CardTitle,
  CardDate,
  DeleteButton
} from '../../styles';
import AddSeriesModal from '../modals/AddSeriesModal';
import { theme } from '../../theme';
// Import mock data for development
import { mockSeries, mockSpecialSeries, mockPastSeries, mockPastSpecialSeries } from '../../utils/mockData';

// Fix styled-component TypeScript errors by using proper typing
const TabContainer = styled('div')`
  display: flex;
  margin-bottom: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
`;

interface TabProps {
  active: boolean;
}

const Tab = styled('button')<TabProps>`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${(props: TabProps) => props.active ? theme.colors.primary : 'transparent'};
  color: ${(props: TabProps) => props.active ? theme.colors.primary : theme.colors.text.secondary};
  font-weight: ${(props: TabProps) => props.active ? theme.typography.fontWeights.semibold : theme.typography.fontWeights.normal};
  cursor: pointer;
  transition: ${theme.transitions.default};
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

const SearchContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg};
`;

const SearchInput = styled('input')`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  width: 300px;
  font-size: ${theme.typography.fontSizes.sm};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;



const SchedulerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useScheduler();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [useMockData, setUseMockData] = useState<boolean>(true); // Toggle to use mock data

  useEffect(() => {
    if (!useMockData) {
      // Fetch series from API when not using mock data
      dispatch(fetchSeries(activeTab, searchTerm));
    }
  }, [dispatch, activeTab, searchTerm, useMockData]);

  // Get the appropriate series data based on active tab and search term
  const getFilteredSeries = () => {
    let seriesData: Series[] = [];
    let specialSeriesData: Series[] = [];
    
    if (useMockData) {
      // Use mock data
      seriesData = activeTab === 'upcoming' ? mockSeries : mockPastSeries;
      specialSeriesData = activeTab === 'upcoming' ? mockSpecialSeries : mockPastSpecialSeries;
    } else {
      // Use data from state
      seriesData = state.series;
      specialSeriesData = state.specialSeries;
    }
    
    // Apply search filter if search term exists
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      seriesData = seriesData.filter(series => 
        series.series_name.toLowerCase().includes(lowerSearchTerm)
      );
      specialSeriesData = specialSeriesData.filter(series => 
        series.series_name.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    return { seriesData, specialSeriesData };
  };

  // Get filtered data
  const { seriesData, specialSeriesData } = getFilteredSeries();

  // Handle tab change
  const handleTabChange = (tab: 'upcoming' | 'past') => {
    setActiveTab(tab);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle series click
  const handleSeriesClick = (seriesId: number) => {
    navigate(`/scheduler/series/${seriesId}`);
  };

  // State for modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpecialSeries, setIsSpecialSeries] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{show: boolean, id: number, isSpecial: boolean}>({show: false, id: 0, isSpecial: false});

  // Handle add new series
  const handleAddNewSeries = (isSpecial: boolean = false) => {
    setIsSpecialSeries(isSpecial);
    setIsModalOpen(true);
  };
  
  // Handle delete series
  const handleDeleteSeries = async (seriesId: number, isSpecial: boolean = false) => {
    try {
      // Cast the dispatch result to ActionResponse to satisfy TypeScript
      const result = await dispatch(deleteSeries(seriesId)) as unknown as { success: boolean; message?: string };
      
      if (result && result.success) {
        // Refresh the series list
        dispatch(fetchSeries(activeTab, searchTerm));
      } else if (result) {
        alert('Failed to delete series: ' + (result.message || 'Please try again.'));
      } else {
        alert('Failed to delete series. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting series:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  // Confirmation dialog for delete
  const ConfirmationDialog = styled('div')`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  const ConfirmationBox = styled('div')`
    background-color: white;
    border-radius: 8px;
    padding: 1.5rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    text-align: center;
  `;

  const ConfirmationTitle = styled('h3')`
    margin: 0 0 1rem;
    color: #f44336;
  `;

  const ConfirmationText = styled('p')`
    margin: 0 0 1.5rem;
    color: #666;
  `;

  const ConfirmationButtons = styled('div')`
    display: flex;
    justify-content: center;
    gap: 1rem;
  `;

  const ConfirmButton = styled('button')`
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    background-color: #f44336;
    color: white;
    
    &:hover {
      background-color: #d32f2f;
    }
  `;

  const CancelButton = styled('button')`
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    background-color: #f1f1f1;
    color: #333;
    
    &:hover {
      background-color: #e5e5e5;
    }
  `;

  return (
    <>
      <SchedulerWidgetContainer>
        <SchedulerHeader>
          <SchedulerTitle>Scheduler Dashboard</SchedulerTitle>
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
              style={{ marginRight: theme.spacing.md }}
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

        {!useMockData && state.loading.series ? (
          <div>Loading series...</div>
        ) : (
          <SchedulerGrid>
            {seriesData.length > 0 ? (
              seriesData.map((series: Series) => (
                <SeriesCard 
                  key={series.id}
                  onClick={() => handleSeriesClick(series.id)}
                >
                  <DeleteButton onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setConfirmDelete({show: true, id: series.id, isSpecial: false});
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </DeleteButton>
                  <CardImage backgroundImage={series.banner_1} />
                  <CardContent>
                    <CardTitle title={series.series_name}>{series.series_name}</CardTitle>
                    <CardDate>{series.start_date} - {series.end_date}</CardDate>
                  </CardContent>
                </SeriesCard>
              ))
            ) : (
              <SchedulerEmptyState>
                <h4>No series found</h4>
                <p>Try adjusting your search or create a new series</p>
              </SchedulerEmptyState>
            )}
          </SchedulerGrid>
        )}

        {specialSeriesData.length > 0 && (
          <>
            <SchedulerHeader style={{ marginTop: theme.spacing.xl }}>
              <SchedulerTitle>Special Series</SchedulerTitle>
            </SchedulerHeader>
            
            <SchedulerGrid>
              {specialSeriesData.map((series: Series) => (
                <SeriesCard 
                  key={series.id}
                  onClick={() => handleSeriesClick(series.id)}
                >
                  <DeleteButton onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    setConfirmDelete({show: true, id: series.id, isSpecial: true});
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </DeleteButton>
                  <CardImage backgroundImage={series.banner_1} />
                  <CardContent>
                    <CardTitle title={series.series_name}>{series.series_name}</CardTitle>
                    <CardDate>{series.start_date} - {series.end_date}</CardDate>
                  </CardContent>
                </SeriesCard>
              ))}
            </SchedulerGrid>
          </>
        )}
      </SchedulerWidgetContainer>

      {/* Add Series Modal */}
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
      
      {/* Confirmation Dialog */}
      {confirmDelete.show && (
        <ConfirmationDialog>
          <ConfirmationBox>
            <ConfirmationTitle>Delete Series</ConfirmationTitle>
            <ConfirmationText>
              Are you sure you want to delete this series? This action cannot be undone.
            </ConfirmationText>
            <ConfirmationButtons>
              <CancelButton onClick={() => setConfirmDelete({show: false, id: 0, isSpecial: false})}>
                Cancel
              </CancelButton>
              <ConfirmButton 
                onClick={() => {
                  handleDeleteSeries(confirmDelete.id, confirmDelete.isSpecial);
                  setConfirmDelete({show: false, id: 0, isSpecial: false});
                }}
              >
                Delete
              </ConfirmButton>
            </ConfirmationButtons>
          </ConfirmationBox>
        </ConfirmationDialog>
      )}
    </>
  );
};

export default SchedulerDashboard;
