import styled from 'styled-components';

// Editor content container
export const EditorContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

// Sidebar container
export const EditorSidebar = styled.div<{ right?: boolean }>`
  width: 260px;
  background-color: #fff;
  border-${props => props.right ? 'left' : 'right'}: 1px solid #e0e0e0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

// Sidebar section container
export const SidebarSection = styled.div`
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
`;

export const SidebarSectionTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #333;
  font-weight: 600;
`;

// Layer item styles
export const LayerItem = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.isActive ? '#e3f2fd' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.isActive ? '#bbdefb' : '#f5f5f5'};
  }
`;

export const LayerItemIcon = styled.div`
  margin-right: 8px;
  color: #666;
`;

export const LayerItemName = styled.div`
  flex: 1;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const LayerItemActions = styled.div`
  display: flex;
  align-items: center;
`;

export const LayerItemAction = styled.button`
  background: transparent;
  border: none;
  color: #666;
  padding: 4px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    color: #1976d2;
  }
`;

// Property controls
export const PropertyRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

export const PropertyLabel = styled.div`
  width: 100px;
  font-size: 12px;
  color: #666;
`;

export const PropertyControl = styled.div`
  flex: 1;
`;

export const PropertyInput = styled.input`
  width: 100%;
  padding: 6px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 12px;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

export const PropertySelect = styled.select`
  width: 100%;
  padding: 6px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 12px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #2196f3;
  }
`;

// Comments section styles
export const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CommentItem = styled.div<{ isResolved?: boolean }>`
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  background-color: ${props => props.isResolved ? '#f5f5f5' : 'white'};
  border: 1px solid #e0e0e0;
  opacity: ${props => props.isResolved ? 0.7 : 1};
`;

export const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const CommentAuthor = styled.div`
  font-weight: bold;
  font-size: 12px;
`;

export const CommentDate = styled.div`
  font-size: 11px;
  color: #666;
`;

export const CommentContent = styled.div`
  font-size: 12px;
  margin-bottom: 8px;
`;

export const CommentActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const CommentAction = styled.button`
  background: transparent;
  border: none;
  color: #666;
  margin-left: 8px;
  font-size: 11px;
  cursor: pointer;
  
  &:hover {
    color: #1976d2;
    text-decoration: underline;
  }
`;
