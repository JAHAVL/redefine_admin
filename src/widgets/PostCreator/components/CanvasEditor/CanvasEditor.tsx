import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faMinus,
  faSearch,
  faArrowsAlt,
  faHandPaper,
  faMagic,
  faPencilAlt,
  faEraser,
  faFont,
  faShapes,
  faImage as faImageIcon,
  faLock,
  faLockOpen,
  faEye,
  faEyeSlash,
  faTh,
  faLayerGroup,
  faAdjust as faSliders,
  faImages,
  faComment,
  faHistory,
  faCode,
  faSave,
  faShareSquare,
  faEdit,
  faFileAlt,
  faCalendarAlt,
  faCropAlt,
  faCaretDown,
  faChevronRight,
  faChevronDown,
  faExpand
} from '@fortawesome/free-solid-svg-icons';
import { EditorProvider, useEditor } from './EditorContext';
import { 
  Canvas as CanvasType,
  Position,
  Comment
} from './EditorTypes';

// Import components
import DrawingToolbar from './components/DrawingToolbar';
import Layers from './components/Layers';
import CodePanel from './components/CodePanel';

// Styled components to ensure full container filling
const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  padding: 0 16px;
  z-index: 10;
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
`;

const ToolbarCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
`;

const StatusTabs = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 4px;
`;

interface StatusTabProps {
  active?: boolean;
}

const StatusTab = styled.div<StatusTabProps>`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: ${(props: StatusTabProps) => props.active ? '600' : '400'};
  color: ${(props: StatusTabProps) => props.active ? '#1976d2' : '#666'};
  background-color: ${(props: StatusTabProps) => props.active ? '#fff' : 'transparent'};
  box-shadow: ${(props: StatusTabProps) => props.active ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'};
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 2px;
  
  &:hover {
    background-color: ${(props: StatusTabProps) => props.active ? '#fff' : '#eeeeee'};
  }
  
  svg {
    margin-right: 8px;
  }
`;

const EditorContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
  height: calc(100% - 60px); /* Subtract toolbar height */
`;

const CanvasContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface CanvasWrapperProps {
  scale: number;
  offsetX: number;
  offsetY: number;
}

const CanvasWrapper = styled.div<CanvasWrapperProps>`
  position: absolute;
  transform: scale(${(props: CanvasWrapperProps) => props.scale}) translate(${(props: CanvasWrapperProps) => props.offsetX}px, ${(props: CanvasWrapperProps) => props.offsetY}px);
  transform-origin: center;
  transition: transform 0.1s ease-out;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

interface CanvasAreaProps {
  width: number;
  height: number;
  backgroundColor: string;
}

const CanvasArea = styled.div<CanvasAreaProps>`
  position: relative;
  width: ${(props: CanvasAreaProps) => props.width}px;
  height: ${(props: CanvasAreaProps) => props.height}px;
  background-color: ${(props: CanvasAreaProps) => props.backgroundColor};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease, height 0.3s ease;
`;

const CanvasGridBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
`;

const CanvasDimensions = styled.div`
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  pointer-events: none;
`;

const RightSidebar = styled.div`
  width: 260px;
  background-color: #fff;
  border-left: 1px solid #e0e0e0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 5;
`;

interface ToolProps {
  active?: boolean;
}

const Tool = styled.button<ToolProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  margin: 0 4px;
  border: 1px solid ${(props: ToolProps) => props.active ? '#2196f3' : '#e0e0e0'};
  background-color: ${(props: ToolProps) => props.active ? '#e3f2fd' : 'white'};
  color: ${(props: ToolProps) => props.active ? '#1976d2' : '#666'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${(props: ToolProps) => props.active ? '#bbdefb' : '#f5f5f5'};
  }
`;

const ToolbarSection = styled.div`
  padding: 12px;
  border-bottom: 1px solid #eee;
`;

const SidebarTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #333;
`;

const SidebarTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  justify-content: center;
`;

interface SidebarTabProps {
  active?: boolean;
}

const SidebarTab = styled.div<SidebarTabProps>`
  padding: 12px;
  font-size: 13px;
  font-weight: ${(props: SidebarTabProps) => props.active ? '600' : '400'};
  color: ${(props: SidebarTabProps) => props.active ? '#1976d2' : '#666'};
  border-bottom: 2px solid ${(props: SidebarTabProps) => props.active ? '#1976d2' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${(props: SidebarTabProps) => props.active ? '#1976d2' : '#333'};
    background-color: ${(props: SidebarTabProps) => props.active ? '#f5f9ff' : '#f5f5f5'};
  }
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    font-size: 16px;
  }
