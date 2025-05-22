import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { useEditor } from '../EditorContext';
import { CanvasElement } from '../EditorTypes';

// Debug info
const DebugInfo = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 9999;
  pointer-events: none;
`;

// Container for the drawing canvas
const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
`;

const SimpleDraw: React.FC = () => {
  const { state, dispatch } = useEditor();
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<{x: number, y: number}[]>([]);
  const [debugInfo, setDebugInfo] = useState({
    tool: '',
    mousePos: {x: 0, y: 0},
    isDrawing: false,
    pointCount: 0,
    canvasSize: {width: 0, height: 0}
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Create and set up canvas on mount
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Remove any existing canvas
    if (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    
    // Create new canvas
    const canvas = document.createElement('canvas');
    canvas.width = state.currentCanvas.width;
    canvas.height = state.currentCanvas.height;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.cursor = 'crosshair';
    
    // Add to container
    containerRef.current.appendChild(canvas);
    canvasRef.current = canvas;
    
    // Update debug info
    setDebugInfo(prev => ({
      ...prev,
      canvasSize: {width: canvas.width, height: canvas.height}
    }));
    
    // Set up canvas context
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = state.activeColor || '#000000';
      ctx.lineWidth = state.brushSize || 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    
    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    
    // Cleanup
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [state.currentCanvas.width, state.currentCanvas.height]);
  
  // Update drawing style when it changes
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = state.activeColor || '#000000';
      ctx.lineWidth = state.brushSize || 3;
    }
  }, [state.activeColor, state.brushSize]);
  
  // Start drawing on mouse down
  const handleMouseDown = (e: MouseEvent) => {
    if (state.mouseMode !== 'edit') return;
    if (state.activeTool !== 'drawing' && state.activeTool !== 'pen') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    console.log('Start drawing at', x, y);
    
    // Begin drawing
    setIsDrawing(true);
    setPoints([{x, y}]);
    
    // Set up context and start path
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
    
    // Update debug info
    setDebugInfo(prev => ({
      ...prev,
      tool: state.activeTool,
      isDrawing: true,
      mousePos: {x, y}
    }));
    
    // Add global event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // Continue drawing on mouse move
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update points array
    setPoints(prev => [...prev, {x, y}]);
    
    // Draw line
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
    
    // Update debug info
    setDebugInfo(prev => ({
      ...prev,
      mousePos: {x, y},
      pointCount: points.length + 1
    }));
  };
  
  // Finish drawing on mouse up
  const handleMouseUp = (e: MouseEvent) => {
    if (!isDrawing) return;
    
    console.log('End drawing with', points.length, 'points');
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // Don't create drawing if less than 2 points
    if (points.length < 2) {
      setIsDrawing(false);
      setPoints([]);
      return;
    }
    
    // Calculate bounds
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const width = Math.max(maxX - minX, 1);
    const height = Math.max(maxY - minY, 1);
    
    // Create drawing element
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
        stroke: state.activeColor || '#000000',
        strokeWidth: state.brushSize || 3,
        strokeOpacity: state.brushOpacity || 1,
        brushType: state.brushType || 'round',
        pathPoints: points.map(point => ({
          x: point.x - minX,
          y: point.y - minY
        }))
      }
    };
    
    // Dispatch action to add element
    dispatch({
      type: 'ADD_ELEMENT',
      payload: newElement
    });
    
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    
    // Reset state
    setIsDrawing(false);
    setPoints([]);
    setDebugInfo(prev => ({
      ...prev,
      isDrawing: false,
      pointCount: 0
    }));
  };
  
  return (
    <>
      <CanvasContainer ref={containerRef} />
      <DebugInfo>
        Drawing Tool: {debugInfo.tool}<br />
        Mouse: {debugInfo.mousePos.x.toFixed(0)}, {debugInfo.mousePos.y.toFixed(0)}<br />
        Active: {debugInfo.isDrawing ? 'Yes' : 'No'}<br />
        Points: {debugInfo.pointCount}<br />
        Canvas: {debugInfo.canvasSize.width}×{debugInfo.canvasSize.height}
      </DebugInfo>
    </>
  );
};

export default SimpleDraw;
