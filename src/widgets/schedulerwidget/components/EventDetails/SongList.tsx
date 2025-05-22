import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/index';
import SongItem from './SongComponents/SongItem';
import { SongExpandStateData } from '../../types/songInterfaces';

interface SongListProps {
    songs: Array<{
        id: number;
        title: string;
        artist: string;
        key: string;
        bpm: number;
    }>;
    songExpandState: Record<number, SongExpandStateData>;
    setSongExpandState: React.Dispatch<React.SetStateAction<Record<number, SongExpandStateData>>>;
    onAddSong: () => void;
}

const SongListContainer = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    box-sizing: border-box;
    flex-shrink: 0;
    flex-grow: 0;
    /* Force a consistent width regardless of content */
    min-width: var(--content-width, 100%);
    max-width: var(--content-width, 100%);
`;

const ScheduleEmptyState = styled.div`
    padding: ${theme.spacing.xl};
    text-align: center;
    color: ${theme.colors.text.secondary};
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: ${theme.borderRadius.md};
    border: 1px dashed ${theme.colors.border};
    font-size: ${theme.typography.fontSizes.md};
    margin: ${theme.spacing.md} 0;
`;

const ActionButton = styled.button`
    background-color: ${theme.colors.secondary};
    color: ${theme.colors.text.white};
    border: none;
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-weight: ${theme.typography.fontWeights.semibold};
    cursor: pointer;
    transition: ${theme.transitions.default};

    &:hover {
        background-color: ${theme.colors.primaryDark};
    }
`;

/**
 * SongList component - Displays a list of songs for an event
 */
const SongList: React.FC<SongListProps> = ({ songs, songExpandState, setSongExpandState, onAddSong }) => {
    return (
        <>
            {songs.length === 0 ? (
                <ScheduleEmptyState>
                    No songs added yet. Add songs to get started.
                </ScheduleEmptyState>
            ) : (
                <SongListContainer>
                    {songs.map(song => (
                        <SongItem
                            key={song.id}
                            song={song}
                            songExpandState={songExpandState}
                            setSongExpandState={setSongExpandState}
                        />
                    ))}
                </SongListContainer>
            )}
            {/* Add button removed - now handled by the main + button */}
        </>
    );
};

export default SongList;