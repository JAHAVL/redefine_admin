import React from 'react';
import { useEditor } from '../../EditorContext';
import { CanvasElement } from '../../EditorTypes';
import { ResizeHandle } from '../../styled/CommonStyles';

interface ElementResizeHandlesProps {
  element: CanvasElement;
}

const ElementResizeHandles: React.FC<ElementResizeHandlesProps> = ({ element }) => {
  const { dispatch } = useEditor();
  
  const handleResize = (e: React.MouseEvent<HTMLDivElement>, handleType: string) => {
    e.stopPropagation();
    
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startPosition = { ...element.position };
    const startSize = { ...element.size };
    
    // Function to handle mouse move during resize
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startMouseX;
      const deltaY = moveEvent.clientY - startMouseY;
      let newWidth = startSize.width;
      let newHeight = startSize.height;
      let newX = startPosition.x;
      let newY = startPosition.y;
      
      // Adjust position and size based on handle type
      switch (handleType) {
        case 'top-left':
          newWidth = Math.max(20, startSize.width - deltaX);
          newHeight = Math.max(20, startSize.height - deltaY);
          newX = startPosition.x + (startSize.width - newWidth);
          newY = startPosition.y + (startSize.height - newHeight);
          break;
        
        case 'top':
          newHeight = Math.max(20, startSize.height - deltaY);
          newY = startPosition.y + (startSize.height - newHeight);
          break;
        
        case 'top-right':
          newWidth = Math.max(20, startSize.width + deltaX);
          newHeight = Math.max(20, startSize.height - deltaY);
          newY = startPosition.y + (startSize.height - newHeight);
          break;
        
        case 'right':
          newWidth = Math.max(20, startSize.width + deltaX);
          break;
          
        case 'bottom-right':
          newWidth = Math.max(20, startSize.width + deltaX);
          newHeight = Math.max(20, startSize.height + deltaY);
          break;
          
        case 'bottom':
          newHeight = Math.max(20, startSize.height + deltaY);
          break;
          
        case 'bottom-left':
          newWidth = Math.max(20, startSize.width - deltaX);
          newHeight = Math.max(20, startSize.height + deltaY);
          newX = startPosition.x + (startSize.width - newWidth);
          break;
          
        case 'left':
          newWidth = Math.max(20, startSize.width - deltaX);
          newX = startPosition.x + (startSize.width - newWidth);
          break;
      }
      
      // Update element
      dispatch({
        type: 'UPDATE_ELEMENT_SIZE',
        payload: {
          id: element.id,
          size: { width: newWidth, height: newHeight }
        }
      });
      
      dispatch({
        type: 'UPDATE_ELEMENT_POSITION',
        payload: {
          id: element.id,
          position: { x: newX, y: newY }
        }
      });
    };
    
    // Function to handle mouse up and remove listeners
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  return (
    <>
      <ResizeHandle 
        className="top-left" 
        onMouseDown={(e) => handleResize(e, 'top-left')} 
      />
      <ResizeHandle 
        className="top" 
        onMouseDown={(e) => handleResize(e, 'top')} 
      />
      <ResizeHandle 
        className="top-right" 
        onMouseDown={(e) => handleResize(e, 'top-right')} 
      />
      <ResizeHandle 
        className="right" 
        onMouseDown={(e) => handleResize(e, 'right')} 
      />
      <ResizeHandle 
        className="bottom-right" 
        onMouseDown={(e) => handleResize(e, 'bottom-right')} 
      />
      <ResizeHandle 
        className="bottom" 
        onMouseDown={(e) => handleResize(e, 'bottom')} 
      />
      <ResizeHandle 
        className="bottom-left" 
        onMouseDown={(e) => handleResize(e, 'bottom-left')} 
      />
      <ResizeHandle 
        className="left" 
        onMouseDown={(e) => handleResize(e, 'left')} 
      />
    </>
  );
};

export default ElementResizeHandles;
