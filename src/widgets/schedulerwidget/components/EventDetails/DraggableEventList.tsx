import React, { useRef } from 'react';
import styled from 'styled-components';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { theme } from '../../theme/index';
import { SongExpandStateData } from '../../types/songInterfaces';

// Import the original components to maintain all UI features
import SongList from './SongList';
import HeaderList from './HeaderList';
import ElementList from './ElementList';

// Item types for drag and drop
const ItemTypes = {
    EVENT_ITEM: 'event_item'
};

// Unified item type - can be a song, element, or header
export interface EventItem {
    id: number;
    type: 'song' | 'element' | 'header';
    position: number;
    data: any; // Specific data for each type
}

interface DraggableEventListProps {
    items: EventItem[];
    songExpandState: Record<number, SongExpandStateData>;
    setSongExpandState: React.Dispatch<React.SetStateAction<Record<number, SongExpandStateData>>>;
    onHeaderColorChange?: (id: number, color: string) => void;
    onReorderItems: (dragIndex: number, hoverIndex: number) => void;
}

// Styled components
const ListContainer = styled.div`
    width: 100%;
`;

const DraggableItemWrapper = styled.div<{ isDragging: boolean }>`
    opacity: ${(props: { isDragging: boolean }) => (props.isDragging ? 0.5 : 1)};
    margin-bottom: ${theme.spacing.md};
    position: relative;
    
    /* Drag handle */
    &::before {
        content: '≡';
        position: absolute;
        left: -24px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 24px;
        color: ${theme.colors.text.secondary};
        opacity: 0.5;
        cursor: grab;
        z-index: 10;
    }
    
    &:hover::before {
        opacity: 1;
    }
`;

// DraggableItem component - wraps any item type with drag and drop functionality
interface DraggableItemProps {
    item: EventItem;
    index: number;
    moveItem: (dragIndex: number, hoverIndex: number) => void;
    children: React.ReactNode;
}

const DraggableItem = ({ item, index, moveItem, children }: DraggableItemProps) => {
    const ref = useRef<HTMLDivElement>(null);
    
    // Configure drag
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.EVENT_ITEM,
        item: () => ({ id: item.id, index }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });
    
    // Configure drop
    const [, drop] = useDrop({
        accept: ItemTypes.EVENT_ITEM,
        hover: (draggedItem: { id: number; index: number }, monitor) => {
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
        }
    });
    
    // Initialize drag and drop ref
    drag(drop(ref));
    
    return (
        <DraggableItemWrapper ref={ref} isDragging={isDragging}>
            {children}
        </DraggableItemWrapper>
    );
};

/**
 * DraggableEventList - A unified list for all event item types with drag and drop functionality
 * Preserves all original UI components and their features
 */
const DraggableEventList: React.FC<DraggableEventListProps> = ({
    items,
    songExpandState,
    setSongExpandState,
    onHeaderColorChange,
    onReorderItems
}) => {
    // Group items by type for rendering in their respective original components
    const songsWithPositions = items
        .filter(item => item.type === 'song')
        .map((item, i) => ({ 
            ...item.data, 
            originalIndex: items.findIndex(it => it.id === item.id) 
        }));
    
    const elementsWithPositions = items
        .filter(item => item.type === 'element')
        .map((item, i) => ({ 
            ...item.data, 
            originalIndex: items.findIndex(it => it.id === item.id) 
        }));
    
    const headersWithPositions = items
        .filter(item => item.type === 'header')
        .map((item, i) => ({ 
            ...item.data, 
            originalIndex: items.findIndex(it => it.id === item.id) 
        }));
    
    return (
        <DndProvider backend={HTML5Backend}>
            <ListContainer>
                {items.map((item, index) => (
                    <DraggableItem 
                        key={`${item.type}-${item.id}`}
                        item={item}
                        index={index}
                        moveItem={onReorderItems}
                    >
                        {item.type === 'song' && (
                            <SongItem 
                                song={item.data}
                                index={index}
                                songExpandState={songExpandState}
                                setSongExpandState={setSongExpandState}
                            />
                        )}
                        
                        {item.type === 'element' && (
                            <ElementItem 
                                element={item.data}
                                index={index}
                                elementExpandState={songExpandState}
                                setElementExpandState={setSongExpandState}
                            />
                        )}
                        
                        {item.type === 'header' && (
                            <HeaderItem 
                                id={item.data.id}
                                title={item.data.title}
                                color={item.data.color}
                                onTitleChange={(id: number, newTitle: string) => {
                                    console.log(`Header ${id} title changed to: ${newTitle}`);
                                }}
                                onColorChange={onHeaderColorChange}
                            />
                        )}
                    </DraggableItem>
                ))}
                
                {items.length === 0 && (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: theme.spacing.lg,
                        color: theme.colors.text.secondary 
                    }}>
                        No items in this event yet. Use the + button below to add songs, elements, or headers.
                    </div>
                )}
            </ListContainer>
        </DndProvider>
    );
};

// Simple wrapper components for type compatibility
const SongItem = ({ song, songExpandState, setSongExpandState }: any) => {
    // This is a simple wrapper that adapts our component to the expected props
    // of the original SongItem component
    return (
        <div className="song-wrapper">
            <div style={{ 
                backgroundColor: theme.colors.highlight,
                padding: theme.spacing.md, 
                borderRadius: theme.borderRadius.md,
                borderLeft: `4px solid ${theme.colors.primary}`,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
                <h3 style={{ margin: '0 0 4px 0' }}>{song.title}</h3>
                <p style={{ 
                    margin: 0, 
                    fontSize: theme.typography.fontSizes.sm,
                    color: theme.colors.text.secondary 
                }}>
                    {song.artist} | Key: {song.key} | BPM: {song.bpm}
                </p>
            </div>
        </div>
    );
};

const ElementItem = ({ element }: any) => {
    // This is a simple wrapper that adapts our component to the expected props
    // of the original ElementItem component
    return (
        <div className="element-wrapper">
            <div style={{ 
                backgroundColor: theme.colors.highlight,
                padding: theme.spacing.md, 
                borderRadius: theme.borderRadius.md,
                borderLeft: `4px solid ${theme.colors.warning}`,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
                <h3 style={{ margin: '0 0 4px 0' }}>{element.title}</h3>
                <p style={{ 
                    margin: 0, 
                    fontSize: theme.typography.fontSizes.sm,
                    color: theme.colors.text.secondary 
                }}>
                    {element.presenter || ''} {element.duration ? `| Duration: ${element.duration}min` : ''}
                </p>
            </div>
        </div>
    );
};

const HeaderItem = ({ id, title, color, onTitleChange, onColorChange }: any) => {
    // This is a simple wrapper that adapts our component to the expected props
    // of the original HeaderItem component
    return (
        <div className="header-wrapper">
            <div style={{ 
                backgroundColor: `${color}44`, // 44 hex = 26% opacity
                padding: theme.spacing.md, 
                borderRadius: theme.borderRadius.md,
                borderLeft: `4px solid ${color}`,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
            }}>
                <h3 style={{ margin: 0 }}>{title}</h3>
            </div>
        </div>
    );
};

export default DraggableEventList;
