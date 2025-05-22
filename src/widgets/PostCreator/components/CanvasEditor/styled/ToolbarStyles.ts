import styled from 'styled-components';

// Toolbar container
export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  padding: 0 16px;
`;

export const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
`;

export const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
`;

// Toolbar sections and components
export const ToolbarSection = styled.div`
  padding: 8px;
  border-bottom: 1px solid #eee;
`;

export const ToolbarLabel = styled.div`
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #666;
`;

export const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

export const Tool = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  border: 1px solid ${props => props.active ? '#2196f3' : '#e0e0e0'};
  background-color: ${props => props.active ? '#e3f2fd' : 'white'};
  color: ${props => props.active ? '#1976d2' : '#666'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#bbdefb' : '#f5f5f5'};
  }
`;

export const ToolbarDivider = styled.div`
  width: 1px;
  height: 24px;
  background-color: #eee;
  margin: 0 8px;
`;

// Color picker components
export const ColorPickerPanel = styled.div`
  padding: 8px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
`;

export const ColorSwatch = styled.div<{ color: string; active?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin: 0 4px;
  cursor: pointer;
  border: 2px solid ${props => props.active ? '#1976d2' : 'transparent'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

export const BrushOptionsPanel = styled.div`
  padding: 8px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
`;

export const SliderLabel = styled.div`
  font-size: 12px;
  margin-right: 8px;
  width: 100px;
`;

export const Slider = styled.input`
  flex: 1;
`;
