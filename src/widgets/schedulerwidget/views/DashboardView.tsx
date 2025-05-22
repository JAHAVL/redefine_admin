import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useScheduler } from '../context';
import { fetchSeries, deleteSeries } from '../actions/index';
import { Series } from '../types/index';
import { 
    SchedulerWidgetContainer,
    SchedulerHeader, 
    SchedulerTitle, 
    SchedulerButton, 
    SchedulerGrid,
    SchedulerEmptyState
} from '../styles/index';
import AddSeriesModal from '../components/modals/AddSeriesModal';
import SeriesCard from '../components/SeriesCard';
import { theme } from '../theme/index';
import { mockSeries, mockSpecialSeries, mockPastSeries, mockPastSpecialSeries } from '../utils/mockData';

// Styled components for tab navigation
const TabContainer = styled.div`
    display: flex;
    margin-bottom: ${theme.spacing.lg};
    border-bottom: 1px solid ${theme.colors.border};
`;

interface TabProps {
    active: boolean;
}

const Tab = styled.button<TabProps>`
    padding: 0.75rem 1.5rem;
    background: none;
    border: none;
    border-bottom: 2px solid ${(props: TabProps) => props.active ? theme.colors.primary : 'transparent'};
    color: ${(props: TabProps) => props.active ? theme.colors.text.primary : theme.colors.text.secondary};
    font-weight: ${(props: TabProps) => props.active ? theme.typography.fontWeights.semibold : theme.typography.fontWeights.normal};
    cursor: pointer;
    transition: ${theme.transitions.default};
    
    &:hover {
        color: ${theme.colors.primary};
    }
`;

const SearchInput = styled.input`
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;
    width: 100%;
    border-radius: ${theme.borderRadius.md};
    border: 1px solid ${theme.colors.border};
    background: ${theme.colors.card};
    color: ${theme.colors.text.primary};
`;

// Series tab types
enum SeriesTab {
    CURRENT = 'current',
    PAST = 'past'
}

/**
 * Dashboard View
 * 
 * Main view component for the scheduler dashboard that displays and manages series.
 * Composes multiple components to create a complete functional screen for series management.
 */
