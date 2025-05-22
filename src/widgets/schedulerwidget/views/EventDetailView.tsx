import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme/index';
import { Series } from '../types';
import AddSongModal from '../components/modals/AddSongModal';
import AddElementModal from '../components/modals/AddElementModal';
import AddHeaderModal from '../components/modals/AddHeaderModal';
import AddItemSelectionModal from '../components/modals/AddItemSelectionModal';
import AddButton from '../components/AddButton';
import ElementList from '../components/EventDetails/ElementList';
import HeaderList from '../components/EventDetails/HeaderList';
import { ExtendedSeriesEvent, SongExpandStateData } from '../types/songInterfaces';
import { mockEvents, mockSeries, mockSpecialSeries } from '../utils/mockData';
import EventSideTabs, { SidebarTab as EventSidebarTab } from '../components/EventDetails/EventSideTabs';
import EventHeader from '../components/EventDetails/EventHeader';
import BackButton from '../components/EventDetails/BackButton';
import SongList from '../components/EventDetails/SongList';

// Styled components
const DetailContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${theme.colors.background};
    color: ${theme.colors.text.primary};
    padding: ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.md};
    min-height: 80vh;
`;

const ContentLayout = styled.div`
    display: flex;
    gap: ${theme.spacing.xl};
    margin-top: ${theme.spacing.xl};
    flex: 1;
`;

const MainContent = styled.div`
    flex: 2;
    background-color: ${theme.colors.card};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.lg};
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
`;

const SideContent = styled.div`
    flex: 1;
    background-color: ${theme.colors.card};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.lg};
    position: sticky;
    top: 20px;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
    margin-bottom: ${theme.spacing.xl};
    animation: fadeIn 0.3s ease-in-out;
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacing.md};
    padding-bottom: ${theme.spacing.sm};
    border-bottom: 1px solid ${theme.colors.border};
`;

const SectionTitle = styled.h3`
    font-size: ${theme.typography.fontSizes.lg};
    font-weight: ${theme.typography.fontWeights.semibold};
    margin: 0;
    color: ${theme.colors.text.primary};
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    
    svg {
        color: ${theme.colors.primary};
    }
