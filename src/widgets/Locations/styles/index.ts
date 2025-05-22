import styled from 'styled-components';
import { theme } from '../theme';

/**
 * Locations Widget Styled Components
 * 
 * These styled components define the visual structure and appearance of the Locations widget.
 * They provide a consistent design system across all location views.
 */

/* Main container for the Locations widget */
export const LocationsWidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  min-height: calc(100vh - 64px); /* Account for header */
  position: relative;
  background-color: ${theme.colors.background}; /* Light blue/gray background */
  color: ${theme.colors.text.primary};
  font-family: ${theme.typography.fontFamily};
  padding: ${theme.spacing.md};
  box-sizing: border-box;
  overflow-x: hidden;
  z-index: 0;
`;

export const LocationsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  width: 100%;
`;

export const LocationsTitle = styled.h1`
  font-size: ${theme.typography.fontSizes.xl};
  font-weight: ${theme.typography.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

export const LocationsContent = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

export const LocationsCard = styled.div`
  background-color: ${theme.colors.card}; /* White card background */
  border-radius: ${theme.borderRadius.md};
  box-shadow: 0 2px 4px ${theme.colors.shadow};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.md};
  transition: ${theme.transitions.default};
  
  &:hover {
    box-shadow: 0 4px 8px ${theme.colors.shadow};
  }
`;

export const LocationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.md};
  width: 100%;
`;

export const LocationsGridItem = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LocationsMapContainer = styled.div`
  background-color: ${theme.colors.mapBackground};
  border-radius: ${theme.borderRadius.md};
  width: 100%;
  height: 600px;
  position: relative;
  overflow: hidden;
  margin-bottom: ${theme.spacing.md};
`;

export const LocationsDetailPanel = styled.div`
  background-color: ${theme.colors.card};
  border-radius: ${theme.borderRadius.md};
  box-shadow: 0 2px 4px ${theme.colors.shadow};
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.md};
  transition: ${theme.transitions.default};
`;

/* Button styling to match scheduler widget */
export const LocationsButton = styled.button<{ primary?: boolean }>`
  background-color: ${(props: { primary?: boolean }) => props.primary ? theme.colors.primary : theme.colors.card};
  color: ${(props: { primary?: boolean }) => props.primary ? '#ffffff' : theme.colors.text.primary};
  border: ${(props: { primary?: boolean }) => props.primary ? 'none' : `1px solid ${theme.colors.border}`};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.fontSizes.sm};
  font-weight: ${theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: ${theme.transitions.quick};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  
  &:hover {
    background-color: ${(props: { primary?: boolean }) => props.primary ? theme.colors.primaryDark : theme.colors.highlight};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    font-size: 18px;
  }
  
  &.iconOnly {
    padding: ${theme.spacing.sm};
    aspect-ratio: 1/1;
  }
`;

export const LocationsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: ${theme.spacing.lg};
  
  th, td {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    text-align: left;
    border-bottom: 1px solid ${theme.colors.border};
  }
  
  th {
    font-weight: ${theme.typography.fontWeights.semibold};
    color: ${theme.colors.text.secondary};
    background-color: ${theme.colors.highlight};
  }
  
  tr:hover td {
    background-color: ${theme.colors.highlight};
  }
`;

/* Tab styling to match scheduler widget */
interface TabProps {
  active: boolean;
}

export const TabContainer = styled.div`
  display: flex;
  margin-bottom: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
`;

export const Tab = styled.button<TabProps>`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${(props: TabProps) => props.active ? theme.colors.primary : 'transparent'};
  color: ${(props: TabProps) => props.active ? theme.colors.text.primary : theme.colors.text.secondary};
  font-weight: ${(props: TabProps) => props.active ? theme.typography.fontWeights.semibold : theme.typography.fontWeights.regular};
  cursor: pointer;
  transition: ${theme.transitions.default};
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

/* Grid layout for dashboard views */
export const Dashboard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  width: 100%;
  padding: ${theme.spacing.md} 0;
`;

/* Search input styling */
export const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  width: 100%;
  max-width: 400px;
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
  font-family: ${theme.typography.fontFamily};
  font-size: ${theme.typography.fontSizes.sm};
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primaryLight};
  }
`;

// Export all components for easier imports
export default {
  LocationsWidgetContainer,
  LocationsHeader,
  LocationsTitle,
  LocationsContent,
  LocationsCard,
  LocationsGrid,
  LocationsGridItem,
  LocationsMapContainer,
  LocationsDetailPanel,
  LocationsButton,
  LocationsTable,
  TabContainer,
  Tab,
  Dashboard,
  SearchInput
};
