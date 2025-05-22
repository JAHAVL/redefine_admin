import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../theme/index';
import SongHeader from './SongHeader';
import SongDetailsContainer from './SongDetailsContainer';
import { SongExpandStateData } from '../../../types/songInterfaces';

// Types
interface SongItemProps {
    song: {
        id: number;
        title: string;
        artist: string;
        key: string;
        bpm: number;
    };
    songExpandState: Record<number, SongExpandStateData>;
    setSongExpandState: React.Dispatch<React.SetStateAction<Record<number, SongExpandStateData>>>;
}

// Styled components
const SongItemContainer = styled.li`
    margin-bottom: ${theme.spacing.sm};
    background-color: ${theme.colors.highlight};
    border-radius: ${theme.borderRadius.md};
    overflow: hidden;
    border: 1px solid ${theme.colors.border};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    width: 100%;
    box-sizing: border-box;
    max-width: 100%;
    flex-shrink: 0;
    flex-grow: 0;
`;

const SongItem: React.FC<SongItemProps> = ({ song, songExpandState, setSongExpandState }): React.ReactElement => {
    // Use default values if state doesn't exist for this song
    // This avoids setting state during render which causes infinite update
    const songState: SongExpandStateData = songExpandState[song.id] || { 
        expanded: false, 
        activeTab: 'info',
        selectedArrangement: 'Standard', 
        selectedKey: song.key 
    };
    
    const isExpanded: boolean = songState.expanded || false;
    const currentTab: 'info' | 'arrangement' | 'files' | 'notes' = songState.activeTab || 'info';
    const selectedArrangement: string = songState.selectedArrangement || 'Standard';
    const selectedKey: string = songState.selectedKey || song.key;
    
    const toggleExpand = (): void => {
        const newState: Record<number, SongExpandStateData> = {...songExpandState};
        newState[song.id] = { 
            ...newState[song.id],
            expanded: !isExpanded 
        };
        setSongExpandState(newState);
    };
    
    const setTabForSong = (tab: 'info' | 'arrangement' | 'files' | 'notes'): void => {
        const newState: Record<number, SongExpandStateData> = {...songExpandState};
        newState[song.id] = { 
            ...newState[song.id],
            activeTab: tab
        };
        setSongExpandState(newState);
    };
    
    // Handler for arrangement changes
    const handleArrangementChange = (arrangement: string): void => {
        const newState: Record<number, SongExpandStateData> = {...songExpandState};
        newState[song.id] = { 
            ...newState[song.id],
            selectedArrangement: arrangement
        };
        setSongExpandState(newState);
    };
    
    // Handler for key changes
    const handleKeyChange = (key: string): void => {
        const newState: Record<number, SongExpandStateData> = {...songExpandState};
        newState[song.id] = { 
            ...newState[song.id],
            selectedKey: key
        };
        setSongExpandState(newState);
    };

    return (
        <SongItemContainer>
            <SongHeader 
                song={song} 
                isExpanded={isExpanded} 
                toggleExpand={toggleExpand}
                selectedArrangement={selectedArrangement}
                selectedKey={selectedKey} 
            />
            
            {isExpanded && (
                <SongDetailsContainer 
                    song={song}
                    currentTab={currentTab}
                    setTabForSong={setTabForSong}
                    songExpandState={songExpandState}
                    setSongExpandState={setSongExpandState}
                    onArrangementChange={handleArrangementChange}
                    onKeyChange={handleKeyChange}
                />
            )}
        </SongItemContainer>
    );
};

export default SongItem;
