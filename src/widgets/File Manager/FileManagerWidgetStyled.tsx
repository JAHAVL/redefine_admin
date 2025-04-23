import styled, { css } from 'styled-components';
import theme from './theme';

// Main container
export const FileManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: ${theme.colors.background.transparent};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  color: ${theme.colors.text.primary};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-family: ${theme.typography.fontFamily};
  box-shadow: ${theme.shadows.md};
  backdrop-filter: blur(5px);
`;

// Header section
export const FileManagerHeader = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background-color: ${theme.colors.background.header};
  border-bottom: 1px solid ${theme.colors.border.main};
  gap: ${theme.spacing.md};
`;

export const FileManagerBreadcrumb = styled.div`
  display: flex;
  align-items: center;
  min-width: 180px;
  max-width: 220px;
  font-size: ${theme.typography.fontSize.md};
`;

export const BreadcrumbButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background-color: ${props => props.disabled 
    ? 'transparent' 
    : theme.colors.background.light};
  color: ${props => props.disabled 
    ? theme.colors.text.disabled 
    : theme.colors.text.primary};
  border-radius: ${theme.borderRadius.circle};
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  transition: all ${theme.transitions.normal};
  
  &:hover {
    background-color: ${props => !props.disabled && theme.colors.primary.transparent};
  }
  
  &:active {
    transform: ${props => !props.disabled && 'scale(0.95)'};
  }
`;

export const BreadcrumbText = styled.span`
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.fontWeight.medium};
`;

export const FileManagerSearch = styled.div`
  flex: 1;
  max-width: 500px;
  margin: 0;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.xl};
  border: 1px solid ${theme.colors.border.main};
  background-color: ${theme.colors.background.dark};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.md};
  transition: all ${theme.transitions.fast};
  padding-left: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 12px center;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: ${theme.shadows.glow};
    background-color: ${theme.colors.background.light};
  }

  &::placeholder {
    color: ${theme.colors.text.hint};
  }
`;

// Top actions section
export const FileManagerActionsTop = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-left: auto;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.background.light};
  border: 1px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  
  svg {
    margin-right: ${theme.spacing.sm};
  }
  
  &:hover {
    background-color: ${theme.colors.primary.transparent};
    border-color: ${theme.colors.primary.main};
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

export const UploadButton = styled(ActionButton)`
  background-color: ${theme.colors.primary.main};
  border-color: ${theme.colors.primary.main};
  color: ${theme.colors.primary.contrastText};
  
  &:hover {
    background-color: ${theme.colors.primary.dark};
    border-color: ${theme.colors.primary.dark};
  }
`;

export const ViewOptionsContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

export const ViewOptionButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: ${props => props.active 
    ? theme.colors.primary.transparent 
    : theme.colors.background.light};
  border: 1px solid ${props => props.active 
    ? theme.colors.primary.main 
    : theme.colors.border.light};
  border-radius: ${theme.borderRadius.md};
  color: ${props => props.active 
    ? theme.colors.primary.main 
    : theme.colors.text.primary};
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  
  &:hover {
    background-color: ${theme.colors.primary.transparent};
    border-color: ${theme.colors.primary.main};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

// Actions section
export const FileManagerActions = styled.div`
  display: flex;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  gap: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border.main};
  background-color: ${theme.colors.background.light};
`;

export const DeleteButton = styled(ActionButton)`
  color: ${theme.colors.status.error};
  
  &:hover {
    color: ${theme.colors.status.error};
    background-color: rgba(255, 52, 120, 0.1);
  }
`;

export const ShareButton = styled(ActionButton)`
  color: ${theme.colors.status.success};
  
  &:hover {
    color: ${theme.colors.status.success};
    background-color: rgba(11, 183, 131, 0.1);
  }
`;

// Content section
export const FileManagerContent = styled.div<{ viewMode: 'grid' | 'list' }>`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.background.main};
  border-radius: 0 0 ${theme.borderRadius.md} ${theme.borderRadius.md};
`;

export const FileListHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 0.8fr 1fr 1fr 0.8fr;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  background-color: ${theme.colors.background.light};
  border-bottom: 1px solid ${theme.colors.border.main};
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.secondary};
  height: 28px;
`;

export const FileListHeaderItem = styled.div`
  cursor: pointer;
  user-select: none;
  transition: color ${theme.transitions.fast};
  display: flex;
  align-items: center;

  &:hover {
    color: ${theme.colors.text.primary};
  }
`;

export const SortIndicator = styled.span`
  margin-left: ${theme.spacing.xs};
  font-size: 8px;
`;

export const FileList = styled.div<{ isDragActive?: boolean }>`
  padding: ${theme.spacing.xs};
  min-height: 200px;
  position: relative;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.colors.background.dark};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  ${props => props.isDragActive && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: ${theme.colors.primary.transparent};
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }
  `}
`;

export const DropOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.background.overlay};
  border: 2px dashed ${theme.colors.primary.main};
  border-radius: ${theme.borderRadius.md};
  z-index: 10;
`;

export const DropOverlayText = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.fontWeight.medium};
  margin-top: ${theme.spacing.md};
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.md};
  
  svg {
    margin-bottom: ${theme.spacing.md};
    opacity: 0.5;
  }
`;

export const FileItem = styled.div<{ fileType: string; selected: boolean }>`
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${props => props.selected ? theme.colors.background.light : 'transparent'};
  transition: background-color ${theme.transitions.fast};
  height: 32px;
  cursor: pointer;
  
  &:hover {
    background-color: ${theme.colors.background.light};
  }
