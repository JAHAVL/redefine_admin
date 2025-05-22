import styled from 'styled-components';

// Common container for all styled components
export const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #f5f5f5;
`;

// Resizable handle components
export const ResizeHandle = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: white;
  border: 1px solid #2196f3;
  border-radius: 50%;
  z-index: 100;
  
  &.top-left {
    top: -5px;
    left: -5px;
    cursor: nwse-resize;
  }
  
  &.top {
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    cursor: ns-resize;
  }
  
  &.top-right {
    top: -5px;
    right: -5px;
    cursor: nesw-resize;
  }
  
  &.right {
    top: 50%;
    right: -5px;
    transform: translateY(-50%);
    cursor: ew-resize;
  }
  
  &.bottom-right {
    bottom: -5px;
    right: -5px;
    cursor: nwse-resize;
  }
  
  &.bottom {
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    cursor: ns-resize;
  }
  
  &.bottom-left {
    bottom: -5px;
    left: -5px;
    cursor: nesw-resize;
  }
  
  &.left {
    top: 50%;
    left: -5px;
    transform: translateY(-50%);
    cursor: ew-resize;
  }
`;

// Divider component
export const Divider = styled.div`
  width: 1px;
  height: 24px;
  background-color: #eee;
  margin: 0 8px;
`;
