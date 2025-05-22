import { CanvasElement, Canvas } from './types';

// Generates HTML code from the canvas elements
export const generateHtml = (elements: CanvasElement[], canvas?: Canvas) => {
  const html = elements.map(el => {
    switch (el.type) {
      case 'text':
        return `<div class="text-element" style="position: absolute; left: ${el.position.x}px; top: ${el.position.y}px;">${el.content}</div>`;
      case 'shape':
        return `<div class="shape-element" style="position: absolute; left: ${el.position.x}px; top: ${el.position.y}px; width: ${el.size.width}px; height: ${el.size.height}px; background-color: ${el.styles.backgroundColor || '#ccc'};"></div>`;
      case 'image':
        return `<img src="${el.content}" alt="Image" style="position: absolute; left: ${el.position.x}px; top: ${el.position.y}px; width: ${el.size.width}px; height: ${el.size.height}px;" />`;
      default:
        return '';
    }
  }).join('\n  ');
  
  // Get canvas dimensions from the canvas object or use default values
  const canvasWidth = canvas?.width || 1080;
  const canvasHeight = canvas?.height || 1080;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Canvas Export</title>
  <style>
    .canvas-container {
      position: relative;
      width: ${canvasWidth}px;
      height: ${canvasHeight}px;
      background-color: #ffffff;
    }
  </style>
</head>
<body>
  <div class="canvas-container">
  ${html}
  </div>
</body>
</html>`;
};
