import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ReactSortable } from 'react-sortablejs';
import type { SortableEvent, Options } from 'sortablejs';
import { theme } from '../../theme/index';

// Enable debugging
const DEBUG = true;
const log = (...args: any[]) => DEBUG && console.log('[DraggableList]', ...args);

// Interface for our item wrapper that includes the required id for sortablejs
interface SortableItem {
    id: string | number;
    content: any; // The actual item content
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

/**
 * DraggableList component - List with drag and drop functionality for reordering items
 * Uses react-sortablejs for cross-environment compatibility
 */
const DraggableList: React.FC<DraggableListProps> = ({ 
    items, 
    keyExtractor, 
    onReorder,
    renderItem 
}): React.ReactElement => {
        // Create a container ref to set up direct DOM manipulation if needed
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Convert items to the format required by react-sortablejs
    const sortableItems = items.map((item) => ({
        id: keyExtractor(item),
        content: item
    }));
    
    log('Rendering with', sortableItems.length, 'items');
    
    // Set up direct DOM event listeners for fallback if SortableJS doesn't work
    useEffect(() => {
        log('Component mounted with', items.length, 'items');
        
        return () => {
            log('Component unmounting');
        };
    }, [items.length]);
    
    // Function to handle list updates from SortableJS
    const handleSetList = useCallback((newState: SortableItem[], sortable: any) => {
        log('List updated by SortableJS', newState);
        // We don't need to update state here since we're controlled by the parent
    }, []);
    
    // Handler for when items are reordered
    const handleSortableEnd = useCallback((evt: SortableEvent): void => {
        // Only call onReorder if we have valid indices
        if (typeof evt.oldIndex === 'number' && typeof evt.newIndex === 'number' && evt.oldIndex !== evt.newIndex) {
            log(`Item moved from ${evt.oldIndex} to ${evt.newIndex}`);
            onReorder(evt.oldIndex, evt.newIndex);
        } else {
            log('Sort ended but no valid indices or same position', evt);
        }
    }, [onReorder]);
    
    // Handler for when drag starts - improves free-floating feeling
    const handleSortableStart = useCallback((evt: SortableEvent): void => {
        log('Drag started', evt);
        
        // Using setTimeout to allow SortableJS to set up the drag ghost
        setTimeout(() => {
            // Find the ghost element that SortableJS created
            const ghostElement = document.querySelector('.sortable-fallback') as HTMLElement;
            if (ghostElement) {
                // Modify the ghost to make it feel more free-floating
                ghostElement.style.transition = 'none';
                ghostElement.style.pointerEvents = 'none';
                ghostElement.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
                ghostElement.style.opacity = '0.9';
                ghostElement.style.willChange = 'transform';
                ghostElement.style.transformOrigin = '50% 50%';
                ghostElement.style.transform = 'scale(1.02)';
                ghostElement.style.cursor = 'grabbing';
                
                // Check if we're in the preview environment for additional tweaks
                const isPreview = window.location.href.includes('preview');
                if (isPreview) {
                    // Preview environment might need additional tweaks
                    ghostElement.style.position = 'fixed';
                    ghostElement.style.margin = '0';
                }
            }
        }, 0);
    }, [log]);
    
    // Handler for when sorting is updated
    const handleSortableUpdate = useCallback((evt: SortableEvent): void => {
        log('Sort updated', evt);
    }, []);
    
    return (
        <div ref={containerRef}>
            <ReactSortable<SortableItem>
                list={sortableItems}
                setList={handleSetList}
                onStart={handleSortableStart}
                onUpdate={handleSortableUpdate}
                onEnd={handleSortableEnd}
                // Animation settings for smooth transitions
                animation={200}
                delay={0}
                // Style classes
                ghostClass="sortable-ghost"
                chosenClass="sortable-chosen"
                dragClass="sortable-drag"
                // Free-floating drag settings
                group="draggable-items"
                // Instead of using a handle, we'll use a filter to exclude interactive elements
                filter=".no-drag, button, .dropdown, [role=button], input, select, .edit-button, .delete-button, .expand-button, .clickable, a"
                // This ensures clicks on filtered elements (buttons, etc.) work as expected
                preventOnFilter={false}
                // Make it feel more free-floating
                forceFallback={true}
                fallbackClass="sortable-fallback"
                fallbackOnBody={true} // This makes the dragged element follow the cursor exactly
                fallbackOffset={{x: 0, y: 0}}
                // Allow wide tolerance for drop zones
                swapThreshold={0.65} // Increased to make swapping easier
                direction="vertical"
                // Make it feel more responsive
                touchStartThreshold={3}
                dataIdAttr="data-id"
                // Ensure the dragged item is always on top
                dragoverBubble={true}
                // Allow more freedom in dragging
                emptyInsertThreshold={10}
            >
                {sortableItems.map((sortableItem, index) => (
                    <DraggableItemContainer 
                        key={sortableItem.id} 
                        data-id={sortableItem.id}
                        className="draggable-item"
                    >
                        {/* No more drag handles - using filter approach instead */}
                        {renderItem(sortableItem.content, index)}
                    </DraggableItemContainer>
                ))}
            </ReactSortable>
        </div>
    );
};

export default DraggableList;
