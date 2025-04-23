import React, { useState } from 'react';
import styled from 'styled-components';
import MailTheme from '../theme';

// Types
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

interface Signature {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Styled components
const SettingsContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  min-height: 0;
  background-color: transparent;
  color: ${MailTheme.colors.text.primary};
  font-family: ${MailTheme.typography.fontFamily};
  backdrop-filter: blur(8px);
  flex: 1 1 auto;
  border: none;
  outline: none;
  margin: 0;
  padding: 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${MailTheme.colors.background.transparent};
    pointer-events: none;
    z-index: -1;
  }
`;

const SidebarContainer = styled.div`
  width: 280px;
  height: 100%;
  background-color: ${MailTheme.colors.background.card};
  border-right: 1px solid ${MailTheme.colors.border.light};
  overflow-y: auto;
  padding: ${MailTheme.spacing.md};
  backdrop-filter: blur(10px);
  transition: all ${MailTheme.transitions.normal};
  box-shadow: ${MailTheme.shadows.sm};
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background-color: transparent;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${MailTheme.colors.background.card};
    pointer-events: none;
    z-index: -1;
    backdrop-filter: blur(5px);
  }
  
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${MailTheme.spacing.md} ${MailTheme.spacing.lg};
  border-bottom: 1px solid ${MailTheme.colors.border.light};
  margin-bottom: ${MailTheme.spacing.md};
  position: sticky;
  top: 0;
  background-color: ${MailTheme.colors.background.card};
  backdrop-filter: blur(10px);
  z-index: ${MailTheme.zIndex.header};
`;

const Title = styled.h2`
  font-size: ${MailTheme.typography.fontSize.xl};
  font-weight: ${MailTheme.typography.fontWeight.medium};
  color: ${MailTheme.colors.text.primary};
  margin: 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 40px;
    height: 2px;
    background: ${MailTheme.gradients.primary};
    border-radius: ${MailTheme.borderRadius.sm};
  }
`;

const Button = styled.button`
  background-color: ${MailTheme.colors.primary.main};
  color: ${MailTheme.colors.primary.contrastText};
  border: none;
  border-radius: ${MailTheme.borderRadius.sm};
  padding: ${MailTheme.spacing.sm} ${MailTheme.spacing.md};
  font-size: ${MailTheme.typography.fontSize.sm};
  font-weight: ${MailTheme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${MailTheme.transitions.fast};
  box-shadow: ${MailTheme.shadows.sm};
  
  &:hover {
    background-color: ${MailTheme.colors.primary.dark};
    box-shadow: ${MailTheme.shadows.md};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: ${MailTheme.shadows.sm};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${MailTheme.colors.primary.transparent};
  }
`;

const SettingsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${MailTheme.spacing.sm};
  margin-top: ${MailTheme.spacing.md};
`;

const CategoryTitle = styled.h3`
  font-size: ${MailTheme.typography.fontSize.md};
  font-weight: ${MailTheme.typography.fontWeight.medium};
  color: ${MailTheme.colors.text.secondary};
  margin: ${MailTheme.spacing.md} 0 ${MailTheme.spacing.sm};
  padding-bottom: ${MailTheme.spacing.xs};
  border-bottom: 1px solid ${MailTheme.colors.border.light};
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: ${MailTheme.typography.fontSize.xs};
`;

interface SettingItemProps {
  active: boolean;
}

const SettingItem = styled.div<SettingItemProps>`
  padding: ${MailTheme.spacing.sm} ${MailTheme.spacing.md};
  border-radius: ${MailTheme.borderRadius.sm};
  background-color: ${props => props.active ? MailTheme.colors.interactive.selected : 'transparent'};
  cursor: pointer;
  transition: all ${MailTheme.transitions.fast};
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: ${props => props.active ? MailTheme.colors.interactive.selected : MailTheme.colors.interactive.hover};
    transform: translateX(2px);
  }
  
  &:active {
    transform: translateX(0);
  }
  
  ${props => props.active && `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 3px;
      background: ${MailTheme.colors.primary.main};
    }
  `}
`;

const SettingName = styled.div`
  font-size: ${MailTheme.typography.fontSize.md};
  font-weight: ${MailTheme.typography.fontWeight.medium};
  color: ${MailTheme.colors.text.primary};
  margin-bottom: ${MailTheme.spacing.xs};
  transition: color ${MailTheme.transitions.fast};
  
  ${SettingItem}:hover & {
    color: ${MailTheme.colors.primary.main};
  }
`;

const SettingDescription = styled.div`
  font-size: ${MailTheme.typography.fontSize.xs};
  color: ${MailTheme.colors.text.secondary};
  transition: opacity ${MailTheme.transitions.fast};
  
  ${SettingItem}:hover & {
    opacity: 1;
  }
`;

const FormContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${MailTheme.spacing.lg};
  overflow-y: auto;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${MailTheme.colors.background.card};
    border-radius: ${MailTheme.borderRadius.sm};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${MailTheme.colors.border.main};
    border-radius: ${MailTheme.borderRadius.sm};
    border: 2px solid ${MailTheme.colors.background.card};
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background-color: ${MailTheme.colors.border.dark};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${MailTheme.spacing.md};
  transition: all ${MailTheme.transitions.normal};
  
  &:focus-within {
    transform: translateY(-2px);
  }
