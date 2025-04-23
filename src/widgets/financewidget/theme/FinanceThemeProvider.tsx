import React, { createContext, useContext, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { FinanceTheme, defaultTheme, createFinanceTheme } from './financeTheme';

// Create theme context
const FinanceThemeContext = createContext<FinanceTheme>(defaultTheme);

// Custom hook to use the finance theme
export const useFinanceTheme = () => useContext(FinanceThemeContext);

interface FinanceThemeProviderProps {
  children: ReactNode;
  theme?: Partial<FinanceTheme>;
}

/**
 * Finance Theme Provider
 * Provides the theme to all nested components
 */
export const FinanceThemeProvider: React.FC<FinanceThemeProviderProps> = ({ 
  children, 
  theme = {} 
}) => {
  // Merge custom theme with default theme
  const mergedTheme = createFinanceTheme(theme);
  
  return (
    <FinanceThemeContext.Provider value={mergedTheme}>
      <StyledThemeProvider theme={mergedTheme}>
        {children}
      </StyledThemeProvider>
    </FinanceThemeContext.Provider>
  );
};

export default FinanceThemeProvider;
