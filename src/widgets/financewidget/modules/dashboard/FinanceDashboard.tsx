import React from 'react';
import {
  DashboardGrid,
  DashboardCard,
  Section,
  Table,
  Button,
  Pill,
  Flex
} from '../../FinanceWidgetStyled/index';
import { useFinanceTheme } from '../../theme/FinanceThemeProvider';

// Sample data for demonstration
const recentTransactions = [
  { id: 1, date: '2025-04-15', description: 'Donation - Smith Family', amount: 500.00, category: 'Tithe', status: 'Completed' },
  { id: 2, date: '2025-04-14', description: 'Office Supplies', amount: -125.35, category: 'Expenses', status: 'Completed' },
  { id: 3, date: '2025-04-13', description: 'Mission Fund Donation', amount: 750.00, category: 'Missions', status: 'Completed' },
  { id: 4, date: '2025-04-12', description: 'Utility Bill - Electric', amount: -215.67, category: 'Utilities', status: 'Pending' },
  { id: 5, date: '2025-04-10', description: 'Youth Event Fees', amount: 350.00, category: 'Youth Ministry', status: 'Completed' },
];

// Sample account balances
const accountBalances = [
  { id: 1, name: 'Main Checking', balance: 12750.84, type: 'Checking' },
  { id: 2, name: 'Savings Account', balance: 35000.00, type: 'Savings' },
  { id: 3, name: 'Mission Fund', balance: 8650.25, type: 'Restricted' },
  { id: 4, name: 'Building Fund', balance: 125000.00, type: 'Restricted' },
];

// Sample budget summary
const budgetSummary = [
  { id: 1, category: 'Operations', budgeted: 10000, actual: 8500, remaining: 1500 },
  { id: 2, category: 'Staff', budgeted: 25000, actual: 25000, remaining: 0 },
  { id: 3, category: 'Ministries', budgeted: 5000, actual: 3200, remaining: 1800 },
  { id: 4, category: 'Facilities', budgeted: 7500, actual: 6800, remaining: 700 },
];

const FinanceDashboard: React.FC = () => {
  // Access the theme
  const theme = useFinanceTheme();
  // Format currency values
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate total balances
  const totalBalance = accountBalances.reduce((sum, account) => sum + account.balance, 0);
  
  // Calculate income, expenses, and net for current month
  const income = recentTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = recentTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const net = income - expenses;

  return (
    <div>
      {/* Summary Cards */}
      <DashboardGrid>
        <DashboardCard>
          <h2>Total Balance</h2>
          <div style={{ fontSize: theme.typography.fontSize.xxlarge, fontWeight: 'bold', color: theme.colors.primary }}>
            {formatCurrency(totalBalance)}
          </div>
          <div style={{ color: theme.colors.text.muted, marginTop: theme.spacing.xs }}>
            Across {accountBalances.length} accounts
          </div>
        </DashboardCard>
        
        <DashboardCard>
          <h2>Current Month Income</h2>
          <div style={{ fontSize: theme.typography.fontSize.xxlarge, fontWeight: 'bold', color: theme.colors.finance.positive }}>
            {formatCurrency(income)}
          </div>
          <div style={{ color: theme.colors.text.muted, marginTop: theme.spacing.xs }}>
            From {recentTransactions.filter(t => t.amount > 0).length} transactions
          </div>
        </DashboardCard>
        
        <DashboardCard>
          <h2>Current Month Expenses</h2>
          <div style={{ fontSize: theme.typography.fontSize.xxlarge, fontWeight: 'bold', color: theme.colors.finance.negative }}>
            {formatCurrency(expenses)}
          </div>
          <div style={{ color: theme.colors.text.muted, marginTop: theme.spacing.xs }}>
            From {recentTransactions.filter(t => t.amount < 0).length} transactions
          </div>
        </DashboardCard>
        
        <DashboardCard>
          <h2>Current Month Net</h2>
          <div style={{ 
            fontSize: theme.typography.fontSize.xxlarge, 
            fontWeight: 'bold', 
            color: net >= 0 ? theme.colors.finance.positive : theme.colors.finance.negative 
          }}>
            {formatCurrency(net)}
          </div>
          <div style={{ color: theme.colors.text.muted, marginTop: theme.spacing.xs }}>
            Net {net >= 0 ? 'gain' : 'loss'} for current month
          </div>
        </DashboardCard>
      </DashboardGrid>

      {/* Account Balances */}
      <Section>
        <Flex justify="space-between" align="center">
          <h2>Account Balances</h2>
          <Button>Manage Accounts</Button>
        </Flex>
        <Table>
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Type</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accountBalances.map(account => (
              <tr key={account.id}>
                <td>{account.name}</td>
                <td>
                  <Pill color={
                    account.type === 'Checking' ? 'blue' : 
                    account.type === 'Savings' ? 'green' : 
                    'yellow'
                  }>
                    {account.type}
                  </Pill>
                </td>
                <td>{formatCurrency(account.balance)}</td>
                <td>
                  <Button>View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      {/* Recent Transactions */}
      <Section>
        <Flex justify="space-between" align="center">
          <h2>Recent Transactions</h2>
          <Button>View All</Button>
        </Flex>
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td>{transaction.category}</td>
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
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      {/* Budget Summary */}
      <Section>
        <Flex justify="space-between" align="center">
          <h2>Budget Summary</h2>
          <Button>View Budget</Button>
        </Flex>
        <Table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Budgeted</th>
              <th>Actual</th>
              <th>Remaining</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {budgetSummary.map(item => (
              <tr key={item.id}>
                <td>{item.category}</td>
                <td>{formatCurrency(item.budgeted)}</td>
                <td>{formatCurrency(item.actual)}</td>
                <td style={{ 
                  color: item.remaining >= 0 ? '#0f783c' : '#d72c0d',
                  fontWeight: '500'
                }}>
                  {formatCurrency(item.remaining)}
                </td>
                <td>
                  <div style={{ 
                    width: '100%', 
                    background: '#eee', 
                    borderRadius: '10px',
                    height: '8px',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${Math.min(100, (item.actual / item.budgeted) * 100)}%`,
                      background: item.actual <= item.budgeted ? '#3478ff' : '#d72c0d',
                      borderRadius: '10px'
                    }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>
    </div>
  );
};

export default FinanceDashboard;
