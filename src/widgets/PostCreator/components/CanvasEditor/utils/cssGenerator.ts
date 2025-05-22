import { CanvasElement, Canvas } from './types';

// Generates CSS code from the canvas elements
export const generateCss = (elements: CanvasElement[], canvas?: Canvas) => {
  // Get canvas dimensions from the canvas object or use default values
  const canvasWidth = canvas?.width || 1080;
  const canvasHeight = canvas?.height || 1080;
  
  let css = `.canvas-container {
  position: relative;
  width: ${canvasWidth}px;
  height: ${canvasHeight}px;
  background-color: #ffffff;
}

`;

  // Add element-specific CSS
  elements.forEach((el, index) => {
    css += `.element-${index} {
  position: absolute;
  left: ${el.position.x}px;
  top: ${el.position.y}px;
`;
    
    if (el.size) {
      css += `  width: ${el.size.width}px;
  height: ${el.size.height}px;
`;
    }

    if (el.styles?.opacity !== undefined && el.styles.opacity !== 1) {
      css += `  opacity: ${el.styles.opacity};
`;
    }

    if (el.styles?.rotation) {
      css += `  transform: rotate(${el.styles.rotation}deg);
`;
    }

    // Add element-specific styles
    if (el.styles) {
      Object.entries(el.styles).forEach(([key, value]) => {
        // Skip properties we've already handled
        if (['opacity', 'rotation'].includes(key)) return;
        
        // Convert camelCase to kebab-case
        const property = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        css += `  ${property}: ${value};
`;
      });
    }

    css += `}

`;
  });

  return css;
};
