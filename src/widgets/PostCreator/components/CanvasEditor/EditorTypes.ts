export interface Position {
  x: number;
  y: number;
  pressure?: number;
  tilt?: number;
  timestamp?: number;
  isControlPoint?: boolean;
}

export interface Size {
  width: number;
  height: number;
}

export interface ElementStyles {
  // General styles
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: string;
  
  // Text styles
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: string;
  lineHeight?: number;
  textDecoration?: string;
  letterSpacing?: number;
  
  // Image/Video styles
  objectFit?: string;
  
  // Shadow effects
  boxShadow?: string;
  
  // Transform effects
  transform?: string;
  
  // Opacity
  opacity?: number;
  
  // Animation
  animation?: string;
  animationDuration?: string;
  
  // Flex layout
  display?: string;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  
  // Size and position constraints
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  overflow?: string;
  
  // SVG properties
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  
  // Drawing specific properties
  strokeStyle?: string;
  lineWidth?: number;
  lineCap?: string;
  lineJoin?: string;
  miterLimit?: number;
  pathPoints?: PathPoint[];
  pathType?: DrawingMode;
  brushType?: BrushType;
  
  // Any other style that could be added
  [key: string]: any;
}

export type ElementType = 'text' | 'image' | 'shape' | 'video' | 'group' | 'container' | 'drawing' | 'component';

export interface CanvasElement {
  id: string;
  type: ElementType;
  content: string;
  position: Position;
  x: number; // Shorthand for position.x
  y: number; // Shorthand for position.y
  size: Size;
  width: number; // Shorthand for size.width
  height: number; // Shorthand for size.height
  zIndex: number;
  isVisible: boolean;
  isLocked: boolean;
  isSelected: boolean;
  label?: string;
  rotation?: number;
  opacity?: number;
  parentId?: string;
  elementIds?: string[]; // For container elements
  styles?: ElementStyles;
  history?: Array<{
    timestamp: string;
    userId: string;
    userName: string;
    action: 'create' | 'update' | 'delete';
    previousState?: Omit<CanvasElement, 'history'>;
  }>;
}

export interface TextElement extends CanvasElement {
  type: 'text';
}

export interface ImageElement extends CanvasElement {
  type: 'image';
  src: string;
  cropInfo?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  alt?: string;
}

export interface ShapeElement extends CanvasElement {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'triangle' | 'line' | 'polygon' | 'star';
  points?: number[][];
}

export interface VideoElement extends CanvasElement {
  type: 'video';
  src: string;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  currentTime: number;
  duration: number;
  thumbnailSrc?: string;
}

export interface GroupElement extends CanvasElement {
  type: 'group';
  elementIds: string[];
  isExpanded?: boolean;
}

export interface ContainerElement extends CanvasElement {
  type: 'container';
  elementIds: string[];
  isExpanded?: boolean;
}

export interface DrawingElement extends CanvasElement {
  type: 'drawing';
  path: Position[];
  brushSize: number;
  brushColor: string;
  brushOpacity: number;
  pressure: boolean;
  tilt: boolean;
}

export interface Canvas {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundType: 'color' | 'image' | 'gradient';
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundGradient?: {
    type: 'linear' | 'radial';
    colors: Array<{ color: string; position: number }>;
    angle?: number;
  };
  elements: CanvasElement[];
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  canvas: Canvas;
  category: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  isActive: boolean;
  lastActivity?: string;
  cursor?: Position;
}

export interface Comment {
  id: string;
  position: Position;
  content: string;
  author: string;
  createdAt: string;
  resolved: boolean;
}

export interface CanvasHistory {
  timestamp: string;
  userId: string;
  userName: string;
  action: 'add' | 'update' | 'delete' | 'reorder' | 'group' | 'ungroup' | 'create';
  elementIds: string[];
  previousState?: any;
  newState?: any;
}

export type BrushType = 'round' | 'square' | 'marker' | 'pencil' | 'calligraphy' | 'airbrush';
export type DrawingMode = 'freehand' | 'line' | 'bezier' | 'polyline';
export interface PathPoint extends Position {
}

export type ToolType = 
  | 'select' 
  | 'text' 
  | 'image' 
  | 'shape' 
  | 'video' 
  | 'group'
  | 'drawing'
  | 'pen'
  | 'eraser';

export interface MediaLibrary {
  images: MediaItem[];
  videos: MediaItem[];
  uploadProgress?: number;
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
  size: number;
  createdAt: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  tags?: string[];
  favorite?: boolean;
}

export type MouseMode = 'edit' | 'comment' | 'navigate';

