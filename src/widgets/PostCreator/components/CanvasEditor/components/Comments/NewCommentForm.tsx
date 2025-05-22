import React, { useState } from 'react';
import { Position } from '../../EditorTypes';
import { 
  CommentBubble, 
  CommentInput 
} from '../../styled/CanvasStyles';
import { CommentActions } from '../../styled/SidebarStyles';

interface NewCommentFormProps {
  position: Position;
  onSave: (content: string) => void;
  onCancel: () => void;
}

const NewCommentForm: React.FC<NewCommentFormProps> = ({ 
  position, 
  onSave, 
  onCancel 
}) => {
  const [content, setContent] = useState('');
  
  return (
    <CommentBubble style={{ left: position.x, top: position.y }}>
      <CommentInput 
        placeholder="Add your comment here..." 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        autoFocus
      />
      <CommentActions>
        <button onClick={onCancel}>Cancel</button>
        <button 
          onClick={() => onSave(content)}
          disabled={!content.trim()}
        >
          Save
        </button>
      </CommentActions>
    </CommentBubble>
  );
};

export default NewCommentForm;
