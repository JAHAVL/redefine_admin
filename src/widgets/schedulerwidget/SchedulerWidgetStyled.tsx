import styled from 'styled-components';
import theme from './theme';

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
  background-color: ${theme.colors.background};
  color: ${theme.colors.text.primary};
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
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
  background-color: ${theme.colors.secondary};
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
  background-color: ${theme.colors.card};
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

interface CardImageProps {
  backgroundImage?: string;
}

export const CardImage = styled.div<CardImageProps>`
  height: 160px;
  background-image: ${(props: CardImageProps) => props.backgroundImage ? `url(${props.backgroundImage})` : 'linear-gradient(to right, #4a6cf7, #3a5ce5)'};
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
  background-color: rgba(255, 255, 255, 0.9);
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
  background-color: ${theme.colors.primary};
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
    border-bottom: 1px solid #e0e0e0;
  }
  
  th {
    font-weight: 600;
    color: #555;
    background-color: #f5f5f5;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr:hover td {
    background-color: #f9f9f9;
  }
`;

export const SchedulerForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SchedulerFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SchedulerLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #555;
`;

export const SchedulerInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #4a6cf7;
  }
`;

export const SchedulerTextarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #4a6cf7;
  }
`;

export const SchedulerSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #4a6cf7;
  }
`;

export const SchedulerModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const SchedulerModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

export const SchedulerModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #555;
    
    &:hover {
      color: #333;
    }
  }
`;

export const SchedulerModalBody = styled.div`
  margin-bottom: 1.5rem;
`;

export const SchedulerModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

export const SchedulerTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 1.5rem;
`;

interface TabProps {
  active?: boolean;
}

export const SchedulerTab = styled.button<TabProps>`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${(props: TabProps) => props.active ? '#4a6cf7' : 'transparent'};
  color: ${(props: TabProps) => props.active ? '#4a6cf7' : '#555'};
  font-weight: ${(props: TabProps) => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #4a6cf7;
  }
`;

export const SchedulerTabContent = styled.div`
  padding: 1rem 0;
`;

interface BadgeProps {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export const SchedulerBadge = styled.span<BadgeProps>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${(props: BadgeProps) => {
    switch (props.type) {
      case 'success': return '#e6f7e6';
      case 'warning': return '#fff8e6';
      case 'danger': return '#ffebeb';
      case 'info': return '#e6f3ff';
      default: return '#eee';
    }
  }};
  color: ${(props: BadgeProps) => {
    switch (props.type) {
      case 'success': return '#28a745';
      case 'warning': return '#ffc107';
      case 'danger': return '#dc3545';
      case 'info': return '#17a2b8';
      default: return '#555';
    }
  }};
`;

export const SchedulerDivider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 1.5rem 0;
`;

export const SchedulerEmptyMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: #777;
  
  svg {
    margin-bottom: 1rem;
    color: #ddd;
  }
  
  h4 {
    margin: 0 0 0.5rem;
    font-weight: 600;
    color: #555;
  }
  
  p {
    margin: 0 0 1.5rem;
  }
`;

export const SchedulerCalendar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  
  .calendar-header {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .calendar-day-names {
    display: contents;
    
    span {
      text-align: center;
      font-weight: 500;
      color: #555;
      padding: 0.5rem;
    }
  }
  
  .calendar-day {
    aspect-ratio: 1;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    
    &.today {
      background-color: #f0f4ff;
      border-color: #4a6cf7;
    }
    
    &.has-events {
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0.25rem;
        right: 0.25rem;
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        background-color: #4a6cf7;
      }
    }
  }
`;
