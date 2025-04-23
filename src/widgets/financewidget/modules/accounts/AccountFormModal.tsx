import React, { useState, useEffect } from 'react';
import { useFinanceTheme } from '../../theme/FinanceThemeProvider';
import { Input, Select, FormGroup } from '../../FinanceWidgetStyled';
import FinanceModal from '../../components/FinanceModal';

// Account types
const ACCOUNT_TYPES = [
  { value: 'Asset', label: 'Asset' },
  { value: 'Liability', label: 'Liability' },
  { value: 'Income', label: 'Income' },
  { value: 'Expense', label: 'Expense' },
  { value: 'Equity', label: 'Equity' }
];

// Account subtypes (vary based on type)
const ACCOUNT_SUBTYPES = {
  Asset: [
    { value: 'Checking', label: 'Checking Account' },
    { value: 'Savings', label: 'Savings Account' },
    { value: 'Investment', label: 'Investment Account' },
    { value: 'Restricted', label: 'Restricted Fund' },
    { value: 'Property', label: 'Property & Equipment' },
    { value: 'Other', label: 'Other Asset' }
  ],
  Liability: [
    { value: 'Credit', label: 'Credit Card' },
    { value: 'Loan', label: 'Loan' },
    { value: 'Mortgage', label: 'Mortgage' },
    { value: 'PayrollLiability', label: 'Payroll Liability' },
    { value: 'Other', label: 'Other Liability' }
  ],
  Income: [
    { value: 'Donation', label: 'Donations' },
    { value: 'Tithe', label: 'Tithes' },
    { value: 'Program', label: 'Program Revenue' },
    { value: 'Interest', label: 'Interest Income' },
    { value: 'Other', label: 'Other Income' }
  ],
  Expense: [
    { value: 'Salary', label: 'Salaries & Wages' },
    { value: 'Ministry', label: 'Ministry Expenses' },
    { value: 'Facilities', label: 'Facilities' },
    { value: 'Office', label: 'Office Expenses' },
    { value: 'Other', label: 'Other Expense' }
  ],
  Equity: [
    { value: 'RetainedEarnings', label: 'Retained Earnings' },
    { value: 'Opening', label: 'Opening Balance Equity' },
    { value: 'Other', label: 'Other Equity' }
  ]
};

// Banking institutions
const FINANCIAL_INSTITUTIONS = [
  { value: 'First National Bank', label: 'First National Bank' },
  { value: 'Community Trust', label: 'Community Trust' },
  { value: 'Wells Fargo', label: 'Wells Fargo' },
  { value: 'Bank of America', label: 'Bank of America' },
  { value: 'Chase', label: 'Chase' },
  { value: 'Other', label: 'Other (Specify)' }
];

interface AccountFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: any) => void;
  account?: {
    id?: string | number;
    name: string;
    type: string;
    subtype: string;
    institution: string;
    balance: number;
    isActive: boolean;
    description?: string;
    accountNumber?: string;
  } | null;
  initialAccountType?: string;
}

/**
 * Modal for creating or editing an account
 */
