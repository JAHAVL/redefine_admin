import styled from 'styled-components';
import { theme } from '../theme';

export const SchedulerWidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${theme.colors.background}; /* Dark background */
  color: ${theme.colors.text.primary}; /* White text */
  font-family: ${theme.typography.fontFamily};
  padding: ${theme.spacing.lg};
  box-sizing: border-box;
  overflow-x: hidden;
`;

export const SchedulerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  width: 100%;
`;

export const SchedulerTitle = styled.h1`
  font-size: ${theme.typography.fontSizes.xl};
  font-weight: ${theme.typography.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

export const SchedulerContent = styled.div`
  flex: 1;
  overflow: auto;
`;

export const SchedulerCard = styled.div`
  background-color: ${theme.colors.card}; /* Card background (dark gray) */
  border-radius: 8px;
  box-shadow: 0 2px 4px ${theme.colors.shadow};
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

export const SchedulerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${theme.spacing.lg};
  margin-top: ${theme.spacing.lg};
  width: 100%;
`;

export const SchedulerEmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl};
  background-color: ${theme.colors.highlight}; /* Highlight background (darker gray) */
  border-radius: ${theme.borderRadius.md};
  grid-column: 1 / -1;
  box-shadow: ${theme.shadows.sm};
  
  h4 {
    margin: 0 0 ${theme.spacing.sm};
    font-size: ${theme.typography.fontSizes.lg};
    color: ${theme.colors.text.primary};
  }
  
  p {
    margin: 0;
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.fontSizes.sm};
  }
`;

// Card components
export const SeriesCard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.card}; /* Card background (dark gray) */
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${theme.shadows.md};
  transition: ${theme.transitions.default};
  cursor: pointer;
  height: 100%;
  min-height: 280px;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.lg};
  }
`;

export interface CardImageProps {
  backgroundImage?: string;
}

export const CardImage = styled.div<CardImageProps>`
  height: 160px;
  background-image: ${(props: CardImageProps) => props.backgroundImage ? `url(${props.backgroundImage})` : `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.primaryDark})`};
  background-size: cover;
  background-position: center;
`;

export const CardContent = styled.div`
  padding: ${theme.spacing.md};
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

export const CardTitle = styled.h3`
  margin: 0 0 ${theme.spacing.xs};
  font-size: ${theme.typography.fontSizes.md};
  font-weight: ${theme.typography.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CardDate = styled.p`
  margin: 0;
  font-size: ${theme.typography.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.round};
  background-color: rgba(0, 0, 0, 0.6); /* Dark semi-transparent background */
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  opacity: 0.8;
  transition: ${theme.transitions.default};
  
  svg {
    width: 16px;
    height: 16px;
    color: ${theme.colors.danger};
  }
  
  &:hover {
    opacity: 1;
    background-color: white;
  }
`;

export const SchedulerButton = styled.button`
  background-color: ${theme.colors.primary}; /* Blue button */
  color: ${theme.colors.text.white};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSizes.sm};
  font-weight: ${theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: ${theme.transitions.default};
  
  &:hover {
    background-color: ${theme.colors.primaryDark};
  }

  &:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
  }
`;

export const SchedulerTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid ${theme.colors.border}; /* Semi-transparent white border */
  }
  
  th {
    font-weight: 600;
    color: ${theme.colors.text.secondary}; /* Semi-transparent white */
    background-color: ${theme.colors.highlight}; /* Highlight background */
  }
  
  tr:last-child td {
    border-bottom: none;
  }
`;

export interface TabProps {
  active?: boolean;
}

export const SchedulerTab = styled.button<TabProps>`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${(props: TabProps) => props.active ? theme.colors.primary : 'transparent'};
  color: ${(props: TabProps) => props.active ? theme.colors.primary : theme.colors.text.secondary};
  font-weight: ${(props: TabProps) => props.active ? 600 : 400};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

export interface BadgeProps {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export const SchedulerBadge = styled.span<BadgeProps>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${(props: BadgeProps) => {
    switch (props.type) {
      case 'success':
        return '#e6f7e6';
      case 'warning':
        return '#fff8e6';
      case 'danger':
        return '#ffebee';
      case 'info':
        return '#e3f2fd';
      default:
        return '#e3f2fd';
    }
  }};
  color: ${(props: BadgeProps) => {
    switch (props.type) {
      case 'success':
        return '#2e7d32';
      case 'warning':
        return '#ef6c00';
      case 'danger':
        return '#c62828';
      case 'info':
        return '#1565c0';
      default:
        return '#1565c0';
    }
  }};
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: ${theme.colors.text.primary};
  }
  
  input, select, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
    }
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  
  button:not(:first-child) {
    background-color: transparent;
    border: 1px solid #e0e0e0;
    color: ${theme.colors.text.secondary};
    
    &:hover {
      background-color: #f5f5f5;
      border-color: #d0d0d0;
    }
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  
  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    margin: 0;
  }
`;
