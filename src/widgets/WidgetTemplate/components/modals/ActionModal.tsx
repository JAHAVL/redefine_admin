import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';

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

    // Calculate position based on trigger element
    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Get the modal width and height (default values if not yet rendered)
            const modalWidth = modalRef.current?.offsetWidth || 250;
            const modalHeight = modalRef.current?.offsetHeight || 200;
            
            // Determine the best position - try to place it to the right of the trigger
            let left = triggerRect.right + 10;
            let top = triggerRect.top;
            let transformOrigin = 'left center';
            
            // If the modal would extend beyond the right edge of the viewport, place it to the left
            if (left + modalWidth > viewportWidth - 20) {
                left = triggerRect.left - modalWidth - 10;
                transformOrigin = 'right center';
                
                // If it also doesn't fit on the left, then center it horizontally
                if (left < 20) {
                    left = Math.max(20, triggerRect.left + (triggerRect.width / 2) - (modalWidth / 2));
                    transformOrigin = 'center top';
                }
            }
            
            // If the modal extends beyond the bottom of the viewport, adjust top position
            if (top + modalHeight > viewportHeight - 20) {
                top = viewportHeight - modalHeight - 20;
                transformOrigin = `${transformOrigin.split(' ')[0]} bottom`;
            }
            
            // Update the position
            setModalPosition({
                top,
                left,
                transformOrigin
            });
            
            // Small delay before making it visible for animation
            setTimeout(() => setIsVisible(true), 50);
        } else {
            setIsVisible(false);
        }
    }, [isOpen, triggerRef]);
    
    // Close on click outside
    useEffect(() => {
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
        
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
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
