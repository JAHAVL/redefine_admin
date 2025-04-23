import React from 'react';
import styled from 'styled-components';
import { Mail } from '../MailWidget';
import MailTheme from '../theme';

// Types
interface MailListProps {
  emails: Mail[];
  selectedEmailId: string | undefined;
  onSelectEmail: (email: Mail) => void;
  onStarEmail: (emailId: string) => void;
  onDeleteEmail: (emailId: string) => void;
}

interface MailItemProps {
  selected: boolean;
  read: boolean;
}

// Styled Components
const MailListContainer = styled.div`
  width: 350px;
  border-right: 1px solid ${MailTheme.colors.border.light};
  background-color: transparent;
  backdrop-filter: blur(5px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const SearchBar = styled.div`
  padding: ${MailTheme.spacing.md};
  border-bottom: 1px solid ${MailTheme.colors.border.light};
  position: sticky;
  top: 0;
  background-color: transparent;
  backdrop-filter: blur(8px);
  z-index: 1;
  flex: 1;
  max-width: 500px;
  margin: 0;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${MailTheme.spacing.sm} ${MailTheme.spacing.lg};
  border-radius: ${MailTheme.borderRadius.xl};
  border: 1px solid rgba(80, 80, 80, 0.7);
  background-color: rgba(30, 30, 30, 0.7);
  color: ${MailTheme.colors.text.primary};
  font-size: ${MailTheme.typography.fontSize.md};
  transition: all ${MailTheme.transitions.fast};
  padding-left: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 12px center;
  
  &:focus {
    outline: none;
    border-color: ${MailTheme.colors.primary.main};
    box-shadow: 0 0 0 2px ${MailTheme.colors.primary.light}40;
  }
`;

const EmailList = styled.div`
  flex: 1;
`;

const EmailItem = styled.div<MailItemProps>`
  padding: ${MailTheme.spacing.md};
  border-bottom: 1px solid ${MailTheme.colors.border.light};
  cursor: pointer;
  background-color: ${props => 
    props.selected 
      ? MailTheme.colors.interactive.selected 
      : props.read 
        ? 'rgba(38, 43, 54, 0.6)' 
        : 'rgba(48, 52, 65, 0.7)'
  };
  position: relative;
  backdrop-filter: blur(3px);
  
  &:hover {
    background-color: ${props => 
      props.selected 
        ? MailTheme.colors.interactive.selected 
        : 'rgba(60, 65, 75, 0.6)'
    };
  }
`;

const EmailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${MailTheme.spacing.xs};
`;

const Sender = styled.div<{ read: boolean }>`
  font-weight: ${props => props.read ? MailTheme.typography.fontWeight.regular : MailTheme.typography.fontWeight.bold};
  font-size: ${MailTheme.typography.fontSize.sm};
  color: ${MailTheme.colors.text.primary};
`;

const Date = styled.div`
  font-size: ${MailTheme.typography.fontSize.xs};
  color: ${MailTheme.colors.text.secondary};
`;

const Subject = styled.div<{ read: boolean }>`
  font-weight: ${props => props.read ? MailTheme.typography.fontWeight.regular : MailTheme.typography.fontWeight.bold};
  font-size: ${MailTheme.typography.fontSize.sm};
  margin-bottom: ${MailTheme.spacing.xs};
  color: ${MailTheme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Preview = styled.div`
  font-size: ${MailTheme.typography.fontSize.xs};
  color: ${MailTheme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ActionButtons = styled.div`
  position: absolute;
  right: ${MailTheme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  display: none;
  
  ${EmailItem}:hover & {
    display: flex;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${MailTheme.spacing.xs};
  color: ${MailTheme.colors.text.secondary};
  
  &:hover {
    color: ${MailTheme.colors.primary.main};
  }
`;

const StarIcon = styled.span<{ starred: boolean }>`
  color: ${props => props.starred ? '#f8d64e' : MailTheme.colors.text.secondary};
  margin-right: ${MailTheme.spacing.sm};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.starred ? '#f8d64e' : MailTheme.colors.primary.main};
  }
`;

const NoEmailsMessage = styled.div`
  padding: ${MailTheme.spacing.xl};
  text-align: center;
  color: ${MailTheme.colors.text.secondary};
`;

// Format date for display
const formatDate = (dateString: string): string => {
  try {
    const date = new globalThis.Date(dateString);
    const today = new globalThis.Date();
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Component
const MailList: React.FC<MailListProps> = ({ 
  emails, 
  selectedEmailId, 
  onSelectEmail, 
  onStarEmail, 
  onDeleteEmail 
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredEmails = searchQuery 
    ? emails.filter(email => 
        email.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
        email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.body.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : emails;
  
  return (
    <MailListContainer>
      <SearchBar>
        <SearchInput 
          type="text" 
          placeholder="Search emails..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchBar>
      
      <EmailList>
        {filteredEmails.length > 0 ? (
          filteredEmails.map(email => (
            <EmailItem 
              key={email.id} 
              selected={email.id === selectedEmailId}
              read={email.read}
              onClick={() => onSelectEmail(email)}
            >
              <EmailHeader>
                <Sender read={email.read}>{email.from.split('@')[0]}</Sender>
                <Date>{formatDate(email.date)}</Date>
              </EmailHeader>
              <Subject read={email.read}>
                <StarIcon 
                  starred={email.starred}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStarEmail(email.id);
                  }}
                >
                  {email.starred ? '★' : '☆'}
                </StarIcon>
                {email.subject}
              </Subject>
              <Preview>{email.body.substring(0, 100)}...</Preview>
              
              <ActionButtons>
                <ActionButton 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteEmail(email.id);
                  }}
                >
                  🗑️
                </ActionButton>
              </ActionButtons>
            </EmailItem>
          ))
        ) : (
          <NoEmailsMessage>No emails found</NoEmailsMessage>
        )}
      </EmailList>
    </MailListContainer>
  );
};

export default MailList;