const DashboardView: React.FC = () => {
    // Hooks
    const navigate = useNavigate();
    const { state, dispatch } = useScheduler();
    
    // State
    const [activeTab, setActiveTab] = useState<SeriesTab>(SeriesTab.CURRENT);
    const [isAddSeriesModalOpen, setAddSeriesModalOpen] = useState<boolean>(false);
    const [isAddSpecialSeries, setAddSpecialSeries] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    
    // Mock data for demonstration
    const [currentSeries, setCurrentSeries] = useState<Series[]>([]);
    const [currentSpecialSeries, setCurrentSpecialSeries] = useState<Series[]>([]);
    const [pastSeries, setPastSeries] = useState<Series[]>([]);
    const [pastSpecialSeries, setPastSpecialSeries] = useState<Series[]>([]);
    
    // Load series data on component mount
    useEffect(() => {
        loadSeriesData();
    }, []);
    
    // Example of loading series data
    const loadSeriesData = (): void => {
        // In a real implementation, this would dispatch actions to fetch data from API
        // For now, using mock data
        setCurrentSeries(mockSeries);
        setCurrentSpecialSeries(mockSpecialSeries);
        setPastSeries(mockPastSeries);
        setPastSpecialSeries(mockPastSpecialSeries);
    };
    
    // Handle tab change
    const handleTabChange = (tab: SeriesTab): void => {
        setActiveTab(tab);
    };
    
    // Handle series click
    const handleSeriesClick = (series: Series): void => {
        console.log(`Clicked on series: ${series.id} - ${series.series_name}`);
        // Navigate to the series detail view using seriesId parameter
        navigate(`/scheduler-new/series/${series.id}`);
    };
    
    // Handle delete series
    const handleDeleteSeries = async (e: React.MouseEvent, seriesId: number): Promise<void> => {
        e.stopPropagation();
        
        if (window.confirm('Are you sure you want to delete this series?')) {
            try {
                // In a real implementation, this would dispatch actions to delete from API
                console.log(`Deleting series with ID: ${seriesId}`);
                
                // Determine if it's a regular or special series
                const isRegularSeries = (series: Series) => !series.is_special;
                const isSpecialSeries = (series: Series) => series.is_special;
                
                // Update UI by removing the series from the appropriate list
                if (activeTab === SeriesTab.CURRENT) {
                    // Check if it's in current regular series
                    if (currentSeries.some(s => s.id === seriesId)) {
                        setCurrentSeries(currentSeries.filter(s => s.id !== seriesId));
                    }
                    // Check if it's in current special series
                    if (currentSpecialSeries.some(s => s.id === seriesId)) {
                        setCurrentSpecialSeries(currentSpecialSeries.filter(s => s.id !== seriesId));
                    }
                } else if (activeTab === SeriesTab.PAST) {
                    // Check if it's in past regular series
                    if (pastSeries.some(s => s.id === seriesId)) {
                        setPastSeries(pastSeries.filter(s => s.id !== seriesId));
                    }
                    // Check if it's in past special series
                    if (pastSpecialSeries.some(s => s.id === seriesId)) {
                        setPastSpecialSeries(pastSpecialSeries.filter(s => s.id !== seriesId));
                    }
                }
                
            } catch (error) {
                console.error('Error deleting series:', error);
            }
        }
    };
    
    // Open add series modal
    const openAddSeriesModal = (isSpecial: boolean = false): void => {
        setAddSpecialSeries(isSpecial);
        setAddSeriesModalOpen(true);
    };
    
    // Handle add series success
    const handleAddSeriesSuccess = (): void => {
        loadSeriesData();
        setAddSeriesModalOpen(false);
    };
    
    // Filter series based on search term
    const getFilteredRegularSeries = (): Series[] => {
        const regularSeries = activeTab === SeriesTab.CURRENT ? currentSeries : pastSeries;
        
        if (!search) return regularSeries;
        
        return regularSeries.filter(series => 
            series.series_name.toLowerCase().includes(search.toLowerCase()) || 
            (series.description && series.description.toLowerCase().includes(search.toLowerCase()))
        );
    };
    
    // Filter special series based on search term
    const getFilteredSpecialSeries = (): Series[] => {
        const specialSeries = activeTab === SeriesTab.CURRENT ? currentSpecialSeries : pastSpecialSeries;
        
        if (!search) return specialSeries;
        
        return specialSeries.filter(series => 
            series.series_name.toLowerCase().includes(search.toLowerCase()) || 
            (series.description && series.description.toLowerCase().includes(search.toLowerCase()))
        );
    };
    
    // Render series cards with separate sections for regular and special series
    const renderSeries = (): JSX.Element => {
        const filteredRegularSeries = getFilteredRegularSeries();
        const filteredSpecialSeries = getFilteredSpecialSeries();
        
        // Both sections are empty
        if (filteredRegularSeries.length === 0 && filteredSpecialSeries.length === 0) {
            return (
                <SchedulerEmptyState>
                    <h4>No events found</h4>
                    <p>
                        {search 
                            ? "No events match your search term. Try a different search."
                            : "Add a new series or special event to get started."}
                    </p>
                </SchedulerEmptyState>
            );
        }
        
        return (
            <div>
                {/* Regular series section */}
                {filteredRegularSeries.length > 0 && (
                    <div>
                        <h3 style={{ 
                            color: theme.colors.text.primary,
                            marginTop: theme.spacing.lg,
                            marginBottom: theme.spacing.md,
                            fontWeight: theme.typography.fontWeights.semibold
                        }}>
                            {activeTab === SeriesTab.CURRENT ? 'Current Series' : 'Past Series'}
                        </h3>
                        <SchedulerGrid>
                            {filteredRegularSeries.map(series => (
                                <SeriesCard 
                                    key={series.id}
                                    series={series}
                                    onClick={(): void => handleSeriesClick(series)}
                                    onDelete={(e): Promise<void> => handleDeleteSeries(e, series.id)}
                                />
                            ))}
                        </SchedulerGrid>
                    </div>
                )}
                
                {/* Special events section */}
                {filteredSpecialSeries.length > 0 && (
                    <div>
                        <h3 style={{ 
                            color: theme.colors.text.primary,
                            marginTop: theme.spacing.xl, 
                            marginBottom: theme.spacing.md,
                            fontWeight: theme.typography.fontWeights.semibold
                        }}>
                            {activeTab === SeriesTab.CURRENT ? 'Special Events' : 'Past Special Events'}
                        </h3>
                        <SchedulerGrid>
                            {filteredSpecialSeries.map(series => (
                                <SeriesCard 
                                    key={series.id}
                                    series={series}
                                    onClick={(): void => handleSeriesClick(series)}
                                    onDelete={(e): Promise<void> => handleDeleteSeries(e, series.id)}
                                />
                            ))}
                        </SchedulerGrid>
                    </div>
                )}
            </div>
        );
    };
    
    return (
        <SchedulerWidgetContainer>
            <SchedulerHeader>
                <SchedulerTitle>Series Management</SchedulerTitle>
                
                <div>
                    {activeTab === SeriesTab.CURRENT && (
                        <>
                            <SchedulerButton onClick={(): void => openAddSeriesModal(false)} style={{ marginRight: theme.spacing.md }}>
                                Add New Series
                            </SchedulerButton>
                            <SchedulerButton onClick={(): void => openAddSeriesModal(true)}>
                                Add Special Event
                            </SchedulerButton>
                        </>
                    )}
                </div>
            </SchedulerHeader>
            
            <TabContainer>
                <Tab 
                    active={activeTab === SeriesTab.CURRENT} 
                    onClick={(): void => handleTabChange(SeriesTab.CURRENT)}
                >
                    Current Events
                </Tab>
                <Tab 
                    active={activeTab === SeriesTab.PAST} 
                    onClick={(): void => handleTabChange(SeriesTab.PAST)}
                >
                    Past Events
                </Tab>
            </TabContainer>
            
            <SearchInput
                type="text"
                placeholder="Search series..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setSearch(e.target.value)}
            />
            
            {renderSeries()}
            
            {isAddSeriesModalOpen && (
                <AddSeriesModal
                    isOpen={isAddSeriesModalOpen}
                    onClose={(): void => setAddSeriesModalOpen(false)}
                    isSpecial={isAddSpecialSeries}
                    onSuccess={handleAddSeriesSuccess}
                />
            )}
        </SchedulerWidgetContainer>
    );
};

export default DashboardView;
