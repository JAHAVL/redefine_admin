import { useCallback, useState, useRef } from 'react';
import { usePostCreator } from '../context/PostCreatorContext';
import { Comment } from '../types';

/**
 * Custom hook for managing the comment system
 * Handles real-time commenting similar to Figma
 */
export const useCommentSystem = () => {
  const { state, actions } = usePostCreator();
  const [activeComment, setActiveComment] = useState<Comment | null>(null);
  const [commentPosition, setCommentPosition] = useState<{ x: number; y: number } | null>(null);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  /**
   * Start adding a new comment
   */
  const startAddingComment = useCallback((e: React.MouseEvent) => {
    if (!state.isCommentMode || !contentRef.current) return;
    
    // Calculate position relative to the content container
    const rect = contentRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100; // Store as percentage
    const y = ((e.clientY - rect.top) / rect.height) * 100; // Store as percentage
    
    setCommentPosition({ x, y });
    setIsAddingComment(true);
  }, [state.isCommentMode]);

  /**
   * Cancel adding a comment
   */
  const cancelAddingComment = useCallback(() => {
    setIsAddingComment(false);
    setCommentPosition(null);
  }, []);

  /**
   * Submit a new comment
   */
  const submitComment = useCallback(async (content: string) => {
    if (!commentPosition || !state.activeRevision) return false;
    
    try {
      // Get current user info (would come from auth context in real app)
      const currentUser = {
        userId: 'user1',
        userName: 'Current User',
        userAvatar: 'https://i.pravatar.cc/150?img=1'
      };
      
      // Create the comment
      await actions.addComment(state.activeRevision.id, {
        ...currentUser,
        content,
        coordinates: commentPosition,
        resolved: false
      });
      
      // Reset state
      setIsAddingComment(false);
      setCommentPosition(null);
      
      return true;
    } catch (error) {
      console.error('Failed to add comment:', error);
      return false;
    }
  }, [commentPosition, state.activeRevision, actions]);

  /**
   * Select a comment for viewing/replying
   */
  const selectComment = useCallback((comment: Comment) => {
    setActiveComment(comment);
  }, []);

  /**
   * Clear the selected comment
   */
  const clearSelectedComment = useCallback(() => {
    setActiveComment(null);
  }, []);

  /**
   * Resolve a comment
   */
  const resolveComment = useCallback(async (commentId: string) => {
    try {
      await actions.resolveComment(commentId);
      
      // If this was the active comment, clear it
      if (activeComment?.id === commentId) {
        setActiveComment(null);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to resolve comment:', error);
      return false;
    }
  }, [activeComment, actions]);

  /**
   * Add a reply to a comment
   */
  const addReply = useCallback(async (parentId: string, content: string) => {
    if (!state.activeRevision) return false;
    
    try {
      // Get current user info (would come from auth context in real app)
      const currentUser = {
        userId: 'user1',
        userName: 'Current User',
        userAvatar: 'https://i.pravatar.cc/150?img=1'
      };
      
      // Create the reply comment
      await actions.addComment(state.activeRevision.id, {
        ...currentUser,
        content,
        parentId,
        resolved: false
      });
      
      return true;
    } catch (error) {
      console.error('Failed to add reply:', error);
      return false;
    }
  }, [state.activeRevision, actions]);

  /**
   * Get all top-level comments (no parent)
   */
  const getTopLevelComments = useCallback(() => {
    if (!state.activeRevision) return [];
    return state.activeRevision.comments.filter(comment => !comment.parentId);
  }, [state.activeRevision]);

  /**
   * Get replies for a specific comment
   */
  const getRepliesForComment = useCallback((commentId: string) => {
    if (!state.activeRevision) return [];
    return state.activeRevision.comments.filter(comment => comment.parentId === commentId);
  }, [state.activeRevision]);

  /**
   * Get total comments count
   */
  const getCommentCount = useCallback(() => {
    if (!state.activeRevision) return 0;
    return state.activeRevision.comments.length;
  }, [state.activeRevision]);

  /**
   * Get unresolved comments count
   */
  const getUnresolvedCommentCount = useCallback(() => {
    if (!state.activeRevision) return 0;
    return state.activeRevision.comments.filter(comment => !comment.resolved).length;
  }, [state.activeRevision]);

  return {
    contentRef,
    isCommentMode: state.isCommentMode,
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
    enableCommentMode: () => actions.setCommentMode(true),
    disableCommentMode: () => actions.setCommentMode(false)
  };
};

export default useCommentSystem;
