import React, { useState } from 'react';
import { useFinanceTheme } from '../../theme/FinanceThemeProvider';
import { 
  Button, 
  Flex,
  Input,
  Select,
  Section
} from '../../FinanceWidgetStyled';

/**
 * BankStatementImport component for importing bank statements
 * Allows users to upload CSV/OFX files and map fields to system fields
 */
const BankStatementImport: React.FC = () => {
  // Access the theme
  const theme = useFinanceTheme();
  
  // State for selected account and file
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importStep, setImportStep] = useState(1);
  const [fieldMappings, setFieldMappings] = useState({
    date: '',
    description: '',
    amount: '',
    type: ''
  });
  
  // Mock accounts data
  const accounts = [
    { id: '1', name: 'Main Checking' },
    { id: '2', name: 'Operations Account' },
    { id: '3', name: 'Payroll Account' },
  ];
  
  // Mock file fields (would come from parsing the actual file)
  const fileFields = [
    'transaction_date',
    'transaction_description',
    'debit_amount',
    'credit_amount',
    'reference_number',
    'transaction_type'
  ];

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle field mapping changes
  const handleMappingChange = (field: keyof typeof fieldMappings, value: string) => {
    setFieldMappings({
      ...fieldMappings,
      [field]: value
    });
  };

  // Move to next step
  const nextStep = () => {
    setImportStep(importStep + 1);
  };

  // Go back to previous step
  const prevStep = () => {
    setImportStep(importStep - 1);
  };

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ 
        marginBottom: theme.spacing.lg,
        borderBottom: `${theme.border.width.thin} solid ${theme.colors.border.light}`,
        paddingBottom: theme.spacing.md 
      }}>
        <h1 style={{ fontSize: theme.typography.fontSize.xlarge, margin: 0 }}>Import Bank Statement</h1>
      </Flex>

      {/* Step indicator */}
      <div style={{ 
        display: 'flex', 
        marginBottom: theme.spacing.xl,
        borderBottom: `${theme.border.width.thin} solid ${theme.colors.border.light}`,
        paddingBottom: theme.spacing.md
      }}>
        {[1, 2, 3].map(step => (
          <div key={step} style={{ 
            marginRight: theme.spacing.xl,
            opacity: importStep === step ? 1 : 0.5,
            fontWeight: importStep === step ? 'bold' : 'normal'
          }}>
            <div style={{ 
              width: '30px', 
              height: '30px', 
              borderRadius: '50%', 
              backgroundColor: importStep >= step ? theme.colors.accent : theme.colors.background.highlight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: theme.spacing.sm
            }}>
              {step}
            </div>
            <div>{step === 1 ? 'Select File' : step === 2 ? 'Map Fields' : 'Review & Import'}</div>
          </div>
        ))}
      </div>

      {/* Step 1: Select File and Account */}
      {importStep === 1 && (
        <Section>
          <div style={{ marginBottom: theme.spacing.lg }}>
            <label style={{ display: 'block', marginBottom: theme.spacing.sm }}>Select Account</label>
            <Select 
              value={selectedAccount}
              onChange={e => setSelectedAccount(e.target.value)}
              style={{ width: '300px' }}
            >
              <option value="">Select an account...</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </Select>
          </div>
          
          <div style={{ marginBottom: theme.spacing.lg }}>
            <label style={{ display: 'block', marginBottom: theme.spacing.sm }}>Upload Statement File</label>
            <div style={{ 
              border: `1px dashed ${theme.colors.border.medium}`,
              borderRadius: '6px',
              padding: theme.spacing.lg,
              textAlign: 'center',
              backgroundColor: theme.colors.background.card,
              marginBottom: theme.spacing.md
            }}>
              <p>Drop your CSV, OFX, or QFX file here</p>
              <p style={{ fontSize: '12px', color: theme.colors.text.secondary }}>
                Supported formats: .csv, .ofx, .qfx
              </p>
              <Input 
                type="file" 
                accept=".csv,.ofx,.qfx"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button as="span">Select File</Button>
              </label>
            </div>
            
            {selectedFile && (
              <div style={{ 
                backgroundColor: theme.colors.background.card,
                padding: theme.spacing.md,
                borderRadius: '6px'
              }}>
                <p style={{ margin: 0 }}>
                  Selected file: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              </div>
            )}
          </div>
          
          <Flex justify="flex-end">
            <Button 
              onClick={nextStep}
              disabled={!selectedAccount || !selectedFile}
            >
              Next: Map Fields
            </Button>
          </Flex>
        </Section>
      )}

      {/* Step 2: Map Fields */}
      {importStep === 2 && (
        <Section>
          <h2 style={{ fontSize: theme.typography.fontSize.large, marginBottom: theme.spacing.md }}>
            Map Statement Fields
          </h2>
          
          <p>
            Please match the fields from your bank statement to the corresponding fields in our system.
          </p>
          
          <div style={{ marginBottom: theme.spacing.lg }}>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: theme.spacing.md,
              marginBottom: theme.spacing.md
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: theme.spacing.sm }}>Date Field</label>
                <Select 
                  value={fieldMappings.date}
                  onChange={e => handleMappingChange('date', e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="">Select field...</option>
                  {fileFields.map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </Select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: theme.spacing.sm }}>Description Field</label>
                <Select 
                  value={fieldMappings.description}
                  onChange={e => handleMappingChange('description', e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="">Select field...</option>
                  {fileFields.map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </Select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: theme.spacing.sm }}>Amount Field</label>
                <Select 
                  value={fieldMappings.amount}
                  onChange={e => handleMappingChange('amount', e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="">Select field...</option>
                  {fileFields.map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </Select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: theme.spacing.sm }}>Transaction Type Field</label>
                <Select 
                  value={fieldMappings.type}
                  onChange={e => handleMappingChange('type', e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="">Select field...</option>
                  {fileFields.map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          
          <Flex justify="space-between">
            <Button 
              onClick={prevStep}
              style={{ backgroundColor: theme.colors.background.highlight }}
            >
              Back
            </Button>
            <Button 
              onClick={nextStep}
              disabled={!fieldMappings.date || !fieldMappings.description || !fieldMappings.amount}
            >
              Next: Review & Import
            </Button>
          </Flex>
        </Section>
      )}

      {/* Step 3: Review and Import */}
      {importStep === 3 && (
        <Section>
          <h2 style={{ fontSize: theme.typography.fontSize.large, marginBottom: theme.spacing.md }}>
            Review & Import
          </h2>
          
          <div style={{ 
            backgroundColor: theme.colors.background.card,
            padding: theme.spacing.md,
            borderRadius: '6px',
            marginBottom: theme.spacing.lg
          }}>
            <h3 style={{ margin: 0, marginBottom: theme.spacing.md }}>Import Summary</h3>
            
            <div style={{ marginBottom: theme.spacing.md }}>
              <div style={{ fontWeight: 'bold', marginBottom: theme.spacing.sm }}>Account:</div>
              <div>{accounts.find(a => a.id === selectedAccount)?.name}</div>
            </div>
            
            <div style={{ marginBottom: theme.spacing.md }}>
              <div style={{ fontWeight: 'bold', marginBottom: theme.spacing.sm }}>File:</div>
              <div>{selectedFile?.name}</div>
            </div>
            
            <div style={{ marginBottom: theme.spacing.md }}>
              <div style={{ fontWeight: 'bold', marginBottom: theme.spacing.sm }}>Field Mappings:</div>
              <div>Date: {fieldMappings.date}</div>
              <div>Description: {fieldMappings.description}</div>
              <div>Amount: {fieldMappings.amount}</div>
              <div>Type: {fieldMappings.type || '(Not mapped)'}</div>
            </div>
            
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: theme.spacing.sm }}>Transactions to Import:</div>
              <div>15 transactions found (sample data)</div>
            </div>
          </div>
          
          <Flex justify="space-between">
            <Button 
              onClick={prevStep}
              style={{ backgroundColor: theme.colors.background.highlight }}
            >
              Back
            </Button>
            <Button>
              Import Transactions
            </Button>
          </Flex>
        </Section>
      )}
    </div>
  );
};

export default BankStatementImport;
