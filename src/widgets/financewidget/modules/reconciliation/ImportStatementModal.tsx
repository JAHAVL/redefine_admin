import React, { useState } from 'react';
import { useFinanceTheme } from '../../theme/FinanceThemeProvider';
import { Button, Select, FormGroup } from '../../FinanceWidgetStyled';
import FinanceModal from '../../components/FinanceModal';

interface ImportStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any) => void;
  accounts: Array<{ id: string; name: string }>;
}

/**
 * Modal for importing bank statements for reconciliation
 */
const ImportStatementModal: React.FC<ImportStatementModalProps> = ({
  isOpen,
  onClose,
  onImport,
  accounts
}) => {
  const theme = useFinanceTheme();
  
  // Form state
  const [selectedAccount, setSelectedAccount] = useState('');
  const [statementDate, setStatementDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importFormat, setImportFormat] = useState('csv');
  const [dragging, setDragging] = useState(false);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };
  
  // Handle import
  const handleImport = () => {
    if (selectedAccount && selectedFile) {
      onImport({
        accountId: selectedAccount,
        statementDate,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        importFormat
      });
      
      // Reset form and close modal
      setSelectedAccount('');
      setStatementDate(new Date().toISOString().split('T')[0]);
      setSelectedFile(null);
      setImportFormat('csv');
      onClose();
    }
  };
  
  // Check if form is valid
  const isFormValid = selectedAccount !== '' && selectedFile !== null;

  return (
    <FinanceModal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Bank Statement"
      primaryAction={{
        label: 'Import Statement',
        onClick: handleImport,
        disabled: !isFormValid
      }}
      secondaryAction={{
        label: 'Cancel',
        onClick: onClose
      }}
    >
      <div>
        <p style={{ marginBottom: theme.spacing.md, color: theme.colors.text.secondary }}>
          Import a statement from your bank to reconcile your accounts. 
          Supported formats: CSV, OFX, QFX, QBO.
        </p>
        
        {/* Account Selection */}
        <FormGroup style={{ marginBottom: theme.spacing.md }}>
          <label>Account *</label>
          <Select
            value={selectedAccount}
            onChange={e => setSelectedAccount(e.target.value)}
            required
          >
            <option value="">Select an account</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </Select>
        </FormGroup>
        
        {/* Statement Date */}
        <FormGroup style={{ marginBottom: theme.spacing.md }}>
          <label>Statement Date *</label>
          <input
            type="date"
            value={statementDate}
            onChange={e => setStatementDate(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: `1px solid ${theme.colors.border.medium}`,
              backgroundColor: theme.colors.background.card,
              color: theme.colors.text.primary
            }}
          />
        </FormGroup>
        
        {/* Import Format */}
        <FormGroup style={{ marginBottom: theme.spacing.lg }}>
          <label>File Format *</label>
          <Select
            value={importFormat}
            onChange={e => setImportFormat(e.target.value)}
            required
          >
            <option value="csv">CSV (Comma Separated Values)</option>
            <option value="ofx">OFX (Open Financial Exchange)</option>
            <option value="qfx">QFX (Quicken Financial Exchange)</option>
            <option value="qbo">QBO (QuickBooks Online)</option>
          </Select>
        </FormGroup>
        
        {/* File Upload */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragging ? theme.colors.accent : theme.colors.border.medium}`,
            borderRadius: '6px',
            padding: theme.spacing.lg,
            textAlign: 'center',
            backgroundColor: dragging ? `${theme.colors.accent}10` : theme.colors.background.highlight,
            transition: 'all 0.2s',
            cursor: 'pointer',
            marginBottom: theme.spacing.lg
          }}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <input
            id="file-upload"
            type="file"
            accept=".csv,.ofx,.qfx,.qbo"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          {selectedFile ? (
            <div>
              <div style={{ 
                fontSize: '48px', 
                marginBottom: theme.spacing.sm,
                color: theme.colors.accent
              }}>
                📄
              </div>
              <div style={{ fontWeight: 'bold', marginBottom: theme.spacing.xs }}>
                {selectedFile.name}
              </div>
              <div style={{ color: theme.colors.text.secondary, fontSize: '0.9em' }}>
                {(selectedFile.size / 1024).toFixed(1)} KB
              </div>
              <Button 
                style={{ 
                  marginTop: theme.spacing.md,
                  backgroundColor: theme.colors.background.card,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border.medium}`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
              >
                Change File
              </Button>
            </div>
          ) : (
            <div>
              <div style={{ 
                fontSize: '48px', 
                marginBottom: theme.spacing.sm,
                color: theme.colors.text.secondary
              }}>
                📄
              </div>
              <div style={{ fontWeight: 'bold', marginBottom: theme.spacing.xs }}>
                Drag and drop your file here
              </div>
              <div style={{ marginBottom: theme.spacing.md, color: theme.colors.text.secondary }}>
                or click to browse files
              </div>
              <Button style={{ backgroundColor: theme.colors.accent, color: theme.colors.text.light }}>
                Browse Files
              </Button>
            </div>
          )}
        </div>
        
        <div style={{ 
          backgroundColor: theme.colors.background.highlight,
          borderRadius: '6px',
          padding: theme.spacing.md,
          marginBottom: theme.spacing.md
        }}>
          <h3 style={{ 
            fontSize: theme.typography.fontSize.medium, 
            marginTop: 0,
            marginBottom: theme.spacing.sm
          }}>
            Statement Import Tips
          </h3>
          <ul style={{ 
            margin: 0,
            paddingLeft: '20px',
            color: theme.colors.text.secondary
          }}>
            <li>Most banks allow you to export statements as CSV files</li>
            <li>For best results, use the most detailed export option available</li>
            <li>Make sure your file includes dates, descriptions, and amounts</li>
            <li>The system will attempt to auto-match transactions where possible</li>
          </ul>
        </div>
      </div>
    </FinanceModal>
  );
};

export default ImportStatementModal;
