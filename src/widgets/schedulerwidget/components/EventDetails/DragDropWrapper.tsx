import React, { useRef } from 'react';
import styled from 'styled-components';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { theme } from '../../theme/index';

// Item types for drag and drop
const ItemTypes = {
    EVENT_ITEM: 'event_item'
};

// Styled components
const DragHandleContainer = styled.div<{ isDragging: boolean }>`
    opacity: ${(props: { isDragging: boolean }): string => (props.isDragging ? '0.5' : '1')};
    cursor: move;
    position: relative;
    margin-bottom: ${theme.spacing.md};
`;

// Interface for the wrapper component
interface DraggableItemProps {
    id: string | number;
    index: number;
    moveItem: (dragIndex: number, hoverIndex: number) => void;
    children: React.ReactNode;
}

/**
 * DraggableItemWrapper - Wraps any component with drag and drop functionality
 * This doesn't modify the original component's UI at all
 */
const DraggableItemWrapper: React.FC<DraggableItemProps> = ({ 
    id, 
    index, 
    moveItem, 
    children 
}) => {
    const ref = useRef<HTMLDivElement>(null);
    
    // Set up drag functionality
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.EVENT_ITEM,
        item: () => ({ id, index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });
    
    // Set up drop functionality
    const [, drop] = useDrop({
        accept: ItemTypes.EVENT_ITEM,
        hover: (draggedItem: { id: string | number; index: number }, monitor) => {
            if (!ref.current) return;
            
            const dragIndex = draggedItem.index;
            const hoverIndex = index;
            
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) return;
            
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current.getBoundingClientRect();
            
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset) return;
            
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            
            // Only perform the move when the mouse has crossed half of the item's height
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
            
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
            
            // Time to actually perform the action
            moveItem(dragIndex, hoverIndex);
            
            // Note: we're mutating the monitor item here for performance
            // This is generally not recommended but is OK for this case
            draggedItem.index = hoverIndex;
        },
        // Add drop handler to ensure the reordering is finalized
        drop: (item: { id: string | number; index: number }) => {
            console.log(`Dropped item ${item.id} at position ${index}`);
            // This is important to trigger a final state update in some cases
            if (item.index !== index) {
                moveItem(item.index, index);
            }
        }
    });
    
    // Initialize drag and drop ref
    drag(drop(ref));
    
    return (
        <DragHandleContainer ref={ref} isDragging={isDragging}>
            {children}
        </DragHandleContainer>
    );
};

// Interface for the list container component
interface DragDropListProps {
    children: React.ReactNode;
}

/**
 * DragDropList - Container component that provides the DnD context
 */
const DragDropList: React.FC<DragDropListProps> = ({ children }) => {
    return (
        <DndProvider backend={HTML5Backend}>
            {children}
        </DndProvider>
    );
};

export { DragDropList, DraggableItemWrapper };
