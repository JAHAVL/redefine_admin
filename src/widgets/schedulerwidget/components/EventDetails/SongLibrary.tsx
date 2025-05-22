import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { ReactSortable } from 'react-sortablejs';
import { theme } from '../../theme';
import { ActionModal } from '../../../WidgetTemplate/components/modals';

// Import the proper SortableEvent type from sortablejs
import Sortable, { SortableEvent } from 'sortablejs';

// Type definitions for songs
interface Song {
    id: number;
    title: string;
    artist: string;
    key?: string;
    bpm?: number;
}

// Filter options interface
interface FilterOptions {
    artist: string | null;
    key: string | null;
    bpmRange: [number | null, number | null];
}

// Props for the SongLibrary component
interface SongLibraryProps {
    onDragStart?: (song: Song) => void;
    onDragEnd?: (song: Song, evt?: SortableEvent) => void;
}

// Styled components
const LibraryContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
`;

const SearchContainer = styled.div`
    margin-bottom: ${theme.spacing.md};
    position: relative;
    display: flex;
    gap: ${theme.spacing.sm};
`;

const SearchInput = styled.input`
    flex: 1;
    padding: ${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.sm} 2.5rem;
    background: ${theme.colors.background};
    color: ${theme.colors.text.primary};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    font-size: ${theme.typography.fontSizes.md};
    outline: none;
    
    &:focus {
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
    }
`;

const SearchIconWrapper = styled.div`
    position: absolute;
    left: ${theme.spacing.sm};
    top: 50%;
    transform: translateY(-50%);
    color: ${theme.colors.text.secondary};
    pointer-events: none;
`;

const FilterButtonElement = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    background: ${theme.colors.background};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    color: ${theme.colors.text.primary};
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: ${theme.colors.highlight};
    }
    
    &:active {
        transform: translateY(1px);
    }
`;

const FilterModalContainer = styled.div<{ isOpen: boolean }>`
    position: absolute;
    top: calc(100% + ${theme.spacing.sm});
    right: 0;
    width: 250px;
    background: ${theme.colors.card};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
    padding: ${theme.spacing.md};
    display: ${(props: { isOpen: boolean }) => props.isOpen ? 'block' : 'none'};
`;

const FilterOptionButton = styled.button<{ active: boolean }>`
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    background: ${(props: { active: boolean }) => props.active ? theme.colors.primary : theme.colors.background};
    color: ${(props: { active: boolean }) => props.active ? theme.colors.text.white : theme.colors.text.primary};
    border: 1px solid ${(props: { active: boolean }) => props.active ? theme.colors.primary : theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    cursor: pointer;
    font-size: ${theme.typography.fontSizes.sm};
    transition: all 0.2s ease;
    
    &:hover {
        background: ${(props: { active: boolean }) => props.active ? theme.colors.primary : theme.colors.highlight};
    }
`;

const SongsListContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    padding-right: ${theme.spacing.sm};
    
    /* Custom scrollbar */
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: ${theme.colors.background};
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: ${theme.colors.border};
        border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
        background: ${theme.colors.secondary};
    }
`;

const SongItem = styled.div`
    padding: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.sm};
    background: ${theme.colors.card};
    border-radius: ${theme.borderRadius.md};
    border: 1px solid ${theme.colors.border};
    cursor: grab;
    transition: all 0.2s ease;
    font-size: ${theme.typography.fontSizes.md};
    color: ${theme.colors.text.primary};
    
    &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
        border-color: ${theme.colors.primary};
    }
    
    &:active {
        cursor: grabbing;
    }
    
    &.sortable-drag {
        cursor: grabbing !important;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
        opacity: 0.9;
        background: ${theme.colors.highlight};
    }
    
    &.sortable-ghost {
        opacity: 0.4;
        background: ${theme.colors.highlight};
    }
