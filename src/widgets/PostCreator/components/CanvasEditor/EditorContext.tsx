import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  EditorState, 
  EditorAction, 
  CanvasElement, 
  Canvas, 
  BrushType, 
  DrawingMode, 
  PathPoint, 
  Position, 
  MediaItem,
  GroupElement,
  ContainerElement,
  Comment
} from './EditorTypes';

// Default empty canvas
const defaultCanvas: Canvas = {
  id: uuidv4(),
  name: 'Untitled Design',
  width: 1080,
  height: 1080,
  backgroundType: 'color' as 'color' | 'image' | 'gradient',
  backgroundColor: '#ffffff',
  elements: [],
};

// Initial state for the editor
const initialState: EditorState = {
  currentCanvas: defaultCanvas,
  selectedElements: [],
  clipboard: [],
  zoom: 1,
  activeUsers: [],
  history: [],
  comments: [],
  undoStack: [],
  redoStack: [],
  activeTool: 'select',
  activeColor: '#000000',
  brushSize: 2,
  brushType: 'round',
  brushOpacity: 1,
  drawingMode: 'freehand',
  isDrawing: false,
  currentPath: [],
  previewPoint: undefined,
  templates: [],
  mediaLibrary: {
    images: [],
    videos: [],
  },
  unsavedChanges: false,
  mouseMode: 'edit',
  scale: 1,
  offset: { x: 0, y: 0 },
  layersPanelState: {
    expandedContainers: [],
    draggedLayerId: undefined,
    dropTargetId: undefined,
    dropPosition: undefined
  }
};

// Create the context type
type EditorContextType = {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
};

// Create the context
const EditorContext = createContext<EditorContextType | undefined>(undefined);

// Provider props type
interface EditorProviderProps {
  children: ReactNode;
  initialState?: Partial<EditorState>;
}

