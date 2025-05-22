import styled from 'styled-components';
import { CanvasAreaProps } from '../EditorTypes';

export const CanvasContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: #e0e0e0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CanvasWrapper = styled.div<{
  scale: number;
  offsetX: number;
  offsetY: number;
}>`
  position: absolute;
  transform: scale(${props => props.scale}) translate(${props => props.offsetX}px, ${props => props.offsetY}px);
  transform-origin: center;
  transition: transform 0.1s ease-out;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

export const CanvasArea = styled.div<CanvasAreaProps>`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: ${props => props.backgroundColor};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease, height 0.3s ease;
  overflow: visible;
`;

export const CanvasBackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
`;

export const StyledDrawingCanvas = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  pointer-events: auto;
  cursor: crosshair;
`;

export const CommentMarker = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  background-color: #2196f3;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  
  &:hover {
    background-color: #1976d2;
  }
`;
