import React, { ReactNode, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { theme } from '../../theme';

interface ActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    triggerRef: React.RefObject<HTMLElement>;
    buttonPosition?: {top: number; left: number; right: number; width: number} | null; // Direct position values
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
    z-index: 99999; /* Extremely high z-index to ensure visibility */
    pointer-events: none; /* Allow clicks to pass through the overlay */
`;

const ModalContainer = styled.div<ModalPositionProps & { isVisible: boolean; maxWidth?: string }>`
    position: fixed; /* Use fixed positioning to ensure it's relative to the viewport */
    top: ${(props: ModalPositionProps) => props.top}px;
    left: ${(props: ModalPositionProps) => props.left}px;
    background: rgba(30, 41, 59, 0.95); /* Slightly more opaque background */
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2); /* More visible border */
    border-radius: ${theme.borderRadius.md};
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5); /* Stronger shadow */
    pointer-events: auto; /* Ensure the modal itself can receive clicks */
    z-index: 99999; /* Same extreme z-index as overlay */
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

/**
 * ActionModal - A small modal that appears near the element that triggered it
 * Used for quick actions and selections
 */
const ActionModal: React.FC<ActionModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    triggerRef,
    buttonPosition, // Using direct position values
    maxWidth
}) => {
    const [modalPosition, setModalPosition] = useState<ModalPositionProps>({
        top: 0,
        left: 0,
        transformOrigin: 'top left'
    });
    const [isVisible, setIsVisible] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    // Calculate position based on explicit position values or trigger element
    useEffect(() => {
        if (isOpen) {
            let rect;
            
            // Use buttonPosition if provided, otherwise get rect from triggerRef
            if (buttonPosition) {
                rect = buttonPosition;
                console.log('Using direct position values:', buttonPosition);
            } else if (triggerRef.current) {
                rect = triggerRef.current.getBoundingClientRect();
                console.log('Using triggerRef getBoundingClientRect:', rect);
            } else {
                console.warn('No position reference available');
                return; // Exit if no position reference
            }
            
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Get the modal width and height (default values if not yet rendered)
            const modalWidth = modalRef.current?.offsetWidth || 250;
            const modalHeight = modalRef.current?.offsetHeight || 200;
            
            // Use fixed position adjacent to the button
            // First try positioning to the right of the button
            let left = rect.right + 10; // 10px to the right
            let top = rect.top;
            let transformOrigin = 'left center';
            
            console.log('Initial position calculation:', { left, top });
            
            // If the modal would extend beyond the right edge of the viewport, place it to the left
            if (left + modalWidth > viewportWidth - 20) {
                left = rect.left - modalWidth - 10;
                transformOrigin = 'right center';
                
                // If it also doesn't fit on the left, then center it horizontally
                if (left < 20) {
                    left = Math.max(20, rect.left + (rect.width / 2) - (modalWidth / 2));
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
    }, [isOpen, triggerRef, buttonPosition]);
    
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
    
    // Create portal content - this will render outside any container restrictions
    const modalContent = (
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
    
    // Create a portal to render the modal at the document body level
    // This ensures it's not constrained by any parent container CSS
    return ReactDOM.createPortal(
        modalContent,
        document.body
    );
};

export default ActionModal;
