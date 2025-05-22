import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import GlassyModal from './GlassyModal';

interface AddElementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddElement: (element: {
        title: string;
        description: string;
        time?: string;
        duration?: string;
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

const Textarea = styled.textarea`
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
 * AddElementModal - A glassy modal for adding a new element to an event
 */
const AddElementModal: React.FC<AddElementModalProps> = ({ isOpen, onClose, onAddElement }) => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [time, setTime] = useState<string>('');
    const [duration, setDuration] = useState<string>('');
    const [errors, setErrors] = useState<{
        title?: string;
        description?: string;
    }>({});
    
    const validateForm = (): boolean => {
        const new_errors: {
            title?: string;
            description?: string;
        } = {};
        
        if (!title.trim()) {
            new_errors.title = 'Title is required';
        }
        
        setErrors(new_errors);
        return Object.keys(new_errors).length === 0;
    };
    
    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        
        if (validateForm()) {
            onAddElement({
                title,
                description,
                time,
                duration
            });
            
            // Reset form
            setTitle('');
            setDescription('');
            setTime('');
            setDuration('');
            setErrors({});
            
            onClose();
        }
    };
    
    return (
        <GlassyModal isOpen={isOpen} onClose={onClose} title="Add New Element">
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="element-title">Element Title</Label>
                    <Input
                        id="element-title"
                        type="text"
                        value={title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                        placeholder="Enter element title"
                    />
                    {errors.title && <ErrorText>{errors.title}</ErrorText>}
                </FormGroup>
                
                <FormGroup>
                    <Label htmlFor="element-description">Description</Label>
                    <Textarea
                        id="element-description"
                        value={description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                        placeholder="Enter element description"
                    />
                    {errors.description && <ErrorText>{errors.description}</ErrorText>}
                </FormGroup>
                
                <Row>
                    <FormGroup>
                        <Label htmlFor="element-time">Scheduled Time</Label>
                        <Input
                            id="element-time"
                            type="text"
                            value={time}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTime(e.target.value)}
                            placeholder="e.g., 9:15 AM"
                        />
                    </FormGroup>
                    
                    <FormGroup>
                        <Label htmlFor="element-duration">Duration</Label>
                        <Input
                            id="element-duration"
                            type="text"
                            value={duration}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDuration(e.target.value)}
                            placeholder="e.g., 5min"
                        />
                    </FormGroup>
                </Row>
                
                <ButtonRow>
                    <Button type="button" onClick={onClose}>Cancel</Button>
                    <Button type="submit" primary>Add Element</Button>
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

export default AddElementModal;
