import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, faEyeSlash, faLock, faLockOpen, 
  faPen, faTrash, faCopy, faFolderPlus,
  faLayerGroup, faChevronRight, faChevronDown,
  faPlus, faMinus
} from '@fortawesome/free-solid-svg-icons';
import { useEditor } from '../EditorContext';
import { 
  CanvasElement, 
  ContainerElement, 
  GroupElement, 
  TextElement, 
  ImageElement, 
  ShapeElement, 
  VideoElement, 
  DrawingElement,
  LayersPanelState
} from '../EditorTypes';
import { v4 as uuidv4 } from 'uuid';

const LayersContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const LayersHeader = styled.div`
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
`;

const LayersList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
`;

const EmptyLayersMessage = styled.div`
  padding: 16px;
  color: #888;
  text-align: center;
  font-size: 13px;
`;

interface DragIndicatorProps {
  position: 'before' | 'after' | 'inside';
  isVisible: boolean;
}

interface LayerItemContainerProps {
  depth: number;
  isSelected: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
}

interface ExpandIconProps {
  isExpanded: boolean;
}

interface LayerActionProps {
  disabled?: boolean;
}

interface ContextMenuProps {
  position: { x: number; y: number };
}

const DragIndicator = styled.div<DragIndicatorProps>`
  position: absolute;
  left: 0;
  right: 0;
  height: ${(props: DragIndicatorProps) => props.position === 'inside' ? '100%' : '2px'};
  background-color: ${(props: DragIndicatorProps) => props.position === 'inside' ? 'transparent' : '#1890ff'};
  display: ${(props: DragIndicatorProps) => props.isVisible ? 'block' : 'none'};
  z-index: 10;
  pointer-events: none;
  
  ${(props: DragIndicatorProps) => props.position === 'before' && `
    top: 0;
  `}
  
  ${(props: DragIndicatorProps) => props.position === 'after' && `
    bottom: 0;
  `}
  
  ${(props: DragIndicatorProps) => props.position === 'inside' && `
    border: 2px dashed #1890ff;
    background-color: transparent;
  `}
`;

const LayerItemContainer = styled.div<LayerItemContainerProps>`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  margin-left: ${(props: LayerItemContainerProps) => props.depth * 16}px;
  background-color: ${(props: LayerItemContainerProps) => props.isSelected ? '#e6f7ff' : props.isDropTarget ? '#f5f5f5' : 'transparent'};
  border-left: ${(props: LayerItemContainerProps) => props.isSelected ? '2px solid #1890ff' : '2px solid transparent'};
  opacity: ${(props: LayerItemContainerProps) => props.isDragging ? 0.5 : 1};
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  
  &:hover {
    background-color: ${(props: LayerItemContainerProps) => props.isSelected ? '#e6f7ff' : '#f5f5f5'};
  }
