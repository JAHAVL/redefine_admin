import React, { useState } from 'react';
import styled from 'styled-components';
import MailTheme from '../theme';

// Define Mail interface locally to avoid dependency on mailbox
interface Mail {
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

// Types
interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  variables: string[];
}

// Styled components
const TemplatesContainer = styled.div`
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
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${MailTheme.spacing.md} ${MailTheme.spacing.lg};
  border-bottom: 1px solid ${MailTheme.colors.border.light};
`;

const Title = styled.h2`
  font-size: ${MailTheme.typography.fontSize.xl};
  font-weight: ${MailTheme.typography.fontWeight.medium};
  color: ${MailTheme.colors.text.primary};
  margin: 0;
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
  transition: background-color ${MailTheme.transitions.fast} ease;
  
  &:hover {
    background-color: ${MailTheme.colors.primary.dark};
  }
`;

const TemplateList = styled.div`
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
`;

interface TemplateItemProps {
  active: boolean;
}

const TemplateItem = styled.div<TemplateItemProps>`
  padding: ${MailTheme.spacing.sm} ${MailTheme.spacing.md};
  border-radius: ${MailTheme.borderRadius.sm};
  background-color: ${props => props.active ? MailTheme.colors.interactive.selected : 'transparent'};
  cursor: pointer;
  transition: background-color ${MailTheme.transitions.fast} ease;
  
  &:hover {
    background-color: ${props => props.active ? MailTheme.colors.interactive.selected : MailTheme.colors.interactive.hover};
  }
`;

const TemplateName = styled.div`
  font-size: ${MailTheme.typography.fontSize.md};
  font-weight: ${MailTheme.typography.fontWeight.medium};
  color: ${MailTheme.colors.text.primary};
  margin-bottom: ${MailTheme.spacing.xs};
`;

const TemplateDate = styled.div`
  font-size: ${MailTheme.typography.fontSize.xs};
  color: ${MailTheme.colors.text.secondary};
`;

const EditorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: ${MailTheme.spacing.lg};
  overflow-y: auto;
`;

const FormGroup = styled.div`
  margin-bottom: ${MailTheme.spacing.md};
`;

const Label = styled.label`
  display: block;
  font-size: ${MailTheme.typography.fontSize.sm};
  font-weight: ${MailTheme.typography.fontWeight.medium};
  color: ${MailTheme.colors.text.secondary};
  margin-bottom: ${MailTheme.spacing.xs};
`;

const Input = styled.input`
  width: 100%;
  padding: ${MailTheme.spacing.sm};
  background-color: ${MailTheme.colors.background.card};
  border: 1px solid ${MailTheme.colors.border.main};
  border-radius: ${MailTheme.borderRadius.sm};
  color: ${MailTheme.colors.text.primary};
  font-size: ${MailTheme.typography.fontSize.md};
  
  &:focus {
    outline: none;
    border-color: ${MailTheme.colors.primary.main};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: ${MailTheme.spacing.sm};
  background-color: ${MailTheme.colors.background.card};
  border: 1px solid ${MailTheme.colors.border.main};
  border-radius: ${MailTheme.borderRadius.sm};
  color: ${MailTheme.colors.text.primary};
  font-size: ${MailTheme.typography.fontSize.md};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${MailTheme.colors.primary.main};
  }
`;

const VariablesContainer = styled.div`
  margin-top: ${MailTheme.spacing.md};
  padding: ${MailTheme.spacing.md};
  background-color: ${MailTheme.colors.background.overlay};
  border-radius: ${MailTheme.borderRadius.sm};
`;

const VariableTitle = styled.h4`
  font-size: ${MailTheme.typography.fontSize.sm};
  font-weight: ${MailTheme.typography.fontWeight.medium};
  color: ${MailTheme.colors.text.secondary};
  margin: 0 0 ${MailTheme.spacing.sm};
`;

const VariableList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${MailTheme.spacing.sm};
`;

const VariableTag = styled.span`
  display: inline-block;
  padding: ${MailTheme.spacing.xs} ${MailTheme.spacing.sm};
  background-color: ${MailTheme.colors.primary.light};
  color: ${MailTheme.colors.primary.dark};
  border-radius: ${MailTheme.borderRadius.xs};
  font-size: ${MailTheme.typography.fontSize.xs};
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${MailTheme.spacing.sm};
  margin-top: ${MailTheme.spacing.lg};
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: ${MailTheme.colors.text.primary};
  border: 1px solid ${MailTheme.colors.border.main};
  
  &:hover {
    background-color: ${MailTheme.colors.background.overlay};
  }
`;

