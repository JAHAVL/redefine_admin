import React, { useState } from 'react';
import { useFinanceTheme } from '../../theme/FinanceThemeProvider';
import { Input, FormGroup, Button } from '../../FinanceWidgetStyled';
import FinanceModal from '../../components/FinanceModal';

interface ConnectBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (data: any) => void;
}

/**
 * Modal for connecting a bank account via Plaid
 */
const ConnectBankModal: React.FC<ConnectBankModalProps> = ({
  isOpen,
  onClose,
  onConnect
}) => {
  const theme = useFinanceTheme();
  
  // State for connection steps
  const [step, setStep] = useState(1);
  const [selectedBank, setSelectedBank] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock bank list
  const popularBanks = [
    { id: 'chase', name: 'Chase', logo: '🏦' },
    { id: 'bofa', name: 'Bank of America', logo: '🏦' },
    { id: 'wells', name: 'Wells Fargo', logo: '🏦' },
    { id: 'citi', name: 'Citibank', logo: '🏦' },
    { id: 'us', name: 'US Bank', logo: '🏦' },
    { id: 'pnc', name: 'PNC Bank', logo: '🏦' },
    { id: 'capital', name: 'Capital One', logo: '🏦' },
    { id: 'td', name: 'TD Bank', logo: '🏦' }
  ];
  
  // Filter banks based on search term
  const filteredBanks = popularBanks.filter(bank => 
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle bank selection
  const handleSelectBank = (bankId: string) => {
    setSelectedBank(bankId);
    setStep(2);
  };
  
  // Handle connection
  const handleConnect = () => {
    // In a real implementation, this would launch Plaid Link
    // For demo purposes, we'll just simulate the successful connection
    const selectedBankData = popularBanks.find(bank => bank.id === selectedBank);
    
    onConnect({
      bankId: selectedBank,
      bankName: selectedBankData?.name,
      connectionDate: new Date().toISOString(),
      status: 'connected'
    });
    
    // Reset and close
    setStep(1);
    setSelectedBank('');
    setSearchTerm('');
    onClose();
  };
  
  // Render based on current step
  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <p style={{ marginBottom: theme.spacing.md, color: theme.colors.text.secondary }}>
              Connect your bank account to automatically import transactions and keep your records up to date.
            </p>
            
            <FormGroup>
              <Input
                type="text"
                placeholder="Search for your bank..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: theme.spacing.md }}
              />
            </FormGroup>
            
            <h3 style={{ fontSize: theme.typography.fontSize.medium, margin: `${theme.spacing.md} 0` }}>
              Popular Banks
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: theme.spacing.md
            }}>
              {filteredBanks.map(bank => (
                <div 
                  key={bank.id}
                  onClick={() => handleSelectBank(bank.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: theme.spacing.md,
                    border: `1px solid ${theme.colors.border.light}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    backgroundColor: theme.colors.background.card
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = theme.colors.background.highlight;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = theme.colors.background.card;
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: theme.spacing.sm }}>
                    {bank.logo}
                  </div>
                  <div>{bank.name}</div>
                </div>
              ))}
            </div>
            
            <div style={{ 
              marginTop: theme.spacing.lg,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.background.highlight,
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0 }}>
                Don't see your bank? <Button style={{ display: 'inline', padding: '0 4px' }}>View full list</Button>
              </p>
            </div>
          </div>
        );
      case 2:
        const bank = popularBanks.find(b => b.id === selectedBank);
        return (
          <div>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              marginBottom: theme.spacing.lg,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.background.highlight,
              borderRadius: '6px'
            }}>
              <div style={{ fontSize: '48px', marginRight: theme.spacing.md }}>
                {bank?.logo}
              </div>
              <div>
                <h3 style={{ margin: 0 }}>{bank?.name}</h3>
                <p style={{ margin: 0, color: theme.colors.text.secondary }}>
                  You'll be redirected to {bank?.name} to securely log in
                </p>
              </div>
            </div>
            
            <div style={{ marginBottom: theme.spacing.lg }}>
              <h3>How it works</h3>
              <ol style={{ padding: `0 0 0 ${theme.spacing.lg}`, margin: 0 }}>
                <li style={{ marginBottom: theme.spacing.sm }}>
                  You'll connect to {bank?.name} using their secure login page
                </li>
                <li style={{ marginBottom: theme.spacing.sm }}>
                  Choose which accounts you want to connect
                </li>
                <li style={{ marginBottom: theme.spacing.sm }}>
                  Your transactions will be automatically imported
                </li>
              </ol>
            </div>
            
            <div style={{ marginBottom: theme.spacing.lg }}>
              <h3>Security</h3>
              <p>
                Your credentials are never stored. We use Plaid's secure API to connect to your bank.
                Bank-level encryption and security practices protect your information.
              </p>
            </div>
            
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: theme.spacing.lg
            }}>
              <Button 
                style={{ 
                  backgroundColor: theme.colors.background.card,
                  color: theme.colors.text.primary
                }}
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button 
                style={{ 
                  backgroundColor: theme.colors.accent,
                  color: theme.colors.text.light
                }}
                onClick={handleConnect}
              >
                Continue to {bank?.name}
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <FinanceModal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 1 ? 'Connect Bank Account' : 'Connect to ' + popularBanks.find(b => b.id === selectedBank)?.name}
      size="large"
      // We'll handle custom actions inside the content for the bank connection flow
      // This gives us more flexibility than using the standard modal actions
    >
      {renderContent()}
    </FinanceModal>
  );
};

export default ConnectBankModal;
