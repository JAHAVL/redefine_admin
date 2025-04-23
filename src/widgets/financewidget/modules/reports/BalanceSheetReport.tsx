import React from 'react';
import { useFinanceTheme } from '../../theme/FinanceThemeProvider';
import { 
  Section, 
  Table
} from '../../FinanceWidgetStyled';

interface BalanceSheetReportProps {
  dateRange: string;
  customDateRange: {
    start: string;
    end: string;
  };
}

/**
 * BalanceSheetReport component for displaying balance sheet statements
 */
const BalanceSheetReport: React.FC<BalanceSheetReportProps> = ({ dateRange, customDateRange }) => {
  // Access the theme
  const theme = useFinanceTheme();
  
  // Mock data for the report
  const assets = [
    { id: '1', name: 'Checking Account', amount: 45250.00 },
    { id: '2', name: 'Savings Account', amount: 75000.00 },
    { id: '3', name: 'Investments', amount: 120000.00 },
    { id: '4', name: 'Property and Equipment', amount: 850000.00 },
  ];
  
  const liabilities = [
    { id: '1', name: 'Accounts Payable', amount: 12500.00 },
    { id: '2', name: 'Mortgage', amount: 350000.00 },
    { id: '3', name: 'Credit Cards', amount: 3200.00 },
  ];
  
  const equity = [
    { id: '1', name: 'Retained Earnings', amount: 650000.00 },
    { id: '2', name: 'Current Year Surplus', amount: 74550.00 },
  ];
  
  // Calculate totals
  const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + item.amount, 0);
  const totalEquity = equity.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;
  
  // Format date for display
  const getDisplayDate = () => {
    switch (dateRange) {
      case 'current-month':
        return 'April 30, 2025';
      case 'previous-month':
        return 'March 31, 2025';
      case 'current-quarter':
        return 'June 30, 2025';
      case 'previous-quarter':
        return 'March 31, 2025';
      case 'current-year':
        return 'December 31, 2025';
      case 'previous-year':
        return 'December 31, 2024';
      case 'custom':
        return customDateRange.end || 'Custom Date';
      default:
        return 'Current Date';
    }
  };

  return (
    <div>
      <div style={{ 
        backgroundColor: theme.colors.background.card,
        padding: theme.spacing.lg,
        borderRadius: '6px',
        marginBottom: theme.spacing.lg
      }}>
        <h2 style={{ 
          fontSize: theme.typography.fontSize.large, 
          margin: 0,
          marginBottom: theme.spacing.md,
          textAlign: 'center'
        }}>
          Balance Sheet
        </h2>
        <h3 style={{ 
          fontSize: theme.typography.fontSize.medium, 
          margin: 0,
          marginBottom: theme.spacing.xl,
          fontWeight: 'normal',
          textAlign: 'center',
          color: theme.colors.text.secondary
        }}>
          As of {getDisplayDate()}
        </h3>
        
        {/* Assets Section */}
        <div style={{ marginBottom: theme.spacing.xl }}>
          <h3 style={{ 
            fontSize: theme.typography.fontSize.medium, 
            marginBottom: theme.spacing.md,
            borderBottom: `1px solid ${theme.colors.border.light}`,
            paddingBottom: theme.spacing.sm
          }}>
            Assets
          </h3>
          
          <Table>
            <tbody>
              {assets.map(item => (
                <tr key={item.id}>
                  <td style={{ width: '70%' }}>{item.name}</td>
                  <td style={{ textAlign: 'right' }}>${item.amount.toFixed(2)}</td>
                </tr>
              ))}
              <tr style={{ 
                fontWeight: 'bold',
                backgroundColor: theme.colors.background.highlight
              }}>
                <td>Total Assets</td>
                <td style={{ textAlign: 'right' }}>${totalAssets.toFixed(2)}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        
        {/* Liabilities Section */}
        <div style={{ marginBottom: theme.spacing.xl }}>
          <h3 style={{ 
            fontSize: theme.typography.fontSize.medium, 
            marginBottom: theme.spacing.md,
            borderBottom: `1px solid ${theme.colors.border.light}`,
            paddingBottom: theme.spacing.sm
          }}>
            Liabilities
          </h3>
          
          <Table>
            <tbody>
              {liabilities.map(item => (
                <tr key={item.id}>
                  <td style={{ width: '70%' }}>{item.name}</td>
                  <td style={{ textAlign: 'right' }}>${item.amount.toFixed(2)}</td>
                </tr>
              ))}
              <tr style={{ 
                fontWeight: 'bold',
                backgroundColor: theme.colors.background.highlight
              }}>
                <td>Total Liabilities</td>
                <td style={{ textAlign: 'right' }}>${totalLiabilities.toFixed(2)}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        
        {/* Equity Section */}
        <div style={{ marginBottom: theme.spacing.xl }}>
          <h3 style={{ 
            fontSize: theme.typography.fontSize.medium, 
            marginBottom: theme.spacing.md,
            borderBottom: `1px solid ${theme.colors.border.light}`,
            paddingBottom: theme.spacing.sm
          }}>
            Equity
          </h3>
          
          <Table>
            <tbody>
              {equity.map(item => (
                <tr key={item.id}>
                  <td style={{ width: '70%' }}>{item.name}</td>
                  <td style={{ textAlign: 'right' }}>${item.amount.toFixed(2)}</td>
                </tr>
              ))}
              <tr style={{ 
                fontWeight: 'bold',
                backgroundColor: theme.colors.background.highlight
              }}>
                <td>Total Equity</td>
                <td style={{ textAlign: 'right' }}>${totalEquity.toFixed(2)}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        
        {/* Total Liabilities and Equity */}
        <div style={{ 
          padding: theme.spacing.md,
          backgroundColor: theme.colors.background.highlight,
          borderRadius: '6px'
        }}>
          <Table>
            <tbody>
              <tr style={{ fontWeight: 'bold' }}>
                <td style={{ width: '70%' }}>Total Liabilities and Equity</td>
                <td style={{ textAlign: 'right' }}>
                  ${totalLiabilitiesAndEquity.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheetReport;
