import { CanvasElement, ElementType, ElementStyles } from './types';
import { ContainerElement, GroupElement } from '../EditorTypes';

// Parse React/JSX code with improved parsing logic
export const parseReactToElements = (reactCode: string): CanvasElement[] => {
  try {
    console.log('Parsing React code:', reactCode.substring(0, 100) + '...');
    const elements: CanvasElement[] = [];
    
    // Canvas dimensions
    const canvasWidth = 1080;
    const canvasHeight = 1080;
    const padding = 20;
    
    // Fixed heights for different sections to ensure we don't overflow
    const headerHeight = 60;
    const titleMargin = 15;
    const propsHeight = 120;
    const structureMarginTop = 20;
    
    // Create a container for all React elements
    const containerId = `react-container-${Date.now()}`;
    const containerElement: CanvasElement = {
      id: containerId,
      type: 'container',
      content: '',
      position: { x: 0, y: 0 },
      x: 0,
      y: 0,
      size: { width: canvasWidth, height: canvasHeight },
      width: canvasWidth,
      height: canvasHeight,
      isVisible: true,
      isLocked: false,
      isSelected: false,
      zIndex: 0,
      label: 'React Component',
      rotation: 0,
      opacity: 1,
      parentId: undefined,
      styles: {
        backgroundColor: '#FFFFFF',
        overflow: 'hidden' // Force containing everything
      },
      elementIds: []
    };
    
    elements.push(containerElement);
    
    // Find component name using different patterns
    let componentName = 'React Component';
    const functionMatch = reactCode.match(/function\s+([A-Z][a-zA-Z0-9_$]*)/);
    const arrowMatch = reactCode.match(/const\s+([A-Z][a-zA-Z0-9_$]*)\s*=\s*(\([^)]*\)\s*=>|\s*=>\s*)/);
    const classMatch = reactCode.match(/class\s+([A-Z][a-zA-Z0-9_$]*)\s+extends/);
    
    if (functionMatch) {
      componentName = functionMatch[1];
    } else if (arrowMatch) {
      componentName = arrowMatch[1];
    } else if (classMatch) {
      componentName = classMatch[1];
    }
    
    // Create header bar
    const headerId = `header-${Date.now()}`;
    const headerElement: CanvasElement = {
      id: headerId,
      type: 'shape',
      content: '',
      position: { x: 0, y: 0 },
      x: 0, 
      y: 0,
      size: { width: canvasWidth, height: headerHeight },
      width: canvasWidth,
      height: headerHeight,
      isVisible: true,
      isLocked: false,
      isSelected: false,
      zIndex: 1,
      label: 'Header',
      rotation: 0,
      opacity: 1,
      parentId: containerId,
      styles: {
        backgroundColor: '#4285F4' // Google blue
      }
    };
    
    elements.push(headerElement);
    
    // Component name text
    const titleId = `title-${Date.now()}`;
    const titleElement: CanvasElement = {
      id: titleId,
      type: 'text',
      content: componentName,
      position: { x: padding, y: titleMargin },
      x: padding,
      y: titleMargin,
      size: { width: canvasWidth - (padding * 2), height: 30 },
      width: canvasWidth - (padding * 2),
      height: 30,
      isVisible: true,
      isLocked: false,
      isSelected: false,
      zIndex: 2,
      label: 'Component Name',
      rotation: 0,
      opacity: 1,
      parentId: containerId,
      styles: {
        fontFamily: 'Arial',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center'
      }
    };
    
    elements.push(titleElement);
    
    // Look for props
    let propsContent = '';
    const propsInterfaceMatch = reactCode.match(/interface\s+([A-Z][a-zA-Z0-9_$]*Props)\s*\{([^}]*)\}/);
    const propsTypeMatch = reactCode.match(/type\s+([A-Z][a-zA-Z0-9_$]*Props)\s*=\s*\{([^}]*)\}/);
    
    if (propsInterfaceMatch) {
      propsContent = propsInterfaceMatch[2].trim();
    } else if (propsTypeMatch) {
      propsContent = propsTypeMatch[2].trim();
    }
    
    // Calculate starting positions based on whether we have props
    const hasProps = !!propsContent;
    const mainContentY = headerHeight + padding;
    const structureY = hasProps ? mainContentY + propsHeight + structureMarginTop : mainContentY;
    
    // Calculate available height for structure
    const availableStructureHeight = canvasHeight - structureY - padding;
    
    // If we have props, add a props section
    if (hasProps) {
      // Props container
      const propsBgId = `props-bg-${Date.now()}`;
      const propsBgElement: CanvasElement = {
        id: propsBgId,
        type: 'shape',
        content: '',
        position: { x: padding, y: mainContentY },
        x: padding,
        y: mainContentY,
        size: { width: canvasWidth - (padding * 2), height: propsHeight },
        width: canvasWidth - (padding * 2),
        height: propsHeight,
        isVisible: true,
        isLocked: false,
        isSelected: false,
        zIndex: 1,
        label: 'Props Background',
        rotation: 0,
        opacity: 1,
        parentId: containerId,
        styles: {
          backgroundColor: '#E3F2FD', // Light blue
          borderRadius: 6,
          border: '1px solid #BBDEFB',
          overflow: 'hidden' // Add overflow hidden to contain children
        }
      };
      
      elements.push(propsBgElement);
      
      // Props title
      const propsTitleId = `props-title-${Date.now()}`;
      const propsTitleElement: CanvasElement = {
        id: propsTitleId,
        type: 'text',
        content: 'Props',
        position: { x: padding + 10, y: mainContentY + 10 },
        x: padding + 10,
        y: mainContentY + 10,
        size: { width: canvasWidth - (padding * 2) - 20, height: 30 },
        width: canvasWidth - (padding * 2) - 20,
        height: 30,
        isVisible: true,
        isLocked: false,
        isSelected: false,
        zIndex: 2,
        label: 'Props Title',
        rotation: 0,
        opacity: 1,
        parentId: containerId,
        styles: {
          fontFamily: 'Arial',
          fontSize: 18,
          fontWeight: 'bold',
          color: '#1976D2'
        }
      };
      
      elements.push(propsTitleElement);
      
      // Limit props content to make sure it fits
      const truncatedProps = propsContent.length > 150 
        ? propsContent.substring(0, 150) + '...' 
        : propsContent;
      
      // Props content
      const propsContentId = `props-content-${Date.now()}`;
      const propsContentElement: CanvasElement = {
        id: propsContentId,
        type: 'text',
        content: truncatedProps.replace(/;/g, ';\n').replace(/,/g, ',\n'),
        position: { x: padding + 20, y: mainContentY + 50 },
        x: padding + 20,
        y: mainContentY + 50,
        size: { width: canvasWidth - (padding * 2) - 40, height: propsHeight - 60 },
        width: canvasWidth - (padding * 2) - 40,
        height: propsHeight - 60,
        isVisible: true,
        isLocked: false,
        isSelected: false,
        zIndex: 2,
        label: 'Props Content',
        rotation: 0,
        opacity: 1,
        parentId: containerId,
        styles: {
          fontFamily: 'monospace',
          fontSize: 14,
          color: '#333333',
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      };
      
      elements.push(propsContentElement);
    }
    
    // Extract JSX from return statement
    let jsxContent = '';
    const returnMatch = reactCode.match(/return\s*\(\s*([^]*?)\s*\)\s*;?/);
    const renderMatch = reactCode.match(/render\s*\(\s*\)\s*\{\s*return\s*\(\s*([^]*?)\s*\)\s*;?\s*\}/);
    
    if (returnMatch) {
      jsxContent = returnMatch[1];
    } else if (renderMatch) {
      jsxContent = renderMatch[1];
    }
    
    // Create main render section with extracted JSX
    const structureData = extractReactStructure(jsxContent);
    
    // JSX background
    const jsxBgId = `jsx-bg-${Date.now()}`;
    const jsxBgElement: CanvasElement = {
      id: jsxBgId,
      type: 'shape',
      content: '',
      position: { x: padding, y: structureY },
      x: padding, 
      y: structureY,
      size: { width: canvasWidth - (padding * 2), height: availableStructureHeight },
      width: canvasWidth - (padding * 2),
      height: availableStructureHeight,
      isVisible: true,
      isLocked: false,
      isSelected: false,
      zIndex: 1,
      label: 'JSX Background',
      rotation: 0,
      opacity: 1,
      parentId: containerId,
      styles: {
        backgroundColor: '#F5F5F5',
        borderRadius: 6,
        overflow: 'hidden' // Add overflow hidden to contain children
      }
    };
    
    elements.push(jsxBgElement);
    
    // JSX title
    const jsxTitleId = `jsx-title-${Date.now()}`;
    const jsxTitleElement: CanvasElement = {
      id: jsxTitleId,
      type: 'text',
      content: 'Component Structure',
      position: { x: padding + 10, y: structureY + 10 },
      x: padding + 10,
      y: structureY + 10,
      size: { width: canvasWidth - (padding * 2) - 20, height: 30 },
      width: canvasWidth - (padding * 2) - 20,
      height: 30,
      isVisible: true,
      isLocked: false,
      isSelected: false,
      zIndex: 2,
      label: 'JSX Title',
      rotation: 0,
      opacity: 1,
      parentId: containerId,
      styles: {
        fontFamily: 'Arial',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333'
      }
    };
    
    elements.push(jsxTitleElement);
    
    // Create visual elements for the component structure
    const structureElements = createStructureElements(
      structureData,
      padding + 20,
      structureY + 50,
      canvasWidth - (padding * 2) - 40,
      availableStructureHeight - 60, // Maximum height available
      containerId
    );
    
    elements.push(...structureElements);
    
    // Update container's elementIds
    containerElement.elementIds = [
      headerId,
      titleId,
      jsxBgId,
      jsxTitleId,
      ...structureElements.map(el => el.id)
    ];
    
    if (hasProps) {
      // Find the prop elements we created earlier and add them to elementIds
      const propElements = elements.filter(el => 
        el.id.includes('props-bg') || 
        el.id.includes('props-title') || 
        el.id.includes('props-content')
      );
      
      containerElement.elementIds.push(...propElements.map(el => el.id));
    }
    
    console.log(`Created ${elements.length} elements from React code`);
    return elements;
  } catch (error) {
    console.error('Error parsing React code:', error);
    
    // Return a default error element with a smaller height
    return [{
      id: `error-${Date.now()}`,
      type: 'text' as ElementType,
      content: 'Error parsing React code: ' + String(error),
      position: { x: 40, y: 40 },
      x: 40, 
      y: 40,
      size: { width: 1000, height: 100 },
      width: 1000,
      height: 100,
      isVisible: true,
      isLocked: false,
      isSelected: false,
      zIndex: 1,
      label: 'Error',
      rotation: 0,
      opacity: 1,
      styles: {
        color: '#F44336',
        fontFamily: 'Arial',
        fontSize: 16,
        backgroundColor: '#FFEBEE',
        padding: 20,
        borderRadius: 4
      }
    }];
  }
};

