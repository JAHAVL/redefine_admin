import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Post, PostRevision, Comment, User } from '../types';

interface ReviewSystemProps {
  postId?: string;
  postRevision?: PostRevision;
  contentRef?: React.RefObject<HTMLDivElement>;
  readOnly?: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f9f9f9;
  border-left: 1px solid #e0e0e0;
`;

const Header = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
  }
  
  p {
    margin: 6px 0 0;
    font-size: 13px;
    color: #757575;
  }
`;

const CommentsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const CommentItem = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 12px;
  margin-bottom: 16px;
  
  .comment-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #e3f2fd;
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1976d2;
      font-weight: 500;
    }
    
    .user-info {
      .name {
        font-weight: 500;
        font-size: 14px;
      }
      
      .time {
        font-size: 12px;
        color: #9e9e9e;
      }
    }
    
    .status {
      margin-left: auto;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      
      &.resolved {
        background-color: #e8f5e9;
        color: #2e7d32;
      }
      
      &.open {
        background-color: #fff8e1;
        color: #f57c00;
      }
    }
  }
  
  .comment-content {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 8px;
  }
  
  .comment-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
    
    button {
      background: none;
      border: none;
      color: #1976d2;
      font-size: 12px;
      cursor: pointer;
      padding: 4px 8px;
      
      &:hover {
        text-decoration: underline;
      }
      
      &.resolve {
        color: #2e7d32;
      }
      
      &.delete {
        color: #d32f2f;
      }
    }
  }
