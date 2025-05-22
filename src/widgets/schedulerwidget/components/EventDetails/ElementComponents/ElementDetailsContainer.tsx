import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../../theme/index';
import ElementFilesTab from './tabs/ElementFilesTab';
import SongNotesTab from '../SongComponents/tabs/SongNotesTab';
import { SongExpandStateData } from '../../../types/songInterfaces';

// Types
interface ElementDetailsContainerProps {
    element: {
        id: number;
        title: string;
        description?: string;
        time?: string;
        duration?: string;
    };
    currentTab: 'info' | 'files' | 'notes';
    setTabForElement: (tab: 'info' | 'files' | 'notes') => void;
    elementExpandState: Record<number, SongExpandStateData>;
    setElementExpandState: React.Dispatch<React.SetStateAction<Record<number, SongExpandStateData>>>;
    onTitleChange?: (title: string) => void;
    onDescriptionChange?: (description: string) => void;
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

const InputContainer = styled.div`
    margin-bottom: ${theme.spacing.md};
    width: 100%;
`;

const Label = styled.label`
    display: block;
    font-size: ${theme.typography.fontSizes.sm};
    font-weight: ${theme.typography.fontWeights.medium};
    margin-bottom: ${theme.spacing.xs};
    color: ${theme.colors.text.primary};
`;

const Input = styled.input`
    width: 100%;
    padding: ${theme.spacing.sm};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    font-size: ${theme.typography.fontSizes.md};
    background-color: ${theme.colors.highlight};
    color: ${theme.colors.text.primary};
    box-sizing: border-box;
    font-family: ${theme.typography.fontFamily};
    
    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
    }
    
    &::placeholder {
        color: ${theme.colors.text.secondary};
        opacity: 0.7;
    }
`;

const Textarea = styled.textarea`
    width: 100%;
    padding: ${theme.spacing.sm};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    font-size: ${theme.typography.fontSizes.md};
    background-color: ${theme.colors.highlight};
    color: ${theme.colors.text.primary};
    box-sizing: border-box;
    min-height: 120px;
    resize: vertical;
    font-family: ${theme.typography.fontFamily};
    
    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
    }
    
    &::placeholder {
        color: ${theme.colors.text.secondary};
        opacity: 0.7;
    }
`;

const TimingContainer = styled.div`
    display: flex;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.md};
`;

const SaveButton = styled.button`
    background-color: ${theme.colors.primary};
    color: white;
    border: none;
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-weight: ${theme.typography.fontWeights.semibold};
    cursor: pointer;
    transition: ${theme.transitions.default};
    margin-top: ${theme.spacing.md};
    
    &:hover {
        background-color: ${theme.colors.primaryDark};
    }
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
 * ElementDetailsContainer component
 * Contains the tabbed interface for viewing and editing element details
 */
const ElementDetailsContainer: React.FC<ElementDetailsContainerProps> = ({
    element,
    currentTab,
    setTabForElement,
    elementExpandState,
    setElementExpandState,
    onTitleChange,
    onDescriptionChange
}): React.ReactElement => {
    // Local state for editing title and description
    const [title, setTitle] = useState<string>(element.title);
    const [description, setDescription] = useState<string>(element.description || '');
    const [time, setTime] = useState<string>(element.time || '');
    const [duration, setDuration] = useState<string>(element.duration || '');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    
    // Create a song-like object for compatibility with existing tab components
    const songLikeElement = {
        id: element.id,
        title: element.title,
        artist: element.description || '',
        key: '', // Not relevant for elements
        bpm: 0   // Not relevant for elements
    };
    
    const handleSave = () => {
        if (onTitleChange) onTitleChange(title);
        if (onDescriptionChange) onDescriptionChange(description);
        setIsEditing(false);
    };

    // Custom info tab with editable fields
    const renderInfoTab = () => {
        return (
            <div>
                {isEditing ? (
                    <>
                        <InputContainer>
                            <Label htmlFor="element-title">Title</Label>
                            <Input 
                                id="element-title"
                                type="text"
                                value={title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                placeholder="Enter element title"
                            />
                        </InputContainer>
                        
                        <InputContainer>
                            <Label htmlFor="element-description">Description</Label>
                            <Textarea 
                                id="element-description"
                                value={description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                placeholder="Enter element description"
                            />
                        </InputContainer>
                        
                        <TimingContainer>
                            <InputContainer>
                                <Label htmlFor="element-time">Scheduled Time</Label>
                                <Input 
                                    id="element-time"
                                    type="text"
                                    value={time}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTime(e.target.value)}
                                    placeholder="e.g. 9:15"
                                />
                            </InputContainer>
                            
                            <InputContainer>
                                <Label htmlFor="element-duration">Duration</Label>
                                <Input 
                                    id="element-duration"
                                    type="text"
                                    value={duration}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuration(e.target.value)}
                                    placeholder="e.g. 5min"
                                />
                            </InputContainer>
                        </TimingContainer>
                        
                        <SaveButton onClick={handleSave}>Save Changes</SaveButton>
                    </>
                ) : (
                    <>
                        <InputContainer>
                            <Label>Title</Label>
                            <div>{element.title}</div>
                        </InputContainer>
                        
                        <InputContainer>
                            <Label>Description</Label>
                            <div>{element.description || 'No description provided'}</div>
                        </InputContainer>
                        
                        <TimingContainer>
                            <InputContainer>
                                <Label>Scheduled Time</Label>
                                <div>{element.time || 'Not specified'}</div>
                            </InputContainer>
                            
                            <InputContainer>
                                <Label>Duration</Label>
                                <div>{element.duration || 'Not specified'}</div>
                            </InputContainer>
                        </TimingContainer>
                        
                        <SaveButton onClick={() => setIsEditing(true)}>Edit Details</SaveButton>
                    </>
                )}
            </div>
        );
    };

    return (
        <Container>
            <TabsRow>
                <TabButton 
                    active={currentTab === 'info'}
                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); setTabForElement('info'); }}
                >
                    Info
                </TabButton>
                <TabButton 
                    active={currentTab === 'files'}
                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); setTabForElement('files'); }}
                >
                    Files
                </TabButton>
                <TabButton 
                    active={currentTab === 'notes'}
                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); setTabForElement('notes'); }}
                >
                    Notes
                </TabButton>
            </TabsRow>
            
            <TabContent>
                {currentTab === 'info' && renderInfoTab()}
                
                {currentTab === 'files' && (
                    <ElementFilesTab 
                        element={element} 
                        elementExpandState={elementExpandState} 
                        setElementExpandState={setElementExpandState} 
                    />
                )}
                
                {currentTab === 'notes' && (
                    <SongNotesTab 
                        song={songLikeElement} 
                        songExpandState={elementExpandState} 
                        setSongExpandState={setElementExpandState} 
                    />
                )}
            </TabContent>
        </Container>
    );
};

export default ElementDetailsContainer;
