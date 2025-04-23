import React, { useState } from 'react';
import { useFinanceTheme } from '../../theme/FinanceThemeProvider';
import {
  Button,
  Input,
  Select,
  FormGroup
} from '../../FinanceWidgetStyled';
import FinanceModal from '../../components/FinanceModal';

interface ManualTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: any) => void;
}

/**
 * Modal component for adding manual transactions (cash, checks, etc.)
 */
const ManualTransactionModal: React.FC<ManualTransactionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const theme = useFinanceTheme();
  
  // State for form fields
  const [giver, setGiver] = useState('');
  const [giverSearchTerm, setGiverSearchTerm] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [showGiverDropdown, setShowGiverDropdown] = useState(false);
  
  // Mock data for givers, categories, and accounts
  const givers = [
    { id: '1', name: 'John Smith', email: 'john.smith@example.com' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah.j@example.com' },
    { id: '3', name: 'Michael Brown', email: 'mbrown@example.com' },
    { id: '4', name: 'Emily Davis', email: 'emily.davis@example.com' },
    { id: '5', name: 'Robert Wilson', email: 'rwilson@example.com' },
    { id: '6', name: 'Jennifer Lee', email: 'jlee@example.com' },
    { id: '7', name: 'David Martinez', email: 'dmartinez@example.com' },
    { id: '8', name: 'Lisa Thompson', email: 'lisa.t@example.com' }
  ];
  
  const categories = [
    { id: 'tithe', name: 'Tithe' },
    { id: 'general', name: 'General Fund' },
    { id: 'missions', name: 'Missions' },
    { id: 'youth', name: 'Youth Ministry' },
    { id: 'building', name: 'Building Fund' },
    { id: 'outreach', name: 'Outreach' }
  ];
  
  const accounts = [
    { id: 'main', name: 'Main Checking' },
    { id: 'operations', name: 'Operations Account' },
    { id: 'missions', name: 'Mission Fund' },
    { id: 'building', name: 'Building Fund' },
    { id: 'youth', name: 'Youth Ministry Fund' }
  ];
  
  // Filter givers based on search term
  const filteredGivers = givers.filter(g => 
    g.name.toLowerCase().includes(giverSearchTerm.toLowerCase()) ||
    g.email.toLowerCase().includes(giverSearchTerm.toLowerCase())
  );
  
  // Handle giver selection
  const handleGiverSelect = (selectedGiver: any) => {
    setGiver(selectedGiver.id);
    setGiverSearchTerm(selectedGiver.name);
    setShowGiverDropdown(false);
  };
  
  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveTransaction();
  };

  // Function to save the transaction without requiring an event
  const saveTransaction = () => {
    // Create transaction object
    const transaction = {
      id: Date.now(), // Temporary ID for frontend
      date,
      description: description || `Manual ${paymentMethod} transaction`,
      amount: parseFloat(amount),
      category,
      account,
      status: 'Completed',
      paymentMethod,
      reference,
      giverId: giver,
      giverName: givers.find(g => g.id === giver)?.name || 'Anonymous',
      createdAt: new Date().toISOString()
    };
    
    // Call the onSave callback with the transaction data
    onSave(transaction);
    onClose();
  };
  
  // Reset form fields
  const resetForm = () => {
    setGiver('');
    setGiverSearchTerm('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('cash');
    setCategory('');
    setAccount('');
    setDescription('');
    setReference('');
  };

  // Calculate if form is valid
  const isFormValid = amount.trim() !== '' && 
                     category !== '' && 
                     account !== '' &&
                     (paymentMethod !== 'check' || reference !== '');

  return (
    <FinanceModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Manual Transaction"
      size="large"
      primaryAction={{
        label: "Save Transaction",
        onClick: saveTransaction,
        disabled: !isFormValid
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: onClose
      }}
    >
      <form onSubmit={handleFormSubmit}>
        <div style={{ 
          padding: '15px',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px',
          maxHeight: '70vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Giver Selection */}
          <div style={{ marginBottom: '0' }}>
            <label 
              htmlFor="giver-search"
              style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 500 
              }}
            >
              Giver
            </label>
            <div style={{ position: 'relative', zIndex: 5 }}>
              <Input
                id="giver-search"
                type="text"
                placeholder="Search by name or email..."
                value={giverSearchTerm}
                onChange={e => {
                  setGiverSearchTerm(e.target.value);
                  setShowGiverDropdown(true);
                }}
                onFocus={() => setShowGiverDropdown(true)}
                onBlur={() => setTimeout(() => setShowGiverDropdown(false), 200)}
                style={{ width: '100%' }}
              />
              {showGiverDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '40px',
                  left: 0,
                  right: 0,
                  backgroundColor: theme.colors.background.card,
                  border: `1px solid ${theme.colors.border.medium}`,
                  borderRadius: '4px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  zIndex: 10,
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {filteredGivers.length > 0 ? (
                    filteredGivers.map(g => (
                      <div 
                        key={g.id}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          borderBottom: `1px solid ${theme.colors.border.light}`,
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = theme.colors.background.highlight;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        onClick={() => handleGiverSelect(g)}
                      >
                        <div>{g.name}</div>
                        <div style={{ fontSize: '0.8em', color: theme.colors.text.secondary }}>{g.email}</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '8px 12px', color: theme.colors.text.secondary }}>
                      No givers found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Amount and Date */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '16px',
            marginBottom: '0',
            width: '100%'
          }}>
            {/* Amount */}
            <div>
              <label 
                htmlFor="transaction-amount"
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 500 
                }}
              >
                Amount *
              </label>
              <Input
                id="transaction-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>
            
            {/* Date */}
            <div>
              <label 
                htmlFor="transaction-date"
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 500 
                }}
              >
                Date *
              </label>
              <Input
                id="transaction-date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>
          </div>
          
          {/* Payment Method and Category */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '16px',
            marginBottom: '0',
            width: '100%'
          }}>
            {/* Payment Method */}
            <div>
              <label 
                htmlFor="payment-method"
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 500 
                }}
              >
                Payment Method *
              </label>
              <Select
                id="payment-method"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                required
                style={{ width: '100%' }}
              >
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="other">Other</option>
              </Select>
            </div>
            
            {/* Category */}
            <div>
              <label 
                htmlFor="transaction-category"
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 500 
                }}
              >
                Category *
              </label>
              <Select
                id="transaction-category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
                style={{ width: '100%' }}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
            </div>
          </div>
          
          {/* Account */}
          <div>
            <label 
              htmlFor="transaction-account"
              style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 500 
              }}
            >
              Account *
            </label>
            <Select
              id="transaction-account"
              value={account}
              onChange={e => setAccount(e.target.value)}
              required
              style={{ width: '100%' }}
            >
              <option value="">Select an account</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </Select>
          </div>
          
          {/* Description */}
          <div>
            <label 
              htmlFor="transaction-description"
              style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 500 
              }}
            >
              Description (Optional)
            </label>
            <Input
              id="transaction-description"
              type="text"
              placeholder="Enter a description..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          
          {/* Reference Number (for checks) */}
          {paymentMethod === 'check' && (
            <div>
              <label 
                htmlFor="check-number"
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 500 
                }}
              >
                Check Number *
              </label>
              <Input
                id="check-number"
                type="text"
                placeholder="Enter check number..."
                value={reference}
                onChange={e => setReference(e.target.value)}
                required={paymentMethod === 'check'}
                style={{ width: '100%' }}
              />
            </div>
          )}
        </div>
      </form>
    </FinanceModal>
  );
};

export default ManualTransactionModal;