`;

// Type for tracking expanded songs and active tabs
type SongExpandState = { [songId: number]: SongExpandStateData };

/**
 * EventDetailView - Displays detailed information about a specific event
 */
const EventDetailView: React.FC = () => {
    // Use both useParams and useLocation to ensure we can extract parameters
    const params = useParams<{ seriesId: string, eventId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    
    // Extract parameters from URL if not available through useParams
    const getParamsFromPath = (): { seriesId: string, eventId: string } => {
        const path = location.pathname;
        
        // Extract seriesId and eventId from path
        const eventsMatch = path.match(/\/events\/([\d]+)\/([\d]+)/);
        if (eventsMatch && eventsMatch.length >= 3) {
            return { seriesId: eventsMatch[1], eventId: eventsMatch[2] };
        }
        
        // If not found in path, use params or defaults
        return {
            seriesId: params.seriesId || '0',
            eventId: params.eventId || '0'
        };
    };
    
    const { seriesId, eventId } = getParamsFromPath();
    const [event, setEvent] = useState<ExtendedSeriesEvent | null>(null);
    const [series, setSeries] = useState<Series | null>(null);
    const [activeTab, setActiveTab] = useState<EventSidebarTab>(EventSidebarTab.TIME);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // State for tracking which songs are expanded and their active tabs
    const [songExpandState, setSongExpandState] = useState<SongExpandState>({});
    
    // State for header colors
    const [headers, setHeaders] = useState<Array<{id: number; title: string; color?: string}>>([    
        { id: 1, title: 'Pre-Service', color: theme.colors.primary },
        { id: 2, title: 'Worship Set', color: theme.colors.info },
        { id: 3, title: 'Message', color: theme.colors.accent },
        { id: 4, title: 'Response', color: theme.colors.success }
    ]);
    
    // Modal visibility states
    const [isSongModalOpen, setIsSongModalOpen] = useState<boolean>(false);
    const [isElementModalOpen, setIsElementModalOpen] = useState<boolean>(false);
    const [isHeaderModalOpen, setIsHeaderModalOpen] = useState<boolean>(false);
    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState<boolean>(false);
    
    // Reference to the add button for positioning the action modal
    const addButtonRef = useRef<HTMLDivElement>(null);
    
    // Handler for header color changes
    const handleHeaderColorChange = (id: number, color: string): void => {
        setHeaders(prevHeaders => 
            prevHeaders.map(header => 
                header.id === id ? { ...header, color } : header
            )
        );
    };
    
    // Mock songs data for demo
    const mockSongList = [
        { id: 1, title: 'Amazing Grace', artist: 'John Newton', key: 'G', bpm: 68 },
        { id: 2, title: 'How Great Is Our God', artist: 'Chris Tomlin', key: 'C', bpm: 78 },
        { id: 3, title: 'Cornerstone', artist: 'Hillsong', key: 'D', bpm: 72 },
        { id: 4, title: 'Good Good Father', artist: 'Chris Tomlin', key: 'A', bpm: 70 }
    ];
    
    // Initialize the songExpandState with mock data - only run once on component mount
    useEffect(() => {
        if (mockSongList.length > 0) {
            const initialState: SongExpandState = {};
            mockSongList.forEach((song) => {
                initialState[song.id] = {
                    expanded: false,
                    activeTab: 'info',
                    activeNoteType: 'vocals',
                    notesByType: {
                        vocals: [
                            { id: 1, content: `Lead Vocal: ${['John', 'Sarah', 'Mike', 'Lisa'][song.id % 4]}\nBacking Vocals: ${['Alex & Emma', 'David & Rachel', 'Sam & Taylor'][song.id % 3]}` }
                        ],
                        production: [
                            { id: 1, content: 'Pay special attention to the dynamics in the bridge section. Start soft and build to full volume by the last chorus.' }
                        ],
                        band: [
                            { id: 1, content: 'Lead vocalist will cue the band for the transition from bridge to chorus.' }
                        ],
                        lighting: [
                            { id: 1, content: 'Keep lighting subdued during verses, then brighten for chorus sections.' }
                        ],
                        audio: [
                            { id: 1, content: 'Bass should be slightly boosted for this song. Vocals need extra reverb during the bridge.' }
                        ],
                        general: [
                            { id: 1, content: 'Remember to have water bottles on stage for all performers.' }
                        ]
                    }
                };
            });
            setSongExpandState(initialState);
        }
    }, []); // Empty dependency array to ensure this only runs once on mount

    useEffect(() => {
        console.log('Loading event data for seriesId:', seriesId, 'eventId:', eventId);
        // In a real implementation, this would fetch data from an API
        const numSeriesId = parseInt(seriesId, 10);
        const numEventId = parseInt(eventId, 10);
        
        // Find the event
        const foundEvent = mockEvents.find(e => e.id === numEventId && e.series_id === numSeriesId);
        
        // Find the associated series
        const foundSeries = [...mockSeries, ...mockSpecialSeries].find(s => s.id === numSeriesId);
        
        if (foundEvent) {
            setEvent(foundEvent);
        }
        
        if (foundSeries) {
            setSeries(foundSeries);
        }
        
        setIsLoading(false);
    }, [seriesId, eventId]);

    const handleBack = (): void => {
        navigate(`/scheduler-new/series/${seriesId}`);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!event || !series) {
        return <div>Event not found</div>;
    }

    return (
        <DetailContainer>
            <BackButton onClick={handleBack}>Back to Series</BackButton>
            
            <EventHeader 
                event={event} 
                onEditEvent={() => console.log('Edit event')} 
            />

            <ContentLayout>
                <MainContent>
                    <Section>
                        {/* Section header removed */}
                        <SongList 
                            songs={mockSongList}
                            songExpandState={songExpandState}
                            setSongExpandState={setSongExpandState}
                            onAddSong={() => setIsSongModalOpen(false)} /* Placeholder but not displayed */
                        />
                    </Section>
                    
                    <Section style={{ marginTop: theme.spacing.lg }}>
                        {/* Section header removed */}
                        <ElementList 
                            elements={[
                                { id: 1, title: 'Welcome and Announcements', description: 'Brief introduction and weekly announcements', time: '9:00 AM', duration: '5min' },
                                { id: 2, title: 'Opening Prayer', description: 'Led by Pastor John', time: '9:05 AM', duration: '3min' },
                                { id: 3, title: 'Video Intro', description: 'New series introduction video', time: '9:08 AM', duration: '2min' }
                            ]} 
                            elementExpandState={songExpandState}
                            setElementExpandState={setSongExpandState}
                            onAddElement={() => setIsElementModalOpen(false)} /* Placeholder but not displayed */
                            onElementUpdate={(id, updatedElement) => {
                                console.log('Element updated:', id, updatedElement);
                                // Would typically update state or make API call here
                            }}
                        />
                    </Section>
                    
                    <Section style={{ marginTop: theme.spacing.lg }}>
                        {/* Section header removed */}
                        <HeaderList 
                            headers={headers}
                            onAddHeader={() => setIsHeaderModalOpen(false)} /* Placeholder but not displayed */
                            onHeaderColorChange={handleHeaderColorChange}
                        />
                    </Section>
                    
                    {/* Add Button */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: theme.spacing.lg }}>
                        <div ref={addButtonRef}>
                            <AddButton onClick={() => setIsSelectionModalOpen(true)} />
                        </div>
                    </div>
                </MainContent>
                
                <SideContent>
                    <EventSideTabs 
                        activeTab={activeTab} 
                        setActiveTab={setActiveTab}
                    />
                </SideContent>
            </ContentLayout>
            
            {/* Glassy Modal Components */}
            <AddSongModal
                isOpen={isSongModalOpen}
                onClose={() => setIsSongModalOpen(false)}
                onAddSong={(newSong) => {
                    console.log('New song added:', newSong);
                    // In a real app, we would add the song to the list
                    // For now, we'll just close the modal
                    setIsSongModalOpen(false);
                }}
            />
            
            <AddElementModal
                isOpen={isElementModalOpen}
                onClose={() => setIsElementModalOpen(false)}
                onAddElement={(newElement) => {
                    console.log('New element added:', newElement);
                    // In a real app, we would add the element to the list
                    // For now, we'll just close the modal
                    setIsElementModalOpen(false);
                }}
            />
            
            <AddHeaderModal
                isOpen={isHeaderModalOpen}
                onClose={() => setIsHeaderModalOpen(false)}
                onAddHeader={(newHeader) => {
                    console.log('New header added:', newHeader);
                    // In a real app, we would add the header to the list
                    // For now, we'll just close the modal
                    setIsHeaderModalOpen(false);
                }}
            />
            
            {/* Item Selection Modal */}
            <AddItemSelectionModal 
                isOpen={isSelectionModalOpen}
                onClose={() => setIsSelectionModalOpen(false)}
                onSelectSong={() => setIsSongModalOpen(true)}
                onSelectElement={() => setIsElementModalOpen(true)}
                onSelectHeader={() => setIsHeaderModalOpen(true)}
                triggerRef={addButtonRef}
            />
        </DetailContainer>
    );
};

export default EventDetailView;
