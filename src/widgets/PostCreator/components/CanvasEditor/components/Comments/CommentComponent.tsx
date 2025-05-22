import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { Comment } from '../../EditorTypes';
import { 
  CommentMarker, 
  CommentBubble,
  CommentActions
} from '../../styled/CanvasStyles';
import {
  CommentHeader,
  CommentAuthor,
  CommentDate,
  CommentContent
} from '../../styled/SidebarStyles';

interface CommentComponentProps {
  comment: Comment;
  onResolve: (id: string) => void;
  onDelete: (id: string) => void;
}

const CommentComponent: React.FC<CommentComponentProps> = ({ 
  comment, 
  onResolve, 
  onDelete 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <CommentMarker 
        style={{ 
          left: comment.position.x, 
          top: comment.position.y,
          opacity: comment.resolved ? 0.5 : 1
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faCommentDots} size="xs" />
      </CommentMarker>
      
      {isOpen && (
        <CommentBubble style={{ left: comment.position.x, top: comment.position.y }}>
          <CommentHeader>
            <CommentAuthor>{comment.author}</CommentAuthor>
            <CommentDate>{new Date(comment.createdAt).toLocaleString()}</CommentDate>
          </CommentHeader>
          <CommentContent>{comment.content}</CommentContent>
          <CommentActions>
            {!comment.resolved && (
              <button onClick={() => onResolve(comment.id)}>Resolve</button>
            )}
            <button onClick={() => onDelete(comment.id)}>Delete</button>
          </CommentActions>
        </CommentBubble>
      )}
    </>
  );
};

export default CommentComponent;
