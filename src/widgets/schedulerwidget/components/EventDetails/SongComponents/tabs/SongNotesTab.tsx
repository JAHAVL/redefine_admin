import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../../theme/index';
import { SongExpandStateData } from '../../../../types/songInterfaces';

// Types
interface SongNotesTabProps {
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
const NotesContainer = styled.div`
    padding: ${theme.spacing.sm} 0;
    background-color: ${theme.colors.highlight};
    color: ${theme.colors.text.primary};
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    max-width: 100%;
    display: flex;
    flex-direction: column;
`;

const SectionLabel = styled.h4`
    font-size: ${theme.typography.fontSizes.md};
    margin: 0 0 ${theme.spacing.sm} 0;
    color: ${theme.colors.text.primary};
`;

const NoteTypesBar = styled.div`
    display: flex;
    overflow-x: auto;
    gap: ${theme.spacing.sm};
    padding-bottom: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.md};
    border-bottom: 1px solid ${theme.colors.border};
    width: 100%;
    box-sizing: border-box;
    max-width: 100%;
    flex-wrap: nowrap;
    flex-shrink: 0;
    /* Hide scrollbar but allow scrolling */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
    }
    /* Force child elements to shrink if needed */
    & > * {
        flex-shrink: 0;
        white-space: nowrap;
    }
`;

type NoteType = 'vocals' | 'production' | 'band' | 'lighting' | 'audio' | 'general';

interface NoteTypeButtonProps {
    noteType: NoteType;
    active: boolean;
}

const NoteTypeButton = styled.button<NoteTypeButtonProps>`
    padding: ${theme.spacing.xs} ${theme.spacing.md};
    margin-right: ${theme.spacing.xs};
    border-radius: ${theme.borderRadius.sm};
    background-color: ${(props: NoteTypeButtonProps) => props.active ? 
        theme.colors.noteTypes[props.noteType] : 'transparent'
    };
    color: ${(props: NoteTypeButtonProps) => props.active ? 'white' : 
        theme.colors.noteTypes[props.noteType]
    };
    font-size: ${theme.typography.fontSizes.sm};
    font-weight: ${(props: NoteTypeButtonProps) => props.active ? theme.typography.fontWeights.medium : theme.typography.fontWeights.normal};
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
    border: 1px solid ${(props: NoteTypeButtonProps) => props.active ? 'transparent' : 
        theme.colors.noteTypes[props.noteType]
    };
    
    &:hover {
        background-color: ${(props: NoteTypeButtonProps) => props.active ? 
            theme.colors.noteTypesHover[props.noteType] : 'rgba(0, 0, 0, 0.05)'
        };
    }
    
    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
    }
`;

interface NoteSectionProps {
    noteType: NoteType;
}

const NoteSection = styled.div<NoteSectionProps>`
    margin-bottom: ${theme.spacing.lg};
    padding: ${theme.spacing.md};
    background-color: ${theme.colors.highlight};
    border-radius: ${theme.borderRadius.md};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    animation: fadeIn 0.3s ease-in-out;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    max-width: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

const NoteSectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacing.sm};
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    max-width: 100%;
    /* Set a fixed width to prevent content from expanding the container */
    position: relative;
`;

interface NoteSectionTitleProps {
    noteType: NoteType;
}

const NoteSectionTitle = styled.h4<NoteSectionTitleProps>`
    margin: 0;
    font-size: ${theme.typography.fontSizes.md};
    color: ${(props: NoteSectionTitleProps) => theme.colors.noteTypes[props.noteType]};
`;

const NoteSectionActions = styled.div`
    display: flex;
    gap: ${theme.spacing.sm};
    flex-shrink: 0;
    /* Fixed width to prevent expansion */
    width: auto;
    box-sizing: border-box;
`;

interface NoteItemProps {
    noteType: NoteType;
}

const NoteItem = styled.div<NoteItemProps>`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${theme.spacing.md};
    background-color: ${theme.colors.card};
    color: ${theme.colors.text.primary};
    border-radius: ${theme.borderRadius.sm};
    margin-bottom: ${theme.spacing.sm};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-left: 5px solid ${(props: NoteItemProps) => theme.colors.noteTypes[props.noteType]};
    padding: ${theme.spacing.md};
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
    flex-shrink: 0;
`;

const NoteContent = styled.div`
    flex: 1;
    font-size: ${theme.typography.fontSizes.sm};
    line-height: 1.5;
    overflow: hidden;
    max-width: calc(100% - 60px); /* Accommodate for action buttons */
    
    p {
        margin: 0 0 ${theme.spacing.sm} 0;
        word-wrap: break-word;
        overflow-wrap: break-word;
        
        &:last-child {
            margin-bottom: 0;
        }
    }
`;

const NoteActions = styled.div`
    display: flex;
    gap: ${theme.spacing.xs};
    flex-shrink: 0;
`;

const NoteActionButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: ${theme.colors.text.secondary};
    padding: ${theme.spacing.xs};
    border-radius: ${theme.borderRadius.sm};
    
