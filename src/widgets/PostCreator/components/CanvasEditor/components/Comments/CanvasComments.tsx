import React from 'react';
import { useEditor } from '../../EditorContext';
import { Comment } from '../../EditorTypes';
import {
  SidebarSection,
  SidebarSectionTitle,
  CommentsList,
  CommentItem,
  CommentHeader,
  CommentAuthor,
  CommentDate,
  CommentContent,
  CommentActions,
  CommentAction
} from '../../styled/SidebarStyles';

const CanvasComments: React.FC = () => {
  const { state, dispatch } = useEditor();
  
  const handleResolveComment = (id: string) => {
    dispatch({
      type: 'RESOLVE_COMMENT',
      payload: id
    });
  };
  
  const handleDeleteComment = (id: string) => {
    dispatch({
      type: 'DELETE_COMMENT',
      payload: id
    });
  };
  
  return (
    <SidebarSection>
      <SidebarSectionTitle>Comments</SidebarSectionTitle>
      
      {state.comments.length === 0 ? (
        <div style={{ color: '#999', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
          No comments yet. Switch to comment mode to add comments.
        </div>
      ) : (
        <CommentsList>
          {state.comments.map((comment: Comment) => (
            <CommentItem 
              key={comment.id} 
              isResolved={comment.resolved}
            >
              <CommentHeader>
                <CommentAuthor>{comment.author}</CommentAuthor>
                <CommentDate>{new Date(comment.createdAt).toLocaleString()}</CommentDate>
              </CommentHeader>
              <CommentContent>{comment.content}</CommentContent>
              <CommentActions>
                {!comment.resolved && (
                  <CommentAction onClick={() => handleResolveComment(comment.id)}>
                    Resolve
                  </CommentAction>
                )}
                <CommentAction onClick={() => handleDeleteComment(comment.id)}>
                  Delete
                </CommentAction>
              </CommentActions>
            </CommentItem>
          ))}
        </CommentsList>
      )}
    </SidebarSection>
  );
};

export default CanvasComments;