`;

const SidebarTabTooltip = styled.span`
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  pointer-events: none;
  white-space: nowrap;
  z-index: 100;
`;

const SidebarTabContainer = styled.div`
  position: relative;
  
  &:hover ${SidebarTabTooltip} {
    opacity: 1;
    visibility: visible;
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const SidebarSection = styled.div`
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
`;

const LayerItem = styled.div`
  padding: 8px 10px;
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 13px;
  color: #555;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const CommentItem = styled.div`
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 13px;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  
  .comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;
    
    .user {
      font-weight: 600;
      color: #333;
    }
    
    .time {
      font-size: 11px;
      color: #999;
    }
  }
  
  .comment-content {
    color: #555;
  }
`;

const RevisionList = styled.div`
  padding: 6px 0;
`;

const RevisionItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  .revision-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    
    .version {
      font-weight: 600;
      color: #333;
    }
    
    .time {
      font-size: 11px;
      color: #999;
    }
  }
  
  .revision-content {
    font-size: 12px;
    color: #777;
  }
`;

const LibraryItem = styled.div`
  width: calc(50% - 6px);
  height: 100px;
  border-radius: 4px;
  margin-bottom: 12px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LibraryGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 8px;
`;

const ToolBarButtonGroup = styled.div`
  display: flex;
  margin-top: 10px;
`;

const SmallButton = styled.button`
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  color: #333;
  margin-right: 8px;
  cursor: pointer;
  
  &:hover {
    background-color: #e8e8e8;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  background-color: #fff;
  color: #333;
  border: 1px solid #e0e0e0;
  margin-left: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &.primary {
    background-color: #1976d2;
    color: white;
    border: 1px solid #1976d2;
    
    &:hover {
      background-color: #1565c0;
    }
  }
  
  svg {
    margin-right: 8px;
  }
`;

const AspectRatioSelector = styled.div`
  position: relative;
  margin-right: 16px;
`;

const AspectRatioButton = styled.button`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 4px;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e8e8e8;
  }
  
  svg {
    margin-right: 8px;
    font-size: 14px;
  }
  
  .dropdown-icon {
    margin-left: 6px;
    margin-right: 0;
    font-size: 12px;
  }
`;

const AspectRatioDropdown = styled.div<{isOpen: boolean}>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 220px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
  display: ${(props: {isOpen: boolean}) => props.isOpen ? 'block' : 'none'};
  padding: 4px 0;
  margin-top: 4px;
`;

const DropdownSection = styled.div`
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const DropdownSectionTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  padding: 0 12px 4px;
`;

const DropdownItem = styled.div<{active?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 13px;
  color: ${(props: {active?: boolean}) => props.active ? '#1976d2' : '#333'};
  background-color: ${(props: {active?: boolean}) => props.active ? '#e3f2fd' : 'transparent'};
  cursor: pointer;
  
  &:hover {
    background-color: ${(props: {active?: boolean}) => props.active ? '#e3f2fd' : '#f5f5f5'};
  }
  
  .dimensions {
    color: #999;
    font-size: 12px;
  }
`;

// Export for backward compatibility
export const defaultCanvas: CanvasType = {
  id: uuidv4(),
  name: 'Untitled Design',
  width: 1080,
  height: 1080,
  backgroundType: 'color',
  backgroundColor: '#ffffff',
  backgroundImage: '',
  elements: []
};

// Status/workflow tabs component
const WorkflowTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('design');
  
  return (
    <StatusTabs>
      <StatusTab 
        active={activeTab === 'design'} 
        onClick={() => setActiveTab('design')}
      >
        <FontAwesomeIcon icon={faPencilAlt} />
        Design
      </StatusTab>
      <StatusTab 
        active={activeTab === 'content'} 
        onClick={() => setActiveTab('content')}
      >
        <FontAwesomeIcon icon={faFileAlt} />
        Content
      </StatusTab>
      <StatusTab 
        active={activeTab === 'preview'} 
        onClick={() => setActiveTab('preview')}
      >
        <FontAwesomeIcon icon={faEye} />
        Preview
      </StatusTab>
      <StatusTab 
        active={activeTab === 'schedule'} 
        onClick={() => setActiveTab('schedule')}
      >
        <FontAwesomeIcon icon={faCalendarAlt} />
        Schedule
      </StatusTab>
    </StatusTabs>
  );
};

