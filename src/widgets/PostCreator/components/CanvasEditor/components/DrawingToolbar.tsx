import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPencilAlt,
  faEraser,
  faPalette,
  faBrush,
  faCircle,
  faSquare,
  faDrawPolygon,
  faVectorSquare,
  faSlash,
  faMarker,
  faPen,
  faSprayCan,
  faFont,
  faImage,
  faShapes,
  faArrowRight,
  faHandPointer,
  faGripLines
} from '@fortawesome/free-solid-svg-icons';
import { useEditor } from '../EditorContext';
import { ToolType, BrushType, DrawingMode } from '../EditorTypes';
import {
  ToolbarSection,
  ToolbarLabel,
  ToolbarRow,
  Tool,
  ToolbarDivider,
  ColorPickerPanel,
  ColorSwatch,
  BrushOptionsPanel,
  SliderLabel,
  Slider
} from '../styled/ToolbarStyles';

// Additional styled components for vertical layout
const VerticalToolbar = styled.div`
  display: flex;
  flex-direction: column;
  width: 60px;
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  height: 100%;
  overflow-y: auto;
`;

const ToolGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
`;

const VerticalTool = styled(Tool)`
  margin: 8px 0;
`;

const OptionsPanel = styled.div`
  position: absolute;
  left: 60px;
  top: 0;
  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 0 4px 4px 0;
  padding: 8px;
  z-index: 1000;
  width: 200px;
