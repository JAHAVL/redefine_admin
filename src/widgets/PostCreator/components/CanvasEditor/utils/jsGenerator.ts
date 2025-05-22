import { CanvasElement, Canvas } from './types';

// Generates JavaScript code from the canvas elements
export const generateJavaScript = (elements: CanvasElement[], canvas?: Canvas) => {
  // Get canvas dimensions from the canvas object or use default values
  const canvasWidth = canvas?.width || 1080;
  const canvasHeight = canvas?.height || 1080;
  
  const js = `// JavaScript code to dynamically create canvas elements
document.addEventListener('DOMContentLoaded', function() {
  const container = document.createElement('div');
  container.className = 'canvas-container';
  container.style.position = 'relative';
  container.style.width = '${canvasWidth}px';
  container.style.height = '${canvasHeight}px';
  container.style.backgroundColor = '#ffffff';
  
  document.body.appendChild(container);
  
  ${elements.map(el => {
    switch(el.type) {
      case 'text':
        return `
  // Create text element: ${el.label}
  const text${el.id.replace(/-/g, '_')} = document.createElement('p');
  text${el.id.replace(/-/g, '_')}.textContent = "${el.content}";
  text${el.id.replace(/-/g, '_')}.style.position = 'absolute';
  text${el.id.replace(/-/g, '_')}.style.left = '${el.position.x}px';
  text${el.id.replace(/-/g, '_')}.style.top = '${el.position.y}px';
  text${el.id.replace(/-/g, '_')}.style.width = '${el.size.width}px';
  text${el.id.replace(/-/g, '_')}.style.height = '${el.size.height}px';
  ${Object.entries(el.styles || {}).map(([key, value]) => 
    `text${el.id.replace(/-/g, '_')}.style.${camelToKebab(key)} = '${value}';`
  ).join('\n  ')}
  container.appendChild(text${el.id.replace(/-/g, '_')});`;
        
      case 'image':
        return `
  // Create image element: ${el.label}
  const img${el.id.replace(/-/g, '_')} = document.createElement('img');
  img${el.id.replace(/-/g, '_')}.src = "${el.content}";
  img${el.id.replace(/-/g, '_')}.alt = "Image Element";
  img${el.id.replace(/-/g, '_')}.style.position = 'absolute';
  img${el.id.replace(/-/g, '_')}.style.left = '${el.position.x}px';
  img${el.id.replace(/-/g, '_')}.style.top = '${el.position.y}px';
  img${el.id.replace(/-/g, '_')}.style.width = '${el.size.width}px';
  img${el.id.replace(/-/g, '_')}.style.height = '${el.size.height}px';
  ${Object.entries(el.styles || {}).map(([key, value]) => 
    `img${el.id.replace(/-/g, '_')}.style.${camelToKebab(key)} = '${value}';`
  ).join('\n  ')}
  container.appendChild(img${el.id.replace(/-/g, '_')});`;
        
      case 'shape':
      case 'container':
        return `
  // Create ${el.type} element: ${el.label}
  const div${el.id.replace(/-/g, '_')} = document.createElement('div');
  div${el.id.replace(/-/g, '_')}.style.position = 'absolute';
  div${el.id.replace(/-/g, '_')}.style.left = '${el.position.x}px';
  div${el.id.replace(/-/g, '_')}.style.top = '${el.position.y}px';
  div${el.id.replace(/-/g, '_')}.style.width = '${el.size.width}px';
  div${el.id.replace(/-/g, '_')}.style.height = '${el.size.height}px';
  ${Object.entries(el.styles || {}).map(([key, value]) => 
    `div${el.id.replace(/-/g, '_')}.style.${camelToKebab(key)} = '${value}';`
  ).join('\n  ')}
  container.appendChild(div${el.id.replace(/-/g, '_')});`;
        
      default:
        return '';
    }
  }).join('\n  ')}
});`;

  return js;
};

// Helper function to convert camelCase to kebab-case for CSS properties
function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}
