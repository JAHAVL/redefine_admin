import { CanvasElement, ElementType, ElementStyles } from './types';
import { ContainerElement, GroupElement } from '../EditorTypes';

// Parse React/JSX code with improved parsing logic
export const parseReactToElements = (reactCode: string): CanvasElement[] => {
  try {
    console.log('Parsing React code:', reactCode.substring(0, 100) + '...');
    const elements: CanvasElement[] = [];
    
    // Track parent-child relationships
    const childrenMap: Record<string, string[]> = {};
    
    // Start with a container element to hold the rendered components
    const containerElement = {
      id: `container-${Date.now()}`,
      type: 'container' as ElementType,
      content: '',
      position: { x: 100, y: 100 },
      x: 100,
      y: 100,
      size: { width: 500, height: 650 }, // Adjust size to match Instagram post dimensions
      width: 500,
      height: 650,
      isVisible: true,
      isLocked: false,
      isSelected: false,
      zIndex: 0,
      label: 'React Component',
      rotation: 0,
      opacity: 1,
      parentId: undefined, // Root container has no parent
      styles: {
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        padding: 20
      },
      elementIds: [] // Important for container elements
    } as any; // Use type assertion to bypass strict typing for now
    
    elements.push(containerElement);
    
    // Enhanced style extraction approach with hierarchy tracking
    // Matches more complex style patterns including nested JSX
    const extractStyles = (code: string) => {
      // Track element nesting levels
      const elementStack: {
        id: string;
        tag: string;
        startIndex: number;
        endIndex: number;
      }[] = [];
      
      // Track the current parent element
      let currentParentId = containerElement.id;
      
      // JSX style patterns
      // Match different formats of style declarations
      const stylePatterns = [
        // Style with double braces: style={{key: value}}
        /<(\w+)[^>]*style={{([^{}]|{[^{}]*})*}}[^>]*>([\s\S]*?)<\/\1>/g,
        // Style with single braces and quotes: style={key: "value"}
        /<(\w+)[^>]*style={\s*{([^{}]|{[^{}]*})*}\s*}[^>]*>([\s\S]*?)<\/\1>/g,
        // Style with single braces as object: style={styleObject}
        /<(\w+)[^>]*style={\s*([a-zA-Z0-9_]+)\s*}[^>]*>([\s\S]*?)<\/\1>/g,
        // Style with direct attributes: <div width={100} height={200}>
        /<(\w+)[^>]*\b(width|height|top|left|right|bottom|color|backgroundColor)={\s*([^{}]+)\s*}[^>]*>([\s\S]*?)<\/\1>/g
      ];
      
      const allElements: {
        id: string;
        tag: string;
        content: string;
        styleObj: any;
        fullMatch: string;
        startIndex: number;
        endIndex: number;
        parentId?: string;
        children: string[];
      }[] = [];
      
      // Helper function to determine if a property should be a number
      const shouldBeNumber = (prop: string): boolean => {
        const numericProps = [
          'fontSize', 'opacity', 'borderRadius', 'borderWidth', 
          'lineHeight', 'letterSpacing', 'padding', 'rotation', 
          'zIndex', 'brushSize', 'width', 'height', 'top', 'left', 
          'right', 'bottom'
        ];
        return numericProps.includes(prop);
      };
      
      // Process each style pattern
      stylePatterns.forEach(pattern => {
        let match;
        const regex = new RegExp(pattern.source, 'g');
        
        while ((match = regex.exec(code)) !== null) {
          try {
            const tagName = match[1];
            const styleStr = match[2] ? match[2] : '';
            const content = match[3] || '';
            const fullMatch = match[0];
            
            // Calculate element metadata
            const startIndex = match.index;
            const endIndex = regex.lastIndex;
            
            // Create a unique ID for this element
            const elemId = `react-${tagName}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            
            // Find the appropriate parent for this element based on nesting
            let parentId = currentParentId;
            for (let i = elementStack.length - 1; i >= 0; i--) {
              const stackElem = elementStack[i];
              if (startIndex > stackElem.startIndex && endIndex < stackElem.endIndex) {
                parentId = stackElem.id;
                break;
              }
            }
            
            // Initialize or add to the children map
            if (parentId) {
              if (!childrenMap[parentId]) {
                childrenMap[parentId] = [];
              }
              childrenMap[parentId].push(elemId);
            }
            
            // Push this element to the stack for tracking children
            elementStack.push({
              id: elemId,
              tag: tagName,
              startIndex,
              endIndex
            });
            
            // Convert style string to object
            let styleObj: ElementStyles = {};
            
            // Different formats need different parsing
            if (styleStr.includes(':')) {
              // It's an inline style object syntax
              const sanitizedStyle = styleStr
                .replace(/^{|}/g, '')
                .replace(/'/g, '"')
                .replace(/(\w+):/g, '"$1":')
                .replace(/,\s*$/, '')
                .replace(/undefined/g, 'null')
                .replace(/(\d+)px/g, '$1')
                .replace(/"/g, '"')
                .replace(/'/g, '"');
              
              try {
                // Try to parse the style string as JSON
                styleObj = JSON.parse(`{${sanitizedStyle}}`);
              } catch (e) {
                console.warn('Could not parse style object:', styleStr, e);
                // Try a more lenient approach for cases with comments or complex syntax
                const styleProperties = styleStr.match(/(\w+):\s*([^,]+),?/g);
                if (styleProperties) {
                  styleProperties.forEach(prop => {
                    const [key, value] = prop.split(':').map(s => s.trim());
                    if (key && value) {
                      // Remove trailing commas and convert pixel values to numbers
                      let cleanValue = value.replace(/,\s*$/, '').replace(/(\d+)px/, '$1');
                      
                      // Try to convert string numbers to actual numbers
                      if (!isNaN(Number(cleanValue)) && shouldBeNumber(key)) {
                        styleObj[key] = Number(cleanValue);
                      } else {
                        styleObj[key] = cleanValue.replace(/['"]/g, '');
                      }
                    }
                  });
                }
              }
            }
            
            // Extract position and dimension properties from direct attributes
            if (match[4]) {
              // This matched the direct attribute pattern
              const attribute = match[2];
              const value = match[3];
              
              // Convert to number if possible and the property should be a number
              let parsedValue: string | number = value;
              if (!isNaN(Number(value)) && shouldBeNumber(attribute)) {
                parsedValue = Number(value);
              }
              
              styleObj[attribute] = parsedValue;
            }
            
            allElements.push({
              id: elemId,
              tag: tagName,
              content,
              styleObj,
              fullMatch,
              startIndex,
              endIndex,
              parentId,
              children: []
            });
            
            // Recursively process nested content if it has HTML tags
            if (content && content.includes('<') && content.includes('</')) {
              // This has nested elements, we'll analyze them separately
              currentParentId = elemId;
            } else if (content && !content.includes('<') && !content.trim().startsWith('{')) {
              // This is a text content
              const textId = `text-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
              const textObj = {
                id: textId,
                tag: 'text',
                content: content.trim(),
                styleObj: { ...styleObj },
                fullMatch: content,
                startIndex: startIndex + fullMatch.indexOf(content),
                endIndex: startIndex + fullMatch.indexOf(content) + content.length,
                parentId: elemId,
                children: []
              };
              allElements.push(textObj);
            }
          } catch (error) {
            console.error('Error processing style pattern match:', error);
          }
        }
      });
      
      // Match any direct text elements with special handling for whitespace
      const textRegex = />([^<>{}]+)</g;
      let textMatch;
      while ((textMatch = textRegex.exec(code)) !== null) {
        const text = textMatch[1].trim();
        if (text && !text.match(/^\s*$/)) {
          // Try to find the parent element that contains this text
          let parentId = containerElement.id;
          for (let i = 0; i < allElements.length; i++) {
            const elem = allElements[i];
            if (textMatch.index > elem.startIndex && textMatch.index < elem.endIndex) {
              parentId = elem.id;
              break;
            }
          }
          
          const textId = `text-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          allElements.push({
            id: textId,
            tag: 'text',
            content: text,
            styleObj: {},
            fullMatch: text,
            startIndex: textMatch.index + 1,
            endIndex: textMatch.index + text.length + 1,
            parentId,
            children: []
          });
        }
      }
      
      // Look for image elements
      const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*\/?>/g;
      let imgMatch;
      while ((imgMatch = imgRegex.exec(code)) !== null) {
        try {
          const imgSrc = imgMatch[1];
          const fullMatch = imgMatch[0];
          const startIndex = imgMatch.index;
          const endIndex = imgRegex.lastIndex;
          
          // Find the parent for this image
          let parentId = containerElement.id;
          for (let i = 0; i < allElements.length; i++) {
            const elem = allElements[i];
            if (startIndex > elem.startIndex && endIndex < elem.endIndex) {
              parentId = elem.id;
              break;
            }
          }
          
          // Extract style attributes from the img tag
          const styleAttrMatch = fullMatch.match(/style={\s*{([^{}]*)}\s*}/);
          let styleObj: ElementStyles = {};
          
          if (styleAttrMatch) {
            const styleStr = styleAttrMatch[1];
            const sanitizedStyle = styleStr
              .replace(/'/g, '"')
              .replace(/(\w+):/g, '"$1":')
              .replace(/,\s*$/, '')
              .replace(/(\d+)px/g, '$1');
            
            try {
              styleObj = JSON.parse(`{${sanitizedStyle}}`);
            } catch (e) {
              console.warn('Could not parse image style:', styleStr);
            }
          }
          
          // Extract direct attributes (width, height, etc.)
          const widthMatch = fullMatch.match(/width=["']?(\d+)["']?/);
          const heightMatch = fullMatch.match(/height=["']?(\d+)["']?/);
          
          if (widthMatch) styleObj.width = parseInt(widthMatch[1], 10);
          if (heightMatch) styleObj.height = parseInt(heightMatch[1], 10);
          
          const imgId = `img-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          allElements.push({
            id: imgId,
            tag: 'img',
            content: imgSrc,
            styleObj,
            fullMatch,
            startIndex,
            endIndex,
            parentId,
            children: []
          });
        } catch (error) {
          console.error('Error processing image element:', error);
        }
      }
      
      // Build parent-child relationships
      allElements.forEach(elem => {
        if (elem.parentId) {
          const parent = allElements.find(e => e.id === elem.parentId);
          if (parent) {
            parent.children.push(elem.id);
          }
        }
      });
      
      return allElements;
    };
    
    // Process the React code to extract elements
    const extractedElements = extractStyles(reactCode);
    
    // Helper to get the best position for an element based on its parent
    const getElementPosition = (elem: any, parentElem?: any) => {
      if (!parentElem) {
        return { x: 100, y: 100 };
      }
      
      // Calculate relative position within parent
      const offsetX = (elem.styleObj.left || 0) + (parentElem?.styleObj?.padding || 0);
      const offsetY = (elem.styleObj.top || 0) + (parentElem?.styleObj?.padding || 0);
      
      return {
        x: parentElem.x + offsetX,
        y: parentElem.y + offsetY
      };
    };
    
    // Helper to get element size
    const getElementSize = (elem: any, parentElem?: any) => {
      const width = elem.styleObj?.width || (elem.tag === 'text' ? 200 : 100);
      const height = elem.styleObj?.height || (elem.tag === 'text' ? 30 : 100);
      
      return { width, height };
    };
    
    // Convert extracted elements to canvas elements
    let id = 1;
    extractedElements.forEach(elem => {
      const { tag, content, styleObj, parentId } = elem;
      
      // Find parent element for positioning
      const parentElem = parentId 
        ? extractedElements.find(e => e.id === parentId) 
        : null;
      
      // Determine element type based on tag and content
      let elementType: ElementType = 'container';
      
      if (tag === 'img' || content.includes('url(') || styleObj?.backgroundImage) {
        elementType = 'image';
      } else if (tag === 'text' || tag === 'p' || tag === 'h1' || tag === 'h2' || tag === 'h3' || 
                tag === 'h4' || tag === 'h5' || tag === 'h6' || tag === 'span' || 
                content.trim().length > 0) {
        elementType = 'text';
      } else if (styleObj?.backgroundColor || styleObj?.borderRadius || 
                styleObj?.border || styleObj?.boxShadow) {
        elementType = 'shape';
      }
      
      // Set content based on element type
      let elementContent = '';
      if (elementType === 'image') {
        // For images, content is the src URL
        if (tag === 'img') {
          elementContent = content;
        } else if (styleObj?.backgroundImage) {
          // Extract URL from backgroundImage
          const bgImgMatch = String(styleObj.backgroundImage).match(/url\(['"]?([^'"()]+)['"]?\)/);
          if (bgImgMatch) {
            elementContent = bgImgMatch[1];
            elementType = 'image';
          }
        }
      } else if (elementType === 'text') {
        // For text, content is the text itself
        elementContent = content.trim();
      }
      
      // Get position and size
      const position = getElementPosition(elem, parentElem);
      const size = getElementSize(elem, parentElem);
      
      // Skip generating elements that don't have enough information
      if (!elementContent && elementType !== 'shape' && elementType !== 'container' && tag !== 'div') {
        return;
      }
      
      // Clean up the style object for better rendering
      const cleanStyles = { ...styleObj };
      
      // Convert string values with units to numbers
      Object.keys(cleanStyles).forEach(key => {
        const value = cleanStyles[key];
        if (typeof value === 'string') {
          // Convert pixel values to numbers
          if (value.endsWith('px')) {
            const numValue = parseFloat(value.replace('px', ''));
            if (!isNaN(numValue)) {
              cleanStyles[key] = numValue;
            }
          }
          
          // Convert percentage values for specific properties
          if (value.endsWith('%') && ['width', 'height'].includes(key)) {
            const percentage = parseFloat(value.replace('%', ''));
            if (!isNaN(percentage)) {
              // Convert percentage to actual pixel value based on container size
              if (key === 'width') {
                cleanStyles[key] = (percentage / 100) * ((parentElem?.styleObj?.width as number) ?? 500);
              } else if (key === 'height') {
                cleanStyles[key] = (percentage / 100) * ((parentElem?.styleObj?.height as number) ?? 500);
              }
            }
          }
        }
      });
      
      // Get a more descriptive label
      const getElementLabel = () => {
        if (elementType === 'container') {
          return `Container ${id}`;
        } else if (elementType === 'text') {
          const shortContent = elementContent.substring(0, 15);
          return `Text: ${shortContent}${elementContent.length > 15 ? '...' : ''}`;
        } else if (elementType === 'image') {
          return `Image ${id}`;
        } else {
          return `${elementType.charAt(0).toUpperCase() + elementType.slice(1)} ${id}`;
        }
      };
      
      // Create the canvas element with conditional properties
      const createCanvasElement = () => {
        // Common properties
        const commonProps = {
          id: elem.id,
          type: elementType,
          content: elementContent,
          position: position,
          x: position.x,
          y: position.y,
          size: size,
          width: size.width,
          height: size.height,
          isVisible: true,
          isLocked: false,
          isSelected: false,
          zIndex: id,
          label: getElementLabel(),
          rotation: styleObj?.rotation ? parseFloat(String(styleObj.rotation)) : 0,
          opacity: styleObj?.opacity ? parseFloat(String(styleObj.opacity)) : 1,
          styles: cleanStyles,
          parentId: parentId === containerElement.id ? undefined : parentId
        };
        
        // Return appropriate element type
        if (elementType === 'container') {
          return {
            ...commonProps,
            elementIds: childrenMap[elem.id] || []
          };
        } else {
          return commonProps;
        }
      };
      
      // Build the canvas element
      const element = createCanvasElement();
      
      elements.push(element);
      id++;
    });
    
    // Add all top-level elements to the main container
    const rootElements = elements.filter(el => el.id !== containerElement.id && !el.parentId);
    containerElement.elementIds = rootElements.map(el => el.id);
    
    // If we couldn't parse any elements, log a message
    if (elements.length <= 1) {
      console.log('No elements were parsed from React code');
    }
    
    console.log(`Created ${elements.length} elements from React code`);
    return elements;
  } catch (error) {
    console.error('Error in React parsing:', error);
    
    // Return a default element on error
    return [{
      id: `error-${Date.now()}`,
      type: 'text' as ElementType,
      content: 'Error parsing React code',
      position: { x: 100, y: 100 },
      x: 100,
      y: 100,
      size: { width: 300, height: 50 },
      width: 300,
      height: 50,
      isVisible: true,
      isLocked: false,
      isSelected: false,
      zIndex: 1,
      label: 'Error',
      styles: {
        color: '#ff0000',
        fontFamily: 'Arial',
        fontSize: 16
      }
    }];
  }
};

