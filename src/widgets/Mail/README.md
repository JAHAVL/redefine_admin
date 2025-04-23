# Mail Widget

## Overview

The Mail Widget is a comprehensive email management system integrated into the Admin-React application. It provides functionality for managing email accounts, composing and sending emails, organizing emails into folders, creating signatures, setting up filters, and configuring mail settings.

## Architecture

The Mail Widget follows a modular architecture with the following key components:

```
/widgets/Mail/
├── actions.ts              # Standardized actions for AI integration
├── components/             # Reusable UI components
├── mailbox/                # Email viewing and management
│   └── MailWidget.tsx      # Main mailbox component
├── mailsettings/           # Mail configuration
│   └── MailSettings.tsx    # Settings management component
├── mailtemplates/          # Email template management
│   └── MailTemplates.tsx   # Templates component
├── theme.ts                # Theme configuration
├── types.ts                # TypeScript interfaces
└── index.ts                # Main export file
```

## Features

- **Mail Accounts Management**: Add, edit, and delete mail accounts
- **Email Composition and Sending**: Create and send emails with rich text formatting
- **Folder Organization**: Organize emails into folders (Inbox, Sent, Drafts, etc.)
- **Signatures**: Create and manage email signatures
- **Filters**: Set up rules to automatically organize incoming emails
- **Settings**: Configure display preferences, security options, and notifications

## Theme System

The Mail Widget uses a dedicated theme system defined in `theme.ts`. This ensures consistent styling throughout the widget and allows for easy customization.

### Theme Structure

```typescript
// Example of theme usage
import MailTheme from '../theme';

const StyledComponent = styled.div`
  background-color: ${MailTheme.colors.background.main};
  color: ${MailTheme.colors.text.primary};
  padding: ${MailTheme.spacing.md};
  border-radius: ${MailTheme.borderRadius.md};
`;
```

### Theme Properties

- **Colors**: Background, text, interactive elements, status indicators
- **Typography**: Font families, sizes, weights
- **Spacing**: Consistent spacing scale
- **Borders**: Border styles and radii
- **Shadows**: Elevation shadows
- **Transitions**: Animation timing

## Data Types

The Mail Widget uses several key data types defined in `types.ts`:

### MailAccount

```typescript
interface MailAccount {
  id: string;
  email: string;
  name: string;
  server: string;
  port: number;
  username: string;
  password: string;
  isDefault: boolean;
  signature: string;
  lastSync: string;
  smtpServer: string;
  imapServer: string;
}
```

### Signature

```typescript
interface Signature {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Email

```typescript
interface Email {
  id: string;
  subject: string;
  from: {
    email: string;
    name: string;
  };
  to: Array<{
    email: string;
    name: string;
  }>;
  body: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  folder: string;
  labels?: string[];
}
```

## API Endpoints

The Mail Widget interacts with the following API endpoints:

### Accounts

- `GET /api/mail/accounts` - Get all mail accounts
- `POST /api/mail/accounts` - Create a new mail account
- `PUT /api/mail/accounts/{id}` - Update a mail account
- `DELETE /api/mail/accounts/{id}` - Delete a mail account

### Emails

- `GET /api/mail/emails` - Get emails (with optional filters)
- `GET /api/mail/emails/{id}` - Get a specific email
- `POST /api/mail/emails` - Send a new email
- `PUT /api/mail/emails/{id}` - Update an email (e.g., mark as read)
- `DELETE /api/mail/emails/{id}` - Delete an email

### Signatures

- `GET /api/mail/signatures` - Get all signatures
- `POST /api/mail/signatures` - Create a new signature
- `PUT /api/mail/signatures/{id}` - Update a signature
- `DELETE /api/mail/signatures/{id}` - Delete a signature

### Filters

- `GET /api/mail/filters` - Get all filters
- `POST /api/mail/filters` - Create a new filter
- `PUT /api/mail/filters/{id}` - Update a filter
- `DELETE /api/mail/filters/{id}` - Delete a filter

## AI Integration

The Mail Widget is fully integrated with the application's AI assistant through standardized actions defined in `actions.ts`. These actions allow the AI to control the Mail Widget programmatically.

### Navigation Actions

```typescript
// Navigate to mail inbox
viewMailInbox(): void

