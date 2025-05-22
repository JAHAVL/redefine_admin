import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import GlassyModal from './GlassyModal';

interface AddHeaderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddHeader: (header: {
        title: string;
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

/**
 * AddHeaderModal - A glassy modal for adding a new section header to an event
 */
const AddHeaderModal: React.FC<AddHeaderModalProps> = ({ isOpen, onClose, onAddHeader }) => {
    const [title, setTitle] = useState<string>('');
    const [errors, setErrors] = useState<{
        title?: string;
    }>({});
    
    const validateForm = (): boolean => {
        const new_errors: {
            title?: string;
        } = {};
        
        if (!title.trim()) {
            new_errors.title = 'Header title is required';
        }
        
        setErrors(new_errors);
        return Object.keys(new_errors).length === 0;
    };
    
    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        
        if (validateForm()) {
            onAddHeader({
                title
            });
            
            // Reset form
            setTitle('');
            setErrors({});
            
            onClose();
        }
    };
    
    return (
        <GlassyModal isOpen={isOpen} onClose={onClose} title="Add Section Header">
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label htmlFor="header-title">Header Title</Label>
                    <Input
                        id="header-title"
                        type="text"
                        value={title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                        placeholder="Enter section header title"
                    />
                    {errors.title && <ErrorText>{errors.title}</ErrorText>}
                </FormGroup>
                
                <ButtonRow>
                    <Button type="button" onClick={onClose}>Cancel</Button>
                    <Button type="submit" primary>Add Header</Button>
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

export default AddHeaderModal;
