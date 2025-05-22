import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../../theme/index';

// Types
interface SongArrangementTabProps {
    song: {
        id: number;
        title: string;
        artist: string;
        key: string;
        bpm: number;
    };
    // Add callbacks to update arrangement and key in parent component
    onArrangementChange?: (arrangement: string) => void;
    onKeyChange?: (key: string) => void;
}

// Styled components
const ArrangementContainer = styled.div`
    padding: ${theme.spacing.sm} 0;
    background-color: ${theme.colors.highlight};
    color: ${theme.colors.text.primary};
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    max-width: 100%;
`;

const ArrangementControls = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.md};
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    max-width: 100%;
    /* Force items to respect container width */
    & > * {
        min-width: 0;
        max-width: 100%;
        overflow: hidden;
    }
`;

const ControlGroup = styled.div`
    display: flex;
    flex-direction: column;
`;

const ControlLabel = styled.label`
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing.xs};
`;

const Select = styled.select`
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.sm};
    border: 1px solid ${theme.colors.border};
    font-size: ${theme.typography.fontSizes.md};
    min-width: 150px;
    background-color: ${theme.colors.background};
    color: ${theme.colors.text.primary};
`;

const Input = styled.input`
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.sm};
    border: 1px solid ${theme.colors.border};
    font-size: ${theme.typography.fontSizes.md};
    background-color: ${theme.colors.background};
    color: ${theme.colors.text.primary};
    min-width: 80px;
    font-family: ${theme.typography.fontFamily};
`;

const SectionLabel = styled.h4`
    font-size: ${theme.typography.fontSizes.md};
    margin: ${theme.spacing.md} 0 ${theme.spacing.sm} 0;
    color: ${theme.colors.text.primary};
`;

const SectionTagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.spacing.sm};
    margin-top: ${theme.spacing.sm};
`;

type SectionType = 'Intro' | 'Outro' | 'Verse' | 'Chorus' | 'Bridge' | 'Default';

interface SectionTagProps {
    type: SectionType;
}

const SectionTag = styled.div<SectionTagProps>`
    background-color: ${(props: SectionTagProps) => {
        const sectionType = props.type.toLowerCase() as keyof typeof theme.colors.sectionTypes;
        return theme.colors.sectionTypes[sectionType]?.background || theme.colors.sectionTypes.default.background;
    }};
    color: ${(props: SectionTagProps) => {
        const sectionType = props.type.toLowerCase() as keyof typeof theme.colors.sectionTypes;
        return theme.colors.sectionTypes[sectionType]?.text || theme.colors.sectionTypes.default.text;
    }};
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.sm};
    font-weight: ${theme.typography.fontWeights.semibold};
    margin-right: ${theme.spacing.sm};
    flex-shrink: 0;
    min-width: 80px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(0, 0, 0, 0.1);
    cursor: pointer;
    
    &:hover {
        opacity: 0.9;
    }
`;

/**
 * SongArrangementTab component - Displays and manages song arrangement
 */
const SongArrangementTab: React.FC<SongArrangementTabProps> = ({ song, onArrangementChange, onKeyChange }): React.ReactElement => {
    // Handle arrangement change
    const handleArrangementChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const selectedArrangement = e.target.value;
        // Capitalize first letter
        const formattedArrangement = selectedArrangement.charAt(0).toUpperCase() + selectedArrangement.slice(1);
        
        if (onArrangementChange) {
            onArrangementChange(formattedArrangement);
        }
    };
    
    // Handle key change
    const handleKeyChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        if (onKeyChange) {
            onKeyChange(e.target.value);
        }
    };
    
    return (
        <ArrangementContainer>
            <ArrangementControls>
                <ControlGroup>
                    <ControlLabel>Arrangement</ControlLabel>
                    <Select onChange={handleArrangementChange} defaultValue="standard">
                        <option value="standard">Standard</option>
                        <option value="extended">Extended</option>
                        <option value="shortened">Shortened</option>
                        <option value="acoustic">Acoustic</option>
                        <option value="custom">Custom</option>
                    </Select>
                </ControlGroup>
                
                <ControlGroup>
                    <ControlLabel>Key</ControlLabel>
                    <Select defaultValue={song.key} onChange={handleKeyChange}>
                        <option value="A">A</option>
                        <option value="A#">A#/Bb</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="C#">C#/Db</option>
                        <option value="D">D</option>
                        <option value="D#">D#/Eb</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="F#">F#/Gb</option>
                        <option value="G">G</option>
                        <option value="G#">G#/Ab</option>
                    </Select>
                </ControlGroup>
                
                <ControlGroup>
                    <ControlLabel>Length</ControlLabel>
                    <Input type="text" defaultValue={`${song.id % 3 + 2}:30`} placeholder="0:00" />
                </ControlGroup>
            </ArrangementControls>
            
            <SectionLabel>Song Sections</SectionLabel>
            
            <SectionTagsContainer>
                <SectionTag type="Intro">Intro</SectionTag>
                <SectionTag type="Verse">Verse 1</SectionTag>
                <SectionTag type="Chorus">Chorus</SectionTag>
                <SectionTag type="Verse">Verse 2</SectionTag>
                <SectionTag type="Chorus">Chorus</SectionTag>
                <SectionTag type="Bridge">Bridge</SectionTag>
                <SectionTag type="Bridge">Bridge</SectionTag>
                <SectionTag type="Chorus">Chorus</SectionTag>
                <SectionTag type="Outro">Outro</SectionTag>
            </SectionTagsContainer>
        </ArrangementContainer>
    );
};

export default SongArrangementTab;
