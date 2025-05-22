import React from 'react';
import { useEditor } from '../EditorContext';
import { CanvasElement } from '../EditorTypes';
import {
  SidebarSection,
  SidebarSectionTitle,
  PropertyRow,
  PropertyLabel,
  PropertyControl,
  PropertyInput,
  PropertySelect
} from '../styled/SidebarStyles';

const ElementProperties: React.FC = () => {
  const { state, dispatch } = useEditor();
  
  // Get the currently selected element
  const selectedElement = state.selectedElements.length === 1
    ? state.currentCanvas.elements.find(el => el.id === state.selectedElements[0])
    : null;
  
  if (!selectedElement) {
    return (
      <SidebarSection>
        <SidebarSectionTitle>Properties</SidebarSectionTitle>
        <div style={{ color: '#999', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
          Select an element to edit its properties.
        </div>
      </SidebarSection>
    );
  }
  
  // Update position property
  const updatePosition = (axis: 'x' | 'y', value: number) => {
    dispatch({
      type: 'UPDATE_ELEMENT_POSITION',
      payload: {
        id: selectedElement.id,
        position: {
          ...selectedElement.position,
          [axis]: value
        }
      }
    });
  };
  
  // Update size property
  const updateSize = (dimension: 'width' | 'height', value: number) => {
    dispatch({
      type: 'UPDATE_ELEMENT_SIZE',
      payload: {
        id: selectedElement.id,
        size: {
          ...selectedElement.size,
          [dimension]: value
        }
      }
    });
  };
  
  // Update style property
  const updateStyle = (property: string, value: any) => {
    dispatch({
      type: 'UPDATE_ELEMENT_STYLE',
      payload: {
        id: selectedElement.id,
        style: {
          property,
          value
        }
      }
    });
  };
  
  return (
    <SidebarSection>
      <SidebarSectionTitle>Properties</SidebarSectionTitle>
      
      {/* Element type */}
      <PropertyRow>
        <PropertyLabel>Type</PropertyLabel>
        <PropertyControl>
          <PropertyInput 
            type="text" 
            value={selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)} 
            disabled 
          />
        </PropertyControl>
      </PropertyRow>
      
      {/* Position controls */}
      <PropertyRow>
        <PropertyLabel>Position X</PropertyLabel>
        <PropertyControl>
          <PropertyInput 
            type="number" 
            value={selectedElement.position.x} 
            onChange={(e) => updatePosition('x', parseInt(e.target.value))} 
          />
        </PropertyControl>
      </PropertyRow>
      
      <PropertyRow>
        <PropertyLabel>Position Y</PropertyLabel>
        <PropertyControl>
          <PropertyInput 
            type="number" 
            value={selectedElement.position.y} 
            onChange={(e) => updatePosition('y', parseInt(e.target.value))} 
          />
        </PropertyControl>
      </PropertyRow>
      
      {/* Size controls */}
      <PropertyRow>
        <PropertyLabel>Width</PropertyLabel>
        <PropertyControl>
          <PropertyInput 
            type="number" 
            value={selectedElement.size.width} 
            onChange={(e) => updateSize('width', parseInt(e.target.value))} 
          />
        </PropertyControl>
      </PropertyRow>
      
      <PropertyRow>
        <PropertyLabel>Height</PropertyLabel>
        <PropertyControl>
          <PropertyInput 
            type="number" 
            value={selectedElement.size.height} 
            onChange={(e) => updateSize('height', parseInt(e.target.value))} 
          />
        </PropertyControl>
      </PropertyRow>
      
      {/* Text specific controls */}
      {selectedElement.type === 'text' && (
        <>
          <PropertyRow>
            <PropertyLabel>Font Family</PropertyLabel>
            <PropertyControl>
              <PropertySelect 
                value={selectedElement.styles.fontFamily || 'Arial, sans-serif'} 
                onChange={(e) => updateStyle('fontFamily', e.target.value)}
              >
                <option value="Arial, sans-serif">Arial</option>
                <option value="Helvetica, sans-serif">Helvetica</option>
                <option value="Times New Roman, serif">Times New Roman</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="Courier New, monospace">Courier New</option>
                <option value="Verdana, sans-serif">Verdana</option>
              </PropertySelect>
            </PropertyControl>
          </PropertyRow>
          
          <PropertyRow>
            <PropertyLabel>Font Size</PropertyLabel>
            <PropertyControl>
              <PropertyInput 
                type="number" 
                value={selectedElement.styles.fontSize || 16} 
                onChange={(e) => updateStyle('fontSize', parseInt(e.target.value))} 
              />
            </PropertyControl>
          </PropertyRow>
          
          <PropertyRow>
            <PropertyLabel>Color</PropertyLabel>
            <PropertyControl>
              <PropertyInput 
                type="color" 
                value={selectedElement.styles.color || '#000000'} 
                onChange={(e) => updateStyle('color', e.target.value)} 
              />
            </PropertyControl>
          </PropertyRow>
          
          <PropertyRow>
            <PropertyLabel>Text Align</PropertyLabel>
            <PropertyControl>
              <PropertySelect 
                value={selectedElement.styles.textAlign || 'left'} 
                onChange={(e) => updateStyle('textAlign', e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
                <option value="justify">Justify</option>
              </PropertySelect>
            </PropertyControl>
          </PropertyRow>
        </>
      )}
      
      {/* Image or video specific controls */}
      {(selectedElement.type === 'image' || selectedElement.type === 'video') && (
        <PropertyRow>
          <PropertyLabel>Opacity</PropertyLabel>
          <PropertyControl>
            <PropertyInput 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              value={selectedElement.styles.opacity || 1} 
              onChange={(e) => updateStyle('opacity', parseFloat(e.target.value))} 
            />
            <span>{(selectedElement.styles.opacity || 1) * 100}%</span>
          </PropertyControl>
        </PropertyRow>
      )}
    </SidebarSection>
  );
};

export default ElementProperties;
