import React, { useCallback } from 'react';
import styled from 'styled-components';
import { ReactSortable } from 'react-sortablejs';
import { theme } from '../../theme/index';
import type { SortableEvent } from 'sortablejs';

// Interface for sortable items that require an id property
interface SortableItem {
    id: string | number;
    original_item: any;
    original_index: number;
}

// Styled wrapper for draggable items
const DraggableItemContainer = styled.div`
    cursor: grab;
    position: relative;
    margin-bottom: ${theme.spacing.md};
    border-radius: ${theme.borderRadius.md};
    transition: background-color 0.2s, transform 0.2s, box-shadow 0.2s;
    
    &.sortable-ghost {
        opacity: 0.5;
        background-color: ${theme.colors.highlight};
    }
    
    &.sortable-drag {
        cursor: grabbing;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
        z-index: 1000;
    }
    
    &.sortable-chosen {
        background-color: ${theme.colors.highlight};
    }
`;

// Interface for the DraggableList props with strict typing
interface DraggableListProps {
    items: Array<any>;
    keyExtractor: (item: any) => string;
    onReorder: (drag_index: number, hover_index: number) => void;
    renderItem: (item: any, index: number) => React.ReactNode;
}

// Interface for the DraggableItem props
interface DraggableItemProps {
    id: string | number;
    index: number;
    moveItem: (dragIndex: number, hoverIndex: number) => void;
    children: React.ReactNode;
}

/**
 * DraggableItem - Wrapper component for making any item draggable
 */
const DraggableItem: React.FC<DraggableItemProps> = ({ id, index, moveItem, children }) => {
    const ref = useRef<HTMLDivElement>(null);
    
    // Set up drag functionality
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.EVENT_ITEM,
        item: () => {
            return { id, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: (item, monitor) => {
            const didDrop = monitor.didDrop();
            if (!didDrop) {
                // Item was not dropped on a valid target
                console.log('Item was not dropped on a valid target');
            }
        }
    });
    
    // Set up drop functionality
    const [{ isOver }, drop] = useDrop<
        { id: string | number; index: number },
        { moved: boolean } | undefined,
        { isOver: boolean }
    >({
        // Define a drop handler to ensure reordering finalizes
        drop: (item: { id: string | number; index: number }, monitor: DropTargetMonitor) => {
            // This is a critical addition to make reordering work properly
            if (item.index !== index) {
                console.log(`Dropped item ${item.id} from position ${item.index} to ${index}`);
                moveItem(item.index, index);
                return { moved: true };
            }
            return undefined;
        },
        accept: ItemTypes.EVENT_ITEM,
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
        hover: (draggedItem: { id: string | number; index: number }, monitor: DropTargetMonitor) => {
            if (!ref.current) {
                return;
            }
            
            const dragIndex = draggedItem.index;
            const hoverIndex = index;
            
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            
// Interface for the DraggableList props
interface DraggableListProps {
    items: Array<any>;
    keyExtractor: (item: any) => string;
    onReorder: (dragIndex: number, hoverIndex: number) => void;
    renderItem: (item: any, index: number) => React.ReactNode;
}

/**
 * DraggableList component - List with drag and drop functionality for reordering items
 * Uses react-sortablejs for cross-environment compatibility
 */
const DraggableList: React.FC<DraggableListProps> = ({ 
    items, 
    keyExtractor, 
    onReorder,
    renderItem 
}) => {
    // Create a typed version of the items with a required id property for sortablejs
    const sortableItems = useCallback((): SortableItem[] => {
        return items.map((item, index) => ({
            id: keyExtractor(item),
            originalItem: item,
            originalIndex: index
        }));
    }, [items, keyExtractor]);
    
    // Handler for when items are reordered
    const handleSortableEnd = useCallback((event: { oldIndex: number; newIndex: number }) => {
        const { oldIndex, newIndex } = event;
        
        // Only call onReorder if the indices have actually changed
        if (oldIndex !== newIndex) {
            console.log(`Sortable: Item moved from ${oldIndex} to ${newIndex}`);
            onReorder(oldIndex, newIndex);
        }
    }, [onReorder]);
    
    return (
        <ReactSortable
            list={sortableItems()}
            setList={() => {}}
            onEnd={handleSortableEnd}
            animation={150}
            delay={50} // Better for touch devices
            delayOnTouchOnly={true}
            // Style and class settings
            ghostClass="sortable-ghost"
            chosenClass="sortable-chosen"
            dragClass="sortable-drag"
            // Options for better mobile compatibility
            scroll={true}
            scrollSensitivity={80}
            scrollSpeed={10}
            // Optimization options
            forceFallback={true}
            fallbackOnBody={true}
            fallbackTolerance={5}
        >
            {items.map((item, index) => (
                <DraggableItemContainer key={keyExtractor(item)}>
                    {renderItem(item, index)}
                </DraggableItemContainer>
            ))}
        </ReactSortable>
    );
};

export default DraggableList;
