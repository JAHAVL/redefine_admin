/**
 * Type definitions for the Mail module
 */

/**
 * Mail interface
 */
export interface Mail {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
  starred: boolean;
  attachments?: {
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'starred';
}

/**
 * Mail Account interface
 */
export interface MailAccount {
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

/**
 * Signature interface
 */
export interface Signature {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Filter interface
 */
export interface Filter {
  id: string;
  name: string;
  condition: string;
  action: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mail Settings interface
 */
export interface MailSettings {
  accounts: MailAccount[];
  signatures: Signature[];
  filters: Filter[];
  displaySettings: {
    theme: string;
    layout: string;
    showPreview: boolean;
    defaultView: string;
  };
}

/**
 * Email interface
 */
export interface Email {
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
  cc?: Array<{
    email: string;
    name: string;
  }>;
  bcc?: Array<{
    email: string;
    name: string;
  }>;
  body: string;
  attachments?: Array<{
    name: string;
    size: number;
    type: string;
    url: string;
  }>;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
  folder: string;
  labels?: string[];
}

// Types are exported as named exports only, not as default export
// since interfaces are types, not values
