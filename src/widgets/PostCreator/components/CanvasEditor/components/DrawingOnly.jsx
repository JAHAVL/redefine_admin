import React, { useEffect } from 'react';

const DrawingOnly = () => {
  // Set up the drawing area on component mount
  useEffect(() => {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '5000';
    canvas.style.pointerEvents = 'auto';
    canvas.style.cursor = 'crosshair';
    canvas.style.background = 'transparent';
    
    // Add canvas to document body
    document.body.appendChild(canvas);
    
    // Get context
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#ff0000'; // Red color
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Add status display
    const status = document.createElement('div');
    status.style.position = 'fixed';
    status.style.top = '50px';
    status.style.left = '50px';
    status.style.padding = '10px';
    status.style.background = 'rgba(0, 0, 0, 0.7)';
    status.style.color = 'white';
    status.style.borderRadius = '5px';
    status.style.zIndex = '5001';
    status.style.fontFamily = 'Arial, sans-serif';
    status.style.fontSize = '14px';
    status.innerText = 'Drawing Mode: Ready';
    document.body.appendChild(status);
    
    // Add clear button
    const clearButton = document.createElement('button');
    clearButton.innerText = 'Clear Drawing';
    clearButton.style.position = 'fixed';
    clearButton.style.top = '100px';
    clearButton.style.left = '50px';
    clearButton.style.padding = '8px 16px';
    clearButton.style.background = '#2196f3';
    clearButton.style.color = 'white';
    clearButton.style.border = 'none';
    clearButton.style.borderRadius = '4px';
    clearButton.style.zIndex = '5001';
    clearButton.style.cursor = 'pointer';
    clearButton.onclick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      status.innerText = 'Drawing Mode: Cleared';
    };
    document.body.appendChild(clearButton);
    
    // Drawing state
    let isDrawing = false;
    
    // Mouse event handlers
    function startDrawing(e) {
      isDrawing = true;
      status.innerText = 'Drawing Mode: Drawing...';
      
      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
      
      e.preventDefault();
    }
    
    function draw(e) {
      if (!isDrawing) return;
      
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      
      e.preventDefault();
    }
    
    function stopDrawing() {
      if (isDrawing) {
        isDrawing = false;
        status.innerText = 'Drawing Mode: Completed';
      }
    }
    
    // Add event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    
    // Cleanup on component unmount
    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
      
      document.body.removeChild(canvas);
      document.body.removeChild(status);
      document.body.removeChild(clearButton);
    };
  }, []);
  
  // This component doesn't render anything itself
  return null;
};

export default DrawingOnly;
