import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../../theme/index';

// Types
interface SongInfoTabProps {
    song: {
        id: number;
        title: string;
        artist: string;
        key: string;
        bpm: number;
        ccli?: string; // Added CCLI number field (optional)
        youtubeUrl?: string; // Added YouTube URL field (optional)
    };
}

// Styled components
const InfoTabContainer = styled.div`
    display: flex;
    gap: ${theme.spacing.xl};
    padding: ${theme.spacing.md} 0;
    background-color: ${theme.colors.highlight};
    color: ${theme.colors.text.primary};
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    max-width: 100%;
`;

const AlbumCoverContainer = styled.div`
    width: 150px;
    height: 150px;
    border-radius: ${theme.borderRadius.md};
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
`;

const AlbumCover = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const SongDetails = styled.div`
    flex: 1;
`;

const SongTitleLarge = styled.h3`
    margin: 0;
    font-size: ${theme.typography.fontSizes.xl};
    font-weight: ${theme.typography.fontWeights.bold};
    margin-bottom: ${theme.spacing.xs};
`;

const SongAuthor = styled.p`
    margin: 0;
    font-size: ${theme.typography.fontSizes.md};
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing.md};
`;

const InfoRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: ${theme.spacing.sm};
`;

const InfoLabel = styled.span`
    width: 100px;
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.text.secondary};
`;

const InfoValue = styled.span`
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.text.primary};
`;

/**
 * SongInfoTab component - Displays general information about a song
 */
// Add YouTube button component
const YouTubeButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing.xs};
    background-color: #FF0000;
    color: white;
    border: none;
    border-radius: ${theme.borderRadius.sm};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.fontSizes.sm};
    margin-top: ${theme.spacing.md};
    cursor: pointer;
    transition: all 0.2s;
    font-family: ${theme.typography.fontFamily};
    
    &:hover {
        background-color: #CC0000;
        transform: translateY(-2px);
    }
    
    &:active {
        transform: translateY(0);
    }
`;

const SongInfoTab: React.FC<SongInfoTabProps> = ({ song }): React.ReactElement => {
    // Placeholder for CCLI number if not provided
    const ccliNumber = song.ccli || '12345678';
    
    // Open YouTube in a new tab
    const openYouTube = () => {
        // If a specific URL is provided, use it, otherwise search for the song on YouTube
        const url = song.youtubeUrl || 
            `https://www.youtube.com/results?search_query=${encodeURIComponent(`${song.title} ${song.artist}`)}`;  
        window.open(url, '_blank');
    };
    
    return (
        <InfoTabContainer>
            <AlbumCoverContainer>
                <AlbumCover 
                    src={`https://picsum.photos/seed/${song.title.replace(/\s+/g, '-').toLowerCase()}/300/300`} 
                    alt={`${song.title} album cover`} 
                />
            </AlbumCoverContainer>
            <SongDetails>
                <SongTitleLarge>{song.title}</SongTitleLarge>
                <SongAuthor>{song.artist}</SongAuthor>
                
                <InfoRow>
                    <InfoLabel>CCLI:</InfoLabel>
                    <InfoValue>{ccliNumber}</InfoValue>
                </InfoRow>
                
                <YouTubeButton onClick={openYouTube}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.54 6.42C22.4212 5.94541 22.1793 5.51057 21.8387 5.15941C21.498 4.80824 21.0708 4.55318 20.6 4.42C18.88 4 12 4 12 4C12 4 5.12 4 3.4 4.46C2.92922 4.59318 2.50198 4.84824 2.16135 5.19941C1.82072 5.55057 1.57879 5.98541 1.46 6.46C1.14521 8.20556 0.991243 9.97631 1 11.75C0.988687 13.537 1.14266 15.3213 1.46 17.08C1.59096 17.5398 1.83831 17.9581 2.17814 18.2945C2.51798 18.6308 2.93882 18.8738 3.4 19C5.12 19.46 12 19.46 12 19.46C12 19.46 18.88 19.46 20.6 19C21.0708 18.8668 21.498 18.6118 21.8387 18.2606C22.1793 17.9094 22.4212 17.4746 22.54 17C22.8524 15.2676 23.0063 13.5103 23 11.75C23.0113 9.96295 22.8573 8.1787 22.54 6.42Z" fill="white"/>
                        <path d="M9.75 15.02L15.5 11.75L9.75 8.48001V15.02Z" fill="#FF0000"/>
                    </svg>
                    Watch on YouTube
                </YouTubeButton>
            </SongDetails>
        </InfoTabContainer>
    );
};

export default SongInfoTab;
