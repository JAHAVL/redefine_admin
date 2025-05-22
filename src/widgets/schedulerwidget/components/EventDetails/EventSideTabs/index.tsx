import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../../theme/index';

// Import tabs
import TimeTab from './TimeTab';
import SongTab from './SongTab';
import PeopleTab from './PeopleTab';

// Import types
import { TabType, Song, SongTabProps } from './types';

// Styled components for the tabs
const TabsContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
`;

const TabNav = styled.div`
    display: flex;
    border-bottom: 1px solid ${theme.colors.border};
    margin-bottom: ${theme.spacing.md};
    gap: 16px;
    justify-content: center;
`;

const TabButton = styled.button<{ active: boolean }>`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    background: transparent;
    color: ${(props: { active: boolean }) => props.active ? theme.colors.primary : theme.colors.text.secondary};
    border: none;
    border-bottom: 2px solid ${(props: { active: boolean }) => props.active ? theme.colors.primary : 'transparent'};
    font-weight: ${(props: { active: boolean }) => props.active ? '600' : '400'};
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        color: ${theme.colors.primary};
    }
`;

const TabContent = styled.div`
    flex: 1;
    overflow-y: auto;
    padding-right: ${theme.spacing.sm};
    
    /* Custom scrollbar */
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: ${theme.colors.border};
        border-radius: 3px;
    }
`;

// Constants for tab types to avoid magic strings
const TABS = {
    TIME: 'time' as TabType,
    SONGS: 'songs' as TabType,
    PEOPLE: 'people' as TabType
};

// Component props
interface EventSideTabsProps {
    activeTab?: TabType;
    setActiveTab?: (tab: TabType) => void;
    onSongDrop?: (song: Song, dropIndex?: number) => void;
    onExternalSongSet?: (song: Song) => void;
}

// EventSideTabs component
const EventSideTabs: React.FC<EventSideTabsProps> = ({ activeTab: propsActiveTab, setActiveTab: propsSetActiveTab, onSongDrop, onExternalSongSet }) => {
    // Use props or local state if props aren't provided
    const [localActiveTab, setLocalActiveTab] = useState<TabType>('time');
    
    // Use provided props if available, otherwise use local state
    const activeTab = propsActiveTab !== undefined ? propsActiveTab : localActiveTab;
    const setActiveTab = propsSetActiveTab || setLocalActiveTab;
    
    // Render tab content based on active tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'time':
                return <TimeTab />;
            case 'songs':
                return <SongTab onSongDrop={onSongDrop} onExternalSongSet={onExternalSongSet} />;
            case 'people':
                return <PeopleTab />;
            default:
                return null;
        }
    };
    
    return (
        <TabsContainer>
            <TabNav>
                <TabButton 
                    active={activeTab === 'time'} 
                    onClick={() => setActiveTab('time')}
                >
                    Time
                </TabButton>
                <TabButton 
                    active={activeTab === 'songs'} 
                    onClick={() => setActiveTab('songs')}
                >
                    Songs
                </TabButton>
                <TabButton 
                    active={activeTab === 'people'} 
                    onClick={() => setActiveTab('people')}
                >
                    People
                </TabButton>
            </TabNav>
            
            <TabContent>
                {renderTabContent()}
            </TabContent>
        </TabsContainer>
    );
};

export default EventSideTabs;
