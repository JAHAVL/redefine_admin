import React, { useState } from 'react';
import { useFinanceTheme } from '../../theme/FinanceThemeProvider';
import { 
  Section, 
  Table, 
  Button, 
  Flex,
  Input,
  Select
} from '../../FinanceWidgetStyled';
import ActionIcons from '../../components/ActionIcons';

/**
 * GivingStatementsModule component for generating and sending giving statements
 * Integrates with existing backend functionality while providing a modern UI
 */
const GivingStatementsModule: React.FC = () => {
  // Access the theme
  const theme = useFinanceTheme();
  
  // State for filters and selected givers
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGivers, setSelectedGivers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [statementFormat, setStatementFormat] = useState('pdf');
  const [showPreview, setShowPreview] = useState(false);
  const [previewGiver, setPreviewGiver] = useState<any>(null);
  
  // Mock givers data
  const givers = [
    { id: '1', name: 'John Smith', email: 'john.smith@example.com', totalGiving: 1250.00, lastGift: '2025-04-15', giftCount: 5 },
    { id: '2', name: 'Sarah Johnson', email: 'sarah.j@example.com', totalGiving: 750.50, lastGift: '2025-04-10', giftCount: 3 },
    { id: '3', name: 'Michael Brown', email: 'mbrown@example.com', totalGiving: 2000.00, lastGift: '2025-04-18', giftCount: 8 },
    { id: '4', name: 'Emily Davis', email: 'emily.davis@example.com', totalGiving: 500.00, lastGift: '2025-04-05', giftCount: 2 },
    { id: '5', name: 'Robert Wilson', email: 'rwilson@example.com', totalGiving: 1500.00, lastGift: '2025-04-12', giftCount: 6 },
    { id: '6', name: 'Jennifer Lee', email: 'jlee@example.com', totalGiving: 350.00, lastGift: '2025-04-08', giftCount: 1 },
    { id: '7', name: 'David Martinez', email: 'dmartinez@example.com', totalGiving: 875.25, lastGift: '2025-04-17', giftCount: 4 },
    { id: '8', name: 'Lisa Thompson', email: 'lisa.t@example.com', totalGiving: 1125.75, lastGift: '2025-04-14', giftCount: 5 }
  ];
  
  // Filter givers based on search term
  const filteredGivers = givers.filter(giver => 
    giver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    giver.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedGivers([]);
    } else {
      setSelectedGivers(filteredGivers.map(giver => giver.id));
    }
    setSelectAll(!selectAll);
  };
  
  // Handle individual giver selection
  const handleSelectGiver = (giverId: string) => {
    if (selectedGivers.includes(giverId)) {
      setSelectedGivers(selectedGivers.filter(id => id !== giverId));
      setSelectAll(false);
    } else {
      setSelectedGivers([...selectedGivers, giverId]);
      if (selectedGivers.length + 1 === filteredGivers.length) {
        setSelectAll(true);
      }
    }
  };
  
  // Generate statements for selected givers
  const generateStatements = () => {
    // This would integrate with the backend API
    console.log('Generating statements for:', selectedGivers);
    console.log('Date range:', dateRange);
    console.log('Format:', statementFormat);
    
    // In a real implementation, this would make an API call to the backend
    // to generate the statements using the existing Laravel functionality
  };
  
  // Send statements via email
  const sendStatements = () => {
    // This would integrate with the mail system
    console.log('Sending statements to:', selectedGivers);
    
    // In a real implementation, this would make an API call to the backend
    // to send the statements via email
  };
  
  // Show statement preview for a specific giver
  const handleShowPreview = (giver: any) => {
    setPreviewGiver(giver);
    setShowPreview(true);
  };

  return (
    <div>
      <Flex justify="space-between" align="center" style={{ 
        marginBottom: theme.spacing.lg,
        borderBottom: `${theme.border.width.thin} solid ${theme.colors.border.light}`,
        paddingBottom: theme.spacing.md 
      }}>
        <h1 style={{ fontSize: theme.typography.fontSize.xlarge, margin: 0 }}>Giving Statements</h1>
        <div>
          <Button 
            style={{ marginRight: theme.spacing.md }}
            onClick={generateStatements}
            disabled={selectedGivers.length === 0}
          >
            Generate Statements
          </Button>
          <Button
            onClick={sendStatements}
            disabled={selectedGivers.length === 0}
          >
            Email Statements
          </Button>
        </div>
      </Flex>

      {/* Filters Section */}
      <Section style={{ marginBottom: theme.spacing.xl }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          marginBottom: theme.spacing.lg,
          backgroundColor: theme.colors.background.card,
          padding: theme.spacing.md,
          borderRadius: '6px'
        }}>
          {/* Search */}
          <div style={{ minWidth: '250px', flex: 1 }}>
            <label style={{ display: 'block', marginBottom: theme.spacing.sm, color: theme.colors.text.secondary }}>
              Search Givers
            </label>
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          
          {/* Date Range */}
          <div style={{ minWidth: '180px' }}>
            <label style={{ display: 'block', marginBottom: theme.spacing.sm, color: theme.colors.text.secondary }}>
              From Date
            </label>
            <Input
              type="date"
              value={dateRange.start}
              onChange={e => setDateRange({ ...dateRange, start: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>
          
          <div style={{ minWidth: '180px' }}>
            <label style={{ display: 'block', marginBottom: theme.spacing.sm, color: theme.colors.text.secondary }}>
              To Date
            </label>
            <Input
              type="date"
              value={dateRange.end}
              onChange={e => setDateRange({ ...dateRange, end: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>
          
          {/* Statement Format */}
          <div style={{ minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: theme.spacing.sm, color: theme.colors.text.secondary }}>
              Format
            </label>
            <Select
              value={statementFormat}
              onChange={e => setStatementFormat(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </Select>
          </div>
        </div>
      </Section>

      {/* Givers Table */}
      <Section>
        <div style={{ 
          backgroundColor: theme.colors.background.card,
          padding: theme.spacing.md,
          borderRadius: '6px',
          marginBottom: theme.spacing.md
        }}>
          <div style={{ marginBottom: theme.spacing.md }}>
            <span style={{ color: theme.colors.text.secondary }}>
              {selectedGivers.length} of {filteredGivers.length} givers selected
            </span>
          </div>
          
          <Table>
            <thead>
              <tr>
                <th style={{ width: '50px' }}>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th style={{ textAlign: 'right' }}>Total Giving</th>
                <th>Last Gift</th>
                <th style={{ textAlign: 'center' }}>Gift Count</th>
                <th style={{ textAlign: 'center', width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGivers.map(giver => (
                <tr key={giver.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedGivers.includes(giver.id)}
                      onChange={() => handleSelectGiver(giver.id)}
                    />
                  </td>
                  <td>{giver.name}</td>
                  <td>{giver.email}</td>
                  <td style={{ textAlign: 'right' }}>${giver.totalGiving.toFixed(2)}</td>
                  <td>{giver.lastGift}</td>
                  <td style={{ textAlign: 'center' }}>{giver.giftCount}</td>
                  <td>
                    <ActionIcons 
                      onView={() => handleShowPreview(giver)}
                      onDownload={() => console.log('Download statement for', giver.id)}
                    />
                  </td>
                </tr>
              ))}
              {filteredGivers.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                    No givers found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        
        {/* Bulk Actions */}
        {selectedGivers.length > 0 && (
          <div style={{ 
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px'
          }}>
            <Button 
              onClick={generateStatements}
              style={{ 
                backgroundColor: theme.colors.accent,
                color: theme.colors.text.light
              }}
            >
              Generate {selectedGivers.length} Statement{selectedGivers.length !== 1 ? 's' : ''}
            </Button>
            <Button
              onClick={sendStatements}
            >
              Email Statement{selectedGivers.length !== 1 ? 's' : ''}
            </Button>
          </div>
        )}
      </Section>

      {/* Statement Preview Modal */}
      {showPreview && previewGiver && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: theme.colors.background.card,
            borderRadius: '6px',
            width: '80%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: theme.spacing.lg
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: theme.spacing.lg
            }}>
              <h2 style={{ margin: 0 }}>Statement Preview: {previewGiver.name}</h2>
              <Button 
                style={{ 
                  backgroundColor: 'transparent',
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border.medium}`
                }}
                onClick={() => setShowPreview(false)}
              >
                Close
              </Button>
            </div>
            
            <div style={{
              backgroundColor: '#fff',
              color: '#000',
              padding: theme.spacing.lg,
              borderRadius: '4px',
              marginBottom: theme.spacing.lg
            }}>
              {/* This would be replaced with an actual statement preview */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Your Church Name</h2>
                <p>123 Church Street, Anytown, USA</p>
                <h3>Giving Statement</h3>
                <p>For the period: {dateRange.start || '01/01/2025'} to {dateRange.end || '04/21/2025'}</p>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <p><strong>Name:</strong> {previewGiver.name}</p>
                <p><strong>Email:</strong> {previewGiver.email}</p>
              </div>
              
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Date</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
                    <th style={{ textAlign: 'right', padding: '8px' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mock transaction data */}
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>2025-04-15</td>
                    <td style={{ padding: '8px' }}>Sunday Offering</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>$250.00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>2025-04-01</td>
                    <td style={{ padding: '8px' }}>Building Fund</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>$500.00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>2025-03-15</td>
                    <td style={{ padding: '8px' }}>Sunday Offering</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>$250.00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>2025-03-01</td>
                    <td style={{ padding: '8px' }}>Missions Fund</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>$250.00</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>2025-02-15</td>
                    <td style={{ padding: '8px' }}>Sunday Offering</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>$250.00</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: '2px solid #ddd' }}>
                    <td colSpan={2} style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>${previewGiver.totalGiving.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
              
              <div style={{ marginTop: '30px', fontSize: '0.9em' }}>
                <p>Thank you for your generous support of our ministry. Your contributions are tax-deductible to the extent allowed by law.</p>
                <p>No goods or services were provided in exchange for these contributions other than intangible religious benefits.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                style={{ 
                  backgroundColor: theme.colors.background.highlight,
                  color: theme.colors.text.primary
                }}
                onClick={() => setShowPreview(false)}
              >
                Close
              </Button>
              <div>
                <Button 
                  style={{ marginRight: theme.spacing.md }}
                  onClick={() => console.log('Download statement for', previewGiver.id)}
                >
                  Download
                </Button>
                <Button
                  onClick={() => console.log('Email statement to', previewGiver.email)}
                >
                  Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GivingStatementsModule;
