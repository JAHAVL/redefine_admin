// Canvas element interface
export interface Position {
  x: number;
  y: number;
  pressure?: number;
  tilt?: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ElementStyles {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  backgroundColor?: string;
  opacity?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  boxShadow?: string;
  textShadow?: string;
  lineHeight?: number;
  letterSpacing?: number;
  padding?: number;
  rotation?: number;
  zIndex?: number;
  filter?: string;
  brushSize?: number;
  brushType?: 'round' | 'square' | 'marker' | 'pencil' | 'calligraphy' | 'airbrush';
  strokeStyle?: string;
  lineWidth?: number;
  pathPoints?: Array<{x: number, y: number, pressure?: number, tilt?: number}>;
  [key: string]: any; // Allow additional properties for backward compatibility
}

export type ElementType = 'text' | 'image' | 'shape' | 'video' | 'group' | 'container' | 'drawing' | 'component';

export interface CanvasElement {
  id: string;
  type: ElementType;
  position: Position;
  size: Size;
  content: string;
  styles: ElementStyles;
  isSelected: boolean;
  isLocked: boolean;
  isVisible: boolean;
  label: string;
  parentId?: string;
  zIndex: number;
  // Additional properties for backward compatibility with existing code
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
  children?: CanvasElement[];
  elementIds?: string[]; // Used for container elements to track children
}

// Canvas for metadata, storing dimensions and container properties
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
