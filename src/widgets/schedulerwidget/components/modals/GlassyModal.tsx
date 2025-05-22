import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';

interface GlassyModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    width?: string;
    maxWidth?: string;
}

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContainer = styled.div<{ width?: string }>`
    background: ${theme.colors.card};
    border-radius: ${theme.borderRadius.md};
    padding: 0;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    min-width: 320px;
    width: ${(props: { width?: string }) => props.width || '500px'};
    max-width: 90%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    border: 1px solid rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    overflow: hidden;
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    border-bottom: 1px solid ${theme.colors.border};
    background-color: rgba(255, 255, 255, 0.1);
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
    font-size: 1.5rem;
    cursor: pointer;
    color: ${theme.colors.text.secondary};
    transition: color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    
    &:hover {
        color: ${theme.colors.text.primary};
        background-color: rgba(0, 0, 0, 0.05);
    }
`;

const ModalContent = styled.div<{ width?: string; maxWidth?: string }>`
    padding: ${theme.spacing.lg};
    overflow-y: auto;
    width: ${(props: { width?: string }) => props.width || 'auto'};
    max-width: ${(props: { maxWidth?: string }) => props.maxWidth || '100%'};
`;

const GlassyModal: React.FC<GlassyModalProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    children,
    width,
    maxWidth
}) => {
    if (!isOpen) return null;
    
    return (
        <ModalOverlay onClick={onClose}>
            <ModalContainer 
                width={width}
                onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                <ModalHeader>
                    <ModalTitle>{title}</ModalTitle>
                    <CloseButton onClick={onClose}>×</CloseButton>
                </ModalHeader>
                <ModalContent width={width} maxWidth={maxWidth}>
                    {children}
                </ModalContent>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default GlassyModal;