`;

const ExpandIcon = styled.div<ExpandIconProps>`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  color: #666;
  transform: ${(props: ExpandIconProps) => props.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'};
  transition: transform 0.2s;
`;

const LayerIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  margin-right: 8px;
  color: #666;
  
  svg {
    font-size: 12px;
  }
`;

const LayerName = styled.div`
  flex: 1;
  font-size: 12px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &:hover {
    text-decoration: underline;
  }
`;

const LayerActions = styled.div`
  display: flex;
  opacity: 0;
  transition: opacity 0.2s;
`;

const LayerAction = styled.button<LayerActionProps>`
  background: none;
  border: none;
  color: #666;
  padding: 4px;
  margin-left: 4px;
  cursor: ${(props: LayerActionProps) => props.disabled ? 'not-allowed' : 'pointer'};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${(props: LayerActionProps) => props.disabled ? 'transparent' : '#f0f0f0'};
  }
`;

const ContextMenu = styled.div<ContextMenuProps>`
  position: fixed;
  top: ${(props: ContextMenuProps) => props.position.y}px;
  left: ${(props: ContextMenuProps) => props.position.x}px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 120px;
  padding: 4px 0;
`;

const ContextMenuItem = styled.div`
  padding: 8px 16px;
  font-size: 13px;
  color: #333;
  display: flex;
  align-items: center;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  svg {
    margin-right: 8px;
    width: 14px;
    color: #666;
  }
`;

const LabelEditForm = styled.form`
  display: flex;
  align-items: center;
  margin: 0;
  flex: 1;
`;

const LabelInput = styled.input`
  border: 1px solid #ddd;
  border-radius: 2px;
  font-size: 12px;
  padding: 2px 4px;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #1890ff;
  }
`;

const LayerActionsBar = styled.div`
  display: flex;
  padding: 8px 12px;
  border-top: 1px solid #eee;
  justify-content: space-between;
`;

interface LayerItemProps {
  element: CanvasElement;
  level: number;
  allElements: CanvasElement[];
  isLastChild?: boolean;
}

const LayerItem: React.FC<LayerItemProps> = ({ element, level, allElements, isLastChild }) => {
  const { state, dispatch } = useEditor();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(element.label || '');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  
  // Safety check - if the element is undefined or missing critical properties, render nothing
  if (!element || !element.id || !element.type) {
    console.warn('Invalid element passed to LayerItem:', element);
    return null;
  }
  
  const { layersPanelState } = state;
  const { draggedLayerId, dropTargetId, dropPosition } = layersPanelState;
  
  const isContainer = element.type === 'container' || element.type === 'group';
  const containerElement = isContainer ? (element as ContainerElement | GroupElement) : null;
  const hasChildren = containerElement && containerElement.elementIds && containerElement.elementIds.length > 0;
  const isExpanded = isContainer && state.layersPanelState.expandedContainers && 
                    state.layersPanelState.expandedContainers.includes(element.id);
  
  // Safety check - if selectedElements is undefined, treat as empty array
  const selectedElements = state.selectedElements || [];
  const isSelected = selectedElements.includes(element.id);
  const isDragging = draggedLayerId === element.id;
  const isDropTarget = dropTargetId === element.id;
  
  // Get child elements if this is a container - with additional safety checks
  const childElements = isContainer && containerElement && containerElement.elementIds && Array.isArray(containerElement.elementIds)
    ? allElements.filter(el => 
        el && containerElement.elementIds.includes(el.id)
      ).sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
    : [];
  
  // Handle expanding/collapsing containers
  const handleToggleExpand = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isContainer) {
      dispatch({ type: 'TOGGLE_LAYER_EXPANSION', payload: element.id });
    }
  };
  
  // Handle selecting element
  const handleSelect = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const multiSelect = e.ctrlKey || e.metaKey;
    dispatch({ 
      type: 'SELECT_ELEMENT', 
      payload: { id: element.id, multiSelect } 
    });
  };
  
  // Handle visibility toggle
  const handleVisibilityToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch({ 
      type: 'UPDATE_ELEMENT', 
      payload: { 
        id: element.id, 
        properties: { 
          isVisible: !element.isVisible 
        } 
      } 
    });
  };
  
  // Handle lock toggle
  const handleLockToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch({ 
      type: 'UPDATE_ELEMENT', 
      payload: { 
        id: element.id, 
        properties: { 
          isLocked: !element.isLocked 
        } 
      } 
    });
  };
  
  // Handle rename
  const handleStartEditing = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(element.label || '');
    // Focus input on next tick
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 10);
  };
  
  const handleEndEditing = () => {
    if (editValue.trim() !== '') {
      dispatch({
        type: 'RENAME_ELEMENT',
        payload: { id: element.id, label: editValue.trim() }
      });
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleEndEditing();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleEndEditing();
  };
  
  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };
  
  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    dispatch({ 
      type: 'SELECT_ELEMENT', 
      payload: { id: element.id, multiSelect: false } 
    });
    
    // Store the dragged element ID
    const layersPanelState: LayersPanelState = {
      ...state.layersPanelState,
      draggedLayerId: element.id
    };
    
    // Use dataTransfer to store element id
    e.dataTransfer.setData('text/plain', element.id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Update state after a short delay to ensure the drag image is set
    setTimeout(() => {
      dispatch({ 
        type: 'UPDATE_LAYERS_PANEL_STATE', 
        payload: layersPanelState
      });
    }, 0);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedLayerId === element.id) return;
    
    // Determine drop position based on cursor position
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    
    let position: 'before' | 'after' | 'inside' = 'after';
    
    if (offsetY < rect.height * 0.25) {
      position = 'before';
    } else if (offsetY > rect.height * 0.75) {
      position = 'after';
    } else if (isContainer) {
      position = 'inside';
    }
    
    // Update drop target in state
    const updatedState: LayersPanelState = {
      ...state.layersPanelState,
      dropTargetId: element.id,
      dropPosition: position
    };
    
    // Only dispatch if something changed
    if (
      dropTargetId !== element.id || 
      dropPosition !== position
    ) {
      dispatch({ 
        type: 'UPDATE_LAYERS_PANEL_STATE', 
        payload: updatedState
      });
    }
    
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only clear if this is the current drop target
    if (dropTargetId === element.id) {
      dispatch({ 
        type: 'UPDATE_LAYERS_PANEL_STATE', 
        payload: {
          ...state.layersPanelState,
          dropTargetId: undefined,
          dropPosition: undefined
        }
      });
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const sourceId = e.dataTransfer.getData('text/plain');
    
    // Prevent dropping on itself
    if (sourceId === element.id) return;
    
    // Move the element
    if (dropPosition) {
      dispatch({
        type: 'MOVE_ELEMENT_IN_LAYERS',
        payload: {
          sourceId,
          targetId: element.id,
          position: dropPosition
        }
      });
    }
    
    // Clear drag state
    dispatch({ 
      type: 'UPDATE_LAYERS_PANEL_STATE', 
      payload: {
        ...state.layersPanelState,
        draggedLayerId: undefined,
        dropTargetId: undefined,
        dropPosition: undefined
      }
    });
  };
  
  const handleDragEnd = () => {
    // Clear drag state if drop didn't happen
    dispatch({ 
      type: 'UPDATE_LAYERS_PANEL_STATE', 
      payload: {
        ...state.layersPanelState,
        draggedLayerId: undefined,
        dropTargetId: undefined,
        dropPosition: undefined
      }
    });
  };
  
  // Get the appropriate icon for the element type
  const getElementIcon = () => {
    switch (element.type) {
      case 'text':
        return <FontAwesomeIcon icon={faPen} />;
      case 'image':
        return <FontAwesomeIcon icon={faLayerGroup} />;
      case 'shape':
        return <FontAwesomeIcon icon={faMinus} />;
      case 'drawing':
        return <FontAwesomeIcon icon={faPlus} />;
      case 'video':
        return <FontAwesomeIcon icon={faLayerGroup} />;
      case 'group':
        return <FontAwesomeIcon icon={faLayerGroup} />;
      case 'container':
        return <FontAwesomeIcon icon={isExpanded ? faFolderPlus : faLayerGroup} />;
      default:
        return <FontAwesomeIcon icon={faLayerGroup} />;
    }
  };
  
  const closeContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.KeyboardEvent | MouseEvent) => {
    if (e && 'stopPropagation' in e) {
      e.stopPropagation();
    }
    setShowContextMenu(false);
  };
  
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (showContextMenu && !e.target) {
        closeContextMenu(e);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (showContextMenu && e.key === 'Escape') {
        closeContextMenu(e as unknown as React.KeyboardEvent);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showContextMenu]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleEndEditing();
  };

  return (
    <>
      <LayerItemContainer
        depth={level}
        isSelected={isSelected}
        isDragging={isDragging}
        isDropTarget={isDropTarget}
        onClick={handleSelect}
        onContextMenu={handleContextMenu}
        draggable={!element.isLocked}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
      >
        {/* Drop indicators for better visual feedback */}
        <DragIndicator 
          position="before" 
          isVisible={isDropTarget && dropPosition === 'before'} 
        />
        <DragIndicator 
          position="inside" 
          isVisible={isDropTarget && dropPosition === 'inside'} 
        />
        <DragIndicator 
          position="after" 
          isVisible={isDropTarget && dropPosition === 'after'} 
        />
        
        {isContainer ? (
          <ExpandIcon isExpanded={isExpanded} onClick={handleToggleExpand}>
            <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronRight} />
          </ExpandIcon>
        ) : (
          <div style={{ width: 16, marginRight: 4 }} />
        )}
        
        <LayerIcon>
          {getElementIcon()}
        </LayerIcon>
        
        {isEditing ? (
          <LabelEditForm onSubmit={handleSubmit}>
            <LabelInput
              ref={inputRef}
              value={editValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            />
          </LabelEditForm>
        ) : (
          <LayerName onDoubleClick={handleStartEditing}>
            {element.label || `${element.type} ${element.id.substr(0, 4)}`}
          </LayerName>
        )}
        
        <LayerActions className="layer-actions">
          <LayerAction 
            title={element.isVisible ? "Hide" : "Show"}
            onClick={handleVisibilityToggle}
          >
            <FontAwesomeIcon icon={element.isVisible ? faEye : faEyeSlash} />
          </LayerAction>
          
          <LayerAction 
            title={element.isLocked ? "Unlock" : "Lock"}
            onClick={handleLockToggle}
          >
            <FontAwesomeIcon icon={element.isLocked ? faLock : faLockOpen} />
          </LayerAction>
          
          <LayerAction 
            title="Rename"
            onClick={handleStartEditing}
          >
            <FontAwesomeIcon icon={faPen} />
          </LayerAction>
        </LayerActions>
      </LayerItemContainer>
      
      {/* Render child elements if this is an expanded container */}
      {isContainer && isExpanded && childElements.map((child, index) => (
        <LayerItem 
          key={child.id} 
          element={child} 
          level={level + 1}
          allElements={allElements}
        />
      ))}
      
      {/* Context Menu */}
      {showContextMenu && (
        <ContextMenu 
          style={{ 
            top: contextMenuPosition.y, 
            left: contextMenuPosition.x 
          }}
        >
          <ContextMenuItem onClick={() => {
            dispatch({ type: 'DESELECT_ALL' });
            dispatch({ 
              type: 'SELECT_ELEMENT', 
              payload: { id: element.id, multiSelect: false } 
            });
            closeContextMenu({} as any);
          }}>
            <FontAwesomeIcon icon={faLayerGroup} />
            Select
          </ContextMenuItem>
          
          <ContextMenuItem onClick={() => {
            handleVisibilityToggle({ stopPropagation: () => {} } as any);
            closeContextMenu({} as any);
          }}>
            <FontAwesomeIcon icon={element.isVisible ? faEyeSlash : faEye} />
            {element.isVisible ? 'Hide' : 'Show'}
          </ContextMenuItem>
          
          <ContextMenuItem onClick={() => {
            handleLockToggle({ stopPropagation: () => {} } as any);
            closeContextMenu({} as any);
          }}>
            <FontAwesomeIcon icon={element.isLocked ? faLockOpen : faLock} />
            {element.isLocked ? 'Unlock' : 'Lock'}
          </ContextMenuItem>
          
          <ContextMenuItem onClick={() => {
            handleStartEditing({ stopPropagation: () => {} } as any);
            closeContextMenu({} as any);
          }}>
            <FontAwesomeIcon icon={faPen} />
            Rename
          </ContextMenuItem>
          
          <ContextMenuItem onClick={() => {
            // Duplicate element
            dispatch({ 
              type: 'COPY_ELEMENTS', 
              payload: { ids: [element.id] } 
            });
            dispatch({ 
              type: 'PASTE_ELEMENTS', 
              payload: { position: { x: element.position.x + 10, y: element.position.y + 10 } } 
            });
            closeContextMenu({} as any);
          }}>
            <FontAwesomeIcon icon={faCopy} />
            Duplicate
          </ContextMenuItem>
          
          <ContextMenuItem onClick={() => {
            // Delete element
            dispatch({ 
              type: 'DELETE_ELEMENT', 
              payload: { id: element.id } 
            });
            closeContextMenu({} as any);
          }}>
            <FontAwesomeIcon icon={faTrash} />
            Delete
          </ContextMenuItem>
        </ContextMenu>
      )}
    </>
  );
};