`;

const SongTitle = styled.h3`
    font-size: ${theme.typography.fontSizes.md};
    font-weight: ${theme.typography.fontWeights.semibold};
    margin: 0 0 ${theme.spacing.xs} 0;
    color: ${theme.colors.text.primary};
`;

const SongArtist = styled.p`
    font-size: ${theme.typography.fontSizes.sm};
    margin: 0 0 ${theme.spacing.xs} 0;
    color: ${theme.colors.text.secondary};
`;

const SongDetails = styled.div`
    display: flex;
    gap: ${theme.spacing.md};
    font-size: ${theme.typography.fontSizes.xs};
    color: ${theme.colors.text.secondary};
`;

const SongDetail = styled.span`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.xs};
`;

const NoResults = styled.div`
    padding: ${theme.spacing.lg};
    text-align: center;
    color: ${theme.colors.text.secondary};
    font-style: italic;
`;

const CountBadge = styled.span`
    display: inline-block;
    padding: 2px 6px;
    background: ${theme.colors.background};
    color: ${theme.colors.text.secondary};
    border-radius: 12px;
    font-size: ${theme.typography.fontSizes.xs};
    margin-left: ${theme.spacing.xs};
`;

// Mock data for songs (would be fetched from API in real implementation)
const mockSongs: Song[] = [
    { id: 1, title: 'Amazing Grace', artist: 'John Newton', key: 'G', bpm: 68 },
    { id: 2, title: 'How Great Is Our God', artist: 'Chris Tomlin', key: 'C', bpm: 78 },
    { id: 3, title: 'Cornerstone', artist: 'Hillsong', key: 'D', bpm: 72 },
    { id: 4, title: 'Good Good Father', artist: 'Chris Tomlin', key: 'A', bpm: 70 },
    { id: 5, title: 'Oceans', artist: 'Hillsong United', key: 'D', bpm: 63 },
    { id: 6, title: 'What A Beautiful Name', artist: 'Hillsong Worship', key: 'D', bpm: 68 },
    { id: 7, title: '10,000 Reasons', artist: 'Matt Redman', key: 'G', bpm: 73 },
    { id: 8, title: 'Blessed Be Your Name', artist: 'Matt Redman', key: 'A', bpm: 140 },
    { id: 9, title: 'Build My Life', artist: 'Housefires', key: 'C', bpm: 65 },
    { id: 10, title: 'Raise A Hallelujah', artist: 'Bethel Music', key: 'G', bpm: 82 },
    { id: 11, title: 'Way Maker', artist: 'Sinach', key: 'E', bpm: 68 },
    { id: 12, title: 'Holy Spirit', artist: 'Francesca Battistelli', key: 'D', bpm: 72 }
];

/**
 * SongLibrary component to display, search, filter, and drag songs
 * Shows only song titles and provides a filter button with modal
 */
const SongLibrary: React.FC<SongLibraryProps> = ({ onDragStart, onDragEnd }) => {
    // State for search term and filter modal
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
    const filterButtonRef = useRef<HTMLButtonElement>(null);
    const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    
    // Filter songs based on search term and selected artist
    const filteredSongs = useMemo<Song[]>(() => {
        return mockSongs.filter(song => {
            // Filter by search term (title only)
            const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Filter by artist if selected
            const matchesArtist = !selectedArtist || song.artist === selectedArtist;
            
            return matchesSearch && matchesArtist;
        });
    }, [searchTerm, selectedArtist]);
    
    // Close filter modal when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
            setIsFilterModalOpen(false);
        }
    };
    
    // Add event listener for clicks outside modal
    React.useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };
    
    // Toggle filter modal
    const toggleFilterModal = () => {
        setIsFilterModalOpen(!isFilterModalOpen);
    };
    
    // Handle selecting an artist filter
    const handleArtistSelect = (artist: string | null) => {
        setSelectedArtist(artist);
        setIsFilterModalOpen(false);
    };
    
    // Extract unique artists for filter modal
    const uniqueArtists = useMemo(() => {
        const artists = new Set(mockSongs.map(song => song.artist));
        return Array.from(artists);
    }, []);
    
    // Create sortable items for ReactSortable
    const sortableItems = filteredSongs.map(song => ({
        chosen: false,
        selected: false,
        ...song // This spreads all song properties including id
    }));
    
    // Handle drag start with enhanced fallback element styling
    const handleOnStart = (evt: SortableEvent, sortable: Sortable | null = null, store: any = null): void => {
        // Add visual feedback for the original item
        if (evt.item) {
            evt.item.style.opacity = '0.5';
        }
        
        // Get the song data for the dragged item
        let song: Song | undefined;
        if (evt.oldIndex !== undefined) {
            song = filteredSongs[evt.oldIndex];
            
            // Notify parent components
            if (onDragStart && song) {
                onDragStart(song);
            }
        }
        
        // We need to style the fallback element that SortableJS creates
        // Use setTimeout to ensure the fallback element is in the DOM
        setTimeout(() => {
            const fallbackElement = document.querySelector('.sortable-fallback') as HTMLElement;
            if (fallbackElement && song) {
                // Make sure all the fallback styling is exactly matching target appearance
                fallbackElement.style.position = 'fixed'; // Better positioning during drag
                fallbackElement.style.pointerEvents = 'none';
                fallbackElement.style.opacity = '1';
                fallbackElement.style.margin = '0';
                fallbackElement.style.background = theme.colors.card;
                fallbackElement.style.border = `1px solid ${theme.colors.primary}`;
                fallbackElement.style.borderRadius = theme.borderRadius.md;
                fallbackElement.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
                fallbackElement.style.width = '300px'; // Match the exact width
                fallbackElement.style.padding = theme.spacing.md;
                fallbackElement.style.boxSizing = 'border-box';
                fallbackElement.style.zIndex = '10000';
                fallbackElement.style.transition = 'none';
                fallbackElement.style.transform = 'translate3d(0,0,0)'; // Force hardware acceleration
                fallbackElement.style.willChange = 'transform'; // Optimize for animations
                fallbackElement.style.height = 'auto'; // Let height be determined by content
                
                // Calculate values for display
                const songKey = song.key || 'C';
                const leadVocalist = ['John', 'Sarah', 'Mike', 'Lisa'][song.id % 4];
                
                // Set rich content that EXACTLY matches the left-side songs
                fallbackElement.innerHTML = `
                    <div style="display: flex; align-items: center;">
                        <div style="
                            color: ${theme.colors.primary};
                            margin-right: 10px;
                            font-size: 12px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">▶</div>
                        
                        <div style="flex: 1;">
                            <div style="
                                font-weight: 600;
                                font-size: 14px;
                                margin-bottom: 4px;
                                color: ${theme.colors.text.primary};
                            ">${song.title}</div>
                            
                            <div style="
                                font-size: 12px;
                                color: ${theme.colors.text.secondary};
                                display: flex;
                                align-items: center;
                            ">
                                <span>${song.artist}</span>
                                <span style="margin: 0 4px;">|</span>
                                <span>Key: ${songKey}</span>
                                ${song.bpm ? `<span style="margin: 0 4px;">|</span><span>BPM: ${song.bpm}</span>` : ''}
                            </div>
                        </div>
                        
                        <div style="
                            font-size: 12px;
                            padding: 2px 8px;
                            background-color: ${theme.colors.primaryLight};
                            color: white;
                            border-radius: 4px;
                            margin-left: 8px;
                            white-space: nowrap;
                        ">Lead: ${leadVocalist}</div>
                    </div>
                `;
            }
        }, 0);
    };
    
    const handleOnEnd = (evt: SortableEvent, sortable: Sortable | null = null, store: any = null): void => {
        // Reset opacity when drag ends
        if (evt.item) {
            evt.item.style.opacity = '1';
        }
        
        if (onDragEnd && evt.oldIndex !== undefined) {
            const song = filteredSongs[evt.oldIndex];
            
            // Pass both the song and the event to the callback so the drop position can be used
            if (song) {
                // Check if the song was dropped in a different list
                if (evt.to && evt.to !== evt.from) {
                    console.log(`Song added to position ${evt.newIndex} in target list`);
                    // Pass the event object to onDragEnd so the parent can use newIndex
                    onDragEnd(song, evt);
                } else {
                    onDragEnd(song);
                }
            }
        }
    };
    
    return (
        <LibraryContainer>
            <SearchContainer ref={searchContainerRef}>
                <SearchIconWrapper>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </SearchIconWrapper>
                <SearchInput 
                    placeholder="Search songs..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <FilterButtonElement ref={filterButtonRef} onClick={toggleFilterModal}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                </FilterButtonElement>
                
                {/* Use proper ActionModal for filtering */}
                <ActionModal
                    isOpen={isFilterModalOpen}
                    onClose={() => setIsFilterModalOpen(false)}
                    title="Filter Songs"
                    triggerRef={filterButtonRef}
                    maxWidth="300px"
                >
                    <div style={{ marginBottom: theme.spacing.md }}>
                        <FilterOptionButton 
                            active={selectedArtist === null}
                            onClick={() => handleArtistSelect(null)}
                        >
                            All Artists
                        </FilterOptionButton>
                        
                        {uniqueArtists.map(artist => (
                            <div key={artist} style={{ marginTop: theme.spacing.xs }}>
                                <FilterOptionButton 
                                    active={selectedArtist === artist}
                                    onClick={() => handleArtistSelect(artist)}
                                >
                                    {artist}
                                </FilterOptionButton>
                            </div>
                        ))}
                    </div>
                </ActionModal>
            </SearchContainer>
            
            <SongsListContainer>
                {filteredSongs.length === 0 ? (
                    <NoResults>No songs matching your search</NoResults>
                ) : (
                    <ReactSortable
                        list={sortableItems}
                        setList={() => {}}
                        animation={200}
                        delay={0}
                        group={{
                            name: 'draggable-items',
                            pull: 'clone',
                            put: false,
                            revertClone: false
                        }}
                        sort={false}
                        onStart={handleOnStart}
                        onEnd={handleOnEnd}
                        ghostClass="sortable-ghost"
                        chosenClass="sortable-chosen"
                        dragClass="sortable-drag"
                        // Critical settings for drag behavior
                        forceFallback={true}
                        fallbackClass="sortable-fallback"
                        fallbackOnBody={true}
                        // Zero tolerance for immediate response to drag
                        fallbackTolerance={0}
                        // Enhanced settings to ensure the drag element follows the cursor precisely
                        scrollSensitivity={100}
                        scrollSpeed={30}
                        dragoverBubble={true}
                        removeCloneOnHide={false}
                        // Custom drag image styling
                        setData={(dataTransfer, dragEl) => {
                            // Don't set drag data to ensure fallback is used
                            dataTransfer.effectAllowed = 'copyMove';
                        }}
                        // Customize the fallback element to look like the destination songs
                        onChoose={(evt) => {
                            if (evt.oldIndex !== undefined && evt.item) {
                                const song = filteredSongs[evt.oldIndex];
                                // Store song data for the fallback creation
                                evt.item.dataset.songId = song.id.toString();
                                evt.item.dataset.songTitle = song.title;
                                evt.item.dataset.songArtist = song.artist;
                                evt.item.dataset.songKey = song.key || 'C';
                            }
                        }}
                    >
                        {sortableItems.map(song => (
                            <SongItem key={song.id}>
                                {song.title}
                            </SongItem>
                        ))}
                    </ReactSortable>
                )}
            </SongsListContainer>
        </LibraryContainer>
    );
};

export default SongLibrary;
