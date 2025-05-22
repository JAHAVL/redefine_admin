import React, { useRef } from 'react';
import styled, { css } from 'styled-components';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { theme } from '../../theme/index';
// Import the original components to maintain all features
import SongItem from './SongComponents/SongItem';
import HeaderItem from './HeaderComponents/HeaderItem';
import ElementItem from './ElementComponents/ElementItem';
import { SongExpandStateData } from '../../types/songInterfaces';

// Item types for drag and drop
const ItemTypes = {
    SONG: 'song',
    ELEMENT: 'element',
    HEADER: 'header'
};

// Unified item type - can be a song, element, or header
export interface EventItem {
    id: number;
    type: 'song' | 'element' | 'header';
    position: number;
    data: any; // Specific data for each type
}

interface DraggableItemListProps {
    items: EventItem[];
    songExpandState: Record<number, SongExpandStateData>;
    setSongExpandState: React.Dispatch<React.SetStateAction<Record<number, SongExpandStateData>>>;
    onHeaderColorChange?: (id: number, color: string) => void;
    onReorderItems: (dragIndex: number, hoverIndex: number) => void;
}

// Styled components
const ListContainer = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    box-sizing: border-box;
`;

const DraggableItem = styled.div<{ isDragging: boolean }>`
    opacity: ${(props: { isDragging: boolean }): string => (props.isDragging ? '0.5' : '1')};
    cursor: move;
    transition: opacity 0.3s, transform 0.2s;
    position: relative;
    
    &:hover {
        transform: translateY(-2px);
    }
    
    &:active {
        transform: translateY(0);
    }
    
    /* Handle to make it clear the item is draggable */
    &::before {
        content: '≡';
        position: absolute;
        left: -18px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 20px;
        color: ${theme.colors.text.secondary};
        opacity: 0.5;
        z-index: 10;
    }
    
    &:hover::before {
        opacity: 1;
    }
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

// Drag and Drop Item component with simplified rendering
interface DraggableItemComponentProps {
    item: EventItem;
    index: number;
    songExpandState: Record<number, SongExpandStateData>;
    setSongExpandState: React.Dispatch<React.SetStateAction<Record<number, SongExpandStateData>>>;
    onHeaderColorChange?: (id: number, color: string) => void;
    moveItem: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableItemComponent: React.FC<DraggableItemComponentProps> = ({
    item,
    index,
    songExpandState,
    setSongExpandState,
    onHeaderColorChange,
    moveItem
}) => {
    const ref = useRef<HTMLLIElement>(null);
    
    // Drag configuration
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.SONG, // Using one type for all items for simplicity
        item: () => ({ index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });
    
    // Drop configuration
    const [, drop] = useDrop({
        accept: ItemTypes.SONG, // Accept the same type
        hover: (draggedItem: { index: number }, monitor) => {
            if (!ref.current) {
                return;
            }
            
            const dragIndex: number = draggedItem.index;
            const hoverIndex: number = index;
            
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            
            // Determine rectangle on screen
            const hoverBoundingRect: DOMRect = ref.current.getBoundingClientRect();
            
            // Get vertical middle
            const hoverMiddleY: number = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            
            if (!clientOffset) {
                return;
            }
            
            // Get pixels to the top
            const hoverClientY: number = clientOffset.y - hoverBoundingRect.top;
            
            // Only perform the move when the mouse has crossed half of the item's height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            
            // Time to actually perform the action
            moveItem(dragIndex, hoverIndex);
            
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            draggedItem.index = hoverIndex;
        }
    });
    
    // Initialize drag and drop ref
    drag(drop(ref));
    
    // Render the appropriate component based on item type
    const renderItemContent = (): React.ReactNode => {
        switch (item.type) {
            case 'song':
                return (
                    <SongItem
                        song={item.data}
                        songExpandState={songExpandState}
                        setSongExpandState={setSongExpandState}
                    />
                );
            case 'header':
                return (
                    <HeaderItem
                        id={item.data.id}
                        title={item.data.title}
                        color={item.data.color}
                        onTitleChange={(id, newTitle) => {
                            console.log(`Header ${id} title changed to: ${newTitle}`);
                        }}
                        onColorChange={onHeaderColorChange}
                    />
                );
            case 'element':
                return (
                    <ElementItem
                        element={item.data}
                        elementExpandState={songExpandState}
                        setElementExpandState={setSongExpandState}
                        onElementUpdate={(id, updatedElement) => {
                            console.log(`Element ${id} updated:`, updatedElement);
                        }}
                    />
                );
            default:
                return <div>Unknown item type</div>;
        }
    };
    
    return (
        <DraggableItem
            ref={ref}
            isDragging={isDragging}
        >
            {renderItemContent()}
        </DraggableItem>
    );
};

/**
 * DraggableItemList component - A unified list for songs, headers, and elements with drag and drop capabilities
 */
const DraggableItemList: React.FC<DraggableItemListProps> = ({
    items,
    songExpandState,
    setSongExpandState,
    onHeaderColorChange,
    onReorderItems
}) => {
    return (
        <DndProvider backend={HTML5Backend}>
            <ListContainer>
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <DraggableItemComponent
                            key={`${item.type}-${item.id}`}
                            item={item}
                            index={index}
                            songExpandState={songExpandState}
                            setSongExpandState={setSongExpandState}
                            onHeaderColorChange={onHeaderColorChange}
                            moveItem={onReorderItems}
                        />
                    ))
                ) : (
                    <EmptyState>
                        No items in this event yet. Use the + button below to add songs, elements, or headers.
                    </EmptyState>
                )}
            </ListContainer>
        </DndProvider>
    );
};

export default DraggableItemList;
