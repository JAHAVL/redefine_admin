import React, { useState } from 'react';
import {
  Section,
  Table,
  Button,
  Pill,
  Flex,
  DashboardCard,
  DashboardGrid
} from '../../FinanceWidgetStyled/index';
import { useFinanceTheme } from '../../theme/FinanceThemeProvider';
import ActionIcons from '../../components/ActionIcons';
import AccountFormModal from './AccountFormModal';
import ConnectBankModal from './ConnectBankModal';

// Sample account data
const sampleAccounts = [
  { 
    id: 1, 
    name: 'Main Checking', 
    type: 'Asset', 
    subtype: 'Checking', 
    balance: 12750.84, 
    institution: 'First National Bank',
    lastUpdated: '2025-04-20',
    isActive: true
  },
  { 
    id: 2, 
    name: 'Operations Account', 
    type: 'Asset', 
    subtype: 'Checking', 
    balance: 7500.25, 
    institution: 'First National Bank',
    lastUpdated: '2025-04-20',
    isActive: true
  },
  { 
    id: 3, 
    name: 'Payroll Account', 
    type: 'Asset', 
    subtype: 'Checking', 
    balance: 15000.00, 
    institution: 'First National Bank',
    lastUpdated: '2025-04-20',
    isActive: true
  },
  { 
    id: 4, 
    name: 'Savings Account', 
    type: 'Asset', 
    subtype: 'Savings', 
    balance: 35000.00, 
    institution: 'First National Bank',
    lastUpdated: '2025-04-20',
    isActive: true
  },
  { 
    id: 5, 
    name: 'Mission Fund', 
    type: 'Asset', 
    subtype: 'Restricted', 
    balance: 8650.25, 
    institution: 'First National Bank',
    lastUpdated: '2025-04-20',
    isActive: true
  },
  { 
    id: 6, 
    name: 'Building Fund', 
    type: 'Asset', 
    subtype: 'Restricted', 
    balance: 125000.00, 
    institution: 'Community Trust',
    lastUpdated: '2025-04-20',
    isActive: true
  },
  { 
    id: 7, 
    name: 'Church Mortgage', 
    type: 'Liability', 
    subtype: 'Loan', 
    balance: -275000.00, 
    institution: 'Community Trust',
    lastUpdated: '2025-04-20',
    isActive: true
  },
  { 
    id: 8, 
    name: 'Credit Card', 
    type: 'Liability', 
    subtype: 'Credit', 
    balance: -2450.75, 
    institution: 'First National Bank',
    lastUpdated: '2025-04-20',
    isActive: true
  }
];

