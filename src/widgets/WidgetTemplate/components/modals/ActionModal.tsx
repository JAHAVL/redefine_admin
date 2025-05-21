import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

// Define theme locally since the import path is causing issues
const theme = {
    colors: {
        text: {
            white: '#FFFFFF'
        }
    },
    spacing: {
        sm: '8px',
        md: '16px'
    },
    borderRadius: {
        md: '8px'
    },
    typography: {
        fontSizes: {
            md: '14px'
        },
        fontWeights: {
            medium: 500
        }
    }
};

/**
 * ActionModal - Small modal that appears near the triggering element
 * Used for quick actions, selections, or confirmations
 */

export interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    triggerRef: React.RefObject<HTMLElement>;
    maxWidth?: string;
}

interface ModalPositionProps {
    top: number;
    left: number;
    transformOrigin: string;
}

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: transparent;
    display: flex;
    z-index: 1000;
`;

const ModalContainer = styled.div<ModalPositionProps & { isVisible: boolean; maxWidth?: string }>`
    position: absolute;
    top: ${(props: ModalPositionProps) => props.top}px;
    left: ${(props: ModalPositionProps) => props.left}px;
    background: rgba(30, 41, 59, 0.85);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: ${theme.borderRadius.md};
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    min-width: 200px;
    max-width: ${(props: { maxWidth?: string }) => props.maxWidth || '300px'};
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: opacity 0.2s ease, transform 0.2s ease;
    opacity: ${(props: { isVisible: boolean }) => (props.isVisible ? 1 : 0)};
    transform: ${(props: { isVisible: boolean }) => (props.isVisible ? 'scale(1)' : 'scale(0.95)')};
    transform-origin: ${(props: ModalPositionProps) => props.transformOrigin};
    color: white;
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ModalTitle = styled.h4`
    margin: 0;
    font-size: ${theme.typography.fontSizes.md};
    font-weight: ${theme.typography.fontWeights.medium};
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    
    &:hover {
        opacity: 1;
    }
`;

const ModalContent = styled.div`
    padding: ${theme.spacing.md};
`;

const ActionModal: React.FC<ActionModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    triggerRef,
    maxWidth
}) => {
    const [modalPosition, setModalPosition] = useState<ModalPositionProps>({
        top: 0,
        left: 0,
        transformOrigin: 'top left'
    });
    const [isVisible, setIsVisible] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    // Position the modal directly adjacent to the button
    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const calculatePosition = () => {
                if (!triggerRef.current || !modalRef.current) return;
                
                const triggerRect = triggerRef.current.getBoundingClientRect();
                const modalRect = modalRef.current.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                // Try to position the modal to the right of the button first
                let left = triggerRect.right + 3; // Very close to the button
                let top = triggerRect.top;
                let transformOrigin = 'left center';
                
                // If there's not enough space on the right, try left side
                if (left + modalRect.width > viewportWidth - 10) {
                    left = triggerRect.left - modalRect.width - 3;
                    transformOrigin = 'right center';
                    
                    // If there's also not enough space on the left, position below
                    if (left < 10) {
                        left = Math.max(10, triggerRect.left);
                        top = triggerRect.bottom + 3;
                        transformOrigin = 'top left';
                        
                        // If there's not enough space below, try above
                        if (top + modalRect.height > viewportHeight - 10) {
                            top = triggerRect.top - modalRect.height - 3;
                            transformOrigin = 'bottom left';
                        }
                    }
                }
                
                // Final boundary checks
                if (top < 10) top = 10;
                if (top + modalRect.height > viewportHeight - 10) {
                    top = viewportHeight - modalRect.height - 10;
                }
                
                setModalPosition({
                    top,
                    left,
                    transformOrigin
                });
            };
            
            // Calculate position immediately and then again after a short delay
            // This double calculation helps ensure accurate positioning with dynamically sized content
            calculatePosition();
            const timer = setTimeout(() => {
                calculatePosition();
                setIsVisible(true);
            }, 50);
            
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [isOpen, triggerRef]);
    
    // Close on click outside
    useEffect(() => {
        if (!isOpen) return;
        
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node) &&
                triggerRef.current !== event.target &&
                !triggerRef.current?.contains(event.target as Node)
            ) {
                onClose();
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose, triggerRef]);
    
    if (!isOpen) return null;
    
    return (
        <ModalOverlay>
            <ModalContainer
                ref={modalRef}
                top={modalPosition.top}
                left={modalPosition.left}
                transformOrigin={modalPosition.transformOrigin}
                isVisible={isVisible}
                maxWidth={maxWidth}
            >
                {title && (
                    <ModalHeader>
                        <ModalTitle>{title}</ModalTitle>
                        <CloseButton onClick={onClose}>&times;</CloseButton>
                    </ModalHeader>
                )}
                <ModalContent>
                    {children}
                </ModalContent>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default ActionModal;
