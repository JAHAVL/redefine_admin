import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme/index';
import { Series } from '../types';
import AddSongModal from '../components/modals/AddSongModal';
import AddElementModal from '../components/modals/AddElementModal';
import AddHeaderModal from '../components/modals/AddHeaderModal';
import AddItemSelectionModal from '../components/modals/AddItemSelectionModal';
import AddButton from '../components/AddButton';
import { ExtendedSeriesEvent, SongExpandStateData } from '../types/songInterfaces';
import { mockEvents, mockSeries, mockSpecialSeries } from '../utils/mockData';
import EventSideTabs, { SidebarTab as EventSidebarTab } from '../components/EventDetails/EventSideTabs';
import EventHeader from '../components/EventDetails/EventHeader';
import BackButton from '../components/EventDetails/BackButton';
import DraggableList from '../components/EventDetails/DraggableListNew';
import SongList from '../components/EventDetails/SongList';
import HeaderList from '../components/EventDetails/HeaderList';
import ElementList from '../components/EventDetails/ElementList';

// Unified item type for drag and drop operations
interface EventItem {
    id: number;
    type: 'song' | 'element' | 'header';
    position: number;
    data: any; // Specific data for each type
};

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
    
    // Separate state for tracking element expansion states
    const [elementExpandState, setElementExpandState] = useState<SongExpandState>({});
    
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
        setEventItems(prevItems => 
            prevItems.map(item => 
                (item.type === 'header' && item.data.id === id) 
                    ? { ...item, data: { ...item.data, color } } 
                    : item
            )
        );
    };
    
    // Handlers for adding new items to the event
    const handleAddSong = (): void => {
        console.log('Opening song selection modal');
        setIsSelectionModalOpen(true);
    };
    
    const handleAddElement = (): void => {
        console.log('Opening element creation modal');
        setIsElementModalOpen(true);
    };
    
    const handleAddHeader = (): void => {
        console.log('Opening header creation modal');
        setIsHeaderModalOpen(true);
    };
    
    // Handler for updating elements
    const handleElementUpdate = (id: number, updatedElement: any): void => {
        setEventItems(prevItems => 
            prevItems.map(item => 
                (item.type === 'element' && item.data.id === id) 
                    ? { ...item, data: { ...updatedElement } } 
                    : item
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
    
    // Mock elements for the event
    const mockElementList = [
        { id: 1, title: 'Welcome', duration: 5, presenter: 'Pastor Mike' },
        { id: 2, title: 'Announcements', duration: 3, presenter: 'Rachel' },
        { id: 3, title: 'Scripture Reading', duration: 2, presenter: 'David' },
        { id: 4, title: 'Message', duration: 25, presenter: 'Pastor Mike' }
    ];
    
    // Unified event items state for drag and drop functionality
    const [eventItems, setEventItems] = useState<EventItem[]>([]);

    // Initialize the songExpandState and event items with mock data
    useEffect(() => {
        if (mockSongList.length > 0) {
            // Initialize song expand state
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
            
            // Create initial event items list with mixed types (songs, elements, headers)
            const initialEventItems: EventItem[] = [
                // Header: Pre-Service
                {
                    id: 1,
                    type: 'header',
                    position: 0,
                    data: { id: 1, title: 'Pre-Service', color: theme.colors.primary }
                },
                // Element: Welcome
                {
                    id: 2,
                    type: 'element',
                    position: 1,
                    data: mockElementList[0]
                },
                // Song: Amazing Grace
                {
                    id: 3,
                    type: 'song',
                    position: 2,
                    data: mockSongList[0]
                },
                // Header: Worship Set
                {
                    id: 4,
                    type: 'header',
                    position: 3,
                    data: { id: 2, title: 'Worship Set', color: theme.colors.info }
                },
                // Song: How Great Is Our God
                {
                    id: 5,
                    type: 'song',
                    position: 4,
                    data: mockSongList[1]
                },
                // Song: Cornerstone
                {
                    id: 6,
                    type: 'song',
                    position: 5,
                    data: mockSongList[2]
                },
                // Header: Message
                {
                    id: 7,
                    type: 'header',
                    position: 6,
                    data: { id: 3, title: 'Message', color: theme.colors.accent }
                },
                // Element: Scripture Reading
                {
                    id: 8,
                    type: 'element',
                    position: 7,
                    data: mockElementList[2]
                },
                // Element: Message
                {
                    id: 9,
                    type: 'element',
                    position: 8,
                    data: mockElementList[3]
                },
                // Header: Response
                {
                    id: 10,
                    type: 'header',
                    position: 9,
                    data: { id: 4, title: 'Response', color: theme.colors.success }
                },
                // Song: Good Good Father
                {
                    id: 11,
                    type: 'song',
                    position: 10,
                    data: mockSongList[3]
                },
            ];
            
            setEventItems(initialEventItems);
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

    const handleReorderItems = useCallback((dragIndex: number, hoverIndex: number): void => {
        // Use a more direct approach to ensure state updates correctly
        setEventItems((prevItems) => {
            // Create a copy of the previous items
            const newItems = [...prevItems];
            
            // Get the dragged item
            const draggedItem = newItems[dragIndex];
            
            if (!draggedItem) {
                console.error(`Item at index ${dragIndex} not found`);
                return prevItems;
            }
            
            // Remove the dragged item
            newItems.splice(dragIndex, 1);
            
            // Insert it at the new position
            newItems.splice(hoverIndex, 0, draggedItem);
            
            // Debug output
            console.log(`Moved item from index ${dragIndex} to ${hoverIndex}:`, 
                        draggedItem.type, draggedItem.id);
            
            // Update positions and return new array
            return newItems.map((item, index) => ({
                ...item,
                position: index
            }));
        });
    }, []);

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
                        <SectionHeader>
                            <SectionTitle>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 8c-2.8 0-5 1.8-5 4s2.2 4 5 4 5-1.8 5-4-2.2-4-5-4Z"></path>
                                    <path d="M8 16v-4"></path>
                                    <path d="M16 16v-4"></path>
                                    <path d="M12 12v8"></path>
                                    <path d="M12 4v4"></path>
                                </svg>
                                Event Program
                            </SectionTitle>
                        </SectionHeader>
                        
                        <DraggableList
                            items={eventItems}
                            keyExtractor={(item) => `${item.type}-${item.id}`}
                            onReorder={handleReorderItems}
                            renderItem={(item, index) => (
                                <>
                                    {item.type === 'song' && (
                                        <SongList 
                                            songs={[item.data]} 
                                            songExpandState={songExpandState} 
                                            setSongExpandState={setSongExpandState}
                                            onAddSong={handleAddSong}
                                        />
                                    )}
                                    {item.type === 'element' && (
                                        <ElementList 
                                            elements={[item.data]} 
                                            elementExpandState={elementExpandState}
                                            setElementExpandState={setElementExpandState}
                                            onAddElement={handleAddElement}
                                            onElementUpdate={handleElementUpdate}
                                        />
                                    )}
                                    {item.type === 'header' && (
                                        <HeaderList 
                                            headers={[item.data]} 
                                            onHeaderColorChange={handleHeaderColorChange}
                                            onAddHeader={handleAddHeader}
                                        />
                                    )}
                                </>
                            )}
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
