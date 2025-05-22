import React, { useRef, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { useEditor } from '../EditorContext';
import { CanvasElement, Position, Comment } from '../EditorTypes';
import CommentComponent from './Comments/CommentComponent';
import NewCommentForm from './Comments/NewCommentForm';
import ElementResizeHandles from './Elements/ElementResizeHandles';
import DrawingOnly from './DrawingOnly';
import {
  CanvasContainer,
  CanvasWrapper,
  CanvasArea,
  CanvasBackgroundImage,
  StyledDrawingCanvas,
  CommentMarker
} from '../styled/CanvasStyles';

// Re-export the ElementWrapper component
export const CanvasElementWrapper: React.FC<{
  element: CanvasElement;
  isSelected: boolean;
  onSelect?: (id: string, multiSelect?: boolean) => void;
  children?: React.ReactNode;
}> = ({ 
  element, 
  isSelected,
  onSelect,
  children
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.stopPropagation();
      onSelect(element.id, e.shiftKey);
    }
  };
  
  return (
    <div 
      style={{
        position: 'absolute',
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        cursor: 'pointer',
        // Apply element styles if available
        ...(element.styles ? {
          backgroundColor: element.styles.backgroundColor,
          borderRadius: element.styles.borderRadius,
          borderWidth: element.styles.borderWidth,
          borderColor: element.styles.borderColor,
          borderStyle: element.styles.borderStyle,
          color: element.styles.color,
          opacity: element.styles.opacity,
          transform: element.styles.transform,
          boxShadow: element.styles.boxShadow
        } : {})
      }}
      onClick={handleClick}
    >
      {children}
      {isSelected && <ElementResizeHandles element={element} />}
    </div>
  );
};