const AccountsModule: React.FC = () => {
  // Access the theme
  const theme = useFinanceTheme();
  // State for account view
  const [viewType, setViewType] = useState<'all' | 'assets' | 'liabilities'>('all');
  // State for modals
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showConnectBankModal, setShowConnectBankModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [accountTypeToAdd, setAccountTypeToAdd] = useState('Asset');
  const [accounts, setAccounts] = useState(sampleAccounts);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Filter accounts based on view type
  const filteredAccounts = accounts.filter(account => {
    if (viewType === 'assets' && account.type !== 'Asset') return false;
    if (viewType === 'liabilities' && account.type !== 'Liability') return false;
    return true;
  });

  // Calculate totals
  const totalAssets = accounts
    .filter(account => account.type === 'Asset')
    .reduce((sum, account) => sum + account.balance, 0);
    
  const totalLiabilities = accounts
    .filter(account => account.type === 'Liability')
    .reduce((sum, account) => sum + Math.abs(account.balance), 0);
    
  const netWorth = totalAssets - totalLiabilities;

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ marginBottom: theme.spacing.lg }}>
        <h1 style={{ fontSize: theme.typography.fontSize.xlarge, margin: 0 }}>Accounts</h1>
        <Flex>
          <Button 
            style={{ marginRight: theme.spacing.sm }}
            onClick={() => setShowConnectBankModal(true)}
          >
            Connect Bank
          </Button>
          <Button onClick={() => setShowAddAccountModal(true)}>Add New Account</Button>
        </Flex>
      </Flex>

      {/* Account Summary */}
      <DashboardGrid>
        <DashboardCard>
          <h2>Total Assets</h2>
          <div style={{ fontSize: theme.typography.fontSize.xxlarge, fontWeight: 'bold', color: theme.colors.finance.positive }}>
            {formatCurrency(totalAssets)}
          </div>
          <div style={{ color: theme.colors.text.muted, marginTop: theme.spacing.xs }}>
            {accounts.filter(account => account.type === 'Asset').length} asset accounts
          </div>
        </DashboardCard>
        
        <DashboardCard>
          <h2>Total Liabilities</h2>
          <div style={{ fontSize: theme.typography.fontSize.xxlarge, fontWeight: 'bold', color: theme.colors.finance.negative }}>
            {formatCurrency(totalLiabilities)}
          </div>
          <div style={{ color: theme.colors.text.muted, marginTop: theme.spacing.xs }}>
            {accounts.filter(account => account.type === 'Liability').length} liability accounts
          </div>
        </DashboardCard>
        
        <DashboardCard>
          <h2>Net Worth</h2>
          <div style={{ 
            fontSize: theme.typography.fontSize.xxlarge, 
            fontWeight: 'bold', 
            color: netWorth >= 0 ? theme.colors.finance.positive : theme.colors.finance.negative 
          }}>
            {formatCurrency(netWorth)}
          </div>
          <div style={{ color: theme.colors.text.muted, marginTop: theme.spacing.xs }}>
            Assets minus Liabilities
          </div>
        </DashboardCard>
      </DashboardGrid>

      {/* Account List */}
      <Section>
        <Flex justify="space-between" align="center">
          <h2>Account List</h2>
          <Flex>
            <Button 
              style={{ 
                marginRight: theme.spacing.sm, 
                backgroundColor: viewType === 'all' ? theme.colors.primary : theme.colors.background.highlight,
                color: viewType === 'all' ? theme.colors.text.light : theme.colors.text.primary
              }}
              onClick={() => setViewType('all')}
            >
              All Accounts
            </Button>
            <Button 
              style={{ 
                marginRight: theme.spacing.sm, 
                backgroundColor: viewType === 'assets' ? theme.colors.primary : theme.colors.background.highlight,
                color: viewType === 'assets' ? theme.colors.text.light : theme.colors.text.primary
              }}
              onClick={() => setViewType('assets')}
            >
              Assets
            </Button>
            <Button 
              style={{ 
                backgroundColor: viewType === 'liabilities' ? theme.colors.primary : theme.colors.background.highlight,
                color: viewType === 'liabilities' ? theme.colors.text.light : theme.colors.text.primary
              }}
              onClick={() => setViewType('liabilities')}
            >
              Liabilities
            </Button>
          </Flex>
        </Flex>
        
        <Table>
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Type</th>
              <th>Financial Institution</th>
              <th>Balance</th>
              <th>Last Updated</th>
              <th>Status</th>
              <th style={{ textAlign: 'center', width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map(account => (
                <tr key={account.id}>
                  <td>{account.name}</td>
                  <td>
                    <Pill color={
                      account.type === 'Asset' ? 'green' : 
                      account.type === 'Liability' ? 'red' : 
                      'blue'
                    }>
                      {account.subtype}
                    </Pill>
                  </td>
                  <td>{account.institution}</td>
                  <td style={{ 
                    color: account.type === 'Asset' ? '#0f783c' : '#d72c0d',
                    fontWeight: '500'
                  }}>
                    {formatCurrency(Math.abs(account.balance))}
                  </td>
                  <td>{account.lastUpdated}</td>
                  <td>
                    <Pill color={account.isActive ? 'green' : 'yellow'}>
                      {account.isActive ? 'Active' : 'Inactive'}
                    </Pill>
                  </td>
                  <td>
                    <ActionIcons 
                      onView={() => console.log('View transactions for account', account.id)}
                      onEdit={() => setEditingAccount(account)}
                      onDelete={() => {
                        // Filter out the deleted account
                        setAccounts(accounts.filter(a => a.id !== account.id));
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>
                  No accounts found in the selected category
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Section>

      {/* Account Types Section */}
      <Section>
        <h2>Chart of Accounts</h2>
        <p>The Chart of Accounts is organized by account type and can be customized to match your organization's financial structure.</p>
        
        <DashboardGrid>
          <DashboardCard>
            <h2>Asset Accounts</h2>
            <p>Asset accounts represent resources owned by your organization that have monetary value.</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Cash and Bank Accounts</li>
              <li>Investments</li>
              <li>Property and Equipment</li>
              <li>Restricted Funds</li>
            </ul>
            <Button 
              style={{ marginTop: '10px' }} 
              onClick={() => {
                setAccountTypeToAdd('Asset');
                setShowAddAccountModal(true);
              }}
            >
              Manage Asset Accounts
            </Button>
          </DashboardCard>
          
          <DashboardCard>
            <h2>Liability Accounts</h2>
            <p>Liability accounts represent financial obligations and debts your organization owes.</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Loans and Mortgages</li>
              <li>Credit Cards</li>
              <li>Accounts Payable</li>
              <li>Payroll Liabilities</li>
            </ul>
            <Button 
              style={{ marginTop: '10px' }} 
              onClick={() => {
                setAccountTypeToAdd('Liability');
                setShowAddAccountModal(true);
              }}
            >
              Manage Liability Accounts
            </Button>
          </DashboardCard>
          
          <DashboardCard>
            <h2>Income Accounts</h2>
            <p>Income accounts track the sources of revenue for your organization.</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Donations and Tithes</li>
              <li>Program Revenue</li>
              <li>Fundraising</li>
              <li>Interest Income</li>
            </ul>
            <Button 
              style={{ marginTop: '10px' }} 
              onClick={() => {
                setAccountTypeToAdd('Income');
                setShowAddAccountModal(true);
              }}
            >
              Manage Income Accounts
            </Button>
          </DashboardCard>
          
          <DashboardCard>
            <h2>Expense Accounts</h2>
            <p>Expense accounts track where your organization spends its resources.</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Staff and Personnel</li>
              <li>Operations and Administration</li>
              <li>Ministry Programs</li>
              <li>Facilities</li>
            </ul>
            <Button 
              style={{ marginTop: '10px' }} 
              onClick={() => {
                setAccountTypeToAdd('Expense');
                setShowAddAccountModal(true);
              }}
            >
              Manage Expense Accounts
            </Button>
          </DashboardCard>
        </DashboardGrid>
      </Section>

      {/* Account Form Modal */}
      <AccountFormModal
        isOpen={showAddAccountModal || editingAccount !== null}
        onClose={() => {
          setShowAddAccountModal(false);
          setEditingAccount(null);
          setAccountTypeToAdd('Asset');
        }}
        account={editingAccount}
        initialAccountType={accountTypeToAdd}
        onSave={(accountData) => {
          if (editingAccount) {
            // Update existing account
            setAccounts(accounts.map(acc => 
              acc.id === accountData.id ? accountData : acc
            ));
            setEditingAccount(null);
          } else {
            // Add new account with a new ID
            const newAccount = {
              ...accountData,
              id: Date.now() // Generate a simple unique ID
            };
            setAccounts([...accounts, newAccount]);
            setShowAddAccountModal(false);
          }
        }}
      />

      {/* Connect Bank Modal */}
      <ConnectBankModal
        isOpen={showConnectBankModal}
        onClose={() => setShowConnectBankModal(false)}
        onConnect={(connectionData) => {
          console.log('Connected bank:', connectionData);
          // In a real implementation, this would create new accounts based on
          // the connected bank accounts
        }}
      />
    </div>
  );
};

export default AccountsModule;
