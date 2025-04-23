import React, { useState } from 'react';
import styled from 'styled-components';
import { useScheduler } from '../../state/schedulerContext';
import { createSeries } from '../../state/actions';

interface AddSeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSpecial: boolean;
  onSuccess: () => void;
}

// Fix styled-component TypeScript errors by using proper typing
const ModalOverlay = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled('div')`
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
`;

const ModalTitle = styled('h3')`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const CloseButton = styled('button')`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  
  &:hover {
    color: #333;
  }
`;

const ModalBody = styled('div')`
  padding: 1.5rem;
`;

const Form = styled('form')`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled('div')`
  display: flex;
  flex-direction: column;
`;

const Label = styled('label')`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Input = styled('input')`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #4a6cf7;
  }
`;

const TextArea = styled('textarea')`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #4a6cf7;
  }
`;

const FileInput = styled('div')`
  position: relative;
  
  input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
`;

const FileInputLabel = styled('div')`
  padding: 0.75rem;
  border: 1px dashed #ddd;
  border-radius: 4px;
  text-align: center;
  background-color: #f9f9f9;
  cursor: pointer;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const ButtonGroup = styled('div')`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const Button = styled('button')<{ primary?: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${props => props.primary ? '#4a6cf7' : '#f1f1f1'};
  color: ${props => props.primary ? 'white' : '#333'};
  
  &:hover {
    background-color: ${props => props.primary ? '#3a5ce5' : '#e5e5e5'};
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled('p')`
  color: #f44336;
  font-size: 0.75rem;
  margin: 0.25rem 0 0;
`;

const AddSeriesModal: React.FC<AddSeriesModalProps> = ({ isOpen, onClose, isSpecial, onSuccess }) => {
  const { dispatch } = useScheduler();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    series_name: '',
    description: '',
    banner_1: null as File | null,
    type: isSpecial ? 'special' : 'normal'
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.files?.[0] || null }));
      
      // Clear error when field is edited
      if (errors[e.target.name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[e.target.name];
          return newErrors;
        });
      }
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.series_name.trim()) {
      newErrors.series_name = 'Series name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.banner_1) {
      newErrors.banner_1 = 'Banner image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      // Create a FormData object to properly handle file uploads
      const data = new FormData();
      data.append('series_name', formData.series_name);
      data.append('description', formData.description);
      data.append('type', formData.type);
      if (formData.banner_1) {
        data.append('banner_1', formData.banner_1);
      }
      
      // Cast the dispatch result to satisfy TypeScript
      const result = await dispatch(createSeries(data)) as unknown as { 
        success: boolean; 
        errors?: Record<string, string>; 
        message?: string 
      };
      
      if (result && result.success) {
        onSuccess();
      } else if (result && result.errors) {
        setErrors(result.errors);
      } else {
        alert('Failed to create series: ' + (result?.message || 'Please try again.'));
      }
    } catch (error) {
      console.error('Error creating series:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{isSpecial ? 'Add Special Series' : 'Add New Series'}</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="series_name">Series Name</Label>
              <Input
                type="text"
                id="series_name"
                name="series_name"
                value={formData.series_name}
                onChange={handleChange}
                placeholder="Enter series name"
              />
              {errors.series_name && <ErrorMessage>{errors.series_name}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="description">Description</Label>
              <TextArea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter series description"
              />
              {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label>Banner Image (1920x1080 pixels)</Label>
              <FileInput>
                <FileInputLabel>
                  {formData.banner_1 ? formData.banner_1.name : 'Click to upload banner image'}
                </FileInputLabel>
                <input
                  type="file"
                  name="banner_1"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </FileInput>
              {errors.banner_1 && <ErrorMessage>{errors.banner_1}</ErrorMessage>}
            </FormGroup>
            
            <ButtonGroup>
              <Button type="button" onClick={onClose}>Cancel</Button>
              <Button type="submit" primary disabled={loading}>
                {loading ? 'Creating...' : 'Create Series'}
              </Button>
            </ButtonGroup>
          </Form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddSeriesModal;
