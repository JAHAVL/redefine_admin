import React, { useState } from 'react';
import styled from 'styled-components';
import { Mail } from '../MailWidget';
import MailTheme from '../theme';

// Types
interface ComposeProps {
  onSend: (email: Omit<Mail, 'id' | 'date' | 'read' | 'starred' | 'folder'>) => void;
  onCancel: () => void;
}

// Styled Components
const ComposeContainer = styled.div`
  flex: 1;
  background-color: ${MailTheme.colors.background.card};
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${MailTheme.colors.border.light};
`;

const ComposeHeader = styled.div`
  padding: ${MailTheme.spacing.md};
  border-bottom: 1px solid ${MailTheme.colors.border.light};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ComposeTitle = styled.h2`
  font-size: ${MailTheme.typography.fontSize.lg};
  font-weight: ${MailTheme.typography.fontWeight.medium};
  margin: 0;
  color: ${MailTheme.colors.text.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${MailTheme.typography.fontSize.lg};
  color: ${MailTheme.colors.text.secondary};
  
  &:hover {
    color: ${MailTheme.colors.text.primary};
  }
`;

const ComposeForm = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const FormField = styled.div`
  padding: ${MailTheme.spacing.md};
  border-bottom: 1px solid ${MailTheme.colors.border.light};
  display: flex;
`;

const FieldLabel = styled.label`
  width: 60px;
  color: ${MailTheme.colors.text.secondary};
  font-size: ${MailTheme.typography.fontSize.sm};
`;

const FieldInput = styled.input`
  flex: 1;
  border: none;
  font-family: ${MailTheme.typography.fontFamily};
  font-size: ${MailTheme.typography.fontSize.sm};
  color: ${MailTheme.colors.text.primary};
  
  &:focus {
    outline: none;
  }
`;

const MessageArea = styled.div`
  flex: 1;
  padding: ${MailTheme.spacing.md};
  display: flex;
  flex-direction: column;
`;

const MessageTextarea = styled.textarea`
  flex: 1;
  border: none;
  resize: none;
  font-family: ${MailTheme.typography.fontFamily};
  font-size: ${MailTheme.typography.fontSize.sm};
  color: ${MailTheme.colors.text.primary};
  line-height: 1.5;
  
  &:focus {
    outline: none;
  }
`;

const ComposeFooter = styled.div`
  padding: ${MailTheme.spacing.md};
  border-top: 1px solid ${MailTheme.colors.border.light};
  display: flex;
  justify-content: space-between;
`;

const SendButton = styled.button`
  background-color: ${MailTheme.colors.primary.main};
  color: ${MailTheme.colors.primary.contrastText};
  border: none;
  border-radius: ${MailTheme.borderRadius.md};
  padding: ${MailTheme.spacing.sm} ${MailTheme.spacing.lg};
  font-weight: ${MailTheme.typography.fontWeight.medium};
  cursor: pointer;
  
  &:hover {
    background-color: ${MailTheme.colors.primary.dark};
  }
  
  &:disabled {
    background-color: ${MailTheme.colors.border.main};
    cursor: not-allowed;
  }
`;

const AttachButton = styled.button`
  background: none;
  border: 1px solid ${MailTheme.colors.border.main};
  border-radius: ${MailTheme.borderRadius.md};
  padding: ${MailTheme.spacing.sm} ${MailTheme.spacing.md};
  color: ${MailTheme.colors.text.secondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: ${MailTheme.colors.interactive.hover};
  }
`;

const AttachmentIcon = styled.span`
  margin-right: ${MailTheme.spacing.xs};
`;

// Component
const Compose: React.FC<ComposeProps> = ({ onSend, onCancel }) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!to || !subject) return;
    
    onSend({
      from: 'me@church.org', // Hardcoded sender for now
      to,
      subject,
      body
    });
  };
  
  const isFormValid = to.trim() !== '' && subject.trim() !== '';
  
  return (
    <ComposeContainer>
      <ComposeHeader>
        <ComposeTitle>New Message</ComposeTitle>
        <CloseButton onClick={onCancel}>×</CloseButton>
      </ComposeHeader>
      
      <ComposeForm onSubmit={handleSubmit}>
        <FormField>
          <FieldLabel>To:</FieldLabel>
          <FieldInput 
            type="email" 
            value={to} 
            onChange={(e) => setTo(e.target.value)} 
            placeholder="recipient@example.com"
            required
          />
        </FormField>
        
        <FormField>
          <FieldLabel>Subject:</FieldLabel>
          <FieldInput 
            type="text" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
            placeholder="Subject"
            required
          />
        </FormField>
        
        <MessageArea>
          <MessageTextarea 
            value={body} 
            onChange={(e) => setBody(e.target.value)} 
            placeholder="Write your message here..."
          />
        </MessageArea>
        
        <ComposeFooter>
          <SendButton type="submit" disabled={!isFormValid}>
            Send
          </SendButton>
          
          <AttachButton type="button">
            <AttachmentIcon>📎</AttachmentIcon>
            Attach
          </AttachButton>
        </ComposeFooter>
      </ComposeForm>
    </ComposeContainer>
  );
};

export default Compose;
