import React, { useState } from 'react';
import styled from 'styled-components';
import { Comment } from '../types';
import useCommentSystem from '../hooks/useCommentSystem';

// Component for the comment panel
const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

// Header of the comment panel
const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }
  
  .comment-count {
    background-color: #e3f2fd;
    color: #1976d2;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }
`;

// List of comments
const CommentList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

// Individual comment
const CommentItem = styled.div<{ isResolved: boolean }>`
  margin-bottom: 16px;
  padding: 12px;
  background-color: ${props => props.isResolved ? '#f5f5f5' : '#ffffff'};
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  opacity: ${props => props.isResolved ? 0.7 : 1};
  
  .comment-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    
    img {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      margin-right: 8px;
    }
    
    .user-info {
      flex: 1;
      
      .user-name {
        font-weight: 500;
        font-size: 14px;
      }
      
      .comment-time {
        font-size: 12px;
        color: #757575;
      }
    }
    
    .comment-actions button {
      background: none;
      border: none;
      color: #757575;
      cursor: pointer;
      font-size: 12px;
      
      &:hover {
        color: #1976d2;
      }
    }
  }
  
  .comment-content {
    font-size: 14px;
    margin-bottom: 8px;
    word-break: break-word;
  }
  
  .comment-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    border-top: 1px solid #eeeeee;
    padding-top: 8px;
    
    button {
      background: none;
      border: none;
      color: #757575;
      cursor: pointer;
      font-size: 12px;
      
      &:hover {
        color: #1976d2;
      }
    }
  }
`;

// Reply section
const ReplySection = styled.div`
  margin-top: 8px;
  margin-left: 16px;
  border-left: 2px solid #e0e0e0;
  padding-left: 16px;
`;

// New comment form
const CommentForm = styled.div`
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  
  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    resize: none;
    margin-bottom: 8px;
    font-size: 14px;
    font-family: inherit;
    
    &:focus {
      border-color: #1976d2;
      outline: none;
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    
    button {
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      
      &.cancel {
        background: none;
        border: 1px solid #e0e0e0;
        color: #757575;
        margin-right: 8px;
        
        &:hover {
          background-color: #f5f5f5;
        }
      }
      
      &.submit {
        background-color: #1976d2;
        border: none;
        color: white;
        
        &:hover {
          background-color: #1565c0;
        }
        
        &:disabled {
          background-color: #e0e0e0;
          color: #9e9e9e;
          cursor: not-allowed;
        }
      }
    }
  }
`;

// Pin markers on the content
const PinMarker = styled.div<{ x: number; y: number; active: boolean }>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  width: 24px;
  height: 24px;
  margin-left: -12px;
  margin-top: -12px;
  background-color: ${props => props.active ? '#1976d2' : '#ff5722'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: scale(1.1);
  }
`;

// New comment marker
const NewCommentMarker = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  width: 24px;
  height: 24px;
  margin-left: -12px;
  margin-top: -12px;
  background-color: #1976d2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  z-index: 10;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
    }
  }
`;

// Comment tooltip
const CommentTooltip = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${props => props.x}%;
  top: ${props => props.y + 3}%;
  background-color: white;
  border-radius: 4px;
  padding: 12px;
  width: 250px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  z-index: 20;
`;

// Format date to relative time
const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    if (days < 30) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
};

/**
 * Comment component that renders a comment with replies
 */
const CommentComponent: React.FC<{
  comment: Comment;
  onReply: (commentId: string, content: string) => void;
  onResolve: (commentId: string) => void;
}> = ({ comment, onReply, onResolve }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  
  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };
  
  return (
    <CommentItem isResolved={comment.resolved}>
      <div className="comment-header">
        <img src={comment.userAvatar} alt={comment.userName} />
        <div className="user-info">
          <div className="user-name">{comment.userName}</div>
          <div className="comment-time">{formatRelativeTime(comment.timestamp)}</div>
        </div>
        <div className="comment-actions">
          {!comment.resolved && (
            <button onClick={() => onResolve(comment.id)}>Resolve</button>
          )}
        </div>
      </div>
      
      <div className="comment-content">{comment.content}</div>
      
      {comment.replies && comment.replies.length > 0 && (
        <ReplySection>
          {comment.replies.map(reply => (
            <CommentComponent
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onResolve={onResolve}
            />
          ))}
        </ReplySection>
      )}
      
      <div className="comment-footer">
        {!isReplying && !comment.resolved && (
          <button onClick={() => setIsReplying(true)}>Reply</button>
        )}
      </div>
      
      {isReplying && (
        <div style={{ marginTop: '8px' }}>
          <textarea
            placeholder="Write a reply..."
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
            rows={3}
          />
          <div className="form-actions">
            <button className="cancel" onClick={() => setIsReplying(false)}>
              Cancel
            </button>
            <button
              className="submit"
              onClick={handleReplySubmit}
              disabled={!replyContent.trim()}
            >
              Reply
            </button>
          </div>
        </div>
      )}
    </CommentItem>
  );
};

