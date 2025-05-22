import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../theme';

interface FloatingActionButtonsProps {
    onAddSong: () => void;
    onAddElement: () => void;
    onAddHeader: () => void;
}

const FABContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    z-index: 5;
    margin-top: 16px;
`;

const MainButton = styled.button`
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: ${theme.colors.primary};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: ${theme.transitions.default};
    z-index: 102;
    
    &:hover {
        background-color: ${theme.colors.primaryDark};
        transform: scale(1.05);
    }
    
    &:active {
        transform: scale(0.95);
    }
    
    svg {
        width: 24px;
        height: 24px;
    }
`;

interface SubButtonProps {
    visible: boolean;
    index: number;
}

const SubButton = styled.button<SubButtonProps>`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: white;
    color: ${theme.colors.text.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    position: absolute;
    bottom: ${(props: SubButtonProps) => props.visible ? `${70 + 56 * props.index}px` : '0'};
    opacity: ${(props: SubButtonProps) => props.visible ? 1 : 0};
    transform: ${(props: SubButtonProps) => props.visible ? 'scale(1)' : 'scale(0)'};
    transition: all 0.2s ease-in-out;
    z-index: 101;
    
    &:hover {
        background-color: #f5f5f5;
        transform: ${(props: SubButtonProps) => props.visible ? 'scale(1.05)' : 'scale(0)'};
    }
    
    svg {
        width: 20px;
        height: 20px;
    }
`;

const ButtonLabel = styled.span<{ visible: boolean }>`
    position: absolute;
    right: 60px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: ${theme.typography.fontSizes.sm};
    white-space: nowrap;
    opacity: ${(props: { visible: boolean }) => props.visible ? 1 : 0};
    transform: ${(props: { visible: boolean }) => props.visible ? 'translateX(0)' : 'translateX(10px)'};
    transition: all 0.2s ease-in-out;
`;

/**
 * FloatingActionButtons - Component that displays a main action button that expands to show
 * buttons for adding songs, elements, and headers
 */
const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
    onAddSong,
    onAddElement,
    onAddHeader
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeLabel, setActiveLabel] = useState<string | null>(null);
    
    return (
        <FABContainer>
            {/* Song Button */}
            <SubButton 
                visible={isExpanded} 
                index={2}
                onClick={() => {
                    setIsExpanded(false);
                    onAddSong();
                }}
                onMouseEnter={() => setActiveLabel('Add Song')}
                onMouseLeave={() => setActiveLabel(null)}
            >
                <ButtonLabel visible={activeLabel === 'Add Song'}>Add Song</ButtonLabel>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                </svg>
            </SubButton>
            
            {/* Element Button */}
            <SubButton 
                visible={isExpanded} 
                index={1}
                onClick={() => {
                    setIsExpanded(false);
                    onAddElement();
                }}
                onMouseEnter={() => setActiveLabel('Add Element')}
                onMouseLeave={() => setActiveLabel(null)}
            >
                <ButtonLabel visible={activeLabel === 'Add Element'}>Add Element</ButtonLabel>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 4h2a4 4 0 01 4 4v12M9 8h3M9 12h5M9 16h10"></path>
                </svg>
            </SubButton>
            
            {/* Header Button */}
            <SubButton 
                visible={isExpanded} 
                index={0}
                onClick={() => {
                    setIsExpanded(false);
                    onAddHeader();
                }}
                onMouseEnter={() => setActiveLabel('Add Header')}
                onMouseLeave={() => setActiveLabel(null)}
            >
                <ButtonLabel visible={activeLabel === 'Add Header'}>Add Header</ButtonLabel>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 8h10M7 12h10M7 16h10"></path>
                </svg>
            </SubButton>
            
            {/* Main Button */}
            <MainButton onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                )}
            </MainButton>
        </FABContainer>
    );
};

export default FloatingActionButtons;