    &:hover {
        color: ${theme.colors.primary};
        background-color: rgba(0, 0, 0, 0.05);
    }
    
    svg {
        width: 16px;
        height: 16px;
    }
`;

const PrimaryButton = styled.button`
    background-color: ${theme.colors.primary};
    color: white;
    border: none;
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-weight: ${theme.typography.fontWeights.semibold};
    cursor: pointer;
    transition: ${theme.transitions.default};
    font-size: ${theme.typography.fontSizes.sm};

    &:hover {
        background-color: ${theme.colors.primaryDark};
    }
`;

const RoundButton = styled.button`
    background-color: ${theme.colors.primary};
    color: white;
    border: none;
    border-radius: ${theme.borderRadius.round};
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: ${theme.transitions.default};
    font-size: ${theme.typography.fontSizes.sm};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    
    &:hover {
        background-color: ${theme.colors.primaryDark};
        transform: translateY(-1px);
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
    }
`

const FileButton = styled.button`
    background: none;
    border: none;
    color: ${theme.colors.primary};
    font-size: ${theme.typography.fontSizes.sm};
    cursor: pointer;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border-radius: ${theme.borderRadius.sm};
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }
`;

interface AddNoteFormProps {
    noteType: NoteType;
}

const AddNoteForm = styled.div<AddNoteFormProps>`
    background-color: ${theme.colors.card};
    color: ${theme.colors.text.primary};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.md};
    margin-top: ${theme.spacing.md};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-left: 5px solid ${(props: AddNoteFormProps) => theme.colors.noteTypes[props.noteType]};
    overflow: hidden;
    width: 100%;
    box-sizing: border-box;
    max-width: 100%;
    flex-shrink: 0;
