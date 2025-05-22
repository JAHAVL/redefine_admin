import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../theme/index';

// Types
interface ElementHeaderProps {
    element: {
        id: number;
        title: string;
        description?: string;
        time?: string;
        duration?: string;
    };
    isExpanded: boolean;
    toggleExpand: () => void;
}

// Styled components
const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.spacing.md};
    background-color: ${theme.colors.highlight};
    cursor: pointer;
    transition: background-color 0.2s;
    width: 100%;
    box-sizing: border-box;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }
`;

const ElementArrow = styled.div<{ isExpanded: boolean }>`
    color: ${theme.colors.primary};
    transform: ${(props: { isExpanded: boolean }) => props.isExpanded ? 'rotate(90deg)' : 'rotate(0)'};
    transition: ${theme.transitions.default};
    margin-right: ${theme.spacing.md};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    font-size: 12px;
`;

const ElementTime = styled.div`
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.text.secondary};
    margin-right: ${theme.spacing.md};
    width: 80px;
`;

const ElementInfo = styled.div`
    flex: 1;
    max-width: calc(100% - 200px); /* Ensure fixed width accounting for other elements */
    overflow: hidden;
`;

const ElementTitle = styled.h4`
    margin: 0;
    font-weight: ${theme.typography.fontWeights.semibold};
    font-size: ${theme.typography.fontSizes.md};
    color: ${theme.colors.text.primary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
`;

const ElementDescription = styled.p`
    margin: 0;
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.text.secondary};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
`;

const TypeLabel = styled.div`
    font-size: ${theme.typography.fontSizes.sm};
    padding: 2px 8px;
    background-color: ${theme.colors.secondary};
    color: white;
    border-radius: ${theme.borderRadius.sm};
    margin-left: ${theme.spacing.md};
`;

const MenuButton = styled.button`
    background: none;
    border: none;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.text.secondary};
    cursor: pointer;
    border-radius: ${theme.borderRadius.round};
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
`;

/**
 * ElementHeader component - Displays the collapsed/expanded header for an element
 * Shows element metadata and handles expand/collapse interactions
 */
const ElementHeader: React.FC<ElementHeaderProps> = ({ 
    element, 
    isExpanded, 
    toggleExpand
}): React.ReactElement => {
    // Calculate default values for time and duration if not provided
    const mockTime: string = element.time || `${9 + (element.id % 4)}:${element.id * 10 % 60 < 10 ? '0' : ''}${element.id * 10 % 60}`;
    const mockDuration: string = element.duration || `${element.id % 3 + 1}min`;
    
    return (
        <HeaderContainer onClick={toggleExpand}>
            <ElementArrow isExpanded={isExpanded}>
                ▶
            </ElementArrow>
            <ElementTime>
                {mockTime} • {mockDuration}
            </ElementTime>
            <ElementInfo>
                <ElementTitle>{element.title}</ElementTitle>
                <ElementDescription>{element.description || 'No description'}</ElementDescription>
            </ElementInfo>
            <TypeLabel>
                Element
            </TypeLabel>
            <MenuButton>
                •••
            </MenuButton>
        </HeaderContainer>
    );
};

export default ElementHeader;
