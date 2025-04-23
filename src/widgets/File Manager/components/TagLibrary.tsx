import React, { useState } from 'react';
import styled from 'styled-components';
import { Tag } from '../types';

interface TagLibraryProps {
  tags: Tag[];
  onAddTag: (tag: Omit<Tag, 'id'>) => void;
  onUpdateTag: (tag: Tag) => void;
  onRemoveTag: (id: string) => void;
  onSelectTag: (tag: Tag) => void;
}

const TagLibraryContainer = styled.div`
  padding: 16px;
  background: rgba(20, 20, 20, 0.95);
  border-radius: 8px;
  width: 300px;
  position: fixed;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const TagList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
`;

const TagItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const TagColor = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 8px;
`;

const TagName = styled.span`
  flex-grow: 1;
`;

const TagActions = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  padding: 4px 8px;
  border-radius: 4px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const AddTagForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  color: white;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ColorInput = styled.input`
  width: 100%;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export const TagLibrary: React.FC<TagLibraryProps> = ({
  tags,
  onAddTag,
  onUpdateTag,
  onRemoveTag,
  onSelectTag,
}) => {
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3478ff');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagName.trim()) {
      onAddTag({
        name: newTagName.trim(),
        color: newTagColor,
      });
      setNewTagName('');
    }
  };

  return (
    <TagLibraryContainer>
      <AddTagForm onSubmit={handleSubmit}>
        <Input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="New tag name..."
        />
        <ColorInput
          type="color"
          value={newTagColor}
          onChange={(e) => setNewTagColor(e.target.value)}
        />
        <Button type="submit">Add Tag</Button>
      </AddTagForm>

      <TagList>
        {tags.map((tag) => (
          <TagItem key={tag.id}>
            <TagColor color={tag.color} />
            <TagName>{tag.name}</TagName>
            <TagActions>
              <Button onClick={() => onSelectTag(tag)}>Select</Button>
              <Button onClick={() => onRemoveTag(tag.id)}>×</Button>
            </TagActions>
          </TagItem>
        ))}
      </TagList>
    </TagLibraryContainer>
  );
};