const SearchInput = styled.input`
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 8px;
  
  &:focus {
    outline: none;
    border-color: #1890ff;
  }
`;

const Layers: React.FC = () => {
  const { state, dispatch } = useEditor();
  const [searchTerm, setSearchTerm] = useState('');
  const [contextMenuId, setContextMenuId] = useState<string | null>(null);
  
  // Ensure these arrays exist before trying to use them
  const elements = state.currentCanvas?.elements || [];
  const selectedElements = state.selectedElements || [];
  const expandedContainers = state.layersPanelState?.expandedContainers || [];
  
  // Create a new component
  const createNewComponent = () => {
    const newComponent: CanvasElement = {
      id: uuidv4(),
      type: 'shape', // Changed from 'component' to 'shape'
      content: '',
      label: `Component ${state.currentCanvas.elements.filter(el => el.type === 'shape').length + 1}`,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 150 },
      isLocked: false,
      isVisible: true,
      isSelected: false,
      zIndex: state.currentCanvas.elements.length + 1,
      parentId: undefined,
      styles: {}
    };
    
    dispatch({
      type: 'ADD_ELEMENT',
      payload: newComponent
    });
  };
  
  // Create a new container
  const createNewContainer = () => {
    const newContainer: CanvasElement = {
      id: uuidv4(),
      type: 'container',
      content: '',
      label: `Container ${state.currentCanvas.elements.filter(el => el.type === 'container').length + 1}`,
      position: { x: 100, y: 100 },
      size: { width: 300, height: 200 },
      isLocked: false,
      isVisible: true,
      isSelected: false,
      zIndex: state.currentCanvas.elements.length + 1,
      parentId: undefined,
      styles: {}
    };
    
    // Add to canvas
    dispatch({
      type: 'ADD_ELEMENT',
      payload: newContainer
    });
    
    // Ensure the container is expanded in the layers panel
    dispatch({
      type: 'UPDATE_LAYERS_PANEL_STATE',
      payload: {
        expandedContainers: [
          ...state.layersPanelState.expandedContainers,
          newContainer.id
        ]
      }
    });
  };

  // Group selected elements
  const groupSelectedElements = () => {
    if (state.selectedElements.length < 2) return;
    
    const groupId = uuidv4();
    
    dispatch({
      type: 'GROUP_ELEMENTS',
      payload: {
        ids: state.selectedElements,
        groupId: groupId
      }
    });
    
    // Expand the new group
    dispatch({
      type: 'TOGGLE_LAYER_EXPANSION',
      payload: groupId
    });
  };
  
  // Filter elements based on search term
  const filteredElements = elements.filter(
    element => element.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Get root elements (elements with no parent)
  const rootElements = filteredElements.filter(element => !element.parentId);
  
  return (
    <LayersContainer>
      <LayersHeader>
        <SearchInput
          placeholder="Search layers..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
      </LayersHeader>
      
      <LayersList>
        {rootElements
          .sort((a, b) => b.zIndex - a.zIndex) // Sort by z-index, highest first
          .map(element => (
            <LayerItem 
              key={element.id} 
              element={element} 
              level={0}
              allElements={elements}
            />
          ))
        }
        
        {rootElements.length === 0 && (
          <EmptyLayersMessage>
            No layers found. Add components or containers to get started.
          </EmptyLayersMessage>
        )}
      </LayersList>
      
      <LayersFooter>
        <ActionButtonContainer>
          <ActionButton 
            title="Add Component" 
            onClick={createNewComponent}
          >
            <FontAwesomeIcon icon={faPlus} />
            <ActionLabel>Component</ActionLabel>
          </ActionButton>
          
          <ActionButton 
            title="Add Container" 
            onClick={createNewContainer}
          >
            <FontAwesomeIcon icon={faFolderPlus} />
            <ActionLabel>Container</ActionLabel>
          </ActionButton>
          
          <ActionButton 
            title="Group Elements" 
            onClick={groupSelectedElements}
            disabled={selectedElements.length < 2}
          >
            <FontAwesomeIcon icon={faLayerGroup} />
            <ActionLabel>Group</ActionLabel>
          </ActionButton>
        </ActionButtonContainer>
        
        {contextMenuId && (
          <ContextMenu 
            elementId={contextMenuId} 
            onClose={() => setContextMenuId(null)} 
          />
        )}
      </LayersFooter>
    </LayersContainer>
  );
};

const ActionButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const ActionButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  padding: 8px;
  color: ${(props: { disabled?: boolean }) => props.disabled ? '#ccc' : '#444'};
  cursor: ${(props: { disabled?: boolean }) => props.disabled ? 'not-allowed' : 'pointer'};
  border-radius: 4px;
  
  &:hover {
    background-color: ${(props: { disabled?: boolean }) => props.disabled ? 'transparent' : '#f0f0f0'};
  }
`;

const ActionLabel = styled.span`
  font-size: 11px;
  margin-top: 4px;
`;

const LayersFooter = styled.div`
  padding: 8px 12px;
  border-top: 1px solid #eee;
`;

export default Layers;
