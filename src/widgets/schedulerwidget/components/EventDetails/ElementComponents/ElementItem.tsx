import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../../theme/index';
import ElementHeader from './ElementHeader';
import ElementDetailsContainer from './ElementDetailsContainer';
import { SongExpandStateData } from '../../../types/songInterfaces';

// Types
interface ElementItemProps {
    element: {
        id: number;
        title: string;
        description?: string;
        time?: string;
        duration?: string;
    };
    elementExpandState: Record<number, SongExpandStateData>;
    setElementExpandState: React.Dispatch<React.SetStateAction<Record<number, SongExpandStateData>>>;
    onElementUpdate?: (id: number, updatedElement: any) => void;
}

// Styled components
const ElementItemContainer = styled.li`
    margin-bottom: ${theme.spacing.sm};
    background-color: ${theme.colors.highlight};
    border-radius: ${theme.borderRadius.md};
    overflow: hidden;
    border: 1px solid ${theme.colors.border};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    width: 100%;
    box-sizing: border-box;
    max-width: 100%;
    flex-shrink: 0;
    flex-grow: 0;
`;

/**
 * ElementItem component - Displays an element in the event list
 */
const ElementItem: React.FC<ElementItemProps> = ({ element, elementExpandState, setElementExpandState, onElementUpdate }): React.ReactElement => {
    // Local state for the element to track changes
    const [currentElement, setCurrentElement] = useState(element);
    
    // Use default values if state doesn't exist for this element
    const elementState: SongExpandStateData = elementExpandState[element.id] || { 
        expanded: false, 
        activeTab: 'info',
    };
    
    const isExpanded: boolean = elementState.expanded || false;
    // Make sure we handle any possible values from songExpandState by explicitly converting
    const currentTab: 'info' | 'files' | 'notes' = 
        (elementState.activeTab === 'arrangement' ? 'info' : elementState.activeTab) as 'info' | 'files' | 'notes' || 'info';
    
    const toggleExpand = (): void => {
        const newState: Record<number, SongExpandStateData> = {...elementExpandState};
        newState[element.id] = { 
            ...newState[element.id],
            expanded: !isExpanded 
        };
        setElementExpandState(newState);
    };
    
    const setTabForElement = (tab: 'info' | 'files' | 'notes'): void => {
        const newState: Record<number, SongExpandStateData> = {...elementExpandState};
        newState[element.id] = { 
            ...newState[element.id],
            activeTab: tab
        };
        setElementExpandState(newState);
    };
    
    // Handler for title changes
    const handleTitleChange = (title: string): void => {
        const updatedElement = {
            ...currentElement,
            title
        };
        setCurrentElement(updatedElement);
        if (onElementUpdate) {
            onElementUpdate(element.id, updatedElement);
        }
    };
    
    // Handler for description changes
    const handleDescriptionChange = (description: string): void => {
        const updatedElement = {
            ...currentElement,
            description
        };
        setCurrentElement(updatedElement);
        if (onElementUpdate) {
            onElementUpdate(element.id, updatedElement);
        }
    };

    return (
        <ElementItemContainer>
            <ElementHeader 
                element={currentElement} 
                isExpanded={isExpanded} 
                toggleExpand={toggleExpand} 
            />
            
            {isExpanded && (
                <ElementDetailsContainer 
                    element={currentElement}
                    currentTab={currentTab}
                    setTabForElement={setTabForElement}
                    elementExpandState={elementExpandState}
                    setElementExpandState={setElementExpandState}
                    onTitleChange={handleTitleChange}
                    onDescriptionChange={handleDescriptionChange}
                />
            )}
        </ElementItemContainer>
    );
};

export default ElementItem;