// Simple MouseMode selector component
const MouseModeSelector: React.FC = () => {
  const { state, dispatch } = useEditor();
  
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Tool 
        active={state.mouseMode === 'edit'} 
        onClick={() => dispatch({ type: 'SET_MOUSE_MODE', payload: 'edit' })}
        title="Edit Mode"
      >
        <FontAwesomeIcon icon={faEdit} />
      </Tool>
      <Tool 
        active={state.mouseMode === 'comment'} 
        onClick={() => dispatch({ type: 'SET_MOUSE_MODE', payload: 'comment' })}
        title="Comment Mode"
      >
        <FontAwesomeIcon icon={faComment} />
      </Tool>
      <Tool 
        active={state.mouseMode === 'navigate'} 
        onClick={() => dispatch({ type: 'SET_MOUSE_MODE', payload: 'navigate' })}
        title="Navigate Mode"
      >
        <FontAwesomeIcon icon={faArrowsAlt} />
      </Tool>
    </div>
  );
};

// Simple DrawingTools component
const DrawingTools: React.FC = () => {
  const { state, dispatch } = useEditor();
  
  return (
    <ToolbarSection>
      <SidebarTitle>Drawing Tools</SidebarTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <Tool 
          active={state.activeTool === 'drawing'} 
          onClick={() => dispatch({ type: 'SET_ACTIVE_TOOL', payload: 'drawing' })}
          title="Drawing Tool"
        >
          <FontAwesomeIcon icon={faPencilAlt} />
        </Tool>
        <Tool 
          active={state.activeTool === 'eraser'} 
          onClick={() => dispatch({ type: 'SET_ACTIVE_TOOL', payload: 'eraser' })}
          title="Eraser"
        >
          <FontAwesomeIcon icon={faEraser} />
        </Tool>
      </div>
    </ToolbarSection>
  );
};

