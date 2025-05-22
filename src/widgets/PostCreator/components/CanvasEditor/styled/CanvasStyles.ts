import styled from 'styled-components';
import { motion } from 'framer-motion';

// Canvas container
export const CanvasContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Canvas wrapper with transform properties
export const CanvasWrapper = styled.div<{
  scale: number;
  offsetX: number;
  offsetY: number;
}>`
  position: absolute;
  transform: scale(${props => props.scale}) translate(${props => props.offsetX}px, ${props => props.offsetY}px);
  transform-origin: center;
  transition: transform 0.1s ease-out;
`;

// Canvas area
export const CanvasArea = styled.div<{
  width: number;
  height: number;
  backgroundColor: string;
}>`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: ${props => props.backgroundColor};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

// Canvas background image
export const CanvasBackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// Canvas elements
export const CanvasElementWrapper = styled(motion.div)<{
  isSelected: boolean;
}>`
  position: absolute;
  box-sizing: border-box;
  
  ${props => props.isSelected && `
    outline: 2px solid #2196f3;
    outline-offset: 2px;
  `}
`;

// Drawing canvas
export const StyledDrawingCanvas = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

// Comment marker and bubble
export const CommentMarker = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #FFD700;
  border: 2px solid #FFA500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transform: translate(-50%, -50%);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
  }
`;

export const CommentBubble = styled.div`
  position: absolute;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 12px;
  width: 250px;
  z-index: 1001;
  transform: translate(10px, -50%);
`;

export const CommentInput = styled.textarea`
  width: 100%;
  height: 80px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
`;

// Element specific styles
export const TextElementContent = styled.div<{
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: string;
  textAlign?: string;
  color?: string;
  lineHeight?: number;
}>`
  font-family: ${props => props.fontFamily || 'Arial, sans-serif'};
  font-size: ${props => props.fontSize || 16}px;
  font-weight: ${props => props.fontWeight || 'normal'};
  font-style: ${props => props.fontStyle || 'normal'};
  text-align: ${props => props.textAlign || 'left'};
  color: ${props => props.color || '#000000'};
  line-height: ${props => props.lineHeight || 1.2};
  width: 100%;
  height: 100%;
  padding: 4px;
  box-sizing: border-box;
  overflow: hidden;
  
  &:focus {
    outline: none;
  }
`;

export const ImageElementContent = styled.img<{
  opacity?: number;
  filter?: string;
}>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.opacity || 1};
  filter: ${props => props.filter || 'none'};
`;

export const VideoElementContent = styled.video<{
  opacity?: number;
  filter?: string;
}>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.opacity || 1};
  filter: ${props => props.filter || 'none'};
`;

export const ShapeElementContent = styled.div<{
  backgroundColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: string;
  opacity?: number;
}>`
  width: 100%;
  height: 100%;
  background-color: ${props => props.backgroundColor || '#000000'};
  border-radius: ${props => props.borderRadius || 0}px;
  border-width: ${props => props.borderWidth || 0}px;
  border-color: ${props => props.borderColor || 'transparent'};
  border-style: ${props => props.borderStyle || 'solid'};
  opacity: ${props => props.opacity || 1};
`;
