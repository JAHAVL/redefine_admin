import styled from 'styled-components';
import { FinanceTheme } from './theme/financeTheme';

// Main container for the Finance Widget
export const FinanceWidgetContainer = styled.div<{ theme: FinanceTheme }>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.main};
  border-radius: ${({ theme }) => theme.border.radius.large};
  box-shadow: ${({ theme }) => theme.shadows.md};
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding-top: ${({ theme }) => theme.spacing.lg};
`;

// Header section with title (not used anymore - kept for reference)
export const FinanceHeader = styled.header<{ theme: FinanceTheme }>`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.xl}`};
  border-bottom: ${({ theme }) => `${theme.border.width.thin} solid ${theme.colors.border.light}`};
  background-color: ${({ theme }) => theme.colors.background.main};

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize.xlarge};
    font-weight: ${({ theme }) => theme.typography.heading.fontWeight};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  }
`;

// Module selector component - horizontal tabs
export const ModuleSelector = styled.div<{ theme: FinanceTheme }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow-x: auto;
  padding-bottom: 2px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.border.light};
    border-radius: ${({ theme }) => theme.border.radius.small};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: ${({ theme }) => theme.border.radius.small};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text.primary};
  }

  @media (max-width: 768px) {
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

// Module selector buttons
interface ModuleButtonProps {
  active: boolean;
  theme: FinanceTheme;
}

export const ModuleButton = styled.button<ModuleButtonProps>`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.text.light : props.theme.colors.text.secondary};
  border: ${props => `${props.theme.border.width.thin} solid ${props.active ? props.theme.colors.primary : props.theme.colors.border.light}`};
  border-radius: ${props => props.theme.border.radius.medium};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all ${props => props.theme.transitions.short};

  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background.highlight};
  }

  @media (max-width: 768px) {
    padding: ${props => `${props.theme.spacing.sm} ${props.theme.spacing.md}`};
    font-size: ${props => props.theme.typography.fontSize.small};
  }
`;

// Main content area for the active module
export const FinanceContent = styled.div<{ theme: FinanceTheme }>`
  flex: 1;
  padding: ${({ theme }) => `0 ${theme.spacing.xl} ${theme.spacing.xl} ${theme.spacing.xl}`};
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.background.main};

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.border.light};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: ${({ theme }) => theme.border.radius.small};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text.primary};
  }
`;

// Card component for dashboard widgets
export const DashboardCard = styled.div<{ theme: FinanceTheme }>`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.border.radius.medium};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize.large};
    font-weight: ${({ theme }) => theme.typography.heading.fontWeight};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  }
`;

// Grid layout for dashboard cards
export const DashboardGrid = styled.div<{ theme: FinanceTheme }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Section with a title and content
export const Section = styled.section<{ theme: FinanceTheme }>`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize.large};
    font-weight: ${({ theme }) => theme.typography.heading.fontWeight};
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

// Table component for displaying data
export const Table = styled.table<{ theme: FinanceTheme }>`
  width: 100%;
  border-collapse: collapse;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.border.radius.medium};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  th {
    background-color: ${({ theme }) => theme.colors.background.highlight};
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md}`};
    text-align: left;
    font-weight: ${({ theme }) => theme.typography.heading.fontWeight};
    color: ${({ theme }) => theme.colors.text.secondary};
    border-bottom: ${({ theme }) => `${theme.border.width.thin} solid ${theme.colors.border.light}`};
  }

  td {
    padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.md}`};
    border-bottom: ${({ theme }) => `${theme.border.width.thin} solid ${theme.colors.border.light}`};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover {
    background-color: ${({ theme }) => theme.colors.background.highlight};
  }
`;

// Button component for actions
export const Button = styled.button<{ theme: FinanceTheme }>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.light};
  border: none;
  border-radius: ${({ theme }) => theme.border.radius.small};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: 500;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.short};

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.secondary};
    cursor: not-allowed;
  }
`;

// Secondary button style
export const SecondaryButton = styled(Button)<{ theme: FinanceTheme }>`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.highlight};
  }
`;

// Form input component
export const Input = styled.input<{ theme: FinanceTheme }>`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: ${({ theme }) => `${theme.border.width.thin} solid ${theme.colors.border.medium}`};
  border-radius: ${({ theme }) => theme.border.radius.small};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background-color: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: border-color ${({ theme }) => theme.transitions.short};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => `0 0 0 2px ${theme.colors.primary}33`};
  }
`;

// Form select component
export const Select = styled.select<{ theme: FinanceTheme }>`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: ${({ theme }) => `${theme.border.width.thin} solid ${theme.colors.border.medium}`};
  border-radius: ${({ theme }) => theme.border.radius.small};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background-color: ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: border-color ${({ theme }) => theme.transitions.short};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => `0 0 0 2px ${theme.colors.primary}33`};
  }
  
  option {
    background-color: ${({ theme }) => theme.colors.background.card};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

// Form group layout
export const FormGroup = styled.div<{ theme: FinanceTheme }>`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  label {
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

// Filter bar for tables
export const FilterBar = styled.div<{ theme: FinanceTheme }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

// Pills for tags or status indicators
interface PillProps {
  color?: string;
  theme: FinanceTheme;
}

export const Pill = styled.span<PillProps>`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.border.radius.small};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${props => {
    switch (props.color) {
      case 'green': return props.theme.colors.state.successLight;
      case 'red': return props.theme.colors.state.errorLight;
      case 'yellow': return props.theme.colors.state.warningLight;
      case 'blue': return props.theme.colors.state.infoLight;
      default: return 'rgba(158, 158, 158, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.color) {
      case 'green': return props.theme.colors.state.success;
      case 'red': return props.theme.colors.state.error;
      case 'yellow': return props.theme.colors.state.warning;
      case 'blue': return props.theme.colors.state.info;
      default: return props.theme.colors.text.secondary;
    }
  }};
  border: 1px solid transparent;
  border-color: ${props => {
    switch (props.color) {
      case 'green': return props.theme.colors.state.success + '4D';
      case 'red': return props.theme.colors.state.error + '4D';
      case 'yellow': return props.theme.colors.state.warning + '4D';
      case 'blue': return props.theme.colors.state.info + '4D';
      default: return 'rgba(158, 158, 158, 0.3)';
    }
  }};
`;

// Flex container for layouts
interface FlexProps {
  gap?: string;
  justify?: string;
  align?: string;
  direction?: string;
}

export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  gap: ${props => props.gap || '0'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'stretch'};
  flex-wrap: wrap;
`;