const AccountFormModal: React.FC<AccountFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  account = null,
  initialAccountType = 'Asset'
}) => {
  const theme = useFinanceTheme();
  const isEditing = !!account;
  
  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState(initialAccountType || 'Asset');
  const [subtype, setSubtype] = useState('');
  const [institution, setInstitution] = useState('');
  const [balance, setBalance] = useState('0.00');
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [otherInstitution, setOtherInstitution] = useState('');
  
  // Load account data when editing
  useEffect(() => {
    if (account) {
      setName(account.name || '');
      setType(account.type || initialAccountType || 'Asset');
      setSubtype(account.subtype || '');
      setInstitution(account.institution || '');
      setBalance(account.balance ? account.balance.toString() : '0.00');
      setIsActive(account.isActive !== undefined ? account.isActive : true);
      setDescription(account.description || '');
      setAccountNumber(account.accountNumber || '');
      
      // Check if institution is custom/other
      if (account.institution && !FINANCIAL_INSTITUTIONS.find(i => i.value === account.institution)) {
        setInstitution('Other');
        setOtherInstitution(account.institution);
      }
    } else {
      // Reset form when creating new account
      resetForm();
    }
  }, [account, isOpen, initialAccountType]);
  
  // Reset form to defaults
  const resetForm = () => {
    setName('');
    setType(initialAccountType || 'Asset');
    setSubtype('');
    setInstitution('');
    setBalance('0.00');
    setIsActive(true);
    setDescription('');
    setAccountNumber('');
    setOtherInstitution('');
  };
  
  // Handle form submission
  const handleSave = () => {
    const finalInstitution = institution === 'Other' ? otherInstitution : institution;
    
    const accountData = {
      ...(account?.id ? { id: account.id } : {}),
      name,
      type,
      subtype,
      institution: finalInstitution,
      balance: parseFloat(balance),
      isActive,
      description,
      accountNumber,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    onSave(accountData);
    resetForm();
  };
  
  // Validation
  const isFormValid = name.trim() !== '' && 
                     type !== '' && 
                     subtype !== '' && 
                     (institution !== '' && institution !== 'Other' || otherInstitution.trim() !== '');

  return (
    <FinanceModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Account' : 'Create New Account'}
      primaryAction={{
        label: isEditing ? 'Save Changes' : 'Create Account',
        onClick: handleSave,
        disabled: !isFormValid
      }}
      secondaryAction={{
        label: 'Cancel',
        onClick: onClose
      }}
    >
      <div className="form-container" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        gap: theme.spacing.md 
      }}>
        {/* Account Name */}
        <FormGroup>
          <label>Account Name *</label>
          <Input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., Main Checking Account"
            required
          />
        </FormGroup>
        
        {/* Account Type and Subtype in a row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
          <FormGroup>
            <label>Account Type *</label>
            <Select
              value={type}
              onChange={e => {
                setType(e.target.value);
                setSubtype(''); // Reset subtype when type changes
              }}
              required
            >
              {ACCOUNT_TYPES.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </FormGroup>
          
          {/* Account Subtype */}
          <FormGroup>
            <label>Account Subtype *</label>
            <Select
              value={subtype}
              onChange={e => setSubtype(e.target.value)}
              required
            >
              <option value="">Select a subtype</option>
              {ACCOUNT_SUBTYPES[type as keyof typeof ACCOUNT_SUBTYPES]?.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </FormGroup>
        </div>
        
        {/* Financial Institution row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: theme.spacing.md }}>
          <FormGroup>
            <label>Financial Institution *</label>
            <Select
              value={institution}
              onChange={e => setInstitution(e.target.value)}
              required
            >
              <option value="">Select an institution</option>
              {FINANCIAL_INSTITUTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </FormGroup>
        </div>
        
        {/* Custom Institution (if "Other" selected) */}
        {institution === 'Other' && (
          <FormGroup>
            <label>Specify Institution *</label>
            <Input
              type="text"
              value={otherInstitution}
              onChange={e => setOtherInstitution(e.target.value)}
              placeholder="Enter institution name"
              required
            />
          </FormGroup>
        )}
        
        {/* Balance and Account number row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
          {/* Opening Balance */}
          <FormGroup>
            <label>Opening Balance *</label>
            <Input
              type="number"
              value={balance}
              onChange={e => setBalance(e.target.value)}
              step="0.01"
              required
            />
            <div style={{ 
              fontSize: '0.8em', 
              color: theme.colors.text.secondary,
              marginTop: '4px'
            }}>
              {type === 'Asset' || type === 'Income' ? 'Enter as positive value' : 'Enter as positive value, will be treated as credit'}
            </div>
          </FormGroup>
          
          {/* Account Number (optional) */}
          <FormGroup>
            <label>Account Number (Optional)</label>
            <Input
              type="text"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              placeholder="For your reference only"
            />
          </FormGroup>
        </div>
        
        {/* Status */}
        <FormGroup>
          <label>Status</label>
          <Select
            value={isActive ? 'active' : 'inactive'}
            onChange={e => setIsActive(e.target.value === 'active')}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </FormGroup>
        
        {/* Description (optional) */}
        <FormGroup>
          <label>Description (Optional)</label>
          <Input
            as="textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Add notes about this account"
            style={{ height: '80px', resize: 'vertical' }}
          />
        </FormGroup>
      </div>
    </FinanceModal>
  );
};

export default AccountFormModal;
