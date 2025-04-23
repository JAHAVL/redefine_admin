# Finance Widget

This widget provides comprehensive financial management capabilities for the redefine.church application, including real-time bank account integration via Plaid, transaction management, accounting, reporting, and budgeting.

## Architecture

The Finance Widget follows a modular architecture within a single parent widget structure:

```
/financewidget/
  index.tsx                      # Main entry point
  FinanceWidget.tsx              # Container widget
  FinanceWidgetStyled.tsx        # Styled components
  
  /components/                   # Shared components
    AccountSelector.tsx
    DateRangePicker.tsx
    GlassModal.tsx
    etc...
  
  /modules/                      # Specialized functional modules
    /transactions/
      TransactionList.tsx        # List of transactions
      TransactionForm.tsx        # Create/edit transactions
      TransactionFilters.tsx     # Filter controls
    
    /accounts/
      AccountList.tsx            # Chart of accounts
      AccountForm.tsx
      
    /reports/
      ReportSelector.tsx         # Report type selection
      ReportViewer.tsx           # Display reports
      ProfitLossReport.tsx       # Specific report components
      BalanceSheetReport.tsx
      
    /reconciliation/
      ReconciliationTool.tsx
      BankStatementImport.tsx
      
    /budget/  # Move existing budget components here
      BudgetBuilder.tsx
      
    /plaid/                      # Plaid integration components
      PlaidLink.tsx              # Plaid Link component
      PlaidAccountSelector.tsx   # Select connected accounts
      TransactionSync.tsx        # Sync transactions from Plaid
      
  /state/                        # State management
    financeReducer.ts
    financeContext.tsx
    actions.ts
```

## Key Features

### 1. Bank Account Integration (Plaid)
- Real-time bank connection using Plaid
- Automatic transaction syncing
- Balance monitoring and reconciliation
- Secure credential management (never storing bank credentials)

### 2. Transaction Management
- Transaction entry and categorization
- Bulk import capabilities
- AI-assisted categorization
- Search and filtering
- Attachment support for receipts

### 3. Financial Reporting
- Profit & Loss statements
- Balance sheets
- Cash flow analysis
- Custom report generation
- Export capabilities (PDF, CSV, Excel)

### 4. Reconciliation
- Automated matching between bank data and system records
- Discrepancy identification and resolution
- Reconciliation status tracking

### 5. Budget Management
- Budget creation and planning
- Budget vs. actual comparison
- Forecasting and projections
- Category-based budget rules

### 6. Chart of Accounts
- Full double-entry accounting support
- Hierarchical account structure
- Account type categorization
- Automatic account suggestions

## Implementation Notes

### Plaid Integration
- Requires backend API support for Plaid API integration
- Uses Plaid Link for secure account connection
- Implements webhooks for real-time updates
- Handles token management and renewal

### State Management
- Uses React Context API for global finance state
- Implements reducers for complex state logic
- Handles optimistic updates for better UX
- Maintains caching strategies for performance

### UI/UX Considerations
- Mobile-responsive design for all components
- Consistent styling with the overall application
- Accessibility compliance
- Progressive loading for large datasets

## Data Models

### Account
```typescript
interface Account {
  id: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  subtype?: string;
  parentAccountId?: string;
  plaidAccountId?: string;
  balance: number;
  currencyCode: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Transaction
```typescript
interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  categoryId: string;
  accountId: string;
  plaidTransactionId?: string;
  reconciled: boolean;
  memo?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Future Enhancements
- Tax reporting and management
- Multi-currency support
- Advanced AI-driven financial insights
- Integration with other financial services
- Mobile app support