`;

// Icon components
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

/**
 * SongNotesTab component - Displays and manages notes for a song
 */
const SongNotesTab: React.FC<SongNotesTabProps> = ({ song, songExpandState, setSongExpandState }): React.ReactElement => {
    const activeNoteType: string = songExpandState[song.id]?.activeNoteType || 'vocals';
    
    const setActiveNoteType = (noteType: string): void => {
        const newState: Record<number, SongExpandStateData> = {...songExpandState};
        newState[song.id] = { 
            ...newState[song.id],
            activeNoteType: noteType
        };
        setSongExpandState(newState);
    };
    
    const addNote = (noteType: string): void => {
        const newState: Record<number, SongExpandStateData> = {...songExpandState};
        newState[song.id] = { 
            ...newState[song.id],
            addingNoteType: noteType
        };
        setSongExpandState(newState);
    };
    
    const cancelAddNote = (): void => {
        const newState: Record<number, SongExpandStateData> = {...songExpandState};
        newState[song.id] = { 
            ...newState[song.id],
            addingNoteType: undefined
        };
        setSongExpandState(newState);
    };
    
    const renderNoteContent = (type: string): React.ReactNode => {
        // Content based on note type and song id for variation
        switch(type) {
            case 'vocals':
                return (
                    <p>Lead Vocal: {['John', 'Sarah', 'Mike', 'Lisa'][song.id % 4]}<br />
                    Backing Vocals: {['Alex & Emma', 'David & Rachel', 'Sam & Taylor'][song.id % 3]}</p>
                );
            case 'production':
                return (
                    <p>Pay special attention to the dynamics in the bridge section. 
                    Start soft and build to full volume by the last chorus.</p>
                );
            case 'band':
                return (
                    <p>Lead vocalist will cue the band for the transition from bridge to chorus.</p>
                );
            case 'lighting':
                return (
                    <p>Blue wash for verses, warm amber for chorus, flashing strobes during bridge buildup.</p>
                );
            case 'audio':
                return (
                    <p>Run vocals through compression with medium attack/release. Set gain to -3dB.</p>
                );
            case 'general':
                return (
                    <p>Remember to have water bottles on stage for all performers.</p>
                );
            default:
                return <p>No notes yet.</p>;
        }
    };
    
    return (
        <NotesContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md, width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                <SectionLabel>Song Notes</SectionLabel>
            </div>
            
            <NoteTypesBar>
                <NoteTypeButton 
                    noteType="vocals" 
                    active={activeNoteType === 'vocals'}
                    onClick={() => setActiveNoteType('vocals')}
                >Vocals</NoteTypeButton>
                <NoteTypeButton 
                    noteType="production" 
                    active={activeNoteType === 'production'}
                    onClick={() => setActiveNoteType('production')}
                >Production</NoteTypeButton>
                <NoteTypeButton 
                    noteType="band" 
                    active={activeNoteType === 'band'}
                    onClick={() => setActiveNoteType('band')}
                >Band</NoteTypeButton>
                <NoteTypeButton 
                    noteType="lighting" 
                    active={activeNoteType === 'lighting'}
                    onClick={() => setActiveNoteType('lighting')}
                >Lighting</NoteTypeButton>
                <NoteTypeButton 
                    noteType="audio" 
                    active={activeNoteType === 'audio'}
                    onClick={() => setActiveNoteType('audio')}
                >Audio</NoteTypeButton>
                <NoteTypeButton 
                    noteType="general" 
                    active={activeNoteType === 'general'}
                    onClick={() => setActiveNoteType('general')}
                >General</NoteTypeButton>
            </NoteTypesBar>
            
            {/* Active Note Type Section */}
            <NoteSection noteType={activeNoteType}>
                <NoteSectionHeader>
                    <NoteSectionTitle noteType={activeNoteType}>
                        {activeNoteType.charAt(0).toUpperCase() + activeNoteType.slice(1)}
                    </NoteSectionTitle>
                    <NoteSectionActions>
                        <RoundButton onClick={() => addNote(activeNoteType)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </RoundButton>
                    </NoteSectionActions>
                </NoteSectionHeader>
                <NoteItem noteType={activeNoteType}>
                    <NoteContent>
                        {renderNoteContent(activeNoteType)}
                    </NoteContent>
                    <NoteActions>
                        <NoteActionButton title="Edit"><EditIcon /></NoteActionButton>
                        <NoteActionButton title="Delete"><DeleteIcon /></NoteActionButton>
                    </NoteActions>
                </NoteItem>
            </NoteSection>
            
            {songExpandState[song.id]?.addingNoteType && (
                <AddNoteForm noteType={songExpandState[song.id]?.addingNoteType as NoteType}>
                    {(() => {
                        // Safe extraction of note type with proper capitalization
                        const noteType = songExpandState[song.id]?.addingNoteType || '';
                        const capitalizedNoteType = noteType.length > 0 
                            ? noteType.charAt(0).toUpperCase() + noteType.slice(1)
                            : 'New';
                        
                        return (
                            <h4 style={{ marginTop: 0, marginBottom: theme.spacing.md }}>
                                Add {capitalizedNoteType} Note
                            </h4>
                        );
                    })()} 
                    <textarea 
                        rows={4} 
                        style={{ 
                            width: '100%', 
                            padding: theme.spacing.sm,
                            borderRadius: theme.borderRadius.sm,
                            border: `1px solid ${theme.colors.border}`,
                            marginBottom: theme.spacing.md,
                            backgroundColor: theme.colors.background,
                            color: theme.colors.text.primary,
                            fontSize: theme.typography.fontSizes.sm,
                            fontFamily: theme.typography.fontFamily,
                            resize: 'none',
                            boxSizing: 'border-box',
                            maxWidth: '100%'
                        }}
                        placeholder={`Enter ${songExpandState[song.id]?.addingNoteType || 'note'} details here...`}
                        // Ensures native browser behavior for copy/paste and other keyboard commands
                        onCut={(e) => e.stopPropagation()} 
                        onCopy={(e) => e.stopPropagation()}
                        onPaste={(e) => e.stopPropagation()}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.sm, width: '100%', boxSizing: 'border-box' }}>
                        <FileButton onClick={cancelAddNote}>Cancel</FileButton>
                        <PrimaryButton style={{ padding: `${theme.spacing.xs} ${theme.spacing.md}` }}>Save</PrimaryButton>
                    </div>
                </AddNoteForm>
            )}
        </NotesContainer>
    );
};

export default SongNotesTab;
