import { CanvasElement, Canvas } from './types';

// Generates React JSX code from the canvas elements
export const generateJsx = (elements: CanvasElement[], canvas?: Canvas) => {
  // Get canvas dimensions from the canvas object or use default values
  const canvasWidth = canvas?.width || 1080;
  const canvasHeight = canvas?.height || 1080;
  
  const containerStyle = `{
    position: 'relative',
    width: '${canvasWidth}px',
    height: '${canvasHeight}px',
    backgroundColor: '#ffffff'
  }`;
  
  // Helper function to recursively render elements with proper hierarchy
  const renderElements = (elements: CanvasElement[], parentId?: string, depth = 0): string => {
    const indent = '  '.repeat(depth + 3); // Base indentation level for elements
    
    return elements
      .filter(el => el.parentId === parentId) // Get only direct children of this parent
      .sort((a, b) => a.zIndex - b.zIndex) // Sort by z-index
      .map(el => {
        const style = `{
${indent}  position: 'absolute',
${indent}  left: '${el.position.x}px',
${indent}  top: '${el.position.y}px'${el.size ? `,
${indent}  width: '${el.size.width}px',
${indent}  height: '${el.size.height}px'` : ''}${el.styles?.rotation ? `,
${indent}  transform: 'rotate(${el.styles.rotation}deg)'` : ''}${el.styles?.opacity !== undefined && el.styles.opacity !== 1 ? `,
${indent}  opacity: ${el.styles.opacity}` : ''}${Object.entries(el.styles || {})
           .filter(([key, _]) => !['rotation', 'opacity'].includes(key))
           .map(([key, value]) => `,
${indent}  ${key}: ${typeof value === 'string' ? `'${value}'` : value}`)
           .join('')}
${indent}}`;

        // Generate appropriate JSX based on element type
        let jsxContent = '';
        
        if (el.type === 'container' && el.elementIds?.length) {
          // For containers, recursively render children
          jsxContent = `
${indent}<div style=${style}> {/* ${el.label} */}
${renderElements(elements, el.id, depth + 1)}
${indent}</div>`;
        } else if (el.type === 'text') {
          // For text elements
          jsxContent = `
${indent}<p style=${style}> {/* ${el.label} */}
${indent}  ${el.content}
${indent}</p>`;
        } else if (el.type === 'image') {
          // For image elements
          jsxContent = `
${indent}<img 
${indent}  src="${el.content}" 
${indent}  alt="Image Element" 
${indent}  style=${style} 
${indent}/>`;
        } else {
          // For other elements (shapes, etc.)
          jsxContent = `
${indent}<div style=${style}> {/* ${el.label} */}
${indent}</div>`;
        }
        
        return jsxContent;
      }).join('');
  };
  
  // Get the root elements (no parent) and render the hierarchy
  const elementsJsx = renderElements(elements);
  
  // Component with proper JSX structure
  const jsxCode = `import React from 'react';

const CanvasComponent = ({ className, style }) => {
  return (
    <div 
      className={className}
      style={{
        ...${containerStyle},
        ...style
      }}
    >
${elementsJsx}
    </div>
  );
};

export default CanvasComponent;`;
  
  return jsxCode;
};