// Mock data for initial development
const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to Our Church Community',
    body: 'Dear {{name}},\n\nWelcome to our church community! We are thrilled to have you join us.\n\nService Times:\n- Sunday: 9:00 AM and 11:00 AM\n- Wednesday: 7:00 PM\n\nIf you have any questions, please don\'t hesitate to reach out to us at {{contact_email}}.\n\nBlessings,\n{{sender_name}}\n{{church_name}}',
    category: 'Onboarding',
    createdAt: '2025-03-15T10:30:00',
    updatedAt: '2025-04-05T14:20:00',
    variables: ['name', 'contact_email', 'sender_name', 'church_name']
  },
  {
    id: '2',
    name: 'Event Invitation',
    subject: 'You\'re Invited: {{event_name}}',
    body: 'Dear {{name}},\n\nWe\'d like to invite you to our upcoming event: {{event_name}}.\n\nDate: {{event_date}}\nTime: {{event_time}}\nLocation: {{event_location}}\n\nPlease RSVP by {{rsvp_date}}.\n\nWe hope to see you there!\n\nBlessings,\n{{sender_name}}\n{{church_name}}',
    category: 'Events',
    createdAt: '2025-03-20T11:45:00',
    updatedAt: '2025-03-20T11:45:00',
    variables: ['name', 'event_name', 'event_date', 'event_time', 'event_location', 'rsvp_date', 'sender_name', 'church_name']
  },
  {
    id: '3',
    name: 'Weekly Newsletter',
    subject: '{{church_name}} Weekly Update: {{date}}',
    body: 'Dear {{name}},\n\nHere\'s what\'s happening this week at {{church_name}}:\n\n{{weekly_announcements}}\n\nUpcoming Events:\n{{upcoming_events}}\n\nPrayer Requests:\n{{prayer_requests}}\n\nBlessings,\n{{sender_name}}\n{{church_name}}',
    category: 'Newsletters',
    createdAt: '2025-03-25T09:15:00',
    updatedAt: '2025-04-08T16:30:00',
    variables: ['name', 'church_name', 'date', 'weekly_announcements', 'upcoming_events', 'prayer_requests', 'sender_name']
  },
  {
    id: '4',
    name: 'Donation Thank You',
    subject: 'Thank You for Your Generous Donation',
    body: 'Dear {{name}},\n\nThank you for your generous donation of {{donation_amount}} to {{church_name}}.\n\nYour contribution helps us continue our mission and serve our community.\n\nDonation Details:\nAmount: {{donation_amount}}\nDate: {{donation_date}}\nPurpose: {{donation_purpose}}\n\nWith gratitude,\n{{sender_name}}\n{{church_name}}',
    category: 'Donations',
    createdAt: '2025-04-01T13:20:00',
    updatedAt: '2025-04-01T13:20:00',
    variables: ['name', 'donation_amount', 'church_name', 'donation_date', 'donation_purpose', 'sender_name']
  },
  {
    id: '5',
    name: 'Volunteer Opportunity',
    subject: 'Volunteer Opportunity: {{volunteer_role}}',
    body: 'Dear {{name}},\n\nWe\'re looking for volunteers to help with {{volunteer_role}}.\n\nDetails:\n- Role: {{volunteer_role}}\n- Date(s): {{volunteer_dates}}\n- Time: {{volunteer_time}}\n- Location: {{volunteer_location}}\n\nIf you\'re interested, please reply to this email or contact {{contact_name}} at {{contact_email}}.\n\nThank you for considering this opportunity to serve!\n\nBlessings,\n{{sender_name}}\n{{church_name}}',
    category: 'Volunteering',
    createdAt: '2025-04-05T10:00:00',
    updatedAt: '2025-04-07T11:30:00',
    variables: ['name', 'volunteer_role', 'volunteer_dates', 'volunteer_time', 'volunteer_location', 'contact_name', 'contact_email', 'sender_name', 'church_name']
  }
];

// Group templates by category
const groupTemplatesByCategory = (templates: Template[]) => {
  const grouped: Record<string, Template[]> = {};
  
  templates.forEach(template => {
    if (!grouped[template.category]) {
      grouped[template.category] = [];
    }
    grouped[template.category].push(template);
  });
  
  return grouped;
};

const MailTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<Template>>({
    name: '',
    subject: '',
    body: '',
    category: '',
    variables: []
  });
  
  // Group templates by category
  const groupedTemplates = groupTemplatesByCategory(templates);
  
  // Handle template selection
  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setEditMode(false);
  };
  
  // Handle creating a new template
  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setEditMode(true);
    setFormData({
      name: '',
      subject: '',
      body: '',
      category: 'Uncategorized',
      variables: []
    });
  };
  
  // Handle editing a template
  const handleEditTemplate = () => {
    if (selectedTemplate) {
      setFormData({
        name: selectedTemplate.name,
        subject: selectedTemplate.subject,
        body: selectedTemplate.body,
        category: selectedTemplate.category,
        variables: selectedTemplate.variables
      });
      setEditMode(true);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Extract variables from template content
  const extractVariables = (content: string): string[] => {
    const regex = /{{([^}]+)}}/g;
    const matches = content.match(regex) || [];
    return matches.map(match => match.replace(/{{|}}/g, ''));
  };
  
  // Handle saving a template
  const handleSaveTemplate = () => {
    // Extract variables from subject and body
    const subjectVariables = extractVariables(formData.subject || '');
    const bodyVariables = extractVariables(formData.body || '');
    const allVariables = Array.from(new Set([...subjectVariables, ...bodyVariables]));
    
    if (editMode && selectedTemplate) {
      // Update existing template
      const updatedTemplates = templates.map(template => 
        template.id === selectedTemplate.id 
          ? {
              ...template,
              name: formData.name || template.name,
              subject: formData.subject || template.subject,
              body: formData.body || template.body,
              category: formData.category || template.category,
              updatedAt: new Date().toISOString(),
              variables: allVariables
            }
          : template
      );
      setTemplates(updatedTemplates);
      setSelectedTemplate(updatedTemplates.find(t => t.id === selectedTemplate.id) || null);
    } else {
      // Create new template
      const newTemplate: Template = {
        id: `new-${Date.now()}`,
        name: formData.name || 'Untitled Template',
        subject: formData.subject || '',
        body: formData.body || '',
        category: formData.category || 'Uncategorized',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        variables: allVariables
      };
      setTemplates([...templates, newTemplate]);
      setSelectedTemplate(newTemplate);
    }
    
    setEditMode(false);
  };
  
  // Handle inserting a variable into the template
  const handleInsertVariable = (variable: string) => {
    const textArea = document.getElementById('template-body') as HTMLTextAreaElement;
    if (textArea) {
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const text = textArea.value;
      const variableText = `{{${variable}}}`;
      
      const newText = text.substring(0, start) + variableText + text.substring(end);
      setFormData(prev => ({
        ...prev,
        body: newText
      }));
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        textArea.focus();
        textArea.setSelectionRange(start + variableText.length, start + variableText.length);
      }, 0);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <TemplatesContainer>
      <SidebarContainer>
        <Header>
          <Title>Templates</Title>
          <Button onClick={handleCreateTemplate}>New Template</Button>
        </Header>
        
        {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
          <div key={category}>
            <CategoryTitle>{category}</CategoryTitle>
            <TemplateList>
              {categoryTemplates.map(template => (
                <TemplateItem 
                  key={template.id}
                  active={selectedTemplate?.id === template.id}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <TemplateName>{template.name}</TemplateName>
                  <TemplateDate>Updated: {formatDate(template.updatedAt)}</TemplateDate>
                </TemplateItem>
              ))}
            </TemplateList>
          </div>
        ))}
      </SidebarContainer>
      
      <ContentArea>
        {selectedTemplate && !editMode ? (
          <EditorContainer>
            <Header>
              <Title>{selectedTemplate.name}</Title>
              <Button onClick={handleEditTemplate}>Edit Template</Button>
            </Header>
            
            <FormGroup>
              <Label>Subject</Label>
              <Input 
                type="text" 
                value={selectedTemplate.subject} 
                readOnly 
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Body</Label>
              <TextArea 
                value={selectedTemplate.body} 
                readOnly 
              />
            </FormGroup>
            
            {selectedTemplate.variables.length > 0 && (
              <VariablesContainer>
                <VariableTitle>Available Variables</VariableTitle>
                <VariableList>
                  {selectedTemplate.variables.map(variable => (
                    <VariableTag key={variable}>
                      {variable}
                    </VariableTag>
                  ))}
                </VariableList>
              </VariablesContainer>
            )}
          </EditorContainer>
        ) : editMode ? (
          <EditorContainer>
            <Header>
              <Title>{selectedTemplate ? 'Edit Template' : 'New Template'}</Title>
            </Header>
            
            <FormGroup>
              <Label htmlFor="name">Template Name</Label>
              <Input 
                id="name"
                name="name"
                type="text" 
                value={formData.name} 
                onChange={handleInputChange}
                placeholder="Enter template name"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category"
                name="category"
                type="text" 
                value={formData.category} 
                onChange={handleInputChange}
                placeholder="Enter category"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject"
                name="subject"
                type="text" 
                value={formData.subject} 
                onChange={handleInputChange}
                placeholder="Enter email subject"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="template-body">Body</Label>
              <TextArea 
                id="template-body"
                name="body"
                value={formData.body} 
                onChange={handleInputChange}
                placeholder="Enter email body"
              />
            </FormGroup>
            
            <VariablesContainer>
              <VariableTitle>Common Variables (click to insert)</VariableTitle>
              <VariableList>
                {['name', 'email', 'church_name', 'sender_name', 'date', 'contact_email'].map(variable => (
                  <VariableTag 
                    key={variable}
                    onClick={() => handleInsertVariable(variable)}
                  >
                    {variable}
                  </VariableTag>
                ))}
              </VariableList>
            </VariablesContainer>
            
            <ButtonGroup>
              <SecondaryButton onClick={() => {
                setEditMode(false);
                if (!selectedTemplate) {
                  setSelectedTemplate(templates[0] || null);
                }
              }}>
                Cancel
              </SecondaryButton>
              <Button onClick={handleSaveTemplate}>
                Save Template
              </Button>
            </ButtonGroup>
          </EditorContainer>
        ) : (
          <EditorContainer style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <h3>Select a template or create a new one</h3>
              <p>Manage your email templates to streamline communication</p>
              <Button onClick={handleCreateTemplate} style={{ marginTop: MailTheme.spacing.md }}>
                Create New Template
              </Button>
            </div>
          </EditorContainer>
        )}
      </ContentArea>
    </TemplatesContainer>
  );
};

export default MailTemplates;
