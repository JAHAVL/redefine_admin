import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../theme/index';
import { Series, SeriesEvent, Team, Song } from '../types';
import { mockEvents, mockSeries, mockSpecialSeries } from '../utils/mockData';

// Styled components
const DetailContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${theme.colors.background};
    color: ${theme.colors.text.primary};
    padding: ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.md};
`;

const SeriesHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: ${theme.spacing.xl};
    padding: ${theme.spacing.md};
    background-color: ${theme.colors.card};
    border-radius: ${theme.borderRadius.md};
`;

const SeriesImageContainer = styled.div`
    width: 30%;
    margin-right: ${theme.spacing.lg};
`;

const SeriesImage = styled.img`
    width: 100%;
    border-radius: ${theme.borderRadius};
`;

const SeriesInfo = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const InfoHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
`;

const SeriesTitle = styled.h2`
    margin: 0 0 ${theme.spacing.sm} 0;
    font-size: ${theme.typography.fontSizes.xl};
    font-weight: ${theme.typography.fontWeights.bold};
`;

const SeriesActions = styled.div`
    display: flex;
    gap: ${theme.spacing.md};
`;

const ActionButton = styled.button`
    background-color: ${theme.colors.secondary};
    color: ${theme.colors.text.primary};
    border: none;
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-weight: ${theme.typography.fontWeights.semibold};
    cursor: pointer;
    transition: ${theme.transitions.default};

    &:hover {
        background-color: ${theme.colors.highlight};
    }
`;

const SpecialBadge = styled.span`
    display: inline-block;
    background-color: ${theme.colors.primary};
    color: ${theme.colors.text.primary};
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.sm};
    font-size: ${theme.typography.fontSizes.sm};
    margin-bottom: ${theme.spacing.sm};
`;

const SeriesDates = styled.div`
    margin-top: ${theme.spacing.sm};
    font-size: ${theme.typography.fontSizes.md};
`;

const ContentLayout = styled.div`
    display: flex;
    gap: ${theme.spacing.xl};
`;

const MainContent = styled.div`
    flex: 2;
    background-color: ${theme.colors.card};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.lg};
`;

const SideContent = styled.div`
    flex: 1;
    background-color: ${theme.colors.card};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.lg};
`;

const SectionTitle = styled.h3`
    font-size: ${theme.typography.fontSizes.lg};
    margin-top: 0;
    margin-bottom: ${theme.spacing.md};
    font-weight: ${theme.typography.fontWeights.semibold};
`;

const TabsContainer = styled.div`
    display: flex;
    border-bottom: 1px solid ${theme.colors.border};
    margin-bottom: ${theme.spacing.lg};
`;

const Tab = styled.button<{ active: boolean }>`
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    background-color: ${(props: { active: boolean }) => props.active ? theme.colors.primary : 'transparent'};
    color: ${(props: { active: boolean }) => props.active ? theme.colors.text.white : theme.colors.text.primary};
    border: none;
    border-bottom: 3px solid ${(props: { active: boolean }) => props.active ? theme.colors.primary : 'transparent'};
    font-weight: ${theme.typography.fontWeights.semibold};
    cursor: pointer;

    &:hover {
        background-color: ${(props: { active: boolean }) => props.active ? theme.colors.primary : theme.colors.highlight};
    }
`;

const EventsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
`;

const EventCard = styled.div`
    display: flex;
    align-items: center;
    background-color: ${theme.colors.highlight};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.md};
    transition: ${theme.transitions.default};
    cursor: pointer;

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.md};
    }
`;

const EventInfo = styled.div`
    flex: 1;
`;

const EventTitle = styled.h4`
    margin: 0 0 ${theme.spacing.xs} 0;
    font-size: ${theme.typography.fontSizes.md};
`;

const EventDate = styled.p`
    margin: 0;
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.text.secondary};
`;

const EventActions = styled.div`
    display: flex;
    gap: ${theme.spacing.sm};
`;

// Tab content components for the sidebar
const TimeTab: React.FC = () => (
    <div>
        <div>
            <h5>Worship Times</h5>
            <ul>
                <li>Sunday at 9:00 AM - 10:15 AM</li>
                <li>Sunday at 11:00 AM - 12:15 PM</li>
            </ul>
        </div>
        <div>
            <h5>Rehearsal Times</h5>
            <ul>
                <li>Saturday at 6:00 PM - 8:00 PM</li>
            </ul>
        </div>
        <div>
            <h5>Other Times</h5>
            <ul>
                <li>Setup: Sunday at 7:30 AM</li>
            </ul>
        </div>
    </div>
);

const SongTab: React.FC = () => (
    <div>
        <ul>
            <li>Way Maker - Leeland</li>
            <li>Great Are You Lord - All Sons & Daughters</li>
            <li>Holy Spirit - Jesus Culture</li>
            <li>What A Beautiful Name - Hillsong Worship</li>
        </ul>
    </div>
);

