import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme';
import ActionModal from './ActionModal';

interface AddItemSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectSong: () => void;
    onSelectElement: () => void;
    onSelectHeader: () => void;
    triggerRef: React.RefObject<HTMLElement>;
}

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
`;

const OptionButton = styled.button`
    display: flex;
    align-items: center;
    padding: ${theme.spacing.md};
    background-color: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: ${theme.borderRadius.md};
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    text-align: left;
    
    &:hover {
        background-color: rgba(255, 255, 255, 0.25);
        transform: translateY(-2px);
    }
    
    &:active {
        transform: translateY(0);
    }
`;

const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    margin-right: ${theme.spacing.md};
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
`;

const OptionContent = styled.div`
    flex: 1;
`;

const OptionTitle = styled.div`
    font-weight: ${theme.typography.fontWeights.medium};
    font-size: ${theme.typography.fontSizes.md};
    margin-bottom: 4px;
`;

const OptionDescription = styled.div`
    font-size: ${theme.typography.fontSizes.sm};
    opacity: 0.8;
`;

/**
 * AddItemSelectionModal - Modal for selecting what type of item to add (song, element, or header)
 */
const AddItemSelectionModal: React.FC<AddItemSelectionModalProps> = ({
    isOpen,
    onClose,
    onSelectSong,
    onSelectElement,
    onSelectHeader,
    triggerRef
}) => {
    const handleSelectSong = (): void => {
        onClose();
        onSelectSong();
    };
    
    const handleSelectElement = (): void => {
        onClose();
        onSelectElement();
    };
    
    const handleSelectHeader = (): void => {
        onClose();
        onSelectHeader();
    };
    
    return (
        <ActionModal
            isOpen={isOpen}
            onClose={onClose}
            title="Add Item"
            triggerRef={triggerRef}
            maxWidth="300px"
        >
            <ModalContent>
                <OptionButton onClick={handleSelectSong}>
                    <IconContainer>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18V5l12-2v13"></path>
                            <circle cx="6" cy="18" r="3"></circle>
                            <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                    </IconContainer>
                    <OptionContent>
                        <OptionTitle>Add Song</OptionTitle>
                        <OptionDescription>Add a song with title, artist, key, and BPM</OptionDescription>
                    </OptionContent>
                </OptionButton>
                
                <OptionButton onClick={handleSelectElement}>
                    <IconContainer>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 4h2a4 4 0 01 4 4v12M9 8h3M9 12h5M9 16h10"></path>
                        </svg>
                    </IconContainer>
                    <OptionContent>
                        <OptionTitle>Add Element</OptionTitle>
                        <OptionDescription>Add an element with title, description, time, and duration</OptionDescription>
                    </OptionContent>
                </OptionButton>
                
                <OptionButton onClick={handleSelectHeader}>
                    <IconContainer>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 8h10M7 12h10M7 16h10"></path>
                        </svg>
                    </IconContainer>
                    <OptionContent>
                        <OptionTitle>Add Section Header</OptionTitle>
                        <OptionDescription>Add a section header to organize your event</OptionDescription>
                    </OptionContent>
                </OptionButton>
            </ModalContent>
        </ActionModal>
    );
};

export default AddItemSelectionModal;
