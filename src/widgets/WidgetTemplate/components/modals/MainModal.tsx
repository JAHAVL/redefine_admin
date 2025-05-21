import React, { ReactNode, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';

/**
 * MainModal - Large centered modal for content-heavy forms and detailed interactions
 * Used for input forms, detailed content entry, and complex interactions
 */

export interface MainModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    width?: string;
    showCloseButton?: boolean;
    onSubmit?: () => void;
    submitLabel?: string;
    cancelLabel?: string;
    hideFooter?: boolean;
}

const ModalOverlay = styled.div<{ isVisible: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: ${(props: { isVisible: boolean }) => (props.isVisible ? 1 : 0)};
    visibility: ${(props: { isVisible: boolean }) => (props.isVisible ? 'visible' : 'hidden')};
    transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const ModalContainer = styled.div<{ width?: string; isVisible: boolean }>`
    background: ${theme.colors.card};
    border-radius: ${theme.borderRadius.md};
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    min-width: 320px;
    width: ${(props: { width?: string }) => props.width || '600px'};
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform: ${(props: { isVisible: boolean }) => 
        props.isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)'};
    transition: transform 0.3s ease;
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    border-bottom: 1px solid ${theme.colors.border};
`;

const ModalTitle = styled.h3`
    margin: 0;
    font-size: ${theme.typography.fontSizes.lg};
    font-weight: ${theme.typography.fontWeights.semibold};
    color: ${theme.colors.text.primary};
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    color: ${theme.colors.text.secondary};
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        color: ${theme.colors.text.primary};
    }
`;

const ModalBody = styled.div`
    padding: ${theme.spacing.lg};
    overflow-y: auto;
    flex: 1;
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    border-top: 1px solid ${theme.colors.border};
    gap: ${theme.spacing.md};
`;

const Button = styled.button<{ primary?: boolean }>`
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    border-radius: ${theme.borderRadius.md};
    font-size: ${theme.typography.fontSizes.sm};
    font-weight: ${theme.typography.fontWeights.medium};
    cursor: pointer;
    transition: all 0.2s ease;
    
    background-color: ${(props: { primary?: boolean }) => 
        props.primary ? theme.colors.primary : 'transparent'};
    color: ${(props: { primary?: boolean }) => 
        props.primary ? 'white' : theme.colors.text.primary};
    border: ${(props: { primary?: boolean }) => 
        props.primary ? 'none' : `1px solid ${theme.colors.border}`};
    
    &:hover {
        background-color: ${(props: { primary?: boolean }) => 
            props.primary 
                ? theme.colors.primaryDark 
                : 'rgba(0, 0, 0, 0.05)'};
    }
    
    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px ${theme.colors.primaryLight};
    }
`;

const MainModal: React.FC<MainModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    width,
    showCloseButton = true,
    onSubmit,
    submitLabel = "Save",
    cancelLabel = "Cancel",
    hideFooter = false
}) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    
    // Handle animation states
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        
        if (isOpen) {
            // Short delay for the entrance animation
            timeoutId = setTimeout(() => setIsVisible(true), 50);
        } else {
            setIsVisible(false);
        }
        
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isOpen]);
    
    // Close on ESC key press
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);
    
    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);
    
    if (!isOpen) return null;
    
    return (
        <ModalOverlay isVisible={isVisible}>
            <ModalContainer ref={modalRef} width={width} isVisible={isVisible}>
                <ModalHeader>
                    <ModalTitle>{title}</ModalTitle>
                    {showCloseButton && (
                        <CloseButton onClick={onClose}>&times;</CloseButton>
                    )}
                </ModalHeader>
                
                <ModalBody>
                    {children}
                </ModalBody>
                
                {!hideFooter && (
                    <ModalFooter>
                        <Button onClick={onClose}>
                            {cancelLabel}
                        </Button>
                        {onSubmit && (
                            <Button primary onClick={onSubmit}>
                                {submitLabel}
                            </Button>
                        )}
                    </ModalFooter>
                )}
            </ModalContainer>
        </ModalOverlay>
    );
};

export default MainModal;
