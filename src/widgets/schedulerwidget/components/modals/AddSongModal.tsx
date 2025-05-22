import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import GlassyModal from './GlassyModal';

interface AddSongModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddSong: (song: {
        title: string;
        artist: string;
        key: string;
        bpm: number;
    }) => void;
}

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    font-weight: ${theme.typography.fontWeights.medium};
    margin-bottom: ${theme.spacing.xs};
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.text.primary};
`;

const Input = styled.input`
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

const ButtonRow = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${theme.spacing.sm};
    margin-top: ${theme.spacing.md};
`;

const Button = styled.button<{ primary?: boolean }>`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border: none;
    border-radius: ${theme.borderRadius.md};
    font-weight: ${theme.typography.fontWeights.medium};
    cursor: pointer;
    transition: ${theme.transitions.default};
    font-size: ${theme.typography.fontSizes.sm};
    
    background-color: ${(props: { primary?: boolean }) => props.primary ? theme.colors.primary : 'transparent'};
    color: ${(props: { primary?: boolean }) => props.primary ? 'white' : theme.colors.text.primary};
    border: ${(props: { primary?: boolean }) => props.primary ? 'none' : `1px solid ${theme.colors.border}`};
    
    &:hover {
        background-color: ${(props: { primary?: boolean }) => props.primary ? theme.colors.primaryDark : 'rgba(0, 0, 0, 0.05)'};
    }
    
    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    }
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const Row = styled.div`
    display: flex;
    gap: ${theme.spacing.md};
    
    @media (max-width: 600px) {
        flex-direction: column;
    }
`;

/**
 * AddSongModal - A glassy modal for adding a new song to an event
 */
const AddSongModal: React.FC<AddSongModalProps> = ({ isOpen, onClose, onAddSong }) => {
    const [title, setTitle] = useState<string>('');
    const [artist, setArtist] = useState<string>('');
    const [key, setKey] = useState<string>('');
    const [bpm, setBpm] = useState<string>('');
    const [errors, setErrors] = useState<{
        title?: string;
        artist?: string;
        key?: string;
        bpm?: string;
    }>({});
    
    const validateForm = (): boolean => {
        const new_errors: {
            title?: string;
            artist?: string;
            key?: string;
            bpm?: string;
        } = {};
        
        if (!title.trim()) {
            new_errors.title = 'Title is required';
        }
        
        if (!artist.trim()) {
            new_errors.artist = 'Artist is required';
        }
        
        if (!key.trim()) {
            new_errors.key = 'Key is required';
        }
        
        const bpm_number = Number(bpm);
        if (isNaN(bpm_number) || bpm_number <= 0) {
            new_errors.bpm = 'BPM must be a positive number';
        }
        
        setErrors(new_errors);
        return Object.keys(new_errors).length === 0;
    };
    
    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        
        if (validateForm()) {
            onAddSong({
                title,
                artist,
                key,
                bpm: Number(bpm)
            });
            
            // Reset form
            setTitle('');
            setArtist('');
            setKey('');
            setBpm('');
            setErrors({});
            
            onClose();
        }
    };
    
    return (
        <GlassyModal isOpen={isOpen} onClose={onClose} title="Add New Song">
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="song-title">Song Title</Label>
                    <Input
                        id="song-title"
                        type="text"
                        value={title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                        placeholder="Enter song title"
                    />
                    {errors.title && <ErrorText>{errors.title}</ErrorText>}
                </FormGroup>
                
                <FormGroup>
                    <Label htmlFor="song-artist">Artist</Label>
                    <Input
                        id="song-artist"
                        type="text"
                        value={artist}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArtist(e.target.value)}
                        placeholder="Enter artist name"
                    />
                    {errors.artist && <ErrorText>{errors.artist}</ErrorText>}
                </FormGroup>
                
                <Row>
                    <FormGroup>
                        <Label htmlFor="song-key">Key</Label>
                        <Input
                            id="song-key"
                            type="text"
                            value={key}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKey(e.target.value)}
                            placeholder="e.g., C, G, Bb"
                        />
                        {errors.key && <ErrorText>{errors.key}</ErrorText>}
                    </FormGroup>
                    
                    <FormGroup>
                        <Label htmlFor="song-bpm">BPM</Label>
                        <Input
                            id="song-bpm"
                            type="number"
                            value={bpm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBpm(e.target.value)}
                            placeholder="e.g., 120"
                        />
                        {errors.bpm && <ErrorText>{errors.bpm}</ErrorText>}
                    </FormGroup>
                </Row>
                
                <ButtonRow>
                    <Button type="button" onClick={onClose}>Cancel</Button>
                    <Button type="submit" primary>Add Song</Button>
                </ButtonRow>
            </Form>
        </GlassyModal>
    );
};

const ErrorText = styled.span`
    color: #FF3B30; /* Standard error color */
    font-size: ${theme.typography.fontSizes.sm};
    margin-top: ${theme.spacing.xs};
`;

export default AddSongModal;