`;

export const FileInfo = styled.div`
  display: grid;
  grid-template-columns: 2fr 0.8fr 1fr 1fr 0.8fr;
  grid-column-gap: ${theme.spacing.sm};
  align-items: center;
  width: 100%;
  padding-left: ${theme.spacing.sm};
  position: relative;
`;

export const FileTags = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.spacing.xs};
  max-width: 100%;
  overflow: visible;
  position: relative;
`;

export const FileTag = styled.span<{ tagType?: string }>`
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1px 5px;
  border-radius: ${theme.borderRadius.sm};
  font-size: 10px;
  font-weight: ${theme.typography.fontWeight.medium};
  background-color: ${props => {
    switch (props.tagType) {
      case 'Important':
        return 'rgba(244, 67, 54, 0.2)';
      case 'Draft':
        return 'rgba(255, 152, 0, 0.2)';
      case 'Final':
        return 'rgba(76, 175, 80, 0.2)';
      case 'Team':
        return 'rgba(33, 150, 243, 0.2)';
      case 'Finance':
        return 'rgba(156, 39, 176, 0.2)';
      case 'Design':
        return 'rgba(233, 30, 99, 0.2)';
      case 'HR':
        return 'rgba(0, 188, 212, 0.2)';
      case 'Legal':
        return 'rgba(63, 81, 181, 0.2)';
      case 'Marketing':
        return 'rgba(255, 87, 34, 0.2)';
      case 'Confidential':
        return 'rgba(121, 85, 72, 0.2)';
      default:
        return 'rgba(158, 158, 158, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.tagType) {
      case 'Important':
        return '#f44336';
      case 'Draft':
        return '#ff9800';
      case 'Final':
        return '#4caf50';
      case 'Team':
        return '#2196f3';
      case 'Finance':
        return '#9c27b0';
      case 'Design':
        return '#e91e63';
      case 'HR':
        return '#00bcd4';
      case 'Legal':
        return '#3f51b5';
      case 'Marketing':
        return '#ff5722';
      case 'Confidential':
        return '#795548';
      default:
        return '#9e9e9e';
    }
  }};
  white-space: nowrap;
  max-height: 18px;
  line-height: 1;
  
  &:hover {
    opacity: 0.8;
  }
  
  &[data-action='add'] {
    background-color: ${theme.colors.background.light} !important;
    color: ${theme.colors.text.secondary} !important;
    border: 1px dashed ${theme.colors.border.main};
    
    &:hover {
      background-color: ${theme.colors.background.dark} !important;
      border-color: ${theme.colors.primary.main};
      color: ${theme.colors.primary.main} !important;
    }
  }
`;

export const FileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.circle};
  
  img {
    max-width: 18px;
    max-height: 18px;
  }
`;

export const FileName = styled.div`
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${theme.typography.fontSize.sm};
`;

export const FileModified = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.xs};
`;

export const FileSize = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.xs};
`;

export const FileShared = styled.div`
  display: flex;
  align-items: center;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.xs};
  
  svg {
    margin-right: ${theme.spacing.xs};
    color: ${theme.colors.status.success};
  }
  
  &.not-shared {
    color: ${theme.colors.text.disabled};
    
    svg {
      color: ${theme.colors.text.disabled};
    }
  }
`;

// Grid view specific styles
export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
`;

export const GridItem = styled.div<{ fileType: string; selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  background-color: ${props => props.selected ? theme.colors.background.light : 'transparent'};
  transition: all ${theme.transitions.fast};
  cursor: pointer;
  position: relative;
  
  &:hover {
    background-color: ${theme.colors.background.light};
  }
`;

export const GridIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin-bottom: ${theme.spacing.sm};
  
  img {
    max-width: 48px;
    max-height: 48px;
  }
`;

export const GridInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
`;

export const GridName = styled.div`
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${theme.typography.fontSize.sm};
`;

export const GridDetails = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.xs};
  margin-top: ${theme.spacing.xs};
`;

// Style for grid view tags
export const GridTags = styled(FileTags)`
  position: relative;
  transform: none;
  margin-top: ${theme.spacing.xs};
  justify-content: center;
  max-width: 100%;
  overflow: visible;
  z-index: 10;
`;

export const Avatar = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  width: ${props => 
    props.size === 'sm' ? '24px' : 
    props.size === 'lg' ? '48px' : '32px'
  };
  height: ${props => 
    props.size === 'sm' ? '24px' : 
    props.size === 'lg' ? '48px' : '32px'
  };
  border-radius: ${theme.borderRadius.circle};
  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.primary.contrastText};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => 
    props.size === 'sm' ? theme.typography.fontSize.xs : 
    props.size === 'lg' ? theme.typography.fontSize.md : theme.typography.fontSize.sm
  };
  font-weight: ${theme.typography.fontWeight.medium};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const FileItemHover = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${theme.colors.primary.transparent};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity ${theme.transitions.normal};
  
  ${FileItem}:hover & {
    opacity: 1;
  }
`;

export const FileItemAction = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: ${theme.borderRadius.circle};
  background-color: rgba(52, 120, 255, 0.1);
  transition: all ${theme.transitions.fast};
  
  border: none;
  color: ${theme.colors.text.primary};
  cursor: pointer;
  margin: 0 ${theme.spacing.xs};
  
  &:hover {
    background-color: ${theme.colors.primary.main};
    color: ${theme.colors.primary.contrastText};
    transform: scale(1.1);
  }
`;
