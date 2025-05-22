import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../theme/index';
import SongInfoTab from './tabs/SongInfoTab';
import SongArrangementTab from './tabs/SongArrangementTab';
import SongFilesTab from './tabs/SongFilesTab';
import SongNotesTab from './tabs/SongNotesTab';
import { SongExpandStateData } from '../../../types/songInterfaces';

// Types
interface SongDetailsContainerProps {
    song: {
        id: number;
        title: string;
        artist: string;
        key: string;
        bpm: number;
    };
    currentTab: 'info' | 'arrangement' | 'files' | 'notes';
    setTabForSong: (tab: 'info' | 'arrangement' | 'files' | 'notes') => void;
    songExpandState: Record<number, SongExpandStateData>;
    setSongExpandState: React.Dispatch<React.SetStateAction<Record<number, SongExpandStateData>>>;
    // Add callbacks for arrangement selections
    onArrangementChange?: (arrangement: string) => void;
    onKeyChange?: (key: string) => void;
}

// Styled components
const Container = styled.div`
    padding: ${theme.spacing.md};
    border-top: 1px solid ${theme.colors.border};
    background-color: ${theme.colors.highlight};
    color: ${theme.colors.text.primary};
    width: 100%;
    box-sizing: border-box; /* Ensure padding doesn't affect width */
`;

const TabsRow = styled.div`
    display: flex;
    border-bottom: 1px solid ${theme.colors.border};
    margin-bottom: ${theme.spacing.md};
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
    }
`;

interface TabButtonProps {
    active: boolean;
}

const TabButton = styled.button<TabButtonProps>`
    background: none;
    border: none;
    border-bottom: 2px solid ${(props: TabButtonProps) => props.active ? theme.colors.primary : 'transparent'};
    color: ${(props: TabButtonProps) => props.active ? theme.colors.primary : theme.colors.text.secondary};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.fontSizes.sm};
    font-weight: ${(props: TabButtonProps) => props.active ? theme.typography.fontWeights.semibold : theme.typography.fontWeights.normal};
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
        color: ${theme.colors.primary};
    }
`;

const TabContent = styled.div`
    animation: fadeIn 0.3s ease-in-out;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden; /* Prevent content from affecting parent width */
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

/**
 * SongDetailsContainer component
 * Contains the tabbed interface for viewing and editing song details
 */
const SongDetailsContainer: React.FC<SongDetailsContainerProps> = ({
    song,
    currentTab,
    setTabForSong,
    songExpandState,
    setSongExpandState,
    onArrangementChange,
    onKeyChange
}): React.ReactElement => {
    return (
        <Container>
            <TabsRow>
                <TabButton 
                    active={currentTab === 'info'}
                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); setTabForSong('info'); }}
                >
                    Info
                </TabButton>
                <TabButton 
                    active={currentTab === 'arrangement'}
                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); setTabForSong('arrangement'); }}
                >
                    Arrangement
                </TabButton>
                <TabButton 
                    active={currentTab === 'files'}
                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); setTabForSong('files'); }}
                >
                    Files
                </TabButton>
                <TabButton 
                    active={currentTab === 'notes'}
                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); setTabForSong('notes'); }}
                >
                    Notes
                </TabButton>
            </TabsRow>
            
            <TabContent>
                {currentTab === 'info' && (
                    <SongInfoTab song={song} />
                )}
                
                {currentTab === 'arrangement' && (
                    <SongArrangementTab 
                        song={song} 
                        onArrangementChange={onArrangementChange} 
                        onKeyChange={onKeyChange} 
                    />
                )}
                
                {currentTab === 'files' && (
                    <SongFilesTab 
                        song={song} 
                        songExpandState={songExpandState} 
                        setSongExpandState={setSongExpandState} 
                    />
                )}
                
                {currentTab === 'notes' && (
                    <SongNotesTab 
                        song={song} 
                        songExpandState={songExpandState} 
                        setSongExpandState={setSongExpandState} 
                    />
                )}
            </TabContent>
        </Container>
    );
};

export default SongDetailsContainer;