// Parse HTML to Canvas Elements
export const parseHtmlToElements = (html: string): CanvasElement[] => {
  const elements: CanvasElement[] = [];
  const divRegex = /<div[^>]*class="([^"]*)"[^>]*style="([^"]*)"[^>]*>(.*?)<\/div>/g;
  const imgRegex = /<img[^>]*src="([^"]*)"[^>]*style="([^"]*)"[^>]*>/g;
  
  let match;
  let id = 1;
  
  // Parse divs
  while ((match = divRegex.exec(html)) !== null) {
    const className = match[1];
    const styleString = match[2];
    const content = match[3] || '';
    
    const styles: Record<string, string> = {};
    const position = { x: 0, y: 0 };
    const size = { width: 0, height: 0 };
    
    // Parse individual styles
    const styleAttrs = styleString.split(';');
    
    for (const attr of styleAttrs) {
      const [key, value] = attr.split(':').map(s => s.trim());
      if (!key || !value) continue;
      
      // Remove the semicolon if present
      const cleanValue = value.endsWith(';') ? value.slice(0, -1) : value;
      
      if (key === 'left') {
        position.x = parseInt(cleanValue, 10);
      } else if (key === 'top') {
        position.y = parseInt(cleanValue, 10);
      } else if (key === 'width') {
        size.width = parseInt(cleanValue, 10);
      } else if (key === 'height') {
        size.height = parseInt(cleanValue, 10);
      } else {
        // Convert kebab-case to camelCase for style properties
        const camelProperty = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        styles[camelProperty] = cleanValue;
      }
    }
    
    const element: CanvasElement = {
      id: `el-${id++}`,
      type: className.includes('text') ? 'text' as ElementType : 'shape' as ElementType,
      content: content,
      position,
      x: position.x as number,
      y: position.y as number,
      size,
      width: size.width as number,
      height: size.height as number,
      isVisible: true,
      isLocked: false,
      isSelected: false,
      label: className.includes('text') ? `Text Element ${id}` : `Shape Element ${id}`,
      zIndex: 0,
      rotation: 0,
      opacity: 1,
      styles: {
        backgroundColor: styles['background-color'] || '#ccc'
      }
    };
    
    elements.push(element);
  }
  
  // Parse images
  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    const styleString = match[2];
    
    const styles: Record<string, string> = {};
    const position = { x: 0, y: 0 };
    const size = { width: 0, height: 0 };
    
    // Parse individual styles
    const styleAttrs = styleString.split(';');
    
    for (const attr of styleAttrs) {
      const [key, value] = attr.split(':').map(s => s.trim());
      if (!key || !value) continue;
      
      // Remove the semicolon if present
      const cleanValue = value.endsWith(';') ? value.slice(0, -1) : value;
      
      if (key === 'left') {
        position.x = parseInt(cleanValue, 10);
      } else if (key === 'top') {
        position.y = parseInt(cleanValue, 10);
      } else if (key === 'width') {
        size.width = parseInt(cleanValue, 10);
      } else if (key === 'height') {
        size.height = parseInt(cleanValue, 10);
      } else {
        styles[key] = cleanValue;
      }
    }
    
    const element: CanvasElement = {
      id: `el-${id++}`,
      type: 'image' as ElementType,
      content: src,
      position,
      x: position.x as number,
      y: position.y as number,
      size,
      width: size.width as number,
      height: size.height as number,
      isVisible: true,
      isLocked: false,
      isSelected: false,
      label: `Image Element ${id}`,
      zIndex: 0,
      rotation: 0,
      opacity: 1,
      styles
    };
    
    elements.push(element);
  }
  
  return elements;
};

