import React, { useState } from 'react';
import { useFinanceTheme } from '../../theme/FinanceThemeProvider';
import { FormGroup, Input } from '../../FinanceWidgetStyled';
import FinanceModal from '../../components/FinanceModal';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (data: any) => void;
  reportType: string;
  reportName: string;
}

/**
 * Modal for exporting financial reports
 */
const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  reportType,
  reportName
}) => {
  const theme = useFinanceTheme();
  
  // Export options
  const [fileFormat, setFileFormat] = useState('pdf');
  const [includeBreakdown, setIncludeBreakdown] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [emailRecipient, setEmailRecipient] = useState('');
  
  // Handle export action
  const handleExport = () => {
    onExport({
      reportType,
      reportName,
      fileFormat,
      options: {
        includeBreakdown,
        includeCharts,
        includeNotes,
        notes: notes.trim() ? notes : undefined
      },
      emailRecipient: emailRecipient.trim() ? emailRecipient : undefined,
      exportDate: new Date().toISOString()
    });
    
    onClose();
  };

  return (
    <FinanceModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Export ${reportName}`}
      primaryAction={{
        label: 'Export',
        onClick: handleExport
      }}
      secondaryAction={{
        label: 'Cancel',
        onClick: onClose
      }}
    >
      <div>
        <p style={{ marginBottom: theme.spacing.md, color: theme.colors.text.secondary }}>
          Configure your export options below. The report will include all data currently displayed.
        </p>
        
        {/* File Format */}
        <FormGroup style={{ marginBottom: theme.spacing.lg }}>
          <label style={{ fontWeight: 'bold', marginBottom: theme.spacing.sm, display: 'block' }}>
            File Format
          </label>
          <div style={{ display: 'flex', gap: theme.spacing.lg }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer'
            }}>
              <input
                type="radio"
                name="fileFormat"
                checked={fileFormat === 'pdf'}
                onChange={() => setFileFormat('pdf')}
                style={{ marginRight: theme.spacing.sm }}
              />
              <div>
                <div>PDF</div>
                <div style={{ fontSize: '0.8em', color: theme.colors.text.secondary }}>
                  Best for sharing and printing
                </div>
              </div>
            </label>
            
            <label style={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer'
            }}>
              <input
                type="radio"
                name="fileFormat"
                checked={fileFormat === 'excel'}
                onChange={() => setFileFormat('excel')}
                style={{ marginRight: theme.spacing.sm }}
              />
              <div>
                <div>Excel</div>
                <div style={{ fontSize: '0.8em', color: theme.colors.text.secondary }}>
                  Best for data analysis
                </div>
              </div>
            </label>
            
            <label style={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer'
            }}>
              <input
                type="radio"
                name="fileFormat"
                checked={fileFormat === 'csv'}
                onChange={() => setFileFormat('csv')}
                style={{ marginRight: theme.spacing.sm }}
              />
              <div>
                <div>CSV</div>
                <div style={{ fontSize: '0.8em', color: theme.colors.text.secondary }}>
                  Simple data format
                </div>
              </div>
            </label>
          </div>
        </FormGroup>
        
        {/* Content Options */}
        <FormGroup style={{ marginBottom: theme.spacing.lg }}>
          <label style={{ fontWeight: 'bold', marginBottom: theme.spacing.sm, display: 'block' }}>
            Content Options
          </label>
          
          <div style={{ marginBottom: theme.spacing.sm }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={includeBreakdown}
                onChange={() => setIncludeBreakdown(!includeBreakdown)}
                style={{ marginRight: theme.spacing.sm }}
              />
              Include detailed breakdown
            </label>
          </div>
          
          <div style={{ marginBottom: theme.spacing.sm }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={includeCharts}
                onChange={() => setIncludeCharts(!includeCharts)}
                style={{ marginRight: theme.spacing.sm }}
              />
              Include charts and graphs
            </label>
          </div>
          
          <div>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={includeNotes}
                onChange={() => setIncludeNotes(!includeNotes)}
                style={{ marginRight: theme.spacing.sm }}
              />
              Include notes
            </label>
          </div>
          
          {includeNotes && (
            <div style={{ marginTop: theme.spacing.sm }}>
              <Input
                as="textarea"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Enter notes to include with the report..."
                style={{ 
                  width: '100%', 
                  height: '80px',
                  resize: 'vertical' 
                }}
              />
            </div>
          )}
        </FormGroup>
        
        {/* Email Options */}
        <FormGroup>
          <label style={{ fontWeight: 'bold', marginBottom: theme.spacing.sm, display: 'block' }}>
            Email Report (Optional)
          </label>
          <Input
            type="email"
            value={emailRecipient}
            onChange={e => setEmailRecipient(e.target.value)}
            placeholder="Enter email address..."
            style={{ width: '100%' }}
          />
          <div style={{ 
            fontSize: '0.8em', 
            color: theme.colors.text.secondary,
            marginTop: '4px'
          }}>
            Leave blank to download the report directly
          </div>
        </FormGroup>
      </div>
    </FinanceModal>
  );
};

export default ExportReportModal;
