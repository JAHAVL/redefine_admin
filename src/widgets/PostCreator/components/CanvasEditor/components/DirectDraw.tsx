import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { useEditor } from '../EditorContext';
import { CanvasElement, ElementType } from '../EditorTypes';

// Simple styled container for the canvas
const DrawingArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  cursor: crosshair;
`;

// Debug info display in top corner
const DebugInfo = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px;
  border-radius: 3px;
  font-size: 12px;
  z-index: 9999;
`;

const DirectDraw: React.FC = () => {
  // Get editor state and dispatch
  const { state, dispatch } = useEditor();
  
  // Create refs
  const containerRef = useRef<HTMLDivElement>(null);
  const debugRef = useRef<HTMLDivElement>(null);
  
  // Track drawing state in refs to avoid re-renders
  const isDrawing = useRef(false);
  const points = useRef<{x: number, y: number}[]>([]);
  
  // Helper to update debug info
  const updateDebug = (message: string) => {
    if (debugRef.current) {
      debugRef.current.innerText = message;
    }
  };
  
  // Set up drawing canvas on mount
  useEffect(() => {
    console.log("DirectDraw component mounted");
    updateDebug("Drawing component initialized");
    
    // Skip if container not available
    if (!containerRef.current) {
      console.log("No container ref");
      return;
    }
    
    // Clean up container
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = state.currentCanvas.width || 800;
    canvas.height = state.currentCanvas.height || 600;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    
    // Append canvas to container
    containerRef.current.appendChild(canvas);
    
    // Get context
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Could not get canvas context");
      return;
    }
    
    // Set up drawing styles
    ctx.strokeStyle = state.activeColor || '#000000';
    ctx.lineWidth = state.brushSize || 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Start drawing on mouse down
    const startDrawing = (e: MouseEvent) => {
      // Only draw if in edit mode with drawing tool
      if (state.mouseMode !== 'edit' ||
          (state.activeTool !== 'drawing' && state.activeTool !== 'pen')) {
        updateDebug(`Cannot draw: mode=${state.mouseMode}, tool=${state.activeTool}`);
        return;
      }
      
      // Get mouse position relative to canvas
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Start drawing
      isDrawing.current = true;
      points.current = [{x, y}];
      
      // Begin path
      ctx.beginPath();
      ctx.moveTo(x, y);
      
      updateDebug(`Drawing started at ${x.toFixed(0)},${y.toFixed(0)}`);
      
      // Prevent default browser behavior
      e.preventDefault();
    };
    
    // Continue drawing on mouse move
    const draw = (e: MouseEvent) => {
      // Skip if not drawing
      if (!isDrawing.current) return;
      
      // Get mouse position
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Add point
      points.current.push({x, y});
      
      // Draw line
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      
      updateDebug(`Drawing... points: ${points.current.length}`);
      
      // Prevent default
      e.preventDefault();
    };
    
    // End drawing on mouse up
    const endDrawing = (e: MouseEvent) => {
      // Skip if not drawing
      if (!isDrawing.current) return;
      
      updateDebug(`Drawing ended, points: ${points.current.length}`);
      console.log("End drawing, points:", points.current.length);
      
      // Stop drawing
      isDrawing.current = false;
      
      // Check if we have enough points to create a drawing
      if (points.current.length < 2) {
        points.current = [];
        return;
      }
      
      // Calculate bounds
      const xs = points.current.map(p => p.x);
      const ys = points.current.map(p => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const width = Math.max(maxX - minX, 1);
      const height = Math.max(maxY - minY, 1);
      
      // Create element with proper typing
      const newElement: CanvasElement = {
        id: uuidv4(),
        type: 'drawing' as ElementType,
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
          stroke: state.activeColor || '#000000',
          strokeWidth: state.brushSize || 3,
          strokeOpacity: state.brushOpacity || 1,
          brushType: state.brushType || 'round',
          pathPoints: points.current.map(point => ({
            x: point.x - minX,
            y: point.y - minY
          }))
        }
      };
      
      // Add element to canvas
      dispatch({
        type: 'ADD_ELEMENT',
        payload: newElement
      });
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Reset points
      points.current = [];
      
      // Prevent default
      e.preventDefault();
    };
    
    // Add event listeners
    canvas.addEventListener('mousedown', startDrawing);
    window.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', endDrawing);
    
    // Cleanup function
    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      window.removeEventListener('mousemove', draw);
      window.removeEventListener('mouseup', endDrawing);
    };
  }, []);
  
  // Update drawing styles when they change
  useEffect(() => {
    if (!containerRef.current || !containerRef.current.firstChild) return;
    
    const canvas = containerRef.current.firstChild as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = state.activeColor || '#000000';
    ctx.lineWidth = state.brushSize || 3;
    
    updateDebug(`Drawing config: color=${state.activeColor}, size=${state.brushSize}`);
  }, [state.activeColor, state.brushSize]);
  
  return (
    <>
      <DrawingArea ref={containerRef} />
      <DebugInfo ref={debugRef}>Drawing ready...</DebugInfo>
    </>
  );
};

export default DirectDraw;