// Editor reducer
const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  // Helper function to persist state to localStorage
  const persistState = (newState: EditorState) => {
    try {
      localStorage.setItem('canvasEditorState', JSON.stringify(newState));
    } catch (e) {
      console.warn('Failed to persist canvas state to localStorage:', e);
    }
    return newState;
  };

  switch (action.type) {
    case 'SELECT_ELEMENT': {
      // Select an element - either add to selection with ctrl/cmd key or select single
      const { id, multiSelect } = action.payload;
      const selectedElements = multiSelect 
        ? [...state.selectedElements, id]
        : [id];
      
      return persistState({
        ...state,
        selectedElements,
        currentCanvas: {
          ...state.currentCanvas,
          elements: state.currentCanvas.elements.map(element => ({
            ...element,
            isSelected: selectedElements.includes(element.id),
          })),
        },
      });
    }
      
    case 'DESELECT_ALL': {
      // Deselect all elements
      return persistState({
        ...state,
        selectedElements: [],
        currentCanvas: {
          ...state.currentCanvas,
          elements: state.currentCanvas.elements.map(element => ({
            ...element,
            isSelected: false,
          })),
        },
      });
    }
      
    // ... existing cases ...
      
    case 'SET_ACTIVE_TOOL': {
      // Set active tool
      return persistState({
        ...state,
        activeTool: action.payload,
      });
    }
    
    case 'SET_ACTIVE_COLOR': {
      // Set active color
      return persistState({
        ...state,
        activeColor: action.payload,
      });
    }
    
    case 'SET_BRUSH_SIZE': {
      // Set brush size
      return persistState({
        ...state,
        brushSize: action.payload,
      });
    }
    
    case 'SET_BRUSH_TYPE': {
      // Set brush type
      return persistState({
        ...state,
        brushType: action.payload,
      });
    }
    
    case 'SET_BRUSH_OPACITY': {
      // Set brush opacity
      return persistState({
        ...state,
        brushOpacity: action.payload,
      });
    }
    
    case 'SET_DRAWING_MODE': {
      // Set drawing mode (freehand, line, bezier, etc.)
      return persistState({
        ...state,
        drawingMode: action.payload,
      });
    }
    
    case 'START_DRAWING':
      console.log('START_DRAWING action received', action.payload);
      return persistState({
        ...state,
        isDrawing: true,
        currentPath: [action.payload]
      });
      
    case 'CONTINUE_DRAWING':
      // Only update if we're drawing
      if (!state.isDrawing) return state;
      
      console.log('CONTINUE_DRAWING action received', action.payload);
      return persistState({
        ...state,
        currentPath: [...state.currentPath, action.payload]
      });
      
    case 'UPDATE_DRAWING_PREVIEW':
      // Only update if we're drawing
      if (!state.isDrawing) return state;
      
      console.log('UPDATE_DRAWING_PREVIEW action received', action.payload);
      return persistState({
        ...state,
        previewPoint: action.payload
      });
      
    case 'FINISH_DRAWING':
      console.log('FINISH_DRAWING action received', state.currentPath.length);
      // Only process if we're drawing and have at least 2 points
      if (!state.isDrawing || state.currentPath.length < 2) {
        return persistState({
          ...state,
          isDrawing: false,
          currentPath: [],
          previewPoint: undefined
        });
      }
      
      // Create a new drawing element from the current path
      const newElement: CanvasElement = {
        id: uuidv4(),
        type: 'drawing',
        content: '',
        position: {
          x: Math.min(...state.currentPath.map(p => p.x)),
          y: Math.min(...state.currentPath.map(p => p.y))
        },
        x: Math.min(...state.currentPath.map(p => p.x)),
        y: Math.min(...state.currentPath.map(p => p.y)),
        size: {
          width: Math.max(...state.currentPath.map(p => p.x)) - Math.min(...state.currentPath.map(p => p.x)),
          height: Math.max(...state.currentPath.map(p => p.y)) - Math.min(...state.currentPath.map(p => p.y))
        },
        width: Math.max(...state.currentPath.map(p => p.x)) - Math.min(...state.currentPath.map(p => p.x)),
        height: Math.max(...state.currentPath.map(p => p.y)) - Math.min(...state.currentPath.map(p => p.y)),
        zIndex: state.currentCanvas.elements.length + 1,
        isVisible: true,
        isLocked: false,
        isSelected: false,
        label: `Drawing ${state.currentCanvas.elements.length + 1}`,
        styles: {
          stroke: state.activeColor,
          strokeWidth: state.brushSize,
          strokeOpacity: state.brushOpacity,
          brushType: state.brushType,
          pathType: state.drawingMode,
          // Normalize path points relative to element position
          pathPoints: state.currentPath.map(point => ({
            x: point.x - Math.min(...state.currentPath.map(p => p.x)),
            y: point.y - Math.min(...state.currentPath.map(p => p.y)),
            pressure: point.pressure || 1,
            timestamp: point.timestamp || Date.now()
          }))
        }
      };
      
      console.log('Created new drawing element:', newElement);
      
      // Add the new element to the canvas
      return persistState({
        ...state,
        isDrawing: false,
        currentPath: [],
        previewPoint: undefined,
        currentCanvas: {
          ...state.currentCanvas,
          elements: [...state.currentCanvas.elements, newElement]
        }
      });
    
    case 'ADD_MEDIA_ITEM': {
      // Add a new media item to the library
      const mediaItem = action.payload;
      if (mediaItem.type === 'image') {
        return persistState({
          ...state,
          mediaLibrary: {
            ...state.mediaLibrary,
            images: [...state.mediaLibrary.images, mediaItem],
          },
        });
      } else if (mediaItem.type === 'video') {
        return persistState({
          ...state,
          mediaLibrary: {
            ...state.mediaLibrary,
            videos: [...state.mediaLibrary.videos, mediaItem],
          },
        });
      }
      return state;
    }

    case 'REMOVE_MEDIA_ITEM': {
      // Remove a media item from the library
      const mediaId = action.payload;
      return persistState({
        ...state,
        mediaLibrary: {
          ...state.mediaLibrary,
          images: state.mediaLibrary.images.filter(item => item.id !== mediaId),
          videos: state.mediaLibrary.videos.filter(item => item.id !== mediaId),
        },
      });
    }

    case 'TOGGLE_FAVORITE_MEDIA': {
      // Toggle favorite status of a media item
      const mediaId = action.payload;
      return persistState({
        ...state,
        mediaLibrary: {
          ...state.mediaLibrary,
          images: state.mediaLibrary.images.map(item => 
            item.id === mediaId ? { ...item, favorite: !item.favorite } : item
          ),
          videos: state.mediaLibrary.videos.map(item => 
            item.id === mediaId ? { ...item, favorite: !item.favorite } : item
          ),
        },
      });
    }

    case 'SET_UPLOAD_PROGRESS': {
      // Set media upload progress
      return persistState({
        ...state,
        mediaLibrary: {
          ...state.mediaLibrary,
          uploadProgress: action.payload,
        },
      });
    }
    
    case 'SET_MOUSE_MODE':
      return persistState({
        ...state,
        mouseMode: action.payload
      });
    
    case 'SET_CANVAS_SCALE':
      return persistState({
        ...state,
        scale: action.payload
      });
      
    case 'SET_CANVAS_OFFSET':
      return persistState({
        ...state,
        offset: action.payload
      });
      
    case 'UPDATE_CANVAS_DIMENSIONS':
      return persistState({
        ...state,
        currentCanvas: {
          ...state.currentCanvas,
          width: action.payload.width,
          height: action.payload.height
        },
        unsavedChanges: true
      });
      
    case 'ADD_COMMENT':
      return persistState({
        ...state,
        comments: [...state.comments, action.payload],
        unsavedChanges: true
      });
      
    case 'UPDATE_COMMENT':
      return persistState({
        ...state,
        comments: state.comments.map(comment => 
          comment.id === action.payload.id 
            ? { ...comment, ...action.payload.updates } 
            : comment
        ),
        unsavedChanges: true
      });
      
    case 'DELETE_COMMENT':
      return persistState({
        ...state,
        comments: state.comments.filter(comment => comment.id !== action.payload),
        unsavedChanges: true
      });
      
    case 'RESOLVE_COMMENT': {
      return persistState({
        ...state,
        comments: state.comments.map(comment => 
          comment.id === action.payload 
            ? { ...comment, resolved: true } 
            : comment
        ),
        unsavedChanges: true
      });
    }
    
    case 'RENAME_ELEMENT': {
      const { id, label } = action.payload;
      return persistState({
        ...state,
        currentCanvas: {
          ...state.currentCanvas,
          elements: state.currentCanvas.elements.map(element => 
            element.id === id ? { ...element, label } : element
          ),
        },
        unsavedChanges: true
      });
    }
    
    case 'ADD_ELEMENT': {
      const newElement = action.payload;
      return persistState({
        ...state,
        currentCanvas: {
          ...state.currentCanvas,
          elements: [...state.currentCanvas.elements, newElement],
        },
        unsavedChanges: true
      });
    }
    
    case 'CLEAR_CANVAS': {
      const { keepBackground } = action.payload || { keepBackground: true };
      return persistState({
        ...state,
        selectedElements: [],
        currentCanvas: {
          ...state.currentCanvas,
          elements: [],
          backgroundColor: keepBackground ? state.currentCanvas.backgroundColor : '#ffffff'
        },
        unsavedChanges: true
      });
    }
    
    case 'MOVE_ELEMENT_IN_LAYERS': {
      const { sourceId, targetId, position } = action.payload;
      
      // Find source and target elements
      const sourceElement = state.currentCanvas.elements.find(el => el.id === sourceId);
      const targetElement = state.currentCanvas.elements.find(el => el.id === targetId);
      
      if (!sourceElement || !targetElement) {
        return state;
      }
      
      // Create a copy of all elements to modify
      const updatedElements = [...state.currentCanvas.elements];
      
      // Find source and target indices
      const sourceIndex = updatedElements.findIndex(el => el.id === sourceId);
      const targetIndex = updatedElements.findIndex(el => el.id === targetId);
      
      // Handle the source element's current parent (if any)
      if (sourceElement.parentId) {
        // Find the current parent container
        const oldParentIndex = updatedElements.findIndex(el => el.id === sourceElement.parentId);
        if (oldParentIndex !== -1 && 
            (updatedElements[oldParentIndex].type === 'container' || updatedElements[oldParentIndex].type === 'group')) {
          // Remove the element from its current parent's elementIds
          const oldParent = updatedElements[oldParentIndex] as ContainerElement | GroupElement;
          if (oldParent.elementIds) {
            oldParent.elementIds = oldParent.elementIds.filter(id => id !== sourceId);
            updatedElements[oldParentIndex] = oldParent;
          }
        }
      }
      
      // Update source element relationships based on drop position
      if (position === 'inside' && (targetElement.type === 'container' || targetElement.type === 'group')) {
        // Move the element inside the container
        const targetContainer = targetElement as ContainerElement | GroupElement;
        
        // Update source element's parent
        sourceElement.parentId = targetId;
        
        // Add to container's elementIds if not already there
        if (!targetContainer.elementIds) {
          targetContainer.elementIds = [];
        }
        
        if (!targetContainer.elementIds.includes(sourceId)) {
          targetContainer.elementIds.push(sourceId);
        }
        
        // Update target in the elements array
        updatedElements[targetIndex] = targetContainer;
        updatedElements[sourceIndex] = sourceElement;
        
        // Auto-expand the container when an element is moved inside
        const expandedContainers = state.layersPanelState.expandedContainers || [];
        if (!expandedContainers.includes(targetId)) {
          expandedContainers.push(targetId);
        }
        
        return persistState({
          ...state,
          currentCanvas: {
            ...state.currentCanvas,
            elements: updatedElements
          },
          layersPanelState: {
            ...state.layersPanelState,
            expandedContainers
          }
        });
      } else {
        // Handle before/after positions
        // First remove the element from its current position
        if (sourceIndex !== -1) {
          updatedElements.splice(sourceIndex, 1);
        }
        
        // Find new target index (might have changed after removing the source)
        const newTargetIndex = updatedElements.findIndex(el => el.id === targetId);
        
        // Get the parent ID based on where we're placing the element
        let newParentId: string | undefined;
        
        if (position === 'before' || position === 'after') {
          // When placing before or after, the new parent is the same as the target's parent
          newParentId = targetElement.parentId;
          
          // If newParentId exists, add sourceId to parent's elementIds
          if (newParentId) {
            const parentIndex = updatedElements.findIndex(el => el.id === newParentId);
            if (parentIndex !== -1 && 
                (updatedElements[parentIndex].type === 'container' || updatedElements[parentIndex].type === 'group')) {
              const parent = updatedElements[parentIndex] as ContainerElement | GroupElement;
              if (!parent.elementIds) {
                parent.elementIds = [];
              }
              if (!parent.elementIds.includes(sourceId)) {
                parent.elementIds.push(sourceId);
              }
              updatedElements[parentIndex] = parent;
            }
          }
          
          // Update the source element's parent reference
          sourceElement.parentId = newParentId;
          
          // Insert at the appropriate position
          const insertIndex = position === 'before' ? newTargetIndex : newTargetIndex + 1;
          updatedElements.splice(insertIndex, 0, sourceElement);
        }
        
        return persistState({
          ...state,
          currentCanvas: {
            ...state.currentCanvas,
            elements: updatedElements
          }
        });
      }
    }

    case 'TOGGLE_LAYER_EXPANSION': {
      const elementId = action.payload;
      const isAlreadyExpanded = state.layersPanelState.expandedContainers.includes(elementId);
      
      return persistState({
        ...state,
        layersPanelState: {
          ...state.layersPanelState,
          expandedContainers: isAlreadyExpanded
            ? state.layersPanelState.expandedContainers.filter(id => id !== elementId)
            : [...state.layersPanelState.expandedContainers, elementId]
        }
      });
    }
    
    case 'UPDATE_LAYERS_PANEL_STATE': {
      return persistState({
        ...state,
        layersPanelState: {
          ...state.layersPanelState,
          ...action.payload
        }
      });
    }

    case 'UPDATE_ELEMENT_STYLE': {
      // Find the element with the matching ID
      const findResult = state.currentCanvas.elements.find(el => el.id === action.payload.id);
      
      if (!findResult) {
        return state; // Element not found
      }
      
      // Apply the style changes to the element
      return persistState({
        ...state,
        currentCanvas: {
          ...state.currentCanvas,
          elements: state.currentCanvas.elements.map(element => 
            // Use strict equality comparison with the ID string
            element.id === action.payload.id
              ? { 
                  ...element,
                  styles: {
                    ...element.styles,
                    ...action.payload.styles
                  }
                }
              : element
          )
        }
      });
    }

    default:
      return state;
  }
};

// Provider component
export const EditorProvider: React.FC<EditorProviderProps> = ({ 
  children, 
  initialState: customInitialState 
}) => {
  // Load state from localStorage if available
  const loadPersistedState = () => {
    try {
      const savedState = localStorage.getItem('canvasEditorState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // If we have a saved state, merge it with our initial state
        if (parsedState) {
          console.log('Loaded persisted state from localStorage');
          return { ...initialState, ...customInitialState, ...parsedState };
        }
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    }
    
    // If no saved state or error loading, return default state
    return { ...initialState, ...customInitialState };
  };
  
  const [state, dispatch] = useReducer(
    editorReducer, 
    loadPersistedState()
  );
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      // Only persist certain parts of the state to avoid excessive storage
      const stateToSave = {
        currentCanvas: state.currentCanvas,
        zoom: state.zoom,
        scale: state.scale,
        offset: state.offset,
        layersPanelState: state.layersPanelState
      };
      
      localStorage.setItem('canvasEditorState', JSON.stringify(stateToSave));
      console.log('Saved state to localStorage');
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
    }
  }, [state.currentCanvas, state.zoom, state.scale, state.offset, state.layersPanelState]);
  
  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
};

// Custom hook to use the editor context
export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  
  return context;
};

export default EditorContext;