`;

const CommentForm = styled.div`
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  
  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    resize: none;
    font-size: 14px;
    min-height: 80px;
    
    &:focus {
      outline: none;
      border-color: #bbdefb;
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    
    .comment-type {
      display: flex;
      
      label {
        display: flex;
        align-items: center;
        margin-right: 12px;
        font-size: 13px;
        cursor: pointer;
        
        input {
          margin-right: 6px;
        }
      }
    }
    
    button {
      background-color: #1976d2;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      
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
`;

const FeedbackSummary = styled.div`
  margin-bottom: 16px;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  h4 {
    margin: 0 0 12px;
    font-size: 15px;
    font-weight: 500;
  }
  
  .stat {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    
    .label {
      flex: 1;
      font-size: 14px;
    }
    
    .value {
      font-weight: 500;
      font-size: 14px;
    }
  }
  
  .feedback-status {
    display: flex;
    margin-top: 12px;
    
    .status-item {
      flex: 1;
      text-align: center;
      
      .number {
        font-size: 20px;
        font-weight: 500;
      }
      
      .label {
        font-size: 12px;
        color: #757575;
      }
      
      &.open {
        color: #f57c00;
      }
      
      &.resolved {
        color: #2e7d32;
      }
    }
  }
`;

const ApprovalActions = styled.div`
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  
  button {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    
    &.reject {
      background-color: #fff;
      color: #d32f2f;
      border: 1px solid #d32f2f;
      
      &:hover {
        background-color: #ffebee;
      }
    }
    
    &.approve {
      background-color: #4caf50;
      color: white;
      border: none;
      
      &:hover {
        background-color: #388e3c;
      }
    }
  }
`;

// Mock reviewer users
const reviewers: User[] = [
  { id: 'user1', name: 'John Doe', avatar: '', email: 'john@example.com', role: 'admin' },
  { id: 'user2', name: 'Jane Smith', avatar: '', email: 'jane@example.com', role: 'approver' },
  { id: 'user3', name: 'Michael Brown', avatar: '', email: 'michael@example.com', role: 'creator' }
];

// Mock comments
const mockComments: Comment[] = [
  {
    id: 'comment1',
    userId: 'user1',
    userName: 'John Doe',
    userAvatar: '',
    content: 'The first paragraph needs more context. Consider adding some statistics to back up the claim.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    resolved: false
  },
  {
    id: 'comment2',
    userId: 'user2',
    userName: 'Jane Smith',
    userAvatar: '',
    content: 'The headline is too long. Try to keep it under 80 characters for better engagement.',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    resolved: true
  },
  {
    id: 'comment3',
    userId: 'user3',
    userName: 'Michael Brown',
    userAvatar: '',
    content: 'Images are high quality but we should include alt text for better accessibility.',
    timestamp: new Date(Date.now() - 21600000).toISOString(),
    resolved: false
  }
];

const ReviewSystem: React.FC<ReviewSystemProps> = ({ 
  postId, 
  postRevision,
  contentRef,
  readOnly = false
}) => {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<'general' | 'specific'>('general');
  const [stats, setStats] = useState({
    openComments: 0,
    resolvedComments: 0,
    reviewers: 0
  });
  
  // Update stats when comments change
  useEffect(() => {
    const openComments = comments.filter(c => !c.resolved).length;
    const resolvedComments = comments.filter(c => c.resolved).length;
    const uniqueReviewers = new Set(comments.map(c => c.userId)).size;
    
    setStats({
      openComments,
      resolvedComments,
      reviewers: uniqueReviewers
    });
  }, [comments]);
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Handle adding a comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const newCommentObj: Comment = {
      id: `comment${Date.now()}`,
      userId: 'user1', // Current user ID would come from auth context
      userName: 'John Doe', // Current user name
      userAvatar: '',
      content: newComment,
      timestamp: new Date().toISOString(),
      resolved: false,
      // For specific comments, we would add coordinates
      ...(commentType === 'specific' && contentRef ? {
        coordinates: { x: 100, y: 100 } // Example coordinates
      } : {})
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };
  
  // Handle resolving a comment
  const handleResolveComment = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, resolved: true } 
        : comment
    ));
  };
  
  // Handle deleting a comment
  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };
  
  // Handle approving the post
  const handleApprove = () => {
    // In a real implementation, this would call an API
    console.log('Post approved');
  };
  
  // Handle rejecting the post
  const handleReject = () => {
    // In a real implementation, this would call an API
    console.log('Post rejected');
  };
  
  return (
    <Container>
      <Header>
        <h3>Review & Feedback</h3>
        <p>Collaborate on improving this content</p>
      </Header>
      
      <CommentsContainer>
        <FeedbackSummary>
          <h4>Feedback Summary</h4>
          
          <div className="stat">
            <div className="label">Revision Number</div>
            <div className="value">{postRevision?.revisionNumber || 1}</div>
          </div>
          
          <div className="stat">
            <div className="label">Created By</div>
            <div className="value">{postRevision?.createdBy || 'Unknown'}</div>
          </div>
          
          <div className="stat">
            <div className="label">Last Updated</div>
            <div className="value">
              {postRevision?.createdAt 
                ? formatTime(postRevision.createdAt) 
                : 'Just now'}
            </div>
          </div>
          
          <div className="feedback-status">
            <div className="status-item open">
              <div className="number">{stats.openComments}</div>
              <div className="label">Open</div>
            </div>
            <div className="status-item resolved">
              <div className="number">{stats.resolvedComments}</div>
              <div className="label">Resolved</div>
            </div>
            <div className="status-item">
              <div className="number">{stats.reviewers}</div>
              <div className="label">Reviewers</div>
            </div>
          </div>
        </FeedbackSummary>
        
        {comments.map(comment => (
          <CommentItem key={comment.id}>
            <div className="comment-header">
              <div className="avatar">
                {comment.userName.charAt(0)}
              </div>
              <div className="user-info">
                <div className="name">{comment.userName}</div>
                <div className="time">{formatTime(comment.timestamp)}</div>
              </div>
              <div className={`status ${comment.resolved ? 'resolved' : 'open'}`}>
                {comment.resolved ? 'Resolved' : 'Open'}
              </div>
            </div>
            <div className="comment-content">
              {comment.content}
            </div>
            {!readOnly && !comment.resolved && (
              <div className="comment-actions">
                <button 
                  className="resolve"
                  onClick={() => handleResolveComment(comment.id)}
                >
                  Resolve
                </button>
                <button
                  className="delete"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </CommentItem>
        ))}
      </CommentsContainer>
      
      {!readOnly && (
        <CommentForm>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your feedback..."
          />
          <div className="form-actions">
            <div className="comment-type">
              <label>
                <input
                  type="radio"
                  name="commentType"
                  checked={commentType === 'general'}
                  onChange={() => setCommentType('general')}
                />
                General
              </label>
              <label>
                <input
                  type="radio"
                  name="commentType"
                  checked={commentType === 'specific'}
                  onChange={() => setCommentType('specific')}
                />
                Specific
              </label>
            </div>
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
            >
              Add Comment
            </button>
          </div>
        </CommentForm>
      )}
      
      {!readOnly && (
        <ApprovalActions>
          <button 
            className="reject"
            onClick={handleReject}
          >
            Reject Content
          </button>
          <button 
            className="approve"
            onClick={handleApprove}
          >
            Approve Content
          </button>
        </ApprovalActions>
      )}
    </Container>
  );
};

export default ReviewSystem;
