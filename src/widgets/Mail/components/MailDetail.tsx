import React from 'react';
import styled from 'styled-components';
import { Mail } from '../MailWidget';
import MailTheme from '../theme';

// Types
interface MailDetailProps {
  email: Mail;
  onDelete: () => void;
  onStar: () => void;
  onClose: () => void;
}

// Styled Components
const DetailContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: ${MailTheme.colors.background.card};
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: ${MailTheme.spacing.lg};
  border-bottom: 1px solid ${MailTheme.colors.border.light};
  position: sticky;
  top: 0;
  background-color: ${MailTheme.colors.background.card};
  z-index: 1;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${MailTheme.spacing.md};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${MailTheme.spacing.xs} ${MailTheme.spacing.sm};
  color: ${MailTheme.colors.text.secondary};
  border-radius: ${MailTheme.borderRadius.sm};
  
  &:hover {
    background-color: ${MailTheme.colors.interactive.hover};
    color: ${MailTheme.colors.primary.main};
  }
`;

const Subject = styled.h2`
  font-size: ${MailTheme.typography.fontSize.xl};
  font-weight: ${MailTheme.typography.fontWeight.medium};
  margin-bottom: ${MailTheme.spacing.md};
  color: ${MailTheme.colors.text.primary};
`;

const MetaData = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FromInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${MailTheme.borderRadius.circle};
  background-color: ${MailTheme.colors.primary.main};
  color: ${MailTheme.colors.primary.contrastText};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${MailTheme.typography.fontWeight.bold};
  margin-right: ${MailTheme.spacing.sm};
`;

const SenderDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const SenderName = styled.div`
  font-weight: ${MailTheme.typography.fontWeight.medium};
  color: ${MailTheme.colors.text.primary};
`;

const SenderEmail = styled.div`
  font-size: ${MailTheme.typography.fontSize.xs};
  color: ${MailTheme.colors.text.secondary};
`;

const DateInfo = styled.div`
  font-size: ${MailTheme.typography.fontSize.sm};
  color: ${MailTheme.colors.text.secondary};
`;

const Recipients = styled.div`
  margin-top: ${MailTheme.spacing.sm};
  font-size: ${MailTheme.typography.fontSize.sm};
  color: ${MailTheme.colors.text.secondary};
`;

const Content = styled.div`
  padding: ${MailTheme.spacing.lg};
  line-height: 1.6;
  color: ${MailTheme.colors.text.primary};
  flex: 1;
`;

const Attachments = styled.div`
  padding: 0 ${MailTheme.spacing.lg} ${MailTheme.spacing.lg};
  display: flex;
  flex-wrap: wrap;
  gap: ${MailTheme.spacing.md};
`;

const Attachment = styled.div`
  border: 1px solid ${MailTheme.colors.border.light};
  border-radius: ${MailTheme.borderRadius.md};
  padding: ${MailTheme.spacing.sm};
  display: flex;
  align-items: center;
  cursor: pointer;
  
  &:hover {
    background-color: ${MailTheme.colors.interactive.hover};
  }
`;

const AttachmentIcon = styled.div`
  margin-right: ${MailTheme.spacing.sm};
  font-size: ${MailTheme.typography.fontSize.lg};
`;

const AttachmentInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AttachmentName = styled.div`
  font-size: ${MailTheme.typography.fontSize.sm};
  color: ${MailTheme.colors.text.primary};
`;

const AttachmentSize = styled.div`
  font-size: ${MailTheme.typography.fontSize.xs};
  color: ${MailTheme.colors.text.secondary};
`;

const StarIcon = styled.span<{ starred: boolean }>`
  color: ${props => props.starred ? '#f8d64e' : MailTheme.colors.text.secondary};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.starred ? '#f8d64e' : MailTheme.colors.primary.main};
  }
`;

// Format date for display
const formatFullDate = (dateString: string): string => {
  try {
    const date = new globalThis.Date(dateString);
    return date.toLocaleString(undefined, { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
  else return (bytes / 1073741824).toFixed(1) + ' GB';
};

// Get initials from email
const getInitials = (email: string): string => {
  const name = email.split('@')[0];
  const parts = name.split(/[._-]/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Component
const MailDetail: React.FC<MailDetailProps> = ({ 
  email, 
  onDelete, 
  onStar, 
  onClose 
}) => {
  return (
    <DetailContainer>
      <Header>
        <Actions>
          <div>
            <ActionButton onClick={onClose}>
              ← Back
            </ActionButton>
            <ActionButton onClick={onDelete}>
              🗑️ Delete
            </ActionButton>
            <ActionButton>
              ↩️ Reply
            </ActionButton>
            <ActionButton>
              ⟳ Forward
            </ActionButton>
          </div>
          <div>
            <ActionButton onClick={onStar}>
              <StarIcon starred={email.starred}>
                {email.starred ? '★' : '☆'}
              </StarIcon>
            </ActionButton>
          </div>
        </Actions>
        
        <Subject>{email.subject}</Subject>
        
        <MetaData>
          <FromInfo>
            <Avatar>{getInitials(email.from)}</Avatar>
            <SenderDetails>
              <SenderName>{email.from.split('@')[0]}</SenderName>
              <SenderEmail>{email.from}</SenderEmail>
            </SenderDetails>
          </FromInfo>
          <DateInfo>{formatFullDate(email.date)}</DateInfo>
        </MetaData>
        
        <Recipients>
          To: {email.to}
        </Recipients>
      </Header>
      
      <Content>
        {email.body.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </Content>
      
      {email.attachments && email.attachments.length > 0 && (
        <Attachments>
          {email.attachments.map((attachment, index) => (
            <Attachment key={index}>
              <AttachmentIcon>
                {attachment.type.includes('image') ? '🖼️' : 
                 attachment.type.includes('pdf') ? '📄' : 
                 attachment.type.includes('word') ? '📝' : 
                 attachment.type.includes('excel') ? '📊' : '📎'}
              </AttachmentIcon>
              <AttachmentInfo>
                <AttachmentName>{attachment.name}</AttachmentName>
                <AttachmentSize>{formatFileSize(attachment.size)}</AttachmentSize>
              </AttachmentInfo>
            </Attachment>
          ))}
        </Attachments>
      )}
    </DetailContainer>
  );
};

export default MailDetail;