export interface EditorState {
  currentCanvas: Canvas;
  selectedElements: string[];
  clipboard: CanvasElement[];
  zoom: number;
  activeUsers: string[];
  history: CanvasElement[][];
  comments: Comment[];
  undoStack: CanvasElement[][];
  redoStack: CanvasElement[][];
  activeTool: ToolType;
  activeColor: string;
  brushSize: number;
  brushType: BrushType;
  brushOpacity: number;
  drawingMode: DrawingMode;
  isDrawing: boolean;
  currentPath: PathPoint[];
  previewPoint?: Position;
  templates: any[];
  mediaLibrary: {
    images: MediaItem[];
    videos: MediaItem[];
    uploadProgress?: number;
  };
  unsavedChanges: boolean;
  mouseMode: 'edit' | 'comment' | 'navigate';
  scale: number;
  offset: Position;
  layersPanelState: LayersPanelState;
}

export interface LayersPanelState {
  expandedContainers: string[];
  draggedLayerId?: string;
  dropTargetId?: string;
  dropPosition?: 'before' | 'after' | 'inside';
  contextMenuVisible?: boolean;
  contextMenuPosition?: { x: number; y: number };
  contextMenuTargetId?: string;
}

export interface CanvasAreaProps {
  width: number;
  height: number;
  backgroundColor: string;
}

export type EditorAction =
  | { type: 'SELECT_ELEMENT'; payload: { id: string; multiSelect?: boolean } }
  | { type: 'DESELECT_ALL' }
  | { type: 'SET_ACTIVE_TOOL'; payload: ToolType }
  | { type: 'SET_ACTIVE_COLOR'; payload: string }
  | { type: 'SET_BRUSH_SIZE'; payload: number }
  | { type: 'SET_BRUSH_TYPE'; payload: BrushType }
  | { type: 'SET_BRUSH_OPACITY'; payload: number }
  | { type: 'SET_DRAWING_MODE'; payload: DrawingMode }
  | { type: 'START_DRAWING'; payload: Position }
  | { type: 'CONTINUE_DRAWING'; payload: Position }
  | { type: 'UPDATE_DRAWING_PREVIEW'; payload: Position }
  | { type: 'END_DRAWING' }
  | { type: 'FINISH_DRAWING' }
  | { type: 'ADD_MEDIA_ITEM'; payload: MediaItem }
  | { type: 'REMOVE_MEDIA_ITEM'; payload: string }
  | { type: 'TOGGLE_FAVORITE_MEDIA'; payload: string }
  | { type: 'SET_UPLOAD_PROGRESS'; payload: number }
  | { type: 'ADD_ELEMENT'; payload: CanvasElement }
  | { type: 'CLEAR_CANVAS'; payload?: { keepBackground?: boolean } }
  | { type: 'UPDATE_ELEMENT'; payload: { id: string; properties: Partial<CanvasElement> } }
  | { type: 'UPDATE_ELEMENT_STYLE'; payload: { id: string; styles: Partial<ElementStyles> } }
  | { type: 'DELETE_ELEMENT'; payload: { id: string } }
  | { type: 'GROUP_ELEMENTS'; payload: { ids: string[]; groupId: string } }
  | { type: 'UNGROUP_ELEMENTS'; payload: { groupId: string } }
  | { type: 'MOVE_ELEMENT'; payload: { id: string; position: Position } }
  | { type: 'RESIZE_ELEMENT'; payload: { id: string; size: Size; position?: Position } }
  | { type: 'COPY_ELEMENTS'; payload: { ids: string[] } }
  | { type: 'PASTE_ELEMENTS'; payload: { position?: Position } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_ZOOM'; payload: { zoom: number } }
  | { type: 'ADD_COMMENT'; payload: Comment }
  | { type: 'RESOLVE_COMMENT'; payload: string }
  | { type: 'ADD_REPLY'; payload: { commentId: string; reply: Omit<Comment, 'id'> } }
  | { type: 'SET_CANVAS_BACKGROUND'; payload: Partial<Pick<Canvas, 'backgroundType' | 'backgroundColor' | 'backgroundImage' | 'backgroundGradient'>> }
  | { type: 'UPDATE_USER_CURSOR'; payload: { userId: string; position: Position } }
  | { type: 'SAVE_CANVAS'; payload?: { name?: string } }
  | { type: 'LOAD_TEMPLATE'; payload: { templateId: string } }
  | { type: 'SET_MOUSE_MODE'; payload: MouseMode }
  | { type: 'SET_CANVAS_SCALE'; payload: number } 
  | { type: 'SET_CANVAS_OFFSET'; payload: Position } 
  | { type: 'UPDATE_CANVAS_DIMENSIONS'; payload: { width: number; height: number } } 
  | { type: 'UPDATE_COMMENT'; payload: { id: string; updates: Partial<Comment> } }
  | { type: 'DELETE_COMMENT'; payload: string }
  | { type: 'RENAME_ELEMENT'; payload: { id: string; label: string } }
  | { type: 'MOVE_ELEMENT_IN_LAYERS'; payload: { sourceId: string; targetId: string; position: 'before' | 'after' | 'inside' } }
  | { type: 'TOGGLE_LAYER_EXPANSION'; payload: string }
  | { type: 'UPDATE_LAYERS_PANEL_STATE'; payload: Partial<LayersPanelState> };
