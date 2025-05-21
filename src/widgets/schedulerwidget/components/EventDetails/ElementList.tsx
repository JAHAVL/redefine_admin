import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/index';
import ElementItem from './ElementComponents/ElementItem';
import { SongExpandStateData } from '../../types/songInterfaces';

interface ElementListProps {
    elements: Array<{
        id: number;
        title: string;
        description?: string;
        time?: string;
        duration?: string;
    }>;
    elementExpandState: Record<number, SongExpandStateData>;
    setElementExpandState: React.Dispatch<React.SetStateAction<Record<number, SongExpandStateData>>>;
    onAddElement: () => void;
    onElementUpdate?: (id: number, updatedElement: any) => void;
}

const ElementListContainer = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    box-sizing: border-box;
    flex-shrink: 0;
    flex-grow: 0;
    /* Force a consistent width regardless of content */
    min-width: var(--content-width, 100%);
    max-width: var(--content-width, 100%);
`;

const EmptyState = styled.div`
    padding: ${theme.spacing.xl};
    text-align: center;
    color: ${theme.colors.text.secondary};
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: ${theme.borderRadius.md};
    border: 1px dashed ${theme.colors.border};
    font-size: ${theme.typography.fontSizes.md};
    margin: ${theme.spacing.md} 0;
`;

const ActionButton = styled.button`
    background-color: ${theme.colors.secondary};
    color: ${theme.colors.text.white};
    border: none;
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-weight: ${theme.typography.fontWeights.semibold};
    cursor: pointer;
    transition: ${theme.transitions.default};

    &:hover {
        background-color: ${theme.colors.primaryDark};
    }
`;

/**
 * ElementList component - Displays a list of elements for an event
 */
const ElementList: React.FC<ElementListProps> = ({ 
    elements, 
    elementExpandState, 
    setElementExpandState, 
    onAddElement,
    onElementUpdate
}) => {
    return (
        <>
            {elements.length === 0 ? (
                <EmptyState>
                    No elements added yet. Add elements to get started.
                </EmptyState>
            ) : (
                <ElementListContainer>
                    {elements.map(element => (
                        <ElementItem
                            key={element.id}
                            element={element}
                            elementExpandState={elementExpandState}
                            setElementExpandState={setElementExpandState}
                            onElementUpdate={onElementUpdate}
                        />
                    ))}
                </ElementListContainer>
            )}
            {/* Add button removed - now handled by the main + button */}
        </>
    );
};

export default ElementList;