// Parse CSS to Canvas Elements (for updating existing elements with styles)
export const parseCssToElements = (css: string): Partial<CanvasElement>[] => {
  const elementRegex = /\.element-(\d+)\s*\{([^}]+)\}/g;
  const elements: Partial<CanvasElement>[] = [];
  
  let match;
  
  while ((match = elementRegex.exec(css)) !== null) {
    const index = parseInt(match[1], 10);
    const styleBlock = match[2];
    
    const styles: Record<string, string> = {};
    const position = { x: 0, y: 0 };
    const size = { width: 0, height: 0 };
    
    // Parse individual styles
    const styleLines = styleBlock.split('\n');
    
    for (const line of styleLines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      const [property, value] = trimmed.split(':').map(s => s.trim());
      if (!property || !value) continue;
      
      // Remove the semicolon if present
      const cleanValue = value.endsWith(';') ? value.slice(0, -1) : value;
      
      if (property === 'left') {
        position.x = parseInt(cleanValue, 10);
      } else if (property === 'top') {
        position.y = parseInt(cleanValue, 10);
      } else if (property === 'width') {
        size.width = parseInt(cleanValue, 10);
      } else if (property === 'height') {
        size.height = parseInt(cleanValue, 10);
      } else {
        // Convert kebab-case to camelCase for style properties
        const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        styles[camelProperty] = cleanValue;
      }
    }
    
    elements[index] = {
      position,
      x: position.x as number,
      y: position.y as number,
      size,
      width: size.width as number,
      height: size.height as number,
      styles
    };
  }
  
  return elements;
};

// Render code to canvas by updating elements
export const renderCodeToCanvas = (code: string, format: string, dispatch: any) => {
  try {
    let elements: CanvasElement[] = [];
    
    switch (format) {
      case 'html':
        elements = parseHtmlToElements(code);
        break;
      case 'css':
        const cssElements = parseCssToElements(code);
        // This would need to update existing elements rather than create new ones
        console.log('CSS elements parsed:', cssElements);
        break;
      case 'react':
        elements = parseReactToElements(code);
        break;
      default:
        console.warn('Unsupported format for rendering code to canvas:', format);
        return;
    }
    
    if (elements.length > 0) {
      console.log('Parsed elements from code:', elements);
      
      // First clear the canvas (keep background)
      dispatch({ 
        type: 'CLEAR_CANVAS',
        payload: { keepBackground: true }
      });
      
      // Add each element individually to the canvas
      elements.forEach(element => {
        console.log(`Adding element to canvas:`, element);
        dispatch({
          type: 'ADD_ELEMENT',
          payload: element
        });
      });
      
      console.log(`Rendered ${elements.length} elements from ${format} code to canvas`);
    }
  } catch (error) {
    console.error('Error rendering code to canvas:', error);
  }
};