const Canvas: React.FC = () => {
  const { state, dispatch } = useEditor();
  const canvasRef = useRef<HTMLDivElement>(null);
  const drawingCanvasRef = useRef<SVGSVGElement>(null);
  const prevMousePosition = useRef<Position | null>(null);
  const [newCommentPosition, setNewCommentPosition] = useState<Position | null>(null);

  // Handle canvas mouse down events based on mouseMode
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / state.scale;
    const y = (e.clientY - rect.top) / state.scale;
    
    console.log('Canvas mouse down', state.mouseMode, state.activeTool);
    
    // Handle different mouse modes
    switch (state.mouseMode) {
      case 'edit':
        // Handle edit mode - select or deselect elements
        if (state.activeTool === 'drawing' || state.activeTool === 'pen' || state.activeTool === 'eraser') {
          console.log('Starting drawing with tool:', state.activeTool, 'mode:', state.drawingMode);
          // For line, bezier, and polyline modes, we need to handle click differently
          if (state.drawingMode === 'line') {
            if (!state.isDrawing) {
              // Start line with first point
              dispatch({
                type: 'START_DRAWING',
                payload: { x, y }
              });
            } else {
              // Complete line with second point and create element
              dispatch({
                type: 'CONTINUE_DRAWING',
                payload: { x, y }
              });
              dispatch({
                type: 'FINISH_DRAWING'
              });
            }
          } else if (state.drawingMode === 'polyline') {
            if (!state.isDrawing) {
              // Start polyline with first point
              dispatch({
                type: 'START_DRAWING',
                payload: { x, y }
              });
            } else {
              // Add point to polyline
              dispatch({
                type: 'CONTINUE_DRAWING',
                payload: { x, y }
              });
              
              // Check for double click to end polyline
              if (state.currentPath.length > 2) {
                const lastPoint = state.currentPath[state.currentPath.length - 2];
                const distX = Math.abs(x - lastPoint.x);
                const distY = Math.abs(y - lastPoint.y);
                
                if (distX < 10 && distY < 10) {
                  dispatch({
                    type: 'FINISH_DRAWING'
                  });
                }
              }
            }
          } else if (state.drawingMode === 'bezier') {
            if (!state.isDrawing) {
              // Start bezier with first point
              dispatch({
                type: 'START_DRAWING',
                payload: { x, y }
              });
            } else if (state.currentPath.length === 1) {
              // Add end point
              dispatch({
                type: 'CONTINUE_DRAWING',
                payload: { x, y }
              });
            } else if (state.currentPath.length === 2) {
              // Add first control point
              dispatch({
                type: 'CONTINUE_DRAWING',
                payload: { x, y }
              });
            } else if (state.currentPath.length === 3) {
              // Add second control point and complete bezier
              dispatch({
                type: 'CONTINUE_DRAWING',
                payload: { x, y }
              });
              dispatch({
                type: 'FINISH_DRAWING'
              });
            }
          }
        } else {
          // If we're clicking on empty space, deselect all
          dispatch({ type: 'DESELECT_ALL' });
        }
        break;
        
      case 'comment':
        // Add a comment at this position
        setNewCommentPosition({ x, y });
        break;
        
      case 'navigate':
        // Start panning the canvas
        prevMousePosition.current = { x: e.clientX, y: e.clientY };
        break;
    }
  };

  // Handle canvas mouse move events based on mouseMode
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / state.scale;
    const y = (e.clientY - rect.top) / state.scale;
    
    switch (state.mouseMode) {
      case 'edit':
        if (state.isDrawing && 
          (state.activeTool === 'drawing' || state.activeTool === 'pen' || state.activeTool === 'eraser')) {
          if (state.drawingMode === 'line' && state.currentPath.length === 1) {
            // For line mode, update the preview of the line
            dispatch({
              type: 'UPDATE_DRAWING_PREVIEW',
              payload: { x, y }
            });
          } else if (state.drawingMode === 'polyline' && state.currentPath.length > 0) {
            // For polyline, update the preview of the next segment
            dispatch({
              type: 'UPDATE_DRAWING_PREVIEW',
              payload: { x, y }
            });
          } else if (state.drawingMode === 'bezier') {
            // Update bezier preview based on current state
            dispatch({
              type: 'UPDATE_DRAWING_PREVIEW',
              payload: { x, y }
            });
          }
        }
        break;
        
      case 'navigate':
        if (prevMousePosition.current) {
          const deltaX = e.clientX - prevMousePosition.current.x;
          const deltaY = e.clientY - prevMousePosition.current.y;
          
          dispatch({
            type: 'SET_CANVAS_OFFSET',
            payload: {
              x: state.offset.x + deltaX,
              y: state.offset.y + deltaY
            }
          });
          
          prevMousePosition.current = { x: e.clientX, y: e.clientY };
        }
        break;
    }
  };

  // Handle canvas mouse up events based on mouseMode
  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / state.scale;
    const y = (e.clientY - rect.top) / state.scale;
    
    switch (state.mouseMode) {
      case 'edit':
        if (state.isDrawing && 
          (state.activeTool === 'drawing' || state.activeTool === 'pen' || state.activeTool === 'eraser') &&
          state.drawingMode === 'freehand') {
          // Only end drawing for freehand mode on mouse up
          // Other modes are ended by their own logic
          console.log('Finishing freehand drawing');
          dispatch({ type: 'FINISH_DRAWING' });
        }
        break;
        
      case 'navigate':
        prevMousePosition.current = null;
        break;
    }
  };

  // Handle canvas mouse leave events
  const handleCanvasMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    switch (state.mouseMode) {
      case 'edit':
        if (state.isDrawing) {
          dispatch({ type: 'FINISH_DRAWING' });
        }
        break;
        
      case 'navigate':
        prevMousePosition.current = null;
        break;
    }
  };

  // Handle wheel events for zooming in navigate mode
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (state.mouseMode === 'navigate') {
      e.preventDefault();
      
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newScale = Math.max(0.5, Math.min(3, state.scale + delta));
      
      dispatch({
        type: 'SET_CANVAS_SCALE',
        payload: newScale
      });
    }
  };
  
  // Handle element selection
  const handleSelectElement = (id: string, multiSelect = false) => {
    if (!multiSelect) {
      dispatch({ type: 'DESELECT_ALL' });
    }
    dispatch({ 
      type: 'SELECT_ELEMENT', 
      payload: { id, multiSelect } 
    });
  };
  
  // Handle saving a new comment
  const handleSaveComment = (content: string) => {
    if (newCommentPosition && content.trim()) {
      const newComment: Comment = {
        id: uuidv4(),
        position: newCommentPosition,
        content,
        author: 'Current User', // This should come from user context in a real app
        createdAt: new Date().toISOString(),
        resolved: false
      };
      
      dispatch({
        type: 'ADD_COMMENT',
        payload: newComment
      });
      
      setNewCommentPosition(null);
    }
  };
  
  // Handle resolving a comment
  const handleResolveComment = (id: string) => {
    dispatch({
      type: 'RESOLVE_COMMENT',
      payload: id
    });
  };
  
  // Handle deleting a comment
  const handleDeleteComment = (id: string) => {
    dispatch({
      type: 'DELETE_COMMENT',
      payload: id
    });
  };

  // Function to render the appropriate content for an element
  const renderElementContent = (element: CanvasElement) => {
    switch (element.type) {
      case 'text':
        return <div dangerouslySetInnerHTML={{ __html: element.content }} />;
      
      case 'image':
        return <img src={element.content} alt={element.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
      
      case 'drawing':
        // Render drawing paths based on path points
        if (element.styles?.pathPoints && element.styles.pathPoints.length > 0) {
          const pathData = element.styles.pathPoints.reduce((acc, point, i) => {
            if (i === 0) return `M ${point.x} ${point.y}`;
            return `${acc} L ${point.x} ${point.y}`;
          }, '');
          
          return (
            <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
              <path
                d={pathData}
                stroke={element.styles.stroke || '#000000'}
                strokeWidth={element.styles.strokeWidth || 3}
                strokeLinecap={(element.styles.brushType === 'square' ? 'square' : 'round')}
                strokeLinejoin="round"
                fill="none"
                opacity={element.styles.strokeOpacity || 1}
              />
            </svg>
          );
        }
        return null;
      
      default:
        return <div>{element.content}</div>;
    }
  };

  // Direct drawing implementation
  const [isDirectDrawing, setIsDirectDrawing] = useState(false);
  const directDrawCanvasRef = useRef<HTMLCanvasElement>(null);
  const directDrawPointsRef = useRef<{x: number, y: number}[]>([]);
  const [drawingStatus, setDrawingStatus] = useState<string>("Click and drag to draw");

  // Set up direct drawing canvas when active tool changes
  useEffect(() => {
    const isDrawingTool = state.mouseMode === 'edit' && 
      (state.activeTool === 'drawing' || state.activeTool === 'pen');
    
    if (isDrawingTool && directDrawCanvasRef.current) {
      const canvas = directDrawCanvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Ensure canvas size matches the container
      const canvasContainer = canvasRef.current;
      if (canvasContainer) {
        const width = state.currentCanvas.width;
        const height = state.currentCanvas.height;
        canvas.width = width;
        canvas.height = height;
        
        console.log(`Canvas sized to ${width}x${height}`);
      }
      
      if (ctx) {
        // Set drawing styles
        ctx.strokeStyle = state.activeColor || '#ff0000';
        ctx.lineWidth = state.brushSize || 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log('Drawing context initialized with color:', ctx.strokeStyle, 'width:', ctx.lineWidth);
      }
    }
  }, [state.mouseMode, state.activeTool, state.activeColor, state.brushSize, state.currentCanvas.width, state.currentCanvas.height]);

  // Handle drawing canvas events
  const handleDirectDrawStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent any default actions
    e.stopPropagation(); // Stop event from bubbling up
    
    if (!directDrawCanvasRef.current) return;
    
    const canvas = directDrawCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate position in canvas coordinates
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    console.log('Drawing started at', x, y);
    setDrawingStatus("Drawing... (release to finish)");
    setIsDirectDrawing(true);
    directDrawPointsRef.current = [{x, y}];
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.stroke(); // Draw a dot at the starting point
    }
  };

  const handleDirectDrawMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent any default actions
    e.stopPropagation(); // Stop event from bubbling up
    
    if (!isDirectDrawing || !directDrawCanvasRef.current) return;
    
    const canvas = directDrawCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate position in canvas coordinates
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    directDrawPointsRef.current.push({x, y});
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleDirectDrawEnd = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent any default actions
    e.stopPropagation(); // Stop event from bubbling up
    
    if (!isDirectDrawing || directDrawPointsRef.current.length < 2) {
      setIsDirectDrawing(false);
      setDrawingStatus("Click and drag to draw");
      return;
    }
    
    console.log('Drawing ended with', directDrawPointsRef.current.length, 'points');
    
    // Create drawing element from points
    const points = directDrawPointsRef.current;
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const width = Math.max(maxX - minX, 2);
    const height = Math.max(maxY - minY, 2);
    
    // Create element
    const newElement: CanvasElement = {
      id: uuidv4(),
      type: 'drawing',
      content: '',
      position: { x: minX, y: minY },
      x: minX,
      y: minY,
      size: { width, height },
      width,
      height,
      zIndex: state.currentCanvas.elements.length + 1,
      isVisible: true,
      isLocked: false,
      isSelected: false,
      label: `Drawing ${state.currentCanvas.elements.length + 1}`,
      styles: {
        stroke: state.activeColor || '#ff0000',
        strokeWidth: state.brushSize || 3,
        strokeOpacity: 1,
        brushType: 'round',
        pathPoints: points.map(p => ({
          x: p.x - minX,
          y: p.y - minY
        }))
      }
    };
    
    // Add element to canvas
    dispatch({
      type: 'ADD_ELEMENT',
      payload: newElement
    });
    
    // Clear canvas and reset state
    if (directDrawCanvasRef.current) {
      const ctx = directDrawCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, directDrawCanvasRef.current.width, directDrawCanvasRef.current.height);
      }
    }
    
    setIsDirectDrawing(false);
    directDrawPointsRef.current = [];
    setDrawingStatus("Click and drag to draw");
  };

  return (
    <CanvasContainer>
      <CanvasWrapper
        scale={state.scale}
        offsetX={state.offset.x}
        offsetY={state.offset.y}
      >
        <CanvasArea
          ref={canvasRef}
          width={state.currentCanvas.width}
          height={state.currentCanvas.height}
          backgroundColor={state.currentCanvas.backgroundColor}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseLeave}
          onWheel={handleWheel}
          style={{ position: 'relative' }}
        >
          {/* Render canvas background */}
          {state.currentCanvas.backgroundType === 'image' && state.currentCanvas.backgroundImage && (
            <CanvasBackgroundImage src={state.currentCanvas.backgroundImage} />
          )}
          
          {/* Render canvas elements */}
          {state.currentCanvas.elements.map((element: CanvasElement) => (
            <CanvasElementWrapper
              key={element.id}
              element={element}
              isSelected={state.selectedElements.includes(element.id)}
              onSelect={state.mouseMode === 'edit' ? handleSelectElement : undefined}
            >
              {renderElementContent(element)}
            </CanvasElementWrapper>
          ))}
          
          {/* Comments and new comment form */}
          {state.comments.map(comment => (
            <CommentComponent
              key={comment.id}
              comment={comment}
              onResolve={handleResolveComment}
              onDelete={handleDeleteComment}
            />
          ))}
          
          {newCommentPosition && (
            <>
              <CommentMarker
                style={{
                  left: newCommentPosition.x,
                  top: newCommentPosition.y
                }}
              >
                <FontAwesomeIcon icon={faCommentDots} size="xs" />
              </CommentMarker>
              <NewCommentForm
                position={newCommentPosition}
                onSave={handleSaveComment}
                onCancel={() => setNewCommentPosition(null)}
              />
            </>
          )}
          
          {/* Direct drawing canvas - positioned above everything else */}
          {state.mouseMode === 'edit' && 
            (state.activeTool === 'drawing' || state.activeTool === 'pen') && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 10000,
              pointerEvents: 'auto'
            }}>
              <canvas
                ref={directDrawCanvasRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  cursor: 'crosshair',
                  zIndex: 10001,
                  pointerEvents: 'auto',
                  touchAction: 'none',
                }}
                onMouseDown={handleDirectDrawStart}
                onMouseMove={handleDirectDrawMove}
                onMouseUp={handleDirectDrawEnd}
                onMouseLeave={handleDirectDrawEnd}
              />
              <div style={{
                position: 'absolute',
                top: 10,
                left: 10,
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '5px 10px',
                borderRadius: 4,
                fontSize: 12,
                zIndex: 10002,
              }}>
                {drawingStatus}
              </div>
            </div>
          )}
        </CanvasArea>
      </CanvasWrapper>
    </CanvasContainer>
  );
};

export default Canvas;
