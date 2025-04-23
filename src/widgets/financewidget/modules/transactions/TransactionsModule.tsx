import React, { useState } from 'react';
import {
  Section,
  Table,
  Button,
  Pill,
  Flex,
  FilterBar,
  Input,
  Select,
  FormGroup
} from '../../FinanceWidgetStyled/index';
import { useFinanceTheme } from '../../theme/FinanceThemeProvider';
import ManualTransactionModal from './ManualTransactionModal';
import ActionIcons from '../../components/ActionIcons';

// Sample transaction data
const sampleTransactions = [
  { 
    id: 1, 
    date: '2025-04-15', 
    description: 'Donation - Smith Family', 
    amount: 500.00, 
    category: 'Tithe', 
    account: 'Main Checking',
    status: 'Completed' 
  },
  { 
    id: 2, 
    date: '2025-04-14', 
    description: 'Office Supplies', 
    amount: -125.35, 
    category: 'Expenses', 
    account: 'Operations Account',
    status: 'Completed' 
  },
  { 
    id: 3, 
    date: '2025-04-13', 
    description: 'Mission Fund Donation', 
    amount: 750.00, 
    category: 'Missions', 
    account: 'Mission Fund',
    status: 'Completed' 
  },
  { 
    id: 4, 
    date: '2025-04-12', 
    description: 'Utility Bill - Electric', 
    amount: -215.67, 
    category: 'Utilities', 
    account: 'Operations Account',
    status: 'Pending' 
  },
  { 
    id: 5, 
    date: '2025-04-10', 
    description: 'Youth Event Fees', 
    amount: 350.00, 
    category: 'Youth Ministry', 
    account: 'Main Checking',
    status: 'Completed' 
  },
  { 
    id: 6, 
    date: '2025-04-08', 
    description: 'Staff Salary - Pastor', 
    amount: -3500.00, 
    category: 'Salaries', 
    account: 'Payroll Account',
    status: 'Completed' 
  },
  { 
    id: 7, 
    date: '2025-04-07', 
    description: 'Online Donation - Anonymous', 
    amount: 250.00, 
    category: 'General Fund', 
    account: 'Main Checking',
    status: 'Completed' 
  },
  { 
    id: 8, 
    date: '2025-04-05', 
    description: 'Building Maintenance', 
    amount: -850.75, 
    category: 'Maintenance', 
    account: 'Building Fund',
    status: 'Pending' 
  },
  { 
    id: 9, 
    date: '2025-04-03', 
    description: 'Sunday Offering', 
    amount: 3250.65, 
    category: 'General Fund', 
    account: 'Main Checking',
    status: 'Completed' 
  },
  { 
    id: 10, 
    date: '2025-04-01', 
    description: 'Church Insurance Payment', 
    amount: -745.50, 
    category: 'Insurance', 
    account: 'Operations Account',
    status: 'Completed' 
  },
];

// Options for filters
const accountOptions = ['All Accounts', 'Main Checking', 'Operations Account', 'Payroll Account', 'Building Fund', 'Mission Fund'];
const categoryOptions = ['All Categories', 'Tithe', 'General Fund', 'Missions', 'Youth Ministry', 'Expenses', 'Salaries', 'Utilities', 'Maintenance', 'Insurance'];
const statusOptions = ['All Statuses', 'Completed', 'Pending'];
const typeOptions = ['All Types', 'Income', 'Expense'];