// Simple Canvas component
const Canvas: React.FC = () => {
  const { state } = useEditor();
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [autoScale, setAutoScale] = React.useState(1);
  
  // Auto-scale the canvas to fit the container
  React.useEffect(() => {
    const resizeCanvas = () => {
      if (!containerRef.current || !canvasRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      const canvasWidth = state.currentCanvas.width;
      const canvasHeight = state.currentCanvas.height;
      
      // Calculate scale to fit with padding
      const maxWidth = containerWidth - 100; // 50px padding on each side
      const maxHeight = containerHeight - 100; // 50px padding on each side
      
      const scaleX = maxWidth / canvasWidth;
      const scaleY = maxHeight / canvasHeight;
      
      // Use the smaller scale to ensure the entire canvas fits
      const newScale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 100%
      
      setAutoScale(newScale);
    };
    
    resizeCanvas();
    
    // Add event listener for window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [state.currentCanvas.width, state.currentCanvas.height]);
  
  // Apply the calculated auto-scale and the user's manual scale
  const finalScale = autoScale * state.scale;
  
  return (
    <CanvasContainer ref={containerRef}>
      <CanvasWrapper
        ref={canvasRef}
        scale={finalScale}
        offsetX={state.offset.x}
        offsetY={state.offset.y}
      >
        <CanvasArea
          width={state.currentCanvas.width}
          height={state.currentCanvas.height}
          backgroundColor={state.currentCanvas.backgroundColor || '#ffffff'}
        >
          <CanvasGridBackground />
          {/* Render all canvas elements */}
          {state.currentCanvas.elements.map((element) => {
            // Skip rendering elements that aren't visible
            if (!element.isVisible) return null;
            
            // Determine the styles based on element properties
            const elementStyle = {
              position: 'absolute' as const,
              left: `${element.position.x}px`,
              top: `${element.position.y}px`,
              width: `${element.size.width}px`,
              height: `${element.size.height}px`,
              zIndex: element.zIndex,
              backgroundColor: element.styles.backgroundColor,
              color: element.styles.color,
              fontFamily: element.styles.fontFamily,
              fontSize: element.styles.fontSize,
              borderRadius: element.styles.borderRadius ? `${element.styles.borderRadius}px` : undefined,
              border: element.isSelected ? '1px solid #1976d2' : 'none',
              boxShadow: element.isSelected ? '0 0 0 1px rgba(25, 118, 210, 0.5)' : 'none',
              pointerEvents: element.isLocked ? 'none' as const : 'auto' as const,
              display: 'flex',
              alignItems: element.type === 'text' ? 'center' : 'flex-start',
              justifyContent: element.type === 'text' ? 'center' : 'flex-start',
              overflow: 'hidden',
              boxSizing: 'border-box' as const
            };
            
            // Render different types of elements
            switch (element.type) {
              case 'text':
                return (
                  <div
                    key={element.id}
                    style={elementStyle}
                    className={`canvas-element text-element ${element.isSelected ? 'selected' : ''}`}
                    data-element-id={element.id}
                  >
                    {element.content}
                  </div>
                );
              
              case 'image':
                return (
                  <div
                    key={element.id}
                    style={elementStyle}
                    className={`canvas-element image-element ${element.isSelected ? 'selected' : ''}`}
                    data-element-id={element.id}
                  >
                    <img 
                      src={element.content} 
                      alt={element.label} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                );
              
              case 'shape':
                return (
                  <div
                    key={element.id}
                    style={elementStyle}
                    className={`canvas-element shape-element ${element.isSelected ? 'selected' : ''}`}
                    data-element-id={element.id}
                  />
                );
              
              case 'container':
                return (
                  <div
                    key={element.id}
                    style={{
                      ...elementStyle,
                      backgroundColor: element.styles.backgroundColor || 'rgba(240, 240, 240, 0.6)',
                      border: '1px dashed #aaa'
                    }}
                    className={`canvas-element container-element ${element.isSelected ? 'selected' : ''}`}
                    data-element-id={element.id}
                  >
                    {/* Container can be empty or contain nested elements */}
                    {element.label && (
                      <div style={{ 
                        position: 'absolute', 
                        top: '-20px', 
                        left: '0', 
                        fontSize: '12px',
                        color: '#666',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        padding: '2px 5px',
                        borderRadius: '3px'
                      }}>
                        {element.label}
                      </div>
                    )}
                  </div>
                );
              
              case 'drawing':
                return (
                  <div
                    key={element.id}
                    style={elementStyle}
                    className={`canvas-element drawing-element ${element.isSelected ? 'selected' : ''}`}
                    data-element-id={element.id}
                  >
                    {/* Rendering paths is more complex and would need SVG implementation */}
                    <div style={{ fontSize: '12px', textAlign: 'center' }}>
                      {element.label || 'Drawing'}
                    </div>
                  </div>
                );
              
              default:
                return (
                  <div
                    key={element.id}
                    style={elementStyle}
                    className={`canvas-element ${element.isSelected ? 'selected' : ''}`}
                    data-element-id={element.id}
                  >
                    {element.label || 'Element'}
                  </div>
                );
            }
          })}
        </CanvasArea>
        <CanvasDimensions>
          {state.currentCanvas.width} × {state.currentCanvas.height}
        </CanvasDimensions>
      </CanvasWrapper>
    </CanvasContainer>
  );
};

// Interface for component props
interface CanvasEditorProps {
  initialCanvas?: Partial<CanvasType>;
  onSave?: (canvas: CanvasType) => void;
  initialComments?: Comment[];
}

// Simple editor content - directly embedded for now
const CanvasEditorContent: React.FC = () => {
  const { state, dispatch } = useEditor();
  const [activeTab, setActiveTab] = useState<string>('layers');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    shapes: true,
    text: true,
    images: true
  });
  const [aspectRatioOpen, setAspectRatioOpen] = useState(false);
  const [currentCanvasSize, setCurrentCanvasSize] = useState({
    name: 'Instagram Square',
    width: 1080,
    height: 1080
  });
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const canvasSizes = {
    instagram: [
      { name: 'Instagram Square', width: 1080, height: 1080 },
      { name: 'Instagram Portrait', width: 1080, height: 1350 },
      { name: 'Instagram Landscape', width: 1080, height: 608 },
      { name: 'Instagram Story', width: 1080, height: 1920 }
    ],
    facebook: [
      { name: 'Facebook Post', width: 1200, height: 630 },
      { name: 'Facebook Cover', width: 851, height: 315 },
      { name: 'Facebook Event Cover', width: 1920, height: 1080 }
    ],
    twitter: [
      { name: 'Twitter Post', width: 1200, height: 675 },
      { name: 'Twitter Header', width: 1500, height: 500 }
    ],
    linkedin: [
      { name: 'LinkedIn Post', width: 1200, height: 627 },
      { name: 'LinkedIn Banner', width: 1584, height: 396 }
    ]
  };
  
  const changeCanvasSize = (size: {name: string, width: number, height: number}) => {
    setCurrentCanvasSize(size);
    dispatch({ 
      type: 'UPDATE_CANVAS_DIMENSIONS', 
      payload: { 
        width: size.width,
        height: size.height
      }
    });
    setAspectRatioOpen(false);
  };
  
  const selectAspectRatio = (ratio: string) => {
    // TODO: Implement aspect ratio selection
    setAspectRatioOpen(false);
  };
  
  return (
    <EditorContainer>
      <Toolbar>
        <ToolbarLeft>
          <MouseModeSelector />
        </ToolbarLeft>
        
        <ToolbarCenter>
          <WorkflowTabs />
        </ToolbarCenter>
        
        <ToolbarRight>
          <AspectRatioSelector>
            <AspectRatioButton onClick={() => setAspectRatioOpen(!aspectRatioOpen)}>
              <FontAwesomeIcon icon={faCropAlt} />
              {currentCanvasSize.name}
              <FontAwesomeIcon icon={faCaretDown} className="dropdown-icon" />
            </AspectRatioButton>
            
            <AspectRatioDropdown isOpen={aspectRatioOpen}>
              <DropdownSection>
                <DropdownSectionTitle>Instagram</DropdownSectionTitle>
                {canvasSizes.instagram.map(size => (
                  <DropdownItem 
                    key={size.name}
                    active={currentCanvasSize.name === size.name}
                    onClick={() => changeCanvasSize(size)}
                  >
                    {size.name}
                    <span className="dimensions">{size.width} × {size.height}</span>
                  </DropdownItem>
                ))}
              </DropdownSection>
              
              <DropdownSection>
                <DropdownSectionTitle>Facebook</DropdownSectionTitle>
                {canvasSizes.facebook.map(size => (
                  <DropdownItem 
                    key={size.name}
                    active={currentCanvasSize.name === size.name}
                    onClick={() => changeCanvasSize(size)}
                  >
                    {size.name}
                    <span className="dimensions">{size.width} × {size.height}</span>
                  </DropdownItem>
                ))}
              </DropdownSection>
              
              <DropdownSection>
                <DropdownSectionTitle>Twitter</DropdownSectionTitle>
                {canvasSizes.twitter.map(size => (
                  <DropdownItem 
                    key={size.name}
                    active={currentCanvasSize.name === size.name}
                    onClick={() => changeCanvasSize(size)}
                  >
                    {size.name}
                    <span className="dimensions">{size.width} × {size.height}</span>
                  </DropdownItem>
                ))}
              </DropdownSection>
              
              <DropdownSection>
                <DropdownSectionTitle>LinkedIn</DropdownSectionTitle>
                {canvasSizes.linkedin.map(size => (
                  <DropdownItem 
                    key={size.name}
                    active={currentCanvasSize.name === size.name}
                    onClick={() => changeCanvasSize(size)}
                  >
                    {size.name}
                    <span className="dimensions">{size.width} × {size.height}</span>
                  </DropdownItem>
                ))}
              </DropdownSection>
            </AspectRatioDropdown>
          </AspectRatioSelector>
          
          <Button>
            <FontAwesomeIcon icon={faSave} />
            Save
          </Button>
          
          <Button className="primary">
            <FontAwesomeIcon icon={faShareSquare} />
            Publish
          </Button>
        </ToolbarRight>
      </Toolbar>
      
      <EditorContent>
        {/* Left vertical drawing toolbar - Figma style */}
        <DrawingToolbar />
        
        {/* Main canvas area */}
        <Canvas />
        
        {/* Right sidebar for properties and media */}
        <RightSidebar>
          <SidebarTabs>
            <SidebarTabContainer>
              <SidebarTab 
                active={activeTab === 'layers'}
                onClick={() => setActiveTab('layers')}
              >
                <FontAwesomeIcon icon={faLayerGroup} />
                <SidebarTabTooltip>Layers</SidebarTabTooltip>
              </SidebarTab>
            </SidebarTabContainer>
            <SidebarTabContainer>
              <SidebarTab 
                active={activeTab === 'comments'}
                onClick={() => setActiveTab('comments')}
              >
                <FontAwesomeIcon icon={faComment} />
                <SidebarTabTooltip>Comments</SidebarTabTooltip>
              </SidebarTab>
            </SidebarTabContainer>
            <SidebarTabContainer>
              <SidebarTab 
                active={activeTab === 'revisions'}
                onClick={() => setActiveTab('revisions')}
              >
                <FontAwesomeIcon icon={faHistory} />
                <SidebarTabTooltip>Revisions</SidebarTabTooltip>
              </SidebarTab>
            </SidebarTabContainer>
            <SidebarTabContainer>
              <SidebarTab 
                active={activeTab === 'library'}
                onClick={() => setActiveTab('library')}
              >
                <FontAwesomeIcon icon={faImageIcon} />
                <SidebarTabTooltip>Media Library</SidebarTabTooltip>
              </SidebarTab>
            </SidebarTabContainer>
            <SidebarTabContainer>
              <SidebarTab 
                active={activeTab === 'code'}
                onClick={() => setActiveTab('code')}
              >
                <FontAwesomeIcon icon={faCode} />
                <SidebarTabTooltip>Code</SidebarTabTooltip>
              </SidebarTab>
            </SidebarTabContainer>
          </SidebarTabs>
          
          <SidebarContent>
            {activeTab === 'layers' && (
              <Layers />
            )}
            
            {activeTab === 'comments' && (
              <SidebarSection>
                <SidebarTitle>Comments</SidebarTitle>
                {/* Comments content here */}
                <div style={{ padding: '12px', fontSize: '14px', color: '#666' }}>
                  Select an element to add comments or view existing comments.
                </div>
              </SidebarSection>
            )}
            
            {activeTab === 'revisions' && (
              <SidebarSection>
                <SidebarTitle>Revision History</SidebarTitle>
                {/* Revisions content here */}
                <RevisionList>
                  <RevisionItem>
                    <div className="revision-header">
                      <div className="version">Version 3</div>
                      <div className="time">Today, 4:30 PM</div>
                    </div>
                    <div className="revision-content">Added new text elements and updated layout</div>
                  </RevisionItem>
                  <RevisionItem>
                    <div className="revision-header">
                      <div className="version">Version 2</div>
                      <div className="time">Yesterday, 2:15 PM</div>
                    </div>
                    <div className="revision-content">Changed background color and image placement</div>
                  </RevisionItem>
                  <RevisionItem>
                    <div className="revision-header">
                      <div className="version">Version 1</div>
                      <div className="time">Apr 23, 10:45 AM</div>
                    </div>
                    <div className="revision-content">Initial canvas creation</div>
                  </RevisionItem>
                </RevisionList>
              </SidebarSection>
            )}
            
            {activeTab === 'library' && (
              <SidebarSection>
                <SidebarTitle>Media Library</SidebarTitle>
                <LibraryGrid>
                  <LibraryItem>
                    <img src="https://via.placeholder.com/100x100" alt="Media item" />
                  </LibraryItem>
                  <LibraryItem>
                    <img src="https://via.placeholder.com/100x100" alt="Media item" />
                  </LibraryItem>
                  <LibraryItem>
                    <img src="https://via.placeholder.com/100x100" alt="Media item" />
                  </LibraryItem>
                  <LibraryItem>
                    <img src="https://via.placeholder.com/100x100" alt="Media item" />
                  </LibraryItem>
                </LibraryGrid>
                
                <ToolBarButtonGroup>
                  <SmallButton>Upload Media</SmallButton>
                  <SmallButton>Browse Library</SmallButton>
                </ToolBarButtonGroup>
              </SidebarSection>
            )}
            
            {activeTab === 'code' && (
              <CodePanel />
            )}
          </SidebarContent>
        </RightSidebar>
      </EditorContent>
    </EditorContainer>
  );
};

// Main component
const CanvasEditor: React.FC<CanvasEditorProps> = ({ 
  initialCanvas, 
  onSave,
  initialComments = []
}) => {
  // Default state with all required properties
  const defaultState = {
    currentCanvas: initialCanvas 
      ? { ...defaultCanvas, ...initialCanvas } 
      : defaultCanvas,
    mouseMode: 'edit' as 'edit' | 'comment' | 'navigate',
    activeTool: 'select' as 'select' | 'drawing' | 'pen' | 'eraser' | 'text' | 'shape' | 'image',
    activeColor: '#000000',
    brushSize: 3,
    brushType: 'round' as 'round' | 'square' | 'marker' | 'pencil' | 'calligraphy' | 'airbrush',
    brushOpacity: 1,
    drawingMode: 'freehand' as 'freehand' | 'line' | 'bezier' | 'polyline',
    isDrawing: false,
    currentPath: [] as Position[],
    selectedElements: [] as string[],
    scale: 1,
    offset: { x: 0, y: 0 },
    mediaLibrary: {
      images: [],
      videos: [],
      uploadProgress: undefined as number | undefined
    },
    comments: initialComments
  };

  return (
    <EditorProvider initialState={defaultState}>
      <CanvasEditorContent />
    </EditorProvider>
  );
};

export default CanvasEditor;