/**
 * Comment system component that allows users to leave Figma-like comments on content
 */
const CommentSystem: React.FC<{ contentRef: React.RefObject<HTMLDivElement> }> = ({ contentRef }) => {
  const {
    isCommentMode,
    isAddingComment,
    commentPosition,
    activeComment,
    startAddingComment,
    cancelAddingComment,
    submitComment,
    selectComment,
    clearSelectedComment,
    resolveComment,
    addReply,
    getTopLevelComments,
    getRepliesForComment,
    getCommentCount,
    getUnresolvedCommentCount,
    enableCommentMode,
    disableCommentMode
  } = useCommentSystem();
  
  const [newCommentContent, setNewCommentContent] = useState('');
  
  const handleSubmitComment = () => {
    if (newCommentContent.trim()) {
      submitComment(newCommentContent);
      setNewCommentContent('');
    }
  };
  
  const handleReply = async (commentId: string, content: string) => {
    await addReply(commentId, content);
  };
  
  const handleResolve = async (commentId: string) => {
    await resolveComment(commentId);
  };
  
  const comments = getTopLevelComments();
  const totalComments = getCommentCount();
  const unresolvedCount = getUnresolvedCommentCount();
  
  return (
    <>
      {/* Comment panel */}
      <CommentContainer>
        <CommentHeader>
          <h3>Comments</h3>
          <div className="comment-count">
            {unresolvedCount} of {totalComments}
          </div>
        </CommentHeader>
        
        <CommentList>
          {comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#757575' }}>
              No comments yet. Click on the content to add a comment.
            </div>
          ) : (
            comments.map(comment => (
              <CommentComponent
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                onResolve={handleResolve}
              />
            ))
          )}
        </CommentList>
        
        {isAddingComment && commentPosition && (
          <CommentForm>
            <textarea
              placeholder="Write a comment..."
              value={newCommentContent}
              onChange={e => setNewCommentContent(e.target.value)}
              rows={4}
              autoFocus
            />
            <div className="form-actions">
              <button className="cancel" onClick={cancelAddingComment}>
                Cancel
              </button>
              <button
                className="submit"
                onClick={handleSubmitComment}
                disabled={!newCommentContent.trim()}
              >
                Comment
              </button>
            </div>
          </CommentForm>
        )}
        
        <div style={{ padding: '10px 16px', borderTop: '1px solid #e0e0e0' }}>
          <button
            onClick={isCommentMode ? disableCommentMode : enableCommentMode}
            style={{
              backgroundColor: isCommentMode ? '#1976d2' : '#f5f5f5',
              color: isCommentMode ? 'white' : '#616161',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            {isCommentMode ? 'Exit Comment Mode' : 'Enable Comment Mode'}
          </button>
        </div>
      </CommentContainer>
      
      {/* Comment pins on the content */}
      {isCommentMode && contentRef.current && (
        <div style={{ position: 'relative' }}>
          {comments
            .filter(comment => comment.coordinates)
            .map(comment => (
              <PinMarker
                key={comment.id}
                x={comment.coordinates!.x}
                y={comment.coordinates!.y}
                active={activeComment?.id === comment.id}
                onClick={() => selectComment(comment)}
              >
                {comment.resolved ? '✓' : '!'}
              </PinMarker>
            ))}
          
          {isAddingComment && commentPosition && (
            <NewCommentMarker
              x={commentPosition.x}
              y={commentPosition.y}
            >
              +
            </NewCommentMarker>
          )}
        </div>
      )}
    </>
  );
};

export default CommentSystem;