`;

const DrawingToolbar: React.FC = () => {
  const { state, dispatch } = useEditor();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBrushOptions, setShowBrushOptions] = useState(false);
  
  const handleToolSelect = (tool: ToolType) => {
    // When selecting a drawing tool, make sure we're in edit mode
    if (tool === 'drawing' || tool === 'pen' || tool === 'eraser') {
      dispatch({ type: 'SET_MOUSE_MODE', payload: 'edit' });
    }
    
    dispatch({ type: 'SET_ACTIVE_TOOL', payload: tool });
    
    // Log the tool selection for debugging
    console.log(`Tool selected: ${tool}, mouse mode: edit`);
  };
  
  const handleColorSelect = (color: string) => {
    dispatch({ type: 'SET_ACTIVE_COLOR', payload: color });
    setShowColorPicker(false);
  };
  
  const handleBrushSizeChange = (size: number) => {
    dispatch({ type: 'SET_BRUSH_SIZE', payload: size });
  };
  
  const handleBrushTypeChange = (type: BrushType) => {
    dispatch({ type: 'SET_BRUSH_TYPE', payload: type });
  };
  
  const handleBrushOpacityChange = (opacity: number) => {
    dispatch({ type: 'SET_BRUSH_OPACITY', payload: opacity });
  };
  
  const handleDrawingModeChange = (mode: DrawingMode) => {
    dispatch({ type: 'SET_DRAWING_MODE', payload: mode });
  };
  
  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080',
    '#800000', '#808000', '#008000', '#800080', '#008080', '#000080'
  ];
  
  // Helper function to determine if text should be dark or light based on background color
  const getLuminance = (color: string): number => {
    // Simple luminance calculation for hex colors
    let r, g, b;
    if (color.startsWith('#')) {
      const hex = color.substring(1);
      r = parseInt(hex.substr(0, 2), 16) / 255;
      g = parseInt(hex.substr(2, 2), 16) / 255;
      b = parseInt(hex.substr(4, 2), 16) / 255;
    } else {
      // Default values if not a hex color
      r = g = b = 0.5;
    }
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  return (
    <VerticalToolbar>
      {/* Selection tools */}
      <ToolGroup>
        <VerticalTool
          active={state.activeTool === 'select'}
          onClick={() => handleToolSelect('select')}
          title="Selection Tool (V)"
        >
          <FontAwesomeIcon icon={faHandPointer} />
        </VerticalTool>
      </ToolGroup>
      
      {/* Drawing & Shape tools */}
      <ToolGroup>
        <VerticalTool
          active={state.activeTool === 'drawing'}
          onClick={() => handleToolSelect('drawing')}
          title="Pencil Tool (P)"
        >
          <FontAwesomeIcon icon={faPencilAlt} />
        </VerticalTool>
        
        <VerticalTool
          active={state.activeTool === 'pen'}
          onClick={() => handleToolSelect('pen')}
          title="Pen Tool (P)"
        >
          <FontAwesomeIcon icon={faPen} />
        </VerticalTool>
        
        <VerticalTool
          active={state.activeTool === 'shape' && state.drawingMode === 'line'}
          onClick={() => {
            handleToolSelect('shape');
            handleDrawingModeChange('line');
          }}
          title="Line Tool (L)"
        >
          <FontAwesomeIcon icon={faGripLines} />
        </VerticalTool>
        
        <VerticalTool
          active={state.activeTool === 'shape' && state.drawingMode === 'polyline'}
          onClick={() => {
            handleToolSelect('shape');
            handleDrawingModeChange('polyline');
          }}
          title="Arrow Tool (Shift+L)"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </VerticalTool>
        
        <VerticalTool
          active={state.activeTool === 'shape'}
          onClick={() => handleToolSelect('shape')}
          title="Shape Tool (R)"
        >
          <FontAwesomeIcon icon={faShapes} />
        </VerticalTool>
        
        <VerticalTool
          active={state.activeTool === 'text'}
          onClick={() => handleToolSelect('text')}
          title="Text Tool (T)"
        >
          <FontAwesomeIcon icon={faFont} />
        </VerticalTool>
      </ToolGroup>
      
      {/* Media tools */}
      <ToolGroup>
        <VerticalTool
          active={state.activeTool === 'image'}
          onClick={() => handleToolSelect('image')}
          title="Image Tool (I)"
        >
          <FontAwesomeIcon icon={faImage} />
        </VerticalTool>
      </ToolGroup>
      
      {/* Style tools */}
      <ToolGroup>
        <VerticalTool
          onClick={() => setShowColorPicker(!showColorPicker)}
          title="Color Picker"
          style={{ backgroundColor: state.activeColor }}
        >
          <FontAwesomeIcon icon={faPalette} color={getLuminance(state.activeColor) > 0.5 ? '#000' : '#fff'} />
        </VerticalTool>
        
        <VerticalTool
          onClick={() => setShowBrushOptions(!showBrushOptions)}
          title="Brush Options"
        >
          <FontAwesomeIcon icon={faBrush} />
        </VerticalTool>
        
        <VerticalTool
          active={state.activeTool === 'eraser'}
          onClick={() => handleToolSelect('eraser')}
          title="Eraser Tool (E)"
        >
          <FontAwesomeIcon icon={faEraser} />
        </VerticalTool>
      </ToolGroup>
      
      {/* Color picker and brush options panels */}
      {showColorPicker && (
        <OptionsPanel>
          <ToolbarRow style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            {colors.map(color => (
              <ColorSwatch 
                key={color} 
                color={color} 
                active={state.activeColor === color}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </ToolbarRow>
          <ToolbarRow style={{ marginTop: '10px' }}>
            <SliderLabel>Opacity: {state.brushOpacity * 100}%</SliderLabel>
            <Slider 
              type="range" 
              min="0.1" 
              max="1" 
              step="0.1" 
              value={state.brushOpacity} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleBrushOpacityChange(parseFloat(e.target.value))}
            />
          </ToolbarRow>
        </OptionsPanel>
      )}
      
      {showBrushOptions && (
        <OptionsPanel>
          <ToolbarRow>
            <ToolbarLabel>Drawing Mode</ToolbarLabel>
          </ToolbarRow>
          <ToolbarRow>
            <Tool 
              active={state.drawingMode === 'freehand'} 
              onClick={() => handleDrawingModeChange('freehand')}
              title="Freehand Drawing"
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </Tool>
            <Tool 
              active={state.drawingMode === 'line'} 
              onClick={() => handleDrawingModeChange('line')}
              title="Straight Line"
            >
              <FontAwesomeIcon icon={faSlash} />
            </Tool>
            <Tool 
              active={state.drawingMode === 'bezier'} 
              onClick={() => handleDrawingModeChange('bezier')}
              title="Bezier Curve"
            >
              <FontAwesomeIcon icon={faVectorSquare} />
            </Tool>
            <Tool 
              active={state.drawingMode === 'polyline'} 
              onClick={() => handleDrawingModeChange('polyline')}
              title="Polyline"
            >
              <FontAwesomeIcon icon={faDrawPolygon} />
            </Tool>
          </ToolbarRow>
          
          <ToolbarRow>
            <ToolbarLabel>Brush Type</ToolbarLabel>
          </ToolbarRow>
          <ToolbarRow>
            <Tool 
              active={state.brushType === 'round'} 
              onClick={() => handleBrushTypeChange('round')}
              title="Round Brush"
            >
              <FontAwesomeIcon icon={faCircle} />
            </Tool>
            <Tool 
              active={state.brushType === 'square'} 
              onClick={() => handleBrushTypeChange('square')}
              title="Square Brush"
            >
              <FontAwesomeIcon icon={faSquare} />
            </Tool>
            <Tool 
              active={state.brushType === 'marker'} 
              onClick={() => handleBrushTypeChange('marker')}
              title="Marker"
            >
              <FontAwesomeIcon icon={faMarker} />
            </Tool>
            <Tool 
              active={state.brushType === 'pencil'} 
              onClick={() => handleBrushTypeChange('pencil')}
              title="Pencil"
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </Tool>
            <Tool 
              active={state.brushType === 'calligraphy'} 
              onClick={() => handleBrushTypeChange('calligraphy')}
              title="Calligraphy Pen"
            >
              <FontAwesomeIcon icon={faPen} />
            </Tool>
            <Tool 
              active={state.brushType === 'airbrush'} 
              onClick={() => handleBrushTypeChange('airbrush')}
              title="Airbrush"
            >
              <FontAwesomeIcon icon={faSprayCan} />
            </Tool>
          </ToolbarRow>
          
          <ToolbarRow style={{ marginTop: '10px' }}>
            <SliderLabel>Brush Size: {state.brushSize}px</SliderLabel>
            <Slider 
              type="range" 
              min="1" 
              max="50" 
              value={state.brushSize} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleBrushSizeChange(parseInt(e.target.value))}
            />
          </ToolbarRow>
        </OptionsPanel>
      )}
    </VerticalToolbar>
  );
};

export default DrawingToolbar;
