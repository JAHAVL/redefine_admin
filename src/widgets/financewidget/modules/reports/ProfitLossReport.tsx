import React from 'react';
import { useFinanceTheme } from '../../theme/FinanceThemeProvider';
import { 
  Section, 
  Table
} from '../../FinanceWidgetStyled';

interface ProfitLossReportProps {
  dateRange: string;
  customDateRange: {
    start: string;
    end: string;
  };
}

/**
 * ProfitLossReport component for displaying profit and loss statements
 */
const ProfitLossReport: React.FC<ProfitLossReportProps> = ({ dateRange, customDateRange }) => {
  // Access the theme
  const theme = useFinanceTheme();
  
  // Mock data for the report
  const incomeCategories = [
    { id: '1', name: 'Tithes', amount: 45250.00 },
    { id: '2', name: 'Offerings', amount: 12750.00 },
    { id: '3', name: 'Special Events', amount: 8500.00 },
    { id: '4', name: 'Donations', amount: 15000.00 },
  ];
  
  const expenseCategories = [
    { id: '1', name: 'Salaries', amount: 28000.00 },
    { id: '2', name: 'Building Maintenance', amount: 5500.00 },
    { id: '3', name: 'Utilities', amount: 3200.00 },
    { id: '4', name: 'Ministry Programs', amount: 7500.00 },
    { id: '5', name: 'Office Supplies', amount: 1200.00 },
    { id: '6', name: 'Insurance', amount: 2800.00 },
  ];
  
  // Calculate totals
  const totalIncome = incomeCategories.reduce((sum, category) => sum + category.amount, 0);
  const totalExpenses = expenseCategories.reduce((sum, category) => sum + category.amount, 0);
  const netIncome = totalIncome - totalExpenses;
  
  // Format date range for display
  const getDisplayDateRange = () => {
    switch (dateRange) {
      case 'current-month':
        return 'April 2025';
      case 'previous-month':
        return 'March 2025';
      case 'current-quarter':
        return 'Q2 2025 (Apr-Jun)';
      case 'previous-quarter':
        return 'Q1 2025 (Jan-Mar)';
      case 'current-year':
        return 'Fiscal Year 2025';
      case 'previous-year':
        return 'Fiscal Year 2024';
      case 'custom':
        return `${customDateRange.start} to ${customDateRange.end}`;
      default:
        return 'Current Period';
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
          Profit & Loss Statement
        </h2>
        <h3 style={{ 
          fontSize: theme.typography.fontSize.medium, 
          margin: 0,
          marginBottom: theme.spacing.xl,
          fontWeight: 'normal',
          textAlign: 'center',
          color: theme.colors.text.secondary
        }}>
          {getDisplayDateRange()}
        </h3>
        
        {/* Income Section */}
        <div style={{ marginBottom: theme.spacing.xl }}>
          <h3 style={{ 
            fontSize: theme.typography.fontSize.medium, 
            marginBottom: theme.spacing.md,
            borderBottom: `1px solid ${theme.colors.border.light}`,
            paddingBottom: theme.spacing.sm
          }}>
            Income
          </h3>
          
          <Table>
            <tbody>
              {incomeCategories.map(category => (
                <tr key={category.id}>
                  <td style={{ width: '70%' }}>{category.name}</td>
                  <td style={{ textAlign: 'right' }}>${category.amount.toFixed(2)}</td>
                </tr>
              ))}
              <tr style={{ 
                fontWeight: 'bold',
                backgroundColor: theme.colors.background.highlight
              }}>
                <td>Total Income</td>
                <td style={{ textAlign: 'right' }}>${totalIncome.toFixed(2)}</td>
              </tr>
            </tbody>
          </Table>
        </div>
        
        {/* Expenses Section */}
        <div style={{ marginBottom: theme.spacing.xl }}>
          <h3 style={{ 
            fontSize: theme.typography.fontSize.medium, 
            marginBottom: theme.spacing.md,
            borderBottom: `1px solid ${theme.colors.border.light}`,
            paddingBottom: theme.spacing.sm
          }}>
            Expenses
          </h3>
          
          <Table>
            <tbody>
              {expenseCategories.map(category => (
                <tr key={category.id}>
                  <td style={{ width: '70%' }}>{category.name}</td>
                  <td style={{ textAlign: 'right', color: theme.colors.state.error }}>
                    (${category.amount.toFixed(2)})
                  </td>
                </tr>
              ))}
              <tr style={{ 
                fontWeight: 'bold',
                backgroundColor: theme.colors.background.highlight
              }}>
                <td>Total Expenses</td>
                <td style={{ textAlign: 'right', color: theme.colors.state.error }}>
                  (${totalExpenses.toFixed(2)})
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        
        {/* Net Income */}
        <div style={{ 
          padding: theme.spacing.md,
          backgroundColor: theme.colors.background.highlight,
          borderRadius: '6px'
        }}>
          <Table>
            <tbody>
              <tr style={{ fontWeight: 'bold' }}>
                <td style={{ width: '70%' }}>Net Income</td>
                <td style={{ 
                  textAlign: 'right',
                  color: netIncome >= 0 ? theme.colors.state.success : theme.colors.state.error
                }}>
                  {netIncome >= 0 ? '$' : '($'}
                  {Math.abs(netIncome).toFixed(2)}
                  {netIncome >= 0 ? '' : ')'}
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossReport;