/**
 * Helper function to extract a simplified React component structure
 */
function extractReactStructure(jsxContent: string): Array<{
  type: string;
  isComponent: boolean;
  children: Array<any>;
  props: string;
  depth: number;
}> {
  if (!jsxContent || jsxContent.trim().length === 0) {
    return [];
  }
  
  // Simple approach: find all JSX tags
  const result: Array<{
    type: string;
    isComponent: boolean;
    children: Array<any>;
    props: string;
    depth: number;
  }> = [];
  
  // Process the opening tags
  try {
    // Find opening tags <Component ...> or <div ...>
    const tagRegex = /<([A-Za-z][A-Za-z0-9._$]*)((?:\s+[^>/{}]+(?:={[^}]*}|="[^"]*"|='[^']*')?)*)/g;
    
    let match;
    let depth = 0;
    let lastIndex = 0;
    
    while ((match = tagRegex.exec(jsxContent)) !== null) {
      const [fullMatch, tagName, attributes] = match;
      const isComponent = /^[A-Z]/.test(tagName);
      
      // If this is a self-closing tag, like <Component /> we'll handle it differently
      const isSelfClosing = jsxContent.slice(match.index + fullMatch.length, match.index + fullMatch.length + 2) === '/>';
      
      // Build a structure entry
      const element = {
        type: tagName,
        isComponent,
        children: [] as Array<any>,
        props: attributes.trim(),
        depth,
        selfClosing: isSelfClosing
      };
      
      result.push(element);
      
      if (!isSelfClosing) {
        depth++;
      }
      
      lastIndex = match.index + fullMatch.length;
    }
    
    // The result will be a flattened structure but with depth information
    return result;
  } catch (error) {
    console.error('Error extracting JSX structure:', error);
    return [];
  }
}

/**
 * Create visual elements representing the React component structure
 */
function createStructureElements(
  structureData: Array<{
    type: string;
    isComponent: boolean;
    props: string;
    depth: number;
  }>,
  startX: number,
  startY: number,
  maxWidth: number,
  maxHeight: number, // Added maxHeight param to ensure we don't go beyond boundaries
  parentId: string
): CanvasElement[] {
  const elements: CanvasElement[] = [];
  
  if (structureData.length === 0) {
    // No structure data, create a placeholder
    const placeholderId = `structure-placeholder-${Date.now()}`;
    const placeholderElement: CanvasElement = {
      id: placeholderId,
      type: 'text',
      content: 'No component structure detected',
      position: { x: startX, y: startY },
      x: startX,
      y: startY,
      size: { width: maxWidth, height: 50 },
      width: maxWidth,
      height: 50,
      isVisible: true,
      isLocked: false,
      isSelected: false,
      zIndex: 2,
      label: 'No Structure',
      rotation: 0,
      opacity: 1,
      parentId,
      styles: {
        fontFamily: 'Arial',
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
        fontStyle: 'italic'
      }
    };
    
    elements.push(placeholderElement);
    return elements;
  }
  
  // Settings for structure visualization
  const elementHeight = 50;
  const elementMargin = 10;
  const indentWidth = 20;
  const maxIndentDepth = 5; // Limit indentation to prevent overflow
  const componentStyles = {
    borderRadius: 6,
    border: '2px solid #1976D2', // Blue border for components
    padding: 10,
    backgroundColor: '#E3F2FD' // Light blue background
  };
  const elementStyles = {
    borderRadius: 4,
    border: '1px solid #BDBDBD', // Gray border for HTML elements
    padding: 10,
    backgroundColor: '#FFFFFF'
  };
  
  // Calculate maximum visible elements based on available space
  const maxVisibleElements = Math.floor(maxHeight / (elementHeight + elementMargin));
  const elementCount = Math.min(structureData.length, maxVisibleElements);
  
  // Create elements with proper indentation based on depth
  let currentY = startY;
  
  // Add "too many elements" warning if needed
  if (structureData.length > maxVisibleElements) {
    const warningId = `too-many-elements-${Date.now()}`;
    const warningElement: CanvasElement = {
      id: warningId,
      type: 'text',
      content: `Showing ${maxVisibleElements} of ${structureData.length} elements`,
      position: { x: startX, y: startY - 20 },
      x: startX,
      y: startY - 20,
      size: { width: maxWidth, height: 20 },
      width: maxWidth,
      height: 20,
      isVisible: true,
      isLocked: false,
      isSelected: false,
      zIndex: 3,
      label: 'Warning',
      rotation: 0,
      opacity: 1,
      parentId,
      styles: {
        fontFamily: 'Arial',
        fontSize: 12,
        fontStyle: 'italic',
        color: '#F57C00',
        textAlign: 'center'
      }
    };
    
    elements.push(warningElement);
  }
  
  for (let i = 0; i < elementCount; i++) {
    const item = structureData[i];
    
    // Verify we haven't exceeded available height
    if (currentY + elementHeight > startY + maxHeight) {
      break;
    }
    
    // Limit indentation to prevent overflow
    const clampedDepth = Math.min(item.depth, maxIndentDepth);
    
    // Calculate indentation based on depth
    const indentedX = startX + (clampedDepth * indentWidth);
    const elementWidth = maxWidth - (clampedDepth * indentWidth);
    
    // Ensure element width doesn't go below minimum
    const safeElementWidth = Math.max(elementWidth, 150);
    
    // Create the background element
    const bgId = `structure-bg-${item.type}-${i}-${Date.now()}`;
    const bgElement: CanvasElement = {
      id: bgId,
      type: 'shape',
      content: '',
      position: { x: indentedX, y: currentY },
      x: indentedX,
      y: currentY,
      size: { width: safeElementWidth, height: elementHeight },
      width: safeElementWidth,
      height: elementHeight,
      isVisible: true,
      isLocked: false,
      isSelected: false,
      zIndex: 2,
      label: `${item.type} Element`,
      rotation: 0,
      opacity: 1,
      parentId,
      styles: item.isComponent ? componentStyles : elementStyles
    };
    
    elements.push(bgElement);
    
    // Create the element name label
    const labelId = `structure-label-${item.type}-${i}-${Date.now()}`;
    const labelElement: CanvasElement = {
      id: labelId,
      type: 'text',
      content: `<${item.type}>`,
      position: { x: indentedX + 10, y: currentY + 5 },
      x: indentedX + 10,
      y: currentY + 5,
      size: { width: safeElementWidth - 20, height: 24 },
      width: safeElementWidth - 20,
      height: 24,
      isVisible: true,
      isLocked: false,
      isSelected: false,
      zIndex: 3,
      label: `${item.type} Label`,
      rotation: 0,
      opacity: 1,
      parentId,
      styles: {
        fontFamily: item.isComponent ? 'Arial' : 'monospace',
        fontSize: item.isComponent ? 16 : 14,
        fontWeight: item.isComponent ? 'bold' : 'normal',
        color: item.isComponent ? '#1976D2' : '#333333',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    };
    
    elements.push(labelElement);
    
    // If we have props, show a small preview
    if (item.props && item.props.trim().length > 0) {
      const propsId = `structure-props-${item.type}-${i}-${Date.now()}`;
      const propsPreview = item.props.trim()
        .replace(/\s+/g, ' ')
        .replace(/=\{([^{}]*)\}/g, "={...}") // Simplify complex expressions
        .substring(0, 30) + (item.props.length > 30 ? '...' : '');
      
      const propsElement: CanvasElement = {
        id: propsId,
        type: 'text',
        content: propsPreview,
        position: { x: indentedX + 10, y: currentY + 30 },
        x: indentedX + 10,
        y: currentY + 30,
        size: { width: safeElementWidth - 20, height: 16 },
        width: safeElementWidth - 20,
        height: 16,
        isVisible: true,
        isLocked: false,
        isSelected: false,
        zIndex: 3,
        label: `${item.type} Props`,
        rotation: 0,
        opacity: 1,
        parentId,
        styles: {
          fontFamily: 'monospace',
          fontSize: 12,
          color: '#757575',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      };
      
      elements.push(propsElement);
    }
    
    // Move down for the next element
    currentY += elementHeight + elementMargin;
  }
  
  return elements;
}
