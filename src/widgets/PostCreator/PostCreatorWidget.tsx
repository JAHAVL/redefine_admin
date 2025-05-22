import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { PostCreatorProvider } from './context/PostCreatorContext';
import usePostCreatorState from './hooks/usePostCreatorState';
import MainLayout from './layouts/MainLayout';
import PostEditor from './components/PostEditor';
import CommentSystem from './components/CommentSystem';
import ScheduleManager from './components/ScheduleManager';

// Styled components for the widget
const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ToolbarActions = styled.div`
  display: flex;
  gap: 10px;
`;

interface ActionButtonProps {
  active?: boolean;
  primary?: boolean;
}

const ActionButton = styled.button<ActionButtonProps>`
  background-color: ${(props: ActionButtonProps) => props.primary ? '#1976d2' : props.active ? '#e3f2fd' : 'transparent'};
  color: ${(props: ActionButtonProps) => props.primary ? 'white' : props.active ? '#1976d2' : '#616161'};
  border: 1px solid ${(props: ActionButtonProps) => props.primary ? '#1976d2' : props.active ? '#bbdefb' : '#e0e0e0'};
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: ${(props: ActionButtonProps) => props.primary ? '#1565c0' : props.active ? '#bbdefb' : '#f5f5f5'};
  }
  
  &:disabled {
    background-color: #f5f5f5;
    color: #bdbdbd;
    border-color: #e0e0e0;
    cursor: not-allowed;
  }
  
  svg {
    margin-right: 6px;
  }
`;

interface StatusIndicatorProps {
  status: string;
}

const StatusIndicator = styled.div<StatusIndicatorProps>`
  display: flex;
  align-items: center;
  
  .status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${(props: StatusIndicatorProps) => props.status};
    margin-right: 8px;
  }
  
  .status-text {
    font-size: 14px;
    color: #616161;
  }
`;

const PostTitleInput = styled.input`
  font-size: 24px;
  font-weight: 500;
  border: none;
  outline: none;
  padding: 8px 0;
  margin-bottom: 16px;
  width: 100%;
  
  &:focus {
    border-bottom: 2px solid #1976d2;
  }
  
  &::placeholder {
    color: #bdbdbd;
  }
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .info {
    display: flex;
    align-items: center;
    color: #757575;
    font-size: 12px;
    
    .separator {
      margin: 0 8px;
    }
  }
  
  .actions {
    display: flex;
    gap: 10px;
  }
`;

/**
 * Internal widget component that uses the context
 */
