import { useCallback } from 'react';
import { usePostCreator } from '../context/PostCreatorContext';
import { 
  Post, 
  PostRevision, 
  MediaItem, 
  Comment,
  PostStatus,
  SocialPlatform 
} from '../types';

/**
 * Custom hook that provides PostCreator state and operations
 * Separates business logic from UI components
 */
export const usePostCreatorState = () => {
  const context = usePostCreator();
  
  /**
   * Create a new post with initialized values
   */
  const createNewPost = useCallback(async (title: string = 'Untitled Post') => {
    return context.createPost({
      title,
      content: '',
      contentType: 'text',
      mediaItems: [],
      tags: [],
      categories: []
    });
  }, [context]);
  
  /**
   * Get posts filtered by status
   */
  const getPostsByStatus = useCallback((status?: PostStatus) => {
    if (!status) return context.posts;
    return context.posts.filter(post => post.status === status);
  }, [context.posts]);
  
  /**
   * Update post title
   */
  const updatePostTitle = useCallback(async (postId: string, newTitle: string) => {
    if (!postId) return null;
    
    try {
      const post = context.posts.find(p => p.id === postId);
      if (!post) return null;
      
      // Use the existing updatePost action with the new title
      return await context.updatePost(postId, {
        ...post,
        title: newTitle
      });
    } catch (error) {
      console.error('Failed to update post title:', error);
      return null;
    }
  }, [context.posts, context.updatePost]);
  
  /**
   * Determine if the post can be edited
   */
  const canEditPost = useCallback((post: Post) => {
    return ['draft', 'rejected'].includes(post.status);
  }, []);
  
  /**
   * Determine if the post can be submitted for review
   */
  const canSubmitForReview = useCallback((post: Post) => {
    return ['draft', 'rejected'].includes(post.status) && 
           post.content.trim().length > 0;
  }, []);
  
  /**
   * Determine if the post can be approved
   */
  const canApprovePost = useCallback((post: Post) => {
    return post.status === 'in_review';
  }, []);
  
  /**
   * Determine if the post can be rejected
   */
  const canRejectPost = useCallback((post: Post) => {
    return post.status === 'in_review';
  }, []);
  
  /**
   * Determine if the post can be scheduled
   */
  const canSchedulePost = useCallback((post: Post) => {
    return ['approved'].includes(post.status);
  }, []);
  
  /**
   * Determine if the post can be published
   */
  const canPublishPost = useCallback((post: Post) => {
    return ['approved', 'scheduled'].includes(post.status);
  }, []);
  
  /**
   * Get revision history for the current post
   */
  const getRevisionHistory = useCallback(() => {
    if (!context.currentPost) return [];
    return context.currentPost.revisions.sort((a, b) => 
      b.revisionNumber - a.revisionNumber
    );
  }, [context.currentPost]);
  
  /**
   * Get comments for the active revision
   */
  const getRevisionComments = useCallback(() => {
    if (!context.activeRevision) return [];
    return context.activeRevision.comments;
  }, [context.activeRevision]);
  
  /**
   * Format post date for display
   */
  const formatPostDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);
  
  /**
   * Handle image upload from the editor
   */
  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    try {
      const media = await context.uploadMedia(file);
      return media.url;
    } catch (error) {
      console.error('Failed to upload image:', error);
      return '';
    }
  }, [context]);
  
  /**
   * Handle save draft action
   */
  const saveDraft = useCallback(async (content: string, mediaItems: MediaItem[]) => {
    if (!context.currentPost) return null;
    
    try {
      // Create a new revision
      const revision = await context.createRevision(
        context.currentPost.id,
        content,
        mediaItems
      );
      
      return revision;
    } catch (error) {
      console.error('Failed to save draft:', error);
      return null;
    }
  }, [context.currentPost, context]);
  
  /**
   * Handle post submission for review
   */
  const submitPostForReview = useCallback(async () => {
    if (!context.currentPost) return false;
    
    try {
      await context.submitForReview(context.currentPost.id);
      return true;
    } catch (error) {
      console.error('Failed to submit for review:', error);
      return false;
    }
  }, [context.currentPost, context]);
  
  /**
   * Switch between different modes
   */
  const switchToEditMode = useCallback(() => {
    context.setEditMode(true);
    context.setReviewMode(false);
    context.setCommentMode(false);
    context.setScheduleMode(false);
    context.setPreviewMode(false);
  }, [context]);
  
  const switchToReviewMode = useCallback(() => {
    context.setEditMode(false);
    context.setReviewMode(true);
    context.setCommentMode(false);
    context.setScheduleMode(false);
    context.setPreviewMode(false);
  }, [context]);
  
  const switchToCommentMode = useCallback(() => {
    context.setEditMode(false);
    context.setReviewMode(false);
    context.setCommentMode(true);
    context.setScheduleMode(false);
    context.setPreviewMode(false);
  }, [context]);
  
  const switchToScheduleMode = useCallback(() => {
    context.setEditMode(false);
    context.setReviewMode(false);
    context.setCommentMode(false);
    context.setScheduleMode(true);
    context.setPreviewMode(false);
  }, [context]);
  
  const switchToPreviewMode = useCallback(() => {
    context.setEditMode(false);
    context.setReviewMode(false);
    context.setCommentMode(false);
    context.setScheduleMode(false);
    context.setPreviewMode(true);
  }, [context]);
  
  /**
   * Get display text for post status
   */
  const getStatusDisplayText = useCallback((status: PostStatus): string => {
    const statusMap: Record<PostStatus, string> = {
      draft: 'Draft',
      in_review: 'In Review',
      approved: 'Approved',
      scheduled: 'Scheduled',
      published: 'Published',
      rejected: 'Rejected'
    };
    return statusMap[status] || 'Unknown';
  }, []);
  
  /**
   * Get color for post status
   */
  const getStatusColor = useCallback((status: PostStatus): string => {
    const colorMap: Record<PostStatus, string> = {
      draft: '#9E9E9E',
      in_review: '#FFA000',
      approved: '#43A047',
      scheduled: '#3949AB',
      published: '#00897B',
      rejected: '#E53935'
    };
    return colorMap[status] || '#9E9E9E';
  }, []);

  return {
    ...context,
    createNewPost,
    getPostsByStatus,
    canEditPost,
    canSubmitForReview,
    canApprovePost,
    canRejectPost,
    canSchedulePost,
    canPublishPost,
    getRevisionHistory,
    getRevisionComments,
    formatPostDate,
    handleImageUpload,
    saveDraft,
    submitPostForReview,
    switchToEditMode,
    switchToReviewMode,
    switchToCommentMode,
    switchToScheduleMode,
    switchToPreviewMode,
    getStatusDisplayText,
    getStatusColor,
    updatePostTitle
  };
};

export default usePostCreatorState;
