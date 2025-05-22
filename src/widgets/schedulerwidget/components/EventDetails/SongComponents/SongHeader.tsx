import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../theme/index';

// Types
interface SongHeaderProps {
    song: {
        id: number;
        title: string;
        artist: string;
        key: string;
        bpm: number;
    };
    isExpanded: boolean;
    toggleExpand: () => void;
    // Added selected arrangement properties
    selectedArrangement?: string;
    selectedKey?: string;
}

// Styled components
const SongHeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.spacing.md};
    background-color: ${theme.colors.highlight};
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }
`;

const SongArrow = styled.div<{ isExpanded: boolean }>`
    color: ${theme.colors.primary};
    transform: ${(props: { isExpanded: boolean }) => props.isExpanded ? 'rotate(90deg)' : 'rotate(0)'};
    transition: ${theme.transitions.default};
    margin-right: ${theme.spacing.md};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    font-size: 12px;
`;

const SongTime = styled.div`
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.text.secondary};
    margin-right: ${theme.spacing.md};
    width: 80px;
`;

const SongInfo = styled.div`
    flex: 1;
    max-width: calc(100% - 200px); /* Ensure fixed width accounting for other elements */
    overflow: hidden;
`;

const SongTitle = styled.h4`
    margin: 0;
    font-weight: ${theme.typography.fontWeights.semibold};
    font-size: ${theme.typography.fontSizes.md};
    color: ${theme.colors.text.primary};
`;

const SongArtist = styled.p`
    margin: 0;
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.text.secondary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
`;

const VocalNotes = styled.div`
    font-size: ${theme.typography.fontSizes.sm};
    padding: 2px 8px;
    background-color: ${theme.colors.primaryLight};
    color: white;
    border-radius: ${theme.borderRadius.sm};
    margin-left: ${theme.spacing.md};
`;

const MenuButton = styled.button`
    background: none;
    border: none;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.text.secondary};
    cursor: pointer;
    border-radius: ${theme.borderRadius.round};
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
`;

/**
 * SongHeader component - Displays the header section of a song item
 * Shows song metadata and handles expand/collapse interactions
 */
const SongHeader: React.FC<SongHeaderProps> = ({ song, isExpanded, toggleExpand, selectedArrangement, selectedKey }): React.ReactElement => {
    // Calculate a mock time for demonstration purposes
    const mockTime: string = `${8 + (song.id % 4)}:${song.id * 10 % 60 < 10 ? '0' : ''}${song.id * 10 % 60}`;
    const mockDuration: string = `${song.id % 3 + 2}min`;
    
    // Mock lead vocalist based on song id
    const leadVocalist: string = ['John', 'Sarah', 'Mike', 'Lisa'][song.id % 4];
    
    // Display selected arrangement if available, otherwise use defaults
    const displayKey: string = selectedKey || song.key;
    const displayArrangement: string = selectedArrangement || 'Standard';
    
    return (
        <SongHeaderContainer onClick={toggleExpand}>
            <SongArrow isExpanded={isExpanded}>
                ▶
            </SongArrow>
            <SongTime>
                {mockTime} • {mockDuration}
            </SongTime>
            <SongInfo>
                <SongTitle>{song.title}</SongTitle>
                <SongArtist>{song.artist} | {displayArrangement} | Key: {displayKey}</SongArtist>
            </SongInfo>
            <VocalNotes>
                Lead: {leadVocalist}
            </VocalNotes>
            <MenuButton>
                •••
            </MenuButton>
        </SongHeaderContainer>
    );
};

export default SongHeader;