const PostCreatorContent: React.FC = () => {
  const {
    currentPost,
    activeRevision,
    isEditMode,
    isCommentMode,
    isReviewMode,
    isScheduleMode,
    isPreviewMode,
    updatePostTitle,
    switchToEditMode,
    switchToCommentMode,
    switchToReviewMode,
    switchToScheduleMode,
    switchToPreviewMode,
    saveDraft,
    submitPostForReview,
    approvePost,
    rejectPost,
    getStatusDisplayText,
    getStatusColor,
    formatPostDate,
    createNewPost
  } = usePostCreatorState();
  
  const [title, setTitle] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Initialize state from current post
  useEffect(() => {
    if (currentPost) {
      setTitle(currentPost.title);
    } else {
      // Create a new post if none exists
      createNewPost();
    }
  }, [currentPost, createNewPost]);
  
  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (currentPost) {
      updatePostTitle(currentPost.id, e.target.value);
    }
  };
  
  // Handle saving content
  const handleSaveContent = async (
    content: string | { text: string; title: string }, 
    mediaItems?: any[]
  ) => {
    if (currentPost) {
      const contentString = typeof content === 'string' ? content : content.text;
      // If content has a title property, update the post title
      if (typeof content === 'object' && content.title) {
        updatePostTitle(currentPost.id, content.title);
        setTitle(content.title);
      }
      await saveDraft(contentString, mediaItems || []);
    }
  };
  
  // Toolbar content
  const renderToolbarContent = () => (
    <Toolbar>
      <div>
        {currentPost && (
          <StatusIndicator status={getStatusColor(currentPost.status)}>
            <div className="status-dot"></div>
            <div className="status-text">{getStatusDisplayText(currentPost.status)}</div>
          </StatusIndicator>
        )}
      </div>
      
      <ToolbarActions>
        <ActionButton 
          active={isEditMode} 
          onClick={switchToEditMode}
          disabled={currentPost?.status === 'published'}
        >
          Edit
        </ActionButton>
        
        <ActionButton 
          active={isCommentMode} 
          onClick={switchToCommentMode}
        >
          Comment
        </ActionButton>
        
        <ActionButton 
          active={isReviewMode} 
          onClick={switchToReviewMode}
        >
          Review
        </ActionButton>
        
        <ActionButton 
          active={isScheduleMode} 
          onClick={switchToScheduleMode}
          disabled={!currentPost || currentPost.status !== 'approved'}
        >
          Schedule
        </ActionButton>
        
        <ActionButton 
          active={isPreviewMode} 
          onClick={switchToPreviewMode}
        >
          Preview
        </ActionButton>
        
        {currentPost?.status === 'draft' && (
          <ActionButton 
            primary 
            onClick={() => submitPostForReview()}
          >
            Submit for Review
          </ActionButton>
        )}
        
        {currentPost?.status === 'in_review' && (
          <>
            <ActionButton 
              onClick={() => rejectPost(currentPost.id, "Rejected by reviewer")}
            >
              Reject
            </ActionButton>
            <ActionButton 
              primary
              onClick={() => approvePost(currentPost.id)}
            >
              Approve
            </ActionButton>
          </>
        )}
      </ToolbarActions>
    </Toolbar>
  );
  
  // Main content based on current mode
  const renderMainContent = () => (
    <div>
      <PostTitleInput
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Enter post title"
        readOnly={!isEditMode || currentPost?.status === 'published'}
      />
      
      <div ref={contentRef}>
        {isEditMode && (
          <PostEditor
            initialContent={activeRevision?.content || ''}
            initialMediaItems={activeRevision?.mediaItems || []}
            onSave={handleSaveContent}
          />
        )}
        
        {isPreviewMode && activeRevision && (
          <div 
            style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
            dangerouslySetInnerHTML={{ __html: activeRevision.content }}
          />
        )}
        
        {!isEditMode && !isPreviewMode && activeRevision && (
          <div 
            style={{ padding: '20px', border: '1px solid #e0e0e0', borderRadius: '4px' }}
            dangerouslySetInnerHTML={{ __html: activeRevision.content }}
          />
        )}
      </div>
    </div>
  );
  
  // Sidebar content based on current mode
  const renderSidebarContent = () => {
    if (isCommentMode) {
      return <CommentSystem contentRef={contentRef} />;
    }
    
    if (isScheduleMode) {
      return <ScheduleManager />;
    }
    
    return null;
  };
  
  // Status bar content
  const renderStatusBarContent = () => (
    <StatusBar>
      <div className="info">
        {currentPost && activeRevision && (
          <>
            <span>Last edited: {formatPostDate(activeRevision.createdAt)}</span>
            <span className="separator">•</span>
            <span>Revision: #{activeRevision.revisionNumber}</span>
          </>
        )}
      </div>
      
      <div className="actions">
        {isEditMode && (
          <ActionButton
            onClick={() => {
              if (contentRef.current && currentPost) {
                handleSaveContent(contentRef.current.innerHTML, activeRevision?.mediaItems || []);
              }
            }}
          >
            Save Draft
          </ActionButton>
        )}
      </div>
    </StatusBar>
  );
  
  return (
    <MainLayout
      toolbarContent={renderToolbarContent()}
      mainContent={renderMainContent()}
      sidebarContent={renderSidebarContent()}
      statusBarContent={renderStatusBarContent()}
    />
  );
};

/**
 * PostCreatorWidget is the main entry point for the post creation and management system
 */
interface PostCreatorWidgetProps {
  initialMode?: 'edit' | 'comment' | 'review' | 'schedule' | 'preview';
  postId?: string;
}

const PostCreatorWidget: React.FC<PostCreatorWidgetProps> = ({ initialMode, postId }) => {
  return (
    <Container>
      <PostCreatorProvider initialPostId={postId} initialMode={initialMode}>
        <PostCreatorContent />
      </PostCreatorProvider>
    </Container>
  );
};

export default PostCreatorWidget;
