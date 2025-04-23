import React, { useState } from 'react';
import { useFinanceTheme } from '../../theme/FinanceThemeProvider';
import { 
  Section, 
  Button, 
  Flex,
  Select
} from '../../FinanceWidgetStyled';
import ProfitLossReport from './ProfitLossReport';
import BalanceSheetReport from './BalanceSheetReport';
import ExportReportModal from './ExportReportModal';

/**
 * ReportsModule component for financial reports
 * Allows users to select and view different financial reports
 */
const ReportsModule: React.FC = () => {
  // Access the theme
  const theme = useFinanceTheme();
  
  // State for selected report type and date range
  const [reportType, setReportType] = useState('profit-loss');
  const [dateRange, setDateRange] = useState('current-month');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Report types
  const reportTypes = [
    { id: 'profit-loss', name: 'Profit & Loss Statement' },
    { id: 'balance-sheet', name: 'Balance Sheet' },
    { id: 'cash-flow', name: 'Cash Flow Statement' },
    { id: 'income-by-category', name: 'Income by Category' },
    { id: 'expense-by-category', name: 'Expense by Category' }
  ];
  
  // Date range options
  const dateRangeOptions = [
    { id: 'current-month', name: 'Current Month' },
    { id: 'previous-month', name: 'Previous Month' },
    { id: 'current-quarter', name: 'Current Quarter' },
    { id: 'previous-quarter', name: 'Previous Quarter' },
    { id: 'current-year', name: 'Current Year' },
    { id: 'previous-year', name: 'Previous Year' },
    { id: 'custom', name: 'Custom Date Range' }
  ];

  // Get report name for display and export
  const getReportName = () => {
    const report = reportTypes.find(r => r.id === reportType);
    return report ? report.name : 'Financial Report';
  };

  // Render the selected report component
  const renderReport = () => {
    switch (reportType) {
      case 'profit-loss':
        return <ProfitLossReport dateRange={dateRange} customDateRange={customDateRange} />;
      case 'balance-sheet':
        return <BalanceSheetReport dateRange={dateRange} customDateRange={customDateRange} />;
      default:
        return (
          <div style={{ 
            padding: theme.spacing.xl,
            textAlign: 'center',
            backgroundColor: theme.colors.background.card,
            borderRadius: '6px'
          }}>
            <h3>Report Under Development</h3>
            <p>This report type is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ 
        marginBottom: theme.spacing.lg,
        borderBottom: `${theme.border.width.thin} solid ${theme.colors.border.light}`,
        paddingBottom: theme.spacing.md 
      }}>
        <h1 style={{ fontSize: theme.typography.fontSize.xlarge, margin: 0 }}>Financial Reports</h1>
        <Button onClick={() => setShowExportModal(true)}>Export Report</Button>
      </Flex>

      {/* Report Selection and Controls */}
      <Section style={{ marginBottom: theme.spacing.xl }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          marginBottom: theme.spacing.lg,
          backgroundColor: theme.colors.background.card,
          padding: theme.spacing.md,
          borderRadius: '6px'
        }}>
          {/* Report Type Selector */}
          <div style={{ minWidth: '250px' }}>
            <label style={{ display: 'block', marginBottom: theme.spacing.sm, color: theme.colors.text.secondary }}>
              Report Type
            </label>
            <Select
              value={reportType}
              onChange={e => setReportType(e.target.value)}
              style={{ width: '100%' }}
            >
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </Select>
          </div>
          
          {/* Date Range Selector */}
          <div style={{ minWidth: '250px' }}>
            <label style={{ display: 'block', marginBottom: theme.spacing.sm, color: theme.colors.text.secondary }}>
              Date Range
            </label>
            <Select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              style={{ width: '100%' }}
            >
              {dateRangeOptions.map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </Select>
          </div>
          
          {/* Custom Date Range (if selected) */}
          {dateRange === 'custom' && (
            <Flex gap="15px" style={{ width: '100%' }}>
              <div>
                <label style={{ display: 'block', marginBottom: theme.spacing.sm, color: theme.colors.text.secondary }}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={e => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: `1px solid ${theme.colors.border.medium}`,
                    backgroundColor: theme.colors.background.card,
                    color: theme.colors.text.primary,
                    width: '180px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: theme.spacing.sm, color: theme.colors.text.secondary }}>
                  End Date
                </label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={e => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: `1px solid ${theme.colors.border.medium}`,
                    backgroundColor: theme.colors.background.card,
                    color: theme.colors.text.primary,
                    width: '180px'
                  }}
                />
              </div>
            </Flex>
          )}
          
          {/* Generate Report Button */}
          <div style={{ alignSelf: 'flex-end' }}>
            <Button>Generate Report</Button>
          </div>
        </div>
      </Section>

      {/* Report Content */}
      <Section>
        {renderReport()}
      </Section>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        reportType={reportType}
        reportName={getReportName()}
        onExport={(exportData) => {
          console.log('Export report data:', exportData);
          // In a real implementation, this would generate and download
          // or email the exported report
          setShowExportModal(false);
        }}
      />
    </div>
  );
};

export default ReportsModule;
