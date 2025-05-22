import React, { ReactNode } from 'react';
import { LocationsWidgetContainer, LocationsContent } from './styles';
import { theme } from './theme';
import { ThemeProvider } from 'styled-components';
import './styles/index';

/**
 * LocationsWidgetStyled Component
 * 
 * A wrapper component that provides styling and theming for the Locations widget.
 * This component applies a consistent background and styling to all location views.
 */
interface LocationsWidgetStyledProps {
  children: ReactNode;
}

const LocationsWidgetStyled: React.FC<LocationsWidgetStyledProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <LocationsWidgetContainer>
        <LocationsContent style={{ width: '100%', height: '100%' }}>
          {children}
        </LocationsContent>
      </LocationsWidgetContainer>
    </ThemeProvider>
  );
};

export default LocationsWidgetStyled;
