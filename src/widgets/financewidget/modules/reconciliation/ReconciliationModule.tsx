import React, { useState } from 'react';
import { useFinanceTheme } from '../../theme/FinanceThemeProvider';
import { 
  Section, 
  Table, 
  Button, 
  Flex,
  Input,
  Select
} from '../../FinanceWidgetStyled';
import ActionIcons from '../../components/ActionIcons';
import ImportStatementModal from './ImportStatementModal';

/**
 * ReconciliationModule component for bank account reconciliation
 * Allows users to match bank transactions with recorded transactions
 */
const ReconciliationModule: React.FC = () => {
  // Access the theme
  const theme = useFinanceTheme();
  
  // Mock accounts data
  const accounts = [
    { id: '1', name: 'Main Checking', balance: 12500.75 },
    { id: '2', name: 'Operations Account', balance: 8750.25 },
    { id: '3', name: 'Payroll Account', balance: 5000.00 },
  ];
  
  // Mock unreconciled transactions
  const mockTransactions = [
    { id: '1', date: '2025-04-15', description: 'Utility Payment', amount: -245.67, status: 'Unreconciled' },
    { id: '2', date: '2025-04-16', description: 'Donation - Smith Family', amount: 500.00, status: 'Unreconciled' },
    { id: '3', date: '2025-04-17', description: 'Office Supplies', amount: -89.99, status: 'Unreconciled' },
  ];
  
  // State for selected account and modals
  const [selectedAccount, setSelectedAccount] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [transactions, setTransactions] = useState(mockTransactions);

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ 
        marginBottom: theme.spacing.lg,
        borderBottom: `${theme.border.width.thin} solid ${theme.colors.border.light}`,
        paddingBottom: theme.spacing.md 
      }}>
        <h1 style={{ fontSize: theme.typography.fontSize.xlarge, margin: 0 }}>Account Reconciliation</h1>
        <Button onClick={() => setShowImportModal(true)}>Import Bank Statement</Button>
      </Flex>

      {/* Account Selection */}
      <Section style={{ marginBottom: theme.spacing.xl }}>
        <div style={{ marginBottom: theme.spacing.md }}>
          <label style={{ display: 'block', marginBottom: theme.spacing.sm }}>Select Account to Reconcile</label>
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
        
        {selectedAccount && (
          <div style={{ 
            backgroundColor: theme.colors.background.card,
            padding: theme.spacing.md,
            borderRadius: '6px',
            marginBottom: theme.spacing.md
          }}>
            <Flex justify="space-between">
              <div>
                <h3 style={{ margin: 0, marginBottom: theme.spacing.sm }}>
                  {accounts.find(a => a.id === selectedAccount)?.name}
                </h3>
                <div>Account Balance: ${accounts.find(a => a.id === selectedAccount)?.balance.toFixed(2)}</div>
              </div>
              <div>
                <Button style={{ marginRight: theme.spacing.sm }}>Start Reconciliation</Button>
                <Button style={{ backgroundColor: theme.colors.background.highlight }}>View Statement</Button>
              </div>
            </Flex>
          </div>
        )}
      </Section>

      {/* Unreconciled Transactions */}
      <Section>
        <h2 style={{ fontSize: theme.typography.fontSize.large, marginBottom: theme.spacing.md }}>
          Unreconciled Transactions
        </h2>
        
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
              <th style={{ textAlign: 'center', width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td style={{ 
                  color: transaction.amount < 0 
                    ? theme.colors.state.error 
                    : theme.colors.state.success 
                }}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </td>
                <td>
                  <div style={{ 
                    display: 'inline-block',
                    backgroundColor: theme.colors.background.highlight,
                    color: theme.colors.text.primary,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {transaction.status}
                  </div>
                </td>
                <td>
                  <ActionIcons 
                    onView={() => console.log('View transaction', transaction.id)}
                    onEdit={() => console.log('Reconcile transaction', transaction.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      {/* Import Statement Modal */}
      <ImportStatementModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        accounts={accounts}
        onImport={(importData) => {
          console.log('Imported statement:', importData);
          // In a real implementation, this would process the imported statement
          // and add new transactions to be reconciled
          setShowImportModal(false);
        }}
      />
    </div>
  );
};

export default ReconciliationModule;