// Navigate to mail settings with optional tab selection
viewMailSettings(tab?: string): void

// Navigate to mail templates
viewMailTemplates(): void
```

### Account Actions

```typescript
// Get all mail accounts
getMailAccounts(): Promise<MailAccount[]>

// Create a new mail account
createMailAccount(accountData: Partial<MailAccount>): Promise<MailAccount | null>

// Update an existing mail account
updateMailAccount(accountId: string, accountData: Partial<MailAccount>): Promise<MailAccount | null>

// Delete a mail account
deleteMailAccount(accountId: string): Promise<boolean>
```

### Signature Actions

```typescript
// Get all signatures
getSignatures(): Promise<Signature[]>

// Create a new signature
createSignature(signatureData: Partial<Signature>): Promise<Signature | null>

// Update an existing signature
updateSignature(signatureId: string, signatureData: Partial<Signature>): Promise<Signature | null>

// Delete a signature
deleteSignature(signatureId: string): Promise<boolean>
```

## Usage Examples

### Basic Component Integration

```tsx
import { MailWidget } from 'widgets/Mail';

const MyComponent = () => {
  return (
    <div>
      <h1>Mail System</h1>
      <MailWidget />
    </div>
  );
};
```

### Using Mail Actions

```tsx
import { useEffect } from 'react';
import mailActions from 'widgets/Mail/actions';

const MailAccountsList = () => {
  const [accounts, setAccounts] = useState([]);
  
  useEffect(() => {
    const loadAccounts = async () => {
      const accounts = await mailActions.getMailAccounts();
      setAccounts(accounts);
    };
    
    loadAccounts();
  }, []);
  
  const handleCreateAccount = async (data) => {
    const newAccount = await mailActions.createMailAccount(data);
    if (newAccount) {
      setAccounts([...accounts, newAccount]);
    }
  };
  
  // Component rendering...
};
```

### Programmatic Navigation

```tsx
import { useAI } from 'contexts/AIContext';

const MailNavigationButtons = () => {
  const { navigateToMail, navigateToMailSettings } = useAI();
  
  return (
    <div>
      <button onClick={() => navigateToMail()}>Go to Inbox</button>
      <button onClick={() => navigateToMailSettings('signatures')}>Manage Signatures</button>
    </div>
  );
};
```

## Best Practices

1. **Theme Consistency**: Always use the Mail theme for styling components
2. **Type Safety**: Leverage the provided TypeScript interfaces for type checking
3. **Action Standardization**: Use the standardized actions for operations
4. **Error Handling**: Implement proper error handling for API calls
5. **Responsive Design**: Ensure components work well on different screen sizes

## For AI Integration

When integrating with the AI assistant, follow these guidelines:

1. **Use Intent Mapping**: Map user intents to specific Mail actions
2. **Provide Context**: Include relevant context with navigation actions
3. **Track Operations**: Register background operations for tracking
4. **Handle Errors**: Provide meaningful error messages
5. **Update UI**: Reflect operation status in the UI

Example of AI handling a mail-related request:

```typescript
// User asks: "Show me my email signatures"
const handleShowSignaturesRequest = () => {
  // Navigate to the signatures tab in mail settings
  navigateByIntent('view_mail_settings', { tab: 'signatures' });
};

// User asks: "Create a new signature called 'Professional'"
const handleCreateSignatureRequest = async (name, content) => {
  // Register the operation
  const operationId = `create_signature_${Date.now()}`;
  operationService.registerOperation(operationId, 'create_signature', { name });
  
  try {
    // Create the signature
    const result = await mailActions.createSignature({
      name,
      content,
      isDefault: false
    });
    
    // Update operation status
    operationService.updateStatus(operationId, 'completed', 'Signature created successfully');
    
    // Navigate to show the result
    navigateByIntent('view_mail_settings', { tab: 'signatures' });
    
    return result;
  } catch (error) {
    operationService.updateStatus(operationId, 'failed', error.message);
    throw error;
  }
};
```