const TransactionsModule: React.FC = () => {
  // Access the theme
  const theme = useFinanceTheme();
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [accountFilter, setAccountFilter] = useState('All Accounts');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showManualTransactionModal, setShowManualTransactionModal] = useState(false);
  const [transactions, setTransactions] = useState(sampleTransactions);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Filter transactions based on current filters
  const filteredTransactions = transactions.filter(transaction => {
    // Search term filter
    if (searchTerm && !transaction.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Account filter
    if (accountFilter !== 'All Accounts' && transaction.account !== accountFilter) {
      return false;
    }
    
    // Category filter
    if (categoryFilter !== 'All Categories' && transaction.category !== categoryFilter) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== 'All Statuses' && transaction.status !== statusFilter) {
      return false;
    }
    
    // Type filter
    if (typeFilter === 'Income' && transaction.amount <= 0) {
      return false;
    }
    if (typeFilter === 'Expense' && transaction.amount >= 0) {
      return false;
    }
    
    // Date range filter
    if (dateRange.start && new Date(transaction.date) < new Date(dateRange.start)) {
      return false;
    }
    if (dateRange.end && new Date(transaction.date) > new Date(dateRange.end)) {
      return false;
    }
    
    return true;
  });

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ 
        marginBottom: theme.spacing.lg,
        borderBottom: `${theme.border.width.thin} solid ${theme.colors.border.light}`,
        paddingBottom: theme.spacing.md 
      }}>
        <h1 style={{ fontSize: theme.typography.fontSize.xlarge, margin: 0 }}>Transactions</h1>
        <Button onClick={() => setShowManualTransactionModal(true)}>Add Transaction</Button>
      </Flex>

      {/* Modern compact filter section */}
      <Section style={{ marginBottom: theme.spacing.xl }}>
        {/* Main filter bar - always visible */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '15px',
          backgroundColor: theme.colors.background.card,
          padding: '12px',
          borderRadius: '6px'
        }}>
          {/* Search */}
          <div style={{ minWidth: '250px', flex: 1 }}>
            <Input 
              type="text" 
              placeholder="Search transactions..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Account - Most common filter */}
          <div style={{ width: '180px' }}>
            <Select 
              value={accountFilter}
              onChange={e => setAccountFilter(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="All Accounts">All Accounts</option>
              {accountOptions.slice(1).map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>
          </div>

          {/* Filter toggle button */}
          <div>
            <Button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              style={{ 
                backgroundColor: 'transparent',
                border: `1px solid ${theme.colors.border.medium}`,
                color: theme.colors.text.primary,
                padding: '6px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span>Filters</span>
              <span style={{ fontSize: '10px' }}>{showAdvancedFilters ? '▲' : '▼'}</span>
            </Button>
          </div>

          {/* Clear button */}
          <div>
            <Button 
              style={{ 
                backgroundColor: theme.colors.background.highlight,
                color: theme.colors.text.primary,
                padding: '6px 12px'
              }}
              onClick={() => {
                setSearchTerm('');
                setAccountFilter('All Accounts');
                setCategoryFilter('All Categories');
                setStatusFilter('All Statuses');
                setTypeFilter('All Types');
                setDateRange({ start: '', end: '' });
              }}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Advanced filters - collapsible */}
        {showAdvancedFilters && (
          <div style={{
            backgroundColor: theme.colors.background.card,
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '15px'
          }}>
            {/* Use flexbox with fixed widths instead of grid */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
            {/* Type Filter */}
            <div style={{ width: '180px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: theme.colors.text.secondary }}>Type</label>
              <Select 
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                style={{ width: '180px' }}
              >
                <option value="All Types">All Types</option>
                {typeOptions.slice(1).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
            </div>

            {/* Category Filter */}
            <div style={{ width: '180px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: theme.colors.text.secondary }}>Category</label>
              <Select 
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                style={{ width: '180px' }}
              >
                <option value="All Categories">All Categories</option>
                {categoryOptions.slice(1).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
            </div>

            {/* Status Filter */}
            <div style={{ width: '180px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: theme.colors.text.secondary }}>Status</label>
              <Select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{ width: '180px' }}
              >
                <option value="All Statuses">All Statuses</option>
                {statusOptions.slice(1).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
            </div>

            {/* From Date */}
            <div style={{ width: '180px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: theme.colors.text.secondary }}>From Date</label>
              <Input 
                type="date"
                value={dateRange.start}
                onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
                style={{ width: '180px' }}
              />
            </div>

            {/* To Date */}
            <div style={{ width: '180px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: theme.colors.text.secondary }}>To Date</label>
              <Input 
                type="date"
                value={dateRange.end}
                onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
                style={{ width: '180px' }}
              />
            </div>
          </div>
        </div>
        )}
      </Section>

      {/* Transactions Table with actions at top */}
      <Section>
        <Flex justify="flex-end" align="center" style={{ marginBottom: theme.spacing.md }}>
          <div>
            <Button style={{ marginRight: theme.spacing.sm }}>Export</Button>
            <Button style={{ backgroundColor: theme.colors.background.highlight, color: theme.colors.text.primary }}>Import</Button>
          </div>
        </Flex>
        
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Account</th>
              <th>Amount</th>
              <th>Status</th>
              <th style={{ textAlign: 'center', width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.date}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.account}</td>
                  <td style={{ 
                    color: transaction.amount >= 0 ? theme.colors.finance.positive : theme.colors.finance.negative,
                    fontWeight: '500'
                  }}>
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td>
                    <Pill color={transaction.status === 'Completed' ? 'green' : 'yellow'}>
                      {transaction.status}
                    </Pill>
                  </td>
                  <td>
                    <ActionIcons 
                      onView={() => console.log('View transaction', transaction.id)} 
                      onEdit={() => console.log('Edit transaction', transaction.id)} 
                      onDelete={() => {
                        // Filter out the deleted transaction
                        setTransactions(transactions.filter(t => t.id !== transaction.id));
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: theme.spacing.xl }}>
                  No transactions found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        
        {/* Simple Pagination */}
        <Flex justify="flex-end" style={{ marginTop: theme.spacing.lg }}>
          <Button style={{ padding: `${theme.spacing.xs} ${theme.spacing.sm}`, marginRight: theme.spacing.sm }}>Previous</Button>
          <Button style={{ padding: `${theme.spacing.xs} ${theme.spacing.sm}` }}>Next</Button>
        </Flex>
      </Section>
      
      {/* Transaction Summary */}
      <Section>
        <h2>Summary</h2>
        <Flex style={{ gap: theme.spacing.lg }}>
          <div style={{ 
            padding: theme.spacing.md, 
            backgroundColor: theme.colors.state.infoLight, 
            borderRadius: theme.border.radius.medium,
            flex: 1
          }}>
            <div style={{ fontSize: theme.typography.fontSize.base, color: theme.colors.text.secondary }}>Total Income</div>
            <div style={{ 
              fontSize: theme.typography.fontSize.xlarge, 
              fontWeight: 'bold', 
              color: theme.colors.finance.positive 
            }}>
              {formatCurrency(
                filteredTransactions
                  .filter(t => t.amount > 0)
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </div>
          </div>
          
          <div style={{ 
            padding: theme.spacing.md, 
            backgroundColor: theme.colors.state.errorLight, 
            borderRadius: theme.border.radius.medium,
            flex: 1
          }}>
            <div style={{ fontSize: theme.typography.fontSize.base, color: theme.colors.text.secondary }}>Total Expenses</div>
            <div style={{ 
              fontSize: theme.typography.fontSize.xlarge, 
              fontWeight: 'bold', 
              color: theme.colors.finance.negative 
            }}>
              {formatCurrency(
                filteredTransactions
                  .filter(t => t.amount < 0)
                  .reduce((sum, t) => sum + Math.abs(t.amount), 0)
              )}
            </div>
          </div>
          
          <div style={{ 
            padding: theme.spacing.md, 
            backgroundColor: theme.colors.background.highlight, 
            borderRadius: theme.border.radius.medium,
            flex: 1
          }}>
            <div style={{ fontSize: theme.typography.fontSize.base, color: theme.colors.text.secondary }}>Net Balance</div>
            <div style={{ 
              fontSize: theme.typography.fontSize.xlarge, 
              fontWeight: 'bold', 
              color: filteredTransactions.reduce((sum, t) => sum + t.amount, 0) >= 0 ? theme.colors.finance.positive : theme.colors.finance.negative 
            }}>
              {formatCurrency(
                filteredTransactions.reduce((sum, t) => sum + t.amount, 0)
              )}
            </div>
          </div>
        </Flex>
      </Section>

      {/* Manual Transaction Modal */}
      <ManualTransactionModal
        isOpen={showManualTransactionModal}
        onClose={() => setShowManualTransactionModal(false)}
        onSave={(newTransaction) => {
          // Add the new transaction to the transactions list
          setTransactions([newTransaction, ...transactions]);
          // Close the modal
          setShowManualTransactionModal(false);
        }}
      />
    </div>
  );
};

export default TransactionsModule;