`;

const Label = styled.label`
  display: block;
  font-size: ${MailTheme.typography.fontSize.sm};
  font-weight: ${MailTheme.typography.fontWeight.medium};
  color: ${MailTheme.colors.text.secondary};
  margin-bottom: ${MailTheme.spacing.xs};
  transition: color ${MailTheme.transitions.fast};
  
  ${FormGroup}:focus-within & {
    color: ${MailTheme.colors.primary.main};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: ${MailTheme.spacing.sm};
  background-color: ${MailTheme.colors.background.card};
  border: 1px solid ${MailTheme.colors.border.main};
  border-radius: ${MailTheme.borderRadius.sm};
  color: ${MailTheme.colors.text.primary};
  font-size: ${MailTheme.typography.fontSize.md};
  transition: all ${MailTheme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${MailTheme.colors.primary.main};
    box-shadow: 0 0 0 2px ${MailTheme.colors.primary.transparent};
  }
  
  &:hover {
    border-color: ${MailTheme.colors.border.dark};
  }
  
  &::placeholder {
    color: ${MailTheme.colors.text.hint};
    opacity: 0.7;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: ${MailTheme.spacing.sm};
  background-color: ${MailTheme.colors.background.card};
  border: 1px solid ${MailTheme.colors.border.main};
  border-radius: ${MailTheme.borderRadius.sm};
  color: ${MailTheme.colors.text.primary};
  font-size: ${MailTheme.typography.fontSize.md};
  resize: vertical;
  transition: all ${MailTheme.transitions.fast};
  line-height: ${MailTheme.typography.lineHeight.md};
  
  &:focus {
    outline: none;
    border-color: ${MailTheme.colors.primary.main};
    box-shadow: 0 0 0 2px ${MailTheme.colors.primary.transparent};
  }
  
  &:hover {
    border-color: ${MailTheme.colors.border.dark};
  }
  
  &::placeholder {
    color: ${MailTheme.colors.text.hint};
    opacity: 0.7;
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: ${MailTheme.spacing.sm};
  margin-top: ${MailTheme.spacing.xs};
  
  input {
    margin: 0;
    appearance: none;
    width: 18px;
    height: 18px;
    border: 1px solid ${MailTheme.colors.border.main};
    border-radius: ${MailTheme.borderRadius.xs};
    background-color: ${MailTheme.colors.background.card};
    cursor: pointer;
    position: relative;
    transition: all ${MailTheme.transitions.fast};
    
    &:checked {
      background-color: ${MailTheme.colors.primary.main};
      border-color: ${MailTheme.colors.primary.main};
      
      &::after {
        content: '';
        position: absolute;
        top: 4px;
        left: 7px;
        width: 4px;
        height: 8px;
        border: solid ${MailTheme.colors.primary.contrastText};
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
    }
    
    &:hover:not(:checked) {
      border-color: ${MailTheme.colors.primary.main};
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px ${MailTheme.colors.primary.transparent};
    }
  }
  
  label {
    margin: 0;
    font-size: ${MailTheme.typography.fontSize.sm};
    color: ${MailTheme.colors.text.primary};
    cursor: pointer;
    user-select: none;
    transition: color ${MailTheme.transitions.fast};
    
    &:hover {
      color: ${MailTheme.colors.primary.main};
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${MailTheme.spacing.sm};
  margin-top: ${MailTheme.spacing.lg};
  padding-top: ${MailTheme.spacing.md};
  border-top: 1px solid ${MailTheme.colors.border.light};
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: ${MailTheme.colors.text.primary};
  border: 1px solid ${MailTheme.colors.border.main};
  box-shadow: none;
  
  &:hover {
    background-color: ${MailTheme.colors.background.overlay};
    border-color: ${MailTheme.colors.border.dark};
    box-shadow: ${MailTheme.shadows.sm};
  }
  
  &:focus {
    box-shadow: 0 0 0 2px ${MailTheme.colors.border.dark};
  }
`;

const AccountsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${MailTheme.colors.background.overlay};
  border-radius: ${MailTheme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${MailTheme.shadows.sm};
  margin-bottom: ${MailTheme.spacing.lg};
  table-layout: fixed;
`;

const TableHeader = styled.thead`
  background-color: ${MailTheme.colors.background.card};
  border-bottom: 1px solid ${MailTheme.colors.border.main};
  
  th {
    text-align: left;
    padding: ${MailTheme.spacing.md};
    font-weight: ${MailTheme.typography.fontWeight.medium};
    color: ${MailTheme.colors.text.secondary};
    font-size: ${MailTheme.typography.fontSize.sm};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid ${MailTheme.colors.border.light};
    transition: all ${MailTheme.transitions.fast};
    
    &:hover {
      background-color: ${MailTheme.colors.background.card};
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  td {
    padding: ${MailTheme.spacing.md};
    color: ${MailTheme.colors.text.primary};
    font-size: ${MailTheme.typography.fontSize.md};
  }
`;

const AccountName = styled.div`
  font-weight: ${MailTheme.typography.fontWeight.medium};
  color: ${MailTheme.colors.text.primary};
  transition: color ${MailTheme.transitions.fast};
  
  tr:hover & {
    color: ${MailTheme.colors.primary.main};
  }
`;

const AccountEmail = styled.div`
  color: ${MailTheme.colors.text.secondary};
  font-style: italic;
  transition: color ${MailTheme.transitions.fast};
  
  tr:hover & {
    color: ${MailTheme.colors.text.primary};
  }
`;

const AccountServer = styled.div`
  color: ${MailTheme.colors.text.secondary};
  font-size: ${MailTheme.typography.fontSize.sm};
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${MailTheme.colors.text.secondary};
  cursor: pointer;
  padding: ${MailTheme.spacing.xs};
  margin-left: ${MailTheme.spacing.xs};
  border-radius: ${MailTheme.borderRadius.xs};
  transition: all ${MailTheme.transitions.fast};
  
  &:hover {
    color: ${MailTheme.colors.primary.main};
    transform: scale(1.1);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${MailTheme.colors.primary.transparent};
  }
`;

const AccountActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${MailTheme.spacing.sm};
  margin-top: ${MailTheme.spacing.md};
`;

const DefaultBadge = styled.span`
  background-color: ${MailTheme.colors.primary.main};
  color: ${MailTheme.colors.primary.contrastText};
  padding: ${MailTheme.spacing.xs} ${MailTheme.spacing.sm};
  border-radius: ${MailTheme.borderRadius.xs};
  font-size: ${MailTheme.typography.fontSize.xs};
  font-weight: ${MailTheme.typography.fontWeight.medium};
  display: inline-block;
  box-shadow: ${MailTheme.shadows.sm};
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(52, 120, 255, 0.4);
    }
    70% {
      box-shadow: 0 0 0 5px rgba(52, 120, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(52, 120, 255, 0);
    }
  }
`;

// Mock data for initial development
const mockSignatures: Signature[] = [
  {
    id: '1',
    name: 'Professional',
    content: 'Best regards,\n\nJohn Doe\nAdministrator\nRedefine Church\n(555) 123-4567',
    isDefault: true,
    createdAt: '2025-03-10T09:30:00',
    updatedAt: '2025-04-05T14:20:00'
  },
  {
    id: '2',
    name: 'Casual',
    content: 'Thanks,\n\nJohn',
    isDefault: false,
    createdAt: '2025-03-15T11:45:00',
    updatedAt: '2025-03-15T11:45:00'
  },
  {
    id: '3',
    name: 'Event Coordinator',
    content: 'Blessings,\n\nJohn Doe\nEvent Coordinator\nRedefine Church\nwww.redefine.church',
    isDefault: false,
    createdAt: '2025-03-20T13:15:00',
    updatedAt: '2025-04-02T10:30:00'
  }
];

const mockAccounts: MailAccount[] = [
  {
    id: '1',
    email: 'admin@redefine.church',
    name: 'Church Admin',
    server: 'mail.redefine.church',
    port: 993,
    username: 'admin@redefine.church',
    password: '********',
    isDefault: true,
    signature: 'Best regards,\nChurch Admin\nRedefine Church',
    lastSync: '2025-04-11T08:30:00',
    smtpServer: 'smtp.redefine.church',
    imapServer: 'imap.redefine.church'
  },
  {
    id: '2',
    email: 'pastor@redefine.church',
    name: 'Pastor John',
    server: 'mail.redefine.church',
    port: 993,
    username: 'pastor@redefine.church',
    password: '********',
    isDefault: false,
    signature: 'Blessings,\nPastor John\nRedefine Church',
    lastSync: '2025-04-11T08:15:00',
    smtpServer: 'smtp.redefine.church',
    imapServer: 'imap.redefine.church'
  },
  {
    id: '3',
    email: 'events@redefine.church',
    name: 'Events Team',
    server: 'mail.redefine.church',
    port: 993,
    username: 'events@redefine.church',
    password: '********',
    isDefault: false,
    signature: 'Regards,\nEvents Team\nRedefine Church',
    lastSync: '2025-04-10T17:45:00',
    smtpServer: 'smtp.redefine.church',
    imapServer: 'imap.redefine.church'
  }
];

// Interface for password change form
interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Interface for display settings
interface DisplaySettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  showPreview: boolean;
  conversationView: boolean;
  messageGrouping: 'off' | 'daily' | 'weekly';
  notificationSound: boolean;
  desktopNotifications: boolean;
}

const MailSettings: React.FC = () => {
  const [accounts, setAccounts] = useState<MailAccount[]>(mockAccounts);
  const [signatures, setSignatures] = useState<Signature[]>(mockSignatures);
  const [selectedSetting, setSelectedSetting] = useState<string>('accounts');
  const [selectedAccount, setSelectedAccount] = useState<MailAccount | null>(null);
  const [selectedSignature, setSelectedSignature] = useState<Signature | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Separate form data states for different types
  const [accountFormData, setAccountFormData] = useState<Partial<MailAccount>>({smtpServer: '', imapServer: ''});
  const [signatureFormData, setSignatureFormData] = useState<Partial<Signature>>({});
  const [passwordFormData, setPasswordFormData] = useState<PasswordChangeForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Display settings with default values
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    theme: 'dark',
    fontSize: 'medium',
    showPreview: true,
    conversationView: true,
    messageGrouping: 'daily',
    notificationSound: true,
    desktopNotifications: true
  });
  
  // Handle setting selection
  const handleSelectSetting = (setting: string) => {
    setSelectedSetting(setting);
    setSelectedAccount(null);
    setIsEditing(false);
  };
  
  // Handle account selection
  const handleSelectAccount = (account: MailAccount) => {
    setSelectedAccount(account);
    setIsEditing(false);
  };
  
  // Handle creating a new account
  const handleCreateAccount = () => {
    setSelectedAccount(null);
    setIsEditing(true);
    setAccountFormData({
      email: '',
      name: '',
      server: '',
      port: 993,
      username: '',
      password: '',
      isDefault: false,
      signature: ''
    });
  };
  
  // Handle editing an account
  const handleEditAccount = (account: MailAccount) => {
    setSelectedAccount(account);
    setAccountFormData({
      email: account.email,
      name: account.name,
      server: account.server,
      port: account.port,
      username: account.username,
      password: account.password,
      isDefault: account.isDefault,
      signature: account.signature,
      smtpServer: account.smtpServer,
      imapServer: account.imapServer
    });
    setIsEditing(true);
  };
  
  // Handle account form input changes
  const handleAccountInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAccountFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle signature form input changes
  const handleSignatureInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSignatureFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle password form input changes
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle display settings changes
  const handleDisplaySettingChange = (setting: keyof DisplaySettings, value: any) => {
    setDisplaySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  // Handle account checkbox changes
  const handleAccountCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setAccountFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle signature checkbox changes
  const handleSignatureCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSignatureFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle display settings checkbox changes
  const handleDisplayCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setDisplaySettings(prev => ({
      ...prev,
      [name as keyof DisplaySettings]: checked
    }));
  };
  
  // Handle saving an account
  const handleSaveAccount = () => {
    if (isEditing) {
      if (selectedAccount) {
        // Update existing account
        const updatedAccounts = accounts.map(account => 
          account.id === selectedAccount.id 
            ? {
                ...account,
                email: accountFormData.email || account.email,
                name: accountFormData.name || account.name,
                server: accountFormData.server || account.server,
                port: accountFormData.port || account.port,
                username: accountFormData.username || account.username,
                password: accountFormData.password || account.password,
                isDefault: accountFormData.isDefault || false,
                signature: accountFormData.signature || account.signature,
                lastSync: new Date().toISOString()
              }
            : accountFormData.isDefault ? { ...account, isDefault: false } : account
        );
        setAccounts(updatedAccounts);
        setSelectedAccount(updatedAccounts.find(a => a.id === selectedAccount.id) || null);
      } else {
        // Create new account
        const newAccount: MailAccount = {
          id: `new-${Date.now()}`,
          email: accountFormData.email || '',
          name: accountFormData.name || '',
          server: accountFormData.server || '',
          port: accountFormData.port || 993,
          username: accountFormData.username || '',
          password: accountFormData.password || '',
          isDefault: accountFormData.isDefault || false,
          signature: accountFormData.signature || '',
          lastSync: new Date().toISOString(),
          smtpServer: accountFormData.smtpServer || '',
          imapServer: accountFormData.imapServer || ''
        };
        
        // If this is set as default, update other accounts
        const updatedAccounts = accountFormData.isDefault 
          ? accounts.map(account => ({ ...account, isDefault: false }))
          : [...accounts];
        
        setAccounts([...updatedAccounts, newAccount]);
        setSelectedAccount(newAccount);
      }
    }
    
    setIsEditing(false);
  };
  
  // Handle deleting an account
  const handleDeleteAccount = (accountId: string) => {
    const accountToDelete = accounts.find(account => account.id === accountId);
    if (accountToDelete && window.confirm(`Are you sure you want to delete the account ${accountToDelete.name}?`)) {
      const updatedAccounts = accounts.filter(account => account.id !== accountId);
      setAccounts(updatedAccounts);
      setSelectedAccount(null);
    }
  };
  
  // Handle editing a signature
  const handleEditSignature = (signature: Signature) => {
    setSelectedSignature(signature);
    setSignatureFormData({
      name: signature.name,
      content: signature.content,
      isDefault: signature.isDefault,
      updatedAt: new Date().toISOString()
    });
    setIsEditing(true);
  };
  
  // Handle deleting a signature
  const handleDeleteSignature = (signatureId: string) => {
    const signatureToDelete = signatures.find(signature => signature.id === signatureId);
    if (signatureToDelete && window.confirm(`Are you sure you want to delete the signature ${signatureToDelete.name}?`)) {
      const updatedSignatures = signatures.filter(signature => signature.id !== signatureId);
      setSignatures(updatedSignatures);
      setSelectedSignature(null);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SettingsContainer>
      <SidebarContainer>
        <Header>
          <Title>Settings</Title>
        </Header>
        
        <SettingsList>
          <CategoryTitle>Mail</CategoryTitle>
          <SettingItem 
            active={selectedSetting === 'accounts'}
            onClick={() => handleSelectSetting('accounts')}
          >
            <SettingName>Mail Accounts</SettingName>
            <SettingDescription>Manage your email accounts</SettingDescription>
          </SettingItem>
          <SettingItem 
            active={selectedSetting === 'signatures'}
            onClick={() => handleSelectSetting('signatures')}
          >
            <SettingName>Signatures</SettingName>
            <SettingDescription>Manage email signatures</SettingDescription>
          </SettingItem>
          <SettingItem 
            active={selectedSetting === 'filters'}
            onClick={() => handleSelectSetting('filters')}
          >
            <SettingName>Filters</SettingName>
            <SettingDescription>Set up email filtering rules</SettingDescription>
          </SettingItem>
          
          <CategoryTitle>Security</CategoryTitle>
          <SettingItem 
            active={selectedSetting === 'password'}
            onClick={() => handleSelectSetting('password')}
          >
            <SettingName>Password</SettingName>
            <SettingDescription>Change your account password</SettingDescription>
          </SettingItem>
          <SettingItem 
            active={selectedSetting === 'two-factor'}
            onClick={() => handleSelectSetting('two-factor')}
          >
            <SettingName>Two-Factor Authentication</SettingName>
            <SettingDescription>Secure your account with 2FA</SettingDescription>
          </SettingItem>
          
          <CategoryTitle>Preferences</CategoryTitle>
          <SettingItem 
            active={selectedSetting === 'display'}
            onClick={() => handleSelectSetting('display')}
          >
            <SettingName>Display Settings</SettingName>
            <SettingDescription>Customize your mail display</SettingDescription>
          </SettingItem>
          <SettingItem 
            active={selectedSetting === 'notifications'}
            onClick={() => handleSelectSetting('notifications')}
          >
            <SettingName>Notifications</SettingName>
            <SettingDescription>Manage email notifications</SettingDescription>
          </SettingItem>
        </SettingsList>
      </SidebarContainer>
      
      <ContentArea>
        {selectedSetting === 'accounts' && (
          <FormContainer>
            <Header>
              <Title>Mail Accounts</Title>
              {!isEditing && (
                <Button onClick={handleCreateAccount}>Add Account</Button>
              )}
            </Header>
            
            {!isEditing && !selectedAccount && (
              <div>
                <AccountsTable style={{ width: '100%' }}>
                  <TableHeader>
                    <tr>
                      <th style={{ width: '20%' }}>Account</th>
                      <th style={{ width: '20%' }}>Email</th>
                      <th style={{ width: '20%' }}>Server</th>
                      <th style={{ width: '15%' }}>Last Sync</th>
                      <th style={{ width: '10%' }}>Status</th>
                      <th style={{ width: '15%' }}>Actions</th>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {accounts.map(account => (
                      <tr key={account.id} onClick={() => handleSelectAccount(account)}>
                        <td>
                          <AccountName>{account.name}</AccountName>
                        </td>
                        <td>
                          <AccountEmail>{account.email}</AccountEmail>
                        </td>
                        <td>
                          <AccountServer>{account.server}</AccountServer>
                        </td>
                        <td>
                          <AccountServer>{formatDate(account.lastSync)}</AccountServer>
                        </td>
                        <td>
                          {account.isDefault && <DefaultBadge>Default</DefaultBadge>}
                        </td>
                        <td>
                          <ActionButtons>
                            <ActionButton onClick={(e) => { e.stopPropagation(); handleEditAccount(account); }}>
                              <i className="fas fa-edit"></i>
                            </ActionButton>
                            <ActionButton onClick={(e) => { e.stopPropagation(); handleDeleteAccount(account.id); }}>
                              <i className="fas fa-trash-alt"></i>
                            </ActionButton>
                          </ActionButtons>
                        </td>
                      </tr>
                    ))}
                  </TableBody>
                </AccountsTable>
              </div>
            )}
            
            {!isEditing && selectedAccount && (
              <div>
                <div style={{
                  background: MailTheme.colors.background.overlay,
                  borderRadius: MailTheme.borderRadius.md,
                  padding: MailTheme.spacing.lg,
                  marginBottom: MailTheme.spacing.lg,
                  border: `1px solid ${MailTheme.colors.border.light}`,
                  boxShadow: MailTheme.shadows.sm
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: MailTheme.spacing.md }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: MailTheme.typography.fontSize.lg }}>{selectedAccount.name}</h3>
                      <div style={{ color: MailTheme.colors.text.secondary, fontStyle: 'italic' }}>{selectedAccount.email}</div>
                    </div>
                    {selectedAccount.isDefault && <DefaultBadge>Default</DefaultBadge>}
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: MailTheme.spacing.md,
                    marginBottom: MailTheme.spacing.lg,
                    padding: MailTheme.spacing.md,
                    background: MailTheme.colors.background.card,
                    borderRadius: MailTheme.borderRadius.sm
                  }}>
                    <div>
                      <strong>Server:</strong> {selectedAccount.server}
                    </div>
                    <div>
                      <strong>Port:</strong> {selectedAccount.port}
                    </div>
                    <div>
                      <strong>Username:</strong> {selectedAccount.username}
                    </div>
                    <div>
                      <strong>Last Sync:</strong> {formatDate(selectedAccount.lastSync)}
                    </div>
                  </div>
                  
                  <AccountActions>
                    <SecondaryButton onClick={() => setSelectedAccount(null)}>Back</SecondaryButton>
                    <SecondaryButton onClick={() => selectedAccount && handleEditAccount(selectedAccount)}>Edit</SecondaryButton>
                    <Button onClick={() => selectedAccount && handleDeleteAccount(selectedAccount.id)}>Delete</Button>
                  </AccountActions>
                </div>
                
                <FormGroup>
                  <Label>Signature</Label>
                  <TextArea 
                    value={selectedAccount.signature} 
                    readOnly 
                  />
                </FormGroup>
              </div>
            )}
            
            {isEditing && (
              <div>
                <FormGroup>
                  <Label htmlFor="name">Account Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    type="text" 
                    value={accountFormData.name || ''} 
                    onChange={handleAccountInputChange}
                    placeholder="Enter account name"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email" 
                    value={accountFormData.email || ''} 
                    onChange={handleAccountInputChange}
                    placeholder="Enter email address"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="server">Mail Server</Label>
                  <Input 
                    id="server"
                    name="server"
                    type="text" 
                    value={accountFormData.server || ''} 
                    onChange={handleAccountInputChange}
                    placeholder="Enter mail server"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="port">Port</Label>
                  <Input 
                    id="port"
                    name="port"
                    type="number" 
                    value={accountFormData.port || 993} 
                    onChange={handleAccountInputChange}
                    placeholder="Enter port number"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username"
                    name="username"
                    type="text" 
                    value={accountFormData.username || ''} 
                    onChange={handleAccountInputChange}
                    placeholder="Enter username"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password"
                    name="password"
                    type="password" 
                    value={accountFormData.password || ''} 
                    onChange={handleAccountInputChange}
                    placeholder="Enter password"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="signature">Signature</Label>
                  <TextArea 
                    id="signature"
                    name="signature"
                    value={accountFormData.signature || ''} 
                    onChange={handleAccountInputChange}
                    placeholder="Enter email signature"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Checkbox>
                    <input 
                      id="isDefault"
                      name="isDefault"
                      type="checkbox" 
                      checked={signatureFormData.isDefault || false} 
                      onChange={handleSignatureCheckboxChange}
                    />
                    <label htmlFor="isDefault">Set as default account</label>
                  </Checkbox>
                </FormGroup>
                
                <ButtonGroup>
                  <SecondaryButton onClick={() => {
                    setIsEditing(false);
                    if (!selectedAccount) {
                      setSelectedAccount(null);
                    }
                  }}>
                    Cancel
                  </SecondaryButton>
                  <Button onClick={handleSaveAccount}>
                    Save Account
                  </Button>
                </ButtonGroup>
              </div>
            )}
          </FormContainer>
        )}
        
        {selectedSetting === 'signatures' && (
          <FormContainer>
            <Header>
              <Title>Signatures</Title>
              {!isEditing && (
                <Button onClick={() => {
                  setSelectedSignature(null);
                  setIsEditing(true);
                  setSignatureFormData({
                    name: '',
                    content: '',
                    isDefault: false
                  });
                }}>Add Signature</Button>
              )}
            </Header>
            
            {!isEditing && !selectedSignature && (
              <div>
                <AccountsTable style={{ width: '100%' }}>
                  <TableHeader>
                    <tr>
                      <th style={{ width: '20%' }}>Name</th>
                      <th style={{ width: '35%' }}>Preview</th>
                      <th style={{ width: '15%' }}>Status</th>
                      <th style={{ width: '15%' }}>Last Updated</th>
                      <th style={{ width: '15%' }}>Actions</th>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    {signatures.map((signature) => (
                      <tr key={signature.id} onClick={() => setSelectedSignature(signature)}>
                        <td>
                          <AccountName>{signature.name}</AccountName>
                        </td>
                        <td>
                          <div style={{ color: MailTheme.colors.text.secondary }}>
                            {signature.content.substring(0, 50)}...
                          </div>
                        </td>
                        <td>
                          {signature.isDefault && <DefaultBadge>Default</DefaultBadge>}
                        </td>
                        <td>
                          <AccountServer>{formatDate(signature.updatedAt)}</AccountServer>
                        </td>
                        <td>
                          <ActionButtons>
                            <ActionButton onClick={(e) => { e.stopPropagation(); handleEditSignature(signature); }}>
                              <i className="fas fa-edit"></i>
                            </ActionButton>
                            <ActionButton onClick={(e) => { e.stopPropagation(); handleDeleteSignature(signature.id); }}>
                              <i className="fas fa-trash-alt"></i>
                            </ActionButton>
                          </ActionButtons>
                        </td>
                      </tr>
                    ))}
                  </TableBody>
                </AccountsTable>
              </div>
            )}
            
            {!isEditing && selectedSignature && (
              <div>
                <div style={{
                  background: MailTheme.colors.background.overlay,
                  borderRadius: MailTheme.borderRadius.md,
                  padding: MailTheme.spacing.lg,
                  marginBottom: MailTheme.spacing.lg,
                  border: `1px solid ${MailTheme.colors.border.light}`,
                  boxShadow: MailTheme.shadows.sm
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <AccountName>{selectedSignature.name}</AccountName>
                    {selectedSignature.isDefault && <DefaultBadge>Default</DefaultBadge>}
                  </div>
                  <div style={{ 
                    marginTop: MailTheme.spacing.md, 
                    fontSize: MailTheme.typography.fontSize.sm,
                    color: MailTheme.colors.text.secondary 
                  }}>
                    <div>Created: {formatDate(selectedSignature.createdAt)}</div>
                    <div>Last Updated: {formatDate(selectedSignature.updatedAt)}</div>
                  </div>
                  <FormGroup style={{ marginTop: MailTheme.spacing.md }}>
                    <Label>Signature Content</Label>
                    <TextArea 
                      value={selectedSignature.content} 
                      readOnly 
                      style={{ minHeight: '150px' }}
                    />
                  </FormGroup>
                  <AccountActions>
                    <SecondaryButton onClick={() => setSelectedSignature(null)}>Back</SecondaryButton>
                    <SecondaryButton onClick={() => {
                      setIsEditing(true);
                      setSignatureFormData({
                        name: selectedSignature.name,
                        content: selectedSignature.content,
                        isDefault: selectedSignature.isDefault
                      });
                    }}>Edit</SecondaryButton>
                    <Button onClick={() => {
                      setSignatures(signatures.filter(s => s.id !== selectedSignature.id));
                      setSelectedSignature(null);
                    }}>Delete</Button>
                  </AccountActions>
                </div>
              </div>
            )}
            
            {isEditing && (
              <div>
                <FormGroup>
                  <Label htmlFor="name">Signature Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    type="text" 
                    value={signatureFormData.name || ''} 
                    onChange={handleSignatureInputChange}
                    placeholder="Enter signature name"
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="content">Signature Content</Label>
                  <TextArea 
                    id="content"
                    name="content"
                    value={signatureFormData.content || ''} 
                    onChange={handleSignatureInputChange}
                    placeholder="Enter signature content"
                    style={{ minHeight: '200px' }}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Checkbox>
                    <input 
                      id="isDefault"
                      name="isDefault"
                      type="checkbox" 
                      checked={signatureFormData.isDefault || false} 
                      onChange={handleSignatureCheckboxChange}
                    />
                    <label htmlFor="isDefault">Set as default signature</label>
                  </Checkbox>
                </FormGroup>
                
                <ButtonGroup>
                  <SecondaryButton onClick={() => {
                    setIsEditing(false);
                    if (!selectedSignature) {
                      setSelectedSignature(null);
                    }
                  }}>
                    Cancel
                  </SecondaryButton>
                  <Button onClick={() => {
                    if (selectedSignature) {
                      // Update existing signature
                      const updatedSignatures = signatures.map(signature => 
                        signature.id === selectedSignature.id 
                          ? {
                              ...signature,
                              name: signatureFormData.name || signature.name,
                              content: signatureFormData.content || signature.content,
                              isDefault: signatureFormData.isDefault || false,
                              updatedAt: new Date().toISOString()
                            }
                          : signatureFormData.isDefault ? { ...signature, isDefault: false } : signature
                      );
                      setSignatures(updatedSignatures);
                      setSelectedSignature(updatedSignatures.find(s => s.id === selectedSignature.id) || null);
                    } else {
                      // Create new signature
                      const newSignature: Signature = {
                        id: `new-${Date.now()}`,
                        name: signatureFormData.name || 'Untitled Signature',
                        content: signatureFormData.content || '',
                        isDefault: signatureFormData.isDefault || false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                      };
                      
                      // If this is set as default, update other signatures
                      const updatedSignatures = signatureFormData.isDefault 
                        ? signatures.map(signature => ({ ...signature, isDefault: false }))
                        : [...signatures];
                      
                      setSignatures([...updatedSignatures, newSignature]);
                      setSelectedSignature(newSignature);
                    }
                    
                    setIsEditing(false);
                  }}>
                    Save Signature
                  </Button>
                </ButtonGroup>
              </div>
            )}
          </FormContainer>
        )}
        
        {selectedSetting === 'filters' && (
          <FormContainer>
            <Header>
              <Title>Filters</Title>
              <Button onClick={() => alert('This would create a new filter')}>Add Filter</Button>
            </Header>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ 
                background: MailTheme.colors.background.overlay, 
                padding: MailTheme.spacing.md,
                borderRadius: MailTheme.borderRadius.md,
                marginBottom: MailTheme.spacing.lg
              }}>
                <p style={{ margin: 0 }}>Filters automatically process incoming emails based on criteria you specify. You can move emails to folders, mark them as read, forward them, or delete them.</p>
              </div>
              
              {/* Sample filters */}
              <AccountsTable style={{ width: '100%' }}>
                <TableHeader>
                  <tr>
                    <th style={{ width: '20%' }}>Filter Name</th>
                    <th style={{ width: '35%' }}>Condition</th>
                    <th style={{ width: '30%' }}>Action</th>
                    <th style={{ width: '15%' }}>Actions</th>
                  </tr>
                </TableHeader>
                <TableBody>
                  <tr>
                    <td>
                      <AccountName>Newsletter Filter</AccountName>
                    </td>
                    <td>
                      <div style={{ color: MailTheme.colors.text.secondary }}>
                        Subject contains "newsletter", "subscribe", "update"
                      </div>
                    </td>
                    <td>
                      <div style={{ color: MailTheme.colors.text.secondary }}>
                        Move to Newsletters folder
                      </div>
                    </td>
                    <td>
                      <ActionButtons>
                        <ActionButton onClick={() => alert('This would edit the filter')}>
                          <i className="fas fa-edit"></i>
                        </ActionButton>
                        <ActionButton onClick={() => alert('This would delete the filter')}>
                          <i className="fas fa-trash-alt"></i>
                        </ActionButton>
                      </ActionButtons>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <AccountName>Important Contacts</AccountName>
                    </td>
                    <td>
                      <div style={{ color: MailTheme.colors.text.secondary }}>
                        From contains "pastor@redefine.church", "admin@redefine.church"
                      </div>
                    </td>
                    <td>
                      <div style={{ color: MailTheme.colors.text.secondary }}>
                        Star message, Mark as important
                      </div>
                    </td>
                    <td>
                      <ActionButtons>
                        <ActionButton onClick={() => alert('This would edit the filter')}>
                          <i className="fas fa-edit"></i>
                        </ActionButton>
                        <ActionButton onClick={() => alert('This would delete the filter')}>
                          <i className="fas fa-trash-alt"></i>
                        </ActionButton>
                      </ActionButtons>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <AccountName>Spam Filter</AccountName>
                    </td>
                    <td>
                      <div style={{ color: MailTheme.colors.text.secondary }}>
                        Subject contains "urgent", "money", "winner", "lottery"
                      </div>
                    </td>
                    <td>
                      <div style={{ color: MailTheme.colors.text.secondary }}>
                        Move to Spam folder
                      </div>
                    </td>
                    <td>
                      <ActionButtons>
                        <ActionButton onClick={() => alert('This would edit the filter')}>
                          <i className="fas fa-edit"></i>
                        </ActionButton>
                        <ActionButton onClick={() => alert('This would delete the filter')}>
                          <i className="fas fa-trash-alt"></i>
                        </ActionButton>
                      </ActionButtons>
                    </td>
                  </tr>
                </TableBody>
              </AccountsTable>
            </div>
          </FormContainer>
        )}
        
        {selectedSetting === 'password' && (
          <FormContainer>
            <Header>
              <Title>Change Password</Title>
            </Header>
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
              <FormGroup>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword"
                  name="currentPassword"
                  type="password" 
                  value={passwordFormData.currentPassword} 
                  onChange={handlePasswordInputChange}
                  placeholder="Enter your current password"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword"
                  name="newPassword"
                  type="password" 
                  value={passwordFormData.newPassword} 
                  onChange={handlePasswordInputChange}
                  placeholder="Enter your new password"
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password" 
                  value={passwordFormData.confirmPassword} 
                  onChange={handlePasswordInputChange}
                  placeholder="Confirm your new password"
                />
              </FormGroup>
              
              <ButtonGroup>
                <Button onClick={() => {
                  // Password validation
                  if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
                    alert('New passwords do not match');
                    return;
                  }
                  
                  if (passwordFormData.newPassword.length < 8) {
                    alert('Password must be at least 8 characters long');
                    return;
                  }
                  
                  // Reset form after successful change
                  setPasswordFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  
                  alert('Password changed successfully');
                }}>
                  Change Password
                </Button>
              </ButtonGroup>
            </div>
          </FormContainer>
        )}
        
        {selectedSetting === 'two-factor' && (
          <FormContainer>
            <Header>
              <Title>Two-Factor Authentication</Title>
            </Header>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ 
                background: MailTheme.colors.background.overlay, 
                padding: MailTheme.spacing.lg,
                borderRadius: MailTheme.borderRadius.md,
                marginBottom: MailTheme.spacing.lg
              }}>
                <h3 style={{ marginTop: 0 }}>Current Status: <span style={{ color: '#ff4d4f' }}>Disabled</span></h3>
                <p>Two-factor authentication adds an extra layer of security to your account by requiring a verification code in addition to your password when signing in.</p>
              </div>
              
              <FormGroup>
                <Label>Authentication Method</Label>
                <div style={{ display: 'flex', gap: MailTheme.spacing.md, marginTop: MailTheme.spacing.sm }}>
                  {['Authenticator App', 'SMS', 'Email'].map((method) => (
                    <div 
                      key={method}
                      style={{
                        padding: MailTheme.spacing.md,
                        borderRadius: MailTheme.borderRadius.md,
                        border: `1px solid ${MailTheme.colors.border.main}`,
                        background: method === 'Authenticator App' ? MailTheme.colors.primary.transparent : MailTheme.colors.background.card,
                        cursor: 'pointer',
                        textAlign: 'center',
                        flex: 1
                      }}
                    >
                      <div style={{ 
                        fontWeight: method === 'Authenticator App' ? 'bold' : 'normal',
                      }}>
                        {method}
                      </div>
                    </div>
                  ))}
                </div>
              </FormGroup>
              
              <FormGroup>
                <Label>Setup Instructions</Label>
                <ol style={{ 
                  paddingLeft: MailTheme.spacing.xl, 
                  color: MailTheme.colors.text.secondary,
                  lineHeight: '1.6'
                }}>
                  <li>Download an authenticator app like Google Authenticator or Authy on your mobile device.</li>
                  <li>Click the "Enable 2FA" button below to generate a QR code.</li>
                  <li>Scan the QR code with your authenticator app.</li>
                  <li>Enter the 6-digit code from your authenticator app to verify setup.</li>
                </ol>
              </FormGroup>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                padding: MailTheme.spacing.xl,
                border: `1px dashed ${MailTheme.colors.border.main}`,
                borderRadius: MailTheme.borderRadius.md,
                marginBottom: MailTheme.spacing.lg
              }}>
                <div style={{ 
                  width: '180px', 
                  height: '180px', 
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: MailTheme.spacing.md
                }}>
                  <div style={{ color: '#000', fontSize: '14px' }}>QR Code will appear here</div>
                </div>
                <Button
                  style={{ marginTop: MailTheme.spacing.md }}
                  onClick={() => alert('This would generate a new QR code for 2FA setup')}
                >
                  Enable 2FA
                </Button>
              </div>
              
              <FormGroup>
                <Label htmlFor="verificationCode">Verification Code</Label>
                <div style={{ display: 'flex', gap: MailTheme.spacing.md }}>
                  <Input 
                    id="verificationCode"
                    name="verificationCode"
                    type="text" 
                    placeholder="Enter 6-digit code"
                    style={{ flex: 1 }}
                  />
                  <Button onClick={() => alert('This would verify your 2FA setup')}>Verify</Button>
                </div>
              </FormGroup>
              
              <FormGroup>
                <Label>Recovery Codes</Label>
                <p style={{ color: MailTheme.colors.text.secondary, marginBottom: MailTheme.spacing.md }}>Save these recovery codes in a safe place. You can use them to access your account if you lose your authentication device.</p>
                <div style={{ 
                  background: MailTheme.colors.background.card,
                  padding: MailTheme.spacing.md,
                  borderRadius: MailTheme.borderRadius.sm,
                  fontFamily: 'monospace',
                  color: MailTheme.colors.text.secondary,
                  marginBottom: MailTheme.spacing.md
                }}>
                  <div>• XXXX-XXXX-XXXX-XXXX</div>
                  <div>• XXXX-XXXX-XXXX-XXXX</div>
                  <div>• XXXX-XXXX-XXXX-XXXX</div>
                  <div>• XXXX-XXXX-XXXX-XXXX</div>
                  <div>• XXXX-XXXX-XXXX-XXXX</div>
                </div>
                <Button 
                  onClick={() => alert('This would download your recovery codes')}
                  style={{ marginRight: MailTheme.spacing.md }}
                >
                  Download Codes
                </Button>
                <SecondaryButton onClick={() => alert('This would generate new recovery codes')}>Generate New Codes</SecondaryButton>
              </FormGroup>
            </div>
          </FormContainer>
        )}
        
        {selectedSetting === 'display' && (
          <FormContainer>
            <Header>
              <Title>Display Settings</Title>
            </Header>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <FormGroup>
                <Label>Theme</Label>
                <div style={{ display: 'flex', gap: MailTheme.spacing.md, marginTop: MailTheme.spacing.sm }}>
                  {['light', 'dark', 'system'].map((theme) => (
                    <div 
                      key={theme}
                      onClick={() => handleDisplaySettingChange('theme', theme)}
                      style={{
                        padding: MailTheme.spacing.md,
                        borderRadius: MailTheme.borderRadius.md,
                        border: `1px solid ${displaySettings.theme === theme ? MailTheme.colors.primary.main : MailTheme.colors.border.main}`,
                        background: displaySettings.theme === theme ? MailTheme.colors.primary.transparent : MailTheme.colors.background.card,
                        cursor: 'pointer',
                        textAlign: 'center',
                        flex: 1
                      }}
                    >
                      <div style={{ textTransform: 'capitalize', fontWeight: displaySettings.theme === theme ? 'bold' : 'normal' }}>
                        {theme}
                      </div>
                    </div>
                  ))}
                </div>
              </FormGroup>
              
              <FormGroup>
                <Label>Font Size</Label>
                <div style={{ display: 'flex', gap: MailTheme.spacing.md, marginTop: MailTheme.spacing.sm }}>
                  {['small', 'medium', 'large'].map((size) => (
                    <div 
                      key={size}
                      onClick={() => handleDisplaySettingChange('fontSize', size as 'small' | 'medium' | 'large')}
                      style={{
                        padding: MailTheme.spacing.md,
                        borderRadius: MailTheme.borderRadius.md,
                        border: `1px solid ${displaySettings.fontSize === size ? MailTheme.colors.primary.main : MailTheme.colors.border.main}`,
                        background: displaySettings.fontSize === size ? MailTheme.colors.primary.transparent : MailTheme.colors.background.card,
                        cursor: 'pointer',
                        textAlign: 'center',
                        flex: 1
                      }}
                    >
                      <div style={{ 
                        textTransform: 'capitalize', 
                        fontWeight: displaySettings.fontSize === size ? 'bold' : 'normal',
                        fontSize: size === 'small' ? '14px' : size === 'medium' ? '16px' : '18px'
                      }}>
                        {size}
                      </div>
                    </div>
                  ))}
                </div>
              </FormGroup>
              
              <FormGroup>
                <Label>Message Grouping</Label>
                <div style={{ display: 'flex', gap: MailTheme.spacing.md, marginTop: MailTheme.spacing.sm }}>
                  {['off', 'daily', 'weekly'].map((grouping) => (
                    <div 
                      key={grouping}
                      onClick={() => handleDisplaySettingChange('messageGrouping', grouping as 'off' | 'daily' | 'weekly')}
                      style={{
                        padding: MailTheme.spacing.md,
                        borderRadius: MailTheme.borderRadius.md,
                        border: `1px solid ${displaySettings.messageGrouping === grouping ? MailTheme.colors.primary.main : MailTheme.colors.border.main}`,
                        background: displaySettings.messageGrouping === grouping ? MailTheme.colors.primary.transparent : MailTheme.colors.background.card,
                        cursor: 'pointer',
                        textAlign: 'center',
                        flex: 1
                      }}
                    >
                      <div style={{ textTransform: 'capitalize', fontWeight: displaySettings.messageGrouping === grouping ? 'bold' : 'normal' }}>
                        {grouping}
                      </div>
                    </div>
                  ))}
                </div>
              </FormGroup>
              
              <FormGroup>
                <Label>View Options</Label>
                <div style={{ marginTop: MailTheme.spacing.sm }}>
                  <Checkbox>
                    <input 
                      id="showPreview"
                      name="showPreview"
                      type="checkbox" 
                      checked={displaySettings.showPreview} 
                      onChange={handleDisplayCheckboxChange}
                    />
                    <label htmlFor="showPreview">Show message preview in list</label>
                  </Checkbox>
                  
                  <Checkbox style={{ marginTop: MailTheme.spacing.sm }}>
                    <input 
                      id="conversationView"
                      name="conversationView"
                      type="checkbox" 
                      checked={displaySettings.conversationView} 
                      onChange={handleDisplayCheckboxChange}
                    />
                    <label htmlFor="conversationView">Group messages by conversation</label>
                  </Checkbox>
                </div>
              </FormGroup>
              
              <FormGroup>
                <Label>Notifications</Label>
                <div style={{ marginTop: MailTheme.spacing.sm }}>
                  <Checkbox>
                    <input 
                      id="notificationSound"
                      name="notificationSound"
                      type="checkbox" 
                      checked={displaySettings.notificationSound} 
                      onChange={handleDisplayCheckboxChange}
                    />
                    <label htmlFor="notificationSound">Play sound for new messages</label>
                  </Checkbox>
                  
                  <Checkbox style={{ marginTop: MailTheme.spacing.sm }}>
                    <input 
                      id="desktopNotifications"
                      name="desktopNotifications"
                      type="checkbox" 
                      checked={displaySettings.desktopNotifications} 
                      onChange={handleDisplayCheckboxChange}
                    />
                    <label htmlFor="desktopNotifications">Show desktop notifications</label>
                  </Checkbox>
                </div>
              </FormGroup>
              
              <ButtonGroup>
                <Button onClick={() => {
                  alert('Display settings saved successfully');
                }}>
                  Save Settings
                </Button>
              </ButtonGroup>
            </div>
          </FormContainer>
        )}
        
        {selectedSetting === 'notifications' && (
          <FormContainer>
            <Header>
              <Title>Notifications</Title>
            </Header>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <FormGroup>
                <Label>Email Notifications</Label>
                <div style={{ marginTop: MailTheme.spacing.sm }}>
                  <Checkbox>
                    <input 
                      id="newMailNotification"
                      name="newMailNotification"
                      type="checkbox" 
                      checked={true} 
                      onChange={() => {}}
                    />
                    <label htmlFor="newMailNotification">Notify me when I receive new mail</label>
                  </Checkbox>
                  
                  <Checkbox style={{ marginTop: MailTheme.spacing.sm }}>
                    <input 
                      id="importantMailNotification"
                      name="importantMailNotification"
                      type="checkbox" 
                      checked={true} 
                      onChange={() => {}}
                    />
                    <label htmlFor="importantMailNotification">Notify me only for important mail</label>
                  </Checkbox>
                  
                  <Checkbox style={{ marginTop: MailTheme.spacing.sm }}>
                    <input 
                      id="digestNotification"
                      name="digestNotification"
                      type="checkbox" 
                      checked={false} 
                      onChange={() => {}}
                    />
                    <label htmlFor="digestNotification">Send me a daily digest of unread emails</label>
                  </Checkbox>
                </div>
              </FormGroup>
              
              <FormGroup>
                <Label>Notification Sound</Label>
                <div style={{ display: 'flex', gap: MailTheme.spacing.md, marginTop: MailTheme.spacing.sm }}>
                  {['Default', 'Chime', 'Bell', 'None'].map((sound) => (
                    <div 
                      key={sound}
                      style={{
                        padding: MailTheme.spacing.md,
                        borderRadius: MailTheme.borderRadius.md,
                        border: `1px solid ${sound === 'Default' ? MailTheme.colors.primary.main : MailTheme.colors.border.main}`,
                        background: sound === 'Default' ? MailTheme.colors.primary.transparent : MailTheme.colors.background.card,
                        cursor: 'pointer',
                        textAlign: 'center',
                        flex: 1
                      }}
                      onClick={() => alert(`Sound changed to ${sound}`)}
                    >
                      <div style={{ fontWeight: sound === 'Default' ? 'bold' : 'normal' }}>
                        {sound}
                      </div>
                    </div>
                  ))}
                </div>
              </FormGroup>
              
              <FormGroup>
                <Label>Quiet Hours</Label>
                <div style={{ display: 'flex', gap: MailTheme.spacing.md, alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <Label htmlFor="quietHoursStart" style={{ fontSize: MailTheme.typography.fontSize.xs }}>From</Label>
                    <Input 
                      id="quietHoursStart"
                      name="quietHoursStart"
                      type="time" 
                      value="22:00" 
                      onChange={() => {}}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Label htmlFor="quietHoursEnd" style={{ fontSize: MailTheme.typography.fontSize.xs }}>To</Label>
                    <Input 
                      id="quietHoursEnd"
                      name="quietHoursEnd"
                      type="time" 
                      value="07:00" 
                      onChange={() => {}}
                    />
                  </div>
                </div>
                <Checkbox style={{ marginTop: MailTheme.spacing.sm }}>
                  <input 
                    id="enableQuietHours"
                    name="enableQuietHours"
                    type="checkbox" 
                    checked={true} 
                    onChange={() => {}}
                  />
                  <label htmlFor="enableQuietHours">Enable quiet hours</label>
                </Checkbox>
              </FormGroup>
              
              <ButtonGroup>
                <Button onClick={() => alert('Notification settings saved successfully')}>
                  Save Settings
                </Button>
              </ButtonGroup>
            </div>
          </FormContainer>
        )}
      </ContentArea>
    </SettingsContainer>
  );
};

export default MailSettings;