const PeopleTab: React.FC = () => (
    <div>
        <div>
            <h5>Worship</h5>
            <ul>
                <li>Worship Leader: John Doe</li>
                <li>Vocals: Jane Smith</li>
                <li>Keyboard: Michael Johnson</li>
                <li>Guitar: Emily Brown</li>
                <li>Drums: David Wilson</li>
            </ul>
        </div>
        <div>
            <h5>Production</h5>
            <ul>
                <li>Sound: Robert Miller</li>
                <li>Lighting: Sarah Davis</li>
                <li>ProPresenter: Chris Thomas</li>
            </ul>
        </div>
    </div>
);

// Enum for sidebar tabs
enum SidebarTab {
    TIME = 'time',
    SONG = 'song',
    PEOPLE = 'people'
}

const SeriesDetailView: React.FC = () => {
    // Use both useParams and useLocation to ensure we can extract parameters
    const params = useParams<{ seriesId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    
    // Extract seriesId from URL if not available through useParams
    const getSeriesIdFromPath = (): string => {
        const path = location.pathname;
        console.log('Path in SeriesDetailView:', path);
        
        // Extract seriesId from path
        const seriesMatch = path.match(/\/series\/([\d]+)/);
        if (seriesMatch && seriesMatch.length >= 2) {
            return seriesMatch[1];
        }
        
        // If not found in path, use params or default
        return params.seriesId || '0';
    };
    
    const seriesId = getSeriesIdFromPath();
    const [series, setSeries] = useState<Series | null>(null);
    const [events, setEvents] = useState<SeriesEvent[]>([]);
    const [activeTab, setActiveTab] = useState<SidebarTab>(SidebarTab.TIME);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        console.log('Loading series data for seriesId:', seriesId);
        // In a real implementation, this would fetch data from an API
        const seriesIdNum = parseInt(seriesId, 10);
        
        // Find the series from our mock data
        const foundSeries = [...mockSeries, ...mockSpecialSeries].find(s => s.id === seriesIdNum);
        if (foundSeries) {
            setSeries(foundSeries);
            
            // Find events for this series
            const seriesEvents = mockEvents.filter(event => event.series_id === seriesIdNum);
            setEvents(seriesEvents);
        }
        
        setIsLoading(false);
    }, [seriesId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!series) {
        return <div>Series not found</div>;
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case SidebarTab.TIME:
                return <TimeTab />;
            case SidebarTab.SONG:
                return <SongTab />;
            case SidebarTab.PEOPLE:
                return <PeopleTab />;
            default:
                return <TimeTab />;
        }
    };

    return (
        <DetailContainer>
            <SeriesHeader>
                <SeriesImageContainer>
                    <SeriesImage src={series.banner_1} alt={series.series_name} />
                </SeriesImageContainer>
                <SeriesInfo>
                    <InfoHeader>
                        <div>
                            <SeriesTitle>{series.series_name}</SeriesTitle>
                            {series.is_special && <SpecialBadge>Special Series</SpecialBadge>}
                        </div>
                        <SeriesActions>
                            <ActionButton onClick={() => console.log('Edit series')}>
                                Edit Series
                            </ActionButton>
                            <ActionButton onClick={() => console.log('Add event')}>
                                Add Event
                            </ActionButton>
                        </SeriesActions>
                    </InfoHeader>
                    <SeriesDates>
                        {series.start_date} - {series.end_date}
                    </SeriesDates>
                    {series.description && <p>{series.description}</p>}
                </SeriesInfo>
            </SeriesHeader>

            <ContentLayout>
                <MainContent>
                    <SectionTitle>Events</SectionTitle>
                    {events.length === 0 ? (
                        <div>No events found for this series. Add an event to get started.</div>
                    ) : (
                        <EventsList>
                            {events.map(event => (
                                <EventCard 
                                    key={event.id} 
                                    onClick={() => navigate(`/scheduler-new/events/${series.id}/${event.id}`)}
                                >
                                    <EventInfo>
                                        <EventTitle>{event.event_name}</EventTitle>
                                        <EventDate>{event.event_date} ({event.event_day})</EventDate>
                                    </EventInfo>
                                    <EventActions>
                                        <ActionButton onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            console.log(`Edit event ${event.id}`);
                                        }}>
                                            Edit
                                        </ActionButton>
                                    </EventActions>
                                </EventCard>
                            ))}
                        </EventsList>
                    )}
                </MainContent>

                <SideContent>
                    <TabsContainer>
                        <Tab 
                            active={activeTab === SidebarTab.TIME} 
                            onClick={() => setActiveTab(SidebarTab.TIME)}
                        >
                            Time
                        </Tab>
                        <Tab 
                            active={activeTab === SidebarTab.SONG} 
                            onClick={() => setActiveTab(SidebarTab.SONG)}
                        >
                            Songs
                        </Tab>
                        <Tab 
                            active={activeTab === SidebarTab.PEOPLE} 
                            onClick={() => setActiveTab(SidebarTab.PEOPLE)}
                        >
                            People
                        </Tab>
                    </TabsContainer>
                    {renderTabContent()}
                </SideContent>
            </ContentLayout>
        </DetailContainer>
    );
};

export default SeriesDetailView;
