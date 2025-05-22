import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';
import { 
  Post, 
  PostCreatorState, 
  PostCreatorActions, 
  MediaItem, 
  PostRevision, 
  Comment,
  PostSchedule,
  SocialPlatform,
  User
} from '../types';

// Initial state
const initialState: PostCreatorState = {
  posts: [],
  currentPost: null,
  users: [],
  selectedMediaItems: [],
  activeRevision: null,
  isEditMode: false,
  isReviewMode: false,
  isCommentMode: false,
  isScheduleMode: false,
  isPreviewMode: false,
  loading: false,
  error: null
};

// Mock data for initial development
const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    email: 'john@example.com',
    role: 'admin'
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    email: 'jane@example.com',
    role: 'creator'
  },
  {
    id: 'user3',
    name: 'Mike Johnson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    email: 'mike@example.com',
    role: 'approver'
  }
];

// Context interface
interface PostCreatorContextValue extends PostCreatorState, PostCreatorActions {
  dispatch: React.Dispatch<ActionType>;
}

// Create the context
const PostCreatorContext = createContext<PostCreatorContextValue | undefined>(undefined);

// Action types for the reducer
type ActionType = 
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'SET_CURRENT_POST'; payload: Post | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_SELECTED_MEDIA'; payload: MediaItem[] }
  | { type: 'SET_ACTIVE_REVISION'; payload: PostRevision | null }
  | { type: 'SET_EDIT_MODE'; payload: boolean }
  | { type: 'SET_REVIEW_MODE'; payload: boolean }
  | { type: 'SET_COMMENT_MODE'; payload: boolean }
  | { type: 'SET_SCHEDULE_MODE'; payload: boolean }
  | { type: 'SET_PREVIEW_MODE'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST'; payload: Post }
  | { type: 'REMOVE_POST'; payload: string }
  | { type: 'ADD_MEDIA_ITEM'; payload: MediaItem }
  | { type: 'REMOVE_MEDIA_ITEM'; payload: string }
  | { type: 'ADD_COMMENT'; payload: { revisionId: string; comment: Comment } }
  | { type: 'RESOLVE_COMMENT'; payload: string };

// Reducer function
const reducer = (state: PostCreatorState, action: ActionType): PostCreatorState => {
  switch (action.type) {
    case 'SET_POSTS':
      return { ...state, posts: action.payload };
    case 'SET_CURRENT_POST':
      return { ...state, currentPost: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_SELECTED_MEDIA':
      return { ...state, selectedMediaItems: action.payload };
    case 'SET_ACTIVE_REVISION':
      return { ...state, activeRevision: action.payload };
    case 'SET_EDIT_MODE':
      return { ...state, isEditMode: action.payload };
    case 'SET_REVIEW_MODE':
      return { ...state, isReviewMode: action.payload };
    case 'SET_COMMENT_MODE':
      return { ...state, isCommentMode: action.payload };
    case 'SET_SCHEDULE_MODE':
      return { ...state, isScheduleMode: action.payload };
    case 'SET_PREVIEW_MODE':
      return { ...state, isPreviewMode: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_POST':
      return { ...state, posts: [...state.posts, action.payload] };
    case 'UPDATE_POST':
      return { 
        ...state, 
        posts: state.posts.map(post => post.id === action.payload.id ? action.payload : post),
        currentPost: state.currentPost?.id === action.payload.id ? action.payload : state.currentPost
      };
    case 'REMOVE_POST':
      return { 
        ...state, 
        posts: state.posts.filter(post => post.id !== action.payload),
        currentPost: state.currentPost?.id === action.payload ? null : state.currentPost
      };
    case 'ADD_MEDIA_ITEM':
      return { ...state, selectedMediaItems: [...state.selectedMediaItems, action.payload] };
    case 'REMOVE_MEDIA_ITEM':
      return { ...state, selectedMediaItems: state.selectedMediaItems.filter(item => item.id !== action.payload) };
    case 'ADD_COMMENT':
      if (!state.activeRevision) return state;
      return {
        ...state,
        activeRevision: {
          ...state.activeRevision,
          comments: [...state.activeRevision.comments, action.payload.comment]
        }
      };
    case 'RESOLVE_COMMENT':
      if (!state.activeRevision) return state;
      return {
        ...state,
        activeRevision: {
          ...state.activeRevision,
          comments: state.activeRevision.comments.map(comment => 
            comment.id === action.payload ? { ...comment, resolved: true } : comment
          )
        }
      };
    default:
      return state;
  }
};

// Interface for the provider props
interface PostCreatorProviderProps {
  children: React.ReactNode;
  initialPostId?: string;
  initialMode?: 'edit' | 'comment' | 'review' | 'schedule' | 'preview';
}

// Provider component
export const PostCreatorProvider: React.FC<PostCreatorProviderProps> = ({ 
  children, 
  initialPostId,
  initialMode 
}) => {
  // Set up the state reducer
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    users: mockUsers // Add mock data for development
  });

  // Initialize with provided mode if specified
  useEffect(() => {
    if (initialMode) {
      switch (initialMode) {
        case 'edit':
          dispatch({ type: 'SET_EDIT_MODE', payload: true });
          break;
        case 'comment':
          dispatch({ type: 'SET_COMMENT_MODE', payload: true });
          break;
        case 'review':
          dispatch({ type: 'SET_REVIEW_MODE', payload: true });
          break;
        case 'schedule':
          dispatch({ type: 'SET_SCHEDULE_MODE', payload: true });
          break;
        case 'preview':
          dispatch({ type: 'SET_PREVIEW_MODE', payload: true });
          break;
      }
    } else {
      // Default to edit mode if no mode specified
      dispatch({ type: 'SET_EDIT_MODE', payload: true });
    }
  }, [initialMode]);

  // Load specific post if an ID is provided
  useEffect(() => {
    if (initialPostId) {
      // In a real app, this would be an API call
      // For now, find in mock data
      const post = state.posts.find(p => p.id === initialPostId);
      if (post) {
        dispatch({ type: 'SET_CURRENT_POST', payload: post });
        // Set active revision to the current one
        const activeRev = post.revisions.find(r => r.id === post.currentRevisionId);
        if (activeRev) {
          dispatch({ type: 'SET_ACTIVE_REVISION', payload: activeRev });
        }
      }
    }
  }, [initialPostId]);

  // Define action implementations
  const actions: PostCreatorActions = {
    createPost: async (postData) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Mock API call
        const newPost: Post = {
          id: `post-${Date.now()}`,
          title: postData.title || 'Untitled Post',
          content: postData.content || '',
          contentType: postData.contentType || 'text',
          status: 'draft',
          mediaItems: postData.mediaItems || [],
          createdBy: 'user1', // Current user ID would come from auth context
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          currentRevisionId: `rev-${Date.now()}`,
          revisions: [
            {
              id: `rev-${Date.now()}`,
              revisionNumber: 1,
              content: postData.content || '',
              mediaItems: postData.mediaItems || [],
              createdBy: 'user1',
              createdAt: new Date().toISOString(),
              comments: []
            }
          ],
          tags: postData.tags || [],
          categories: postData.categories || []
        };
        
        dispatch({ type: 'ADD_POST', payload: newPost });
        dispatch({ type: 'SET_CURRENT_POST', payload: newPost });
        dispatch({ type: 'SET_ERROR', payload: null });
        return newPost;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to create post' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    updatePost: async (id, postData) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Find the post to update
        const postToUpdate = state.posts.find(post => post.id === id);
        if (!postToUpdate) {
          throw new Error('Post not found');
        }

        // Create updated post
        const updatedPost: Post = {
          ...postToUpdate,
          ...postData,
          updatedAt: new Date().toISOString()
        };

        dispatch({ type: 'UPDATE_POST', payload: updatedPost });
        dispatch({ type: 'SET_ERROR', payload: null });
        return updatedPost;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update post' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    deletePost: async (id) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Mock API call
        dispatch({ type: 'REMOVE_POST', payload: id });
        dispatch({ type: 'SET_ERROR', payload: null });
        return true;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to delete post' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    fetchPost: async (id) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Mock API call
        const post = state.posts.find(post => post.id === id);
        if (!post) {
          throw new Error('Post not found');
        }
        dispatch({ type: 'SET_CURRENT_POST', payload: post });
        dispatch({ type: 'SET_ERROR', payload: null });
        return post;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch post' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    fetchPosts: async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Mock API call - would be replaced with real API call
        // For now just return the current posts in state
        dispatch({ type: 'SET_ERROR', payload: null });
        return state.posts;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch posts' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    setCurrentPost: (post) => {
      dispatch({ type: 'SET_CURRENT_POST', payload: post });
      // When setting current post, also set the active revision to the current one
      if (post) {
        const activeRevision = post.revisions.find(rev => rev.id === post.currentRevisionId) || null;
        dispatch({ type: 'SET_ACTIVE_REVISION', payload: activeRevision });
      } else {
        dispatch({ type: 'SET_ACTIVE_REVISION', payload: null });
      }
    },

    createRevision: async (postId, content, mediaItems) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Find the post
        const post = state.posts.find(p => p.id === postId);
        if (!post) {
          throw new Error('Post not found');
        }
        
        // Get the next revision number
        const nextRevisionNumber = post.revisions.length + 1;
        
        // Create new revision
        const newRevision: PostRevision = {
          id: `rev-${Date.now()}`,
          revisionNumber: nextRevisionNumber,
          content,
          mediaItems,
          createdBy: 'user1', // Would come from auth context
          createdAt: new Date().toISOString(),
          comments: []
        };
        
        // Update the post with the new revision
        const updatedPost: Post = {
          ...post,
          content,
          mediaItems,
          updatedAt: new Date().toISOString(),
          currentRevisionId: newRevision.id,
          revisions: [...post.revisions, newRevision]
        };
        
        dispatch({ type: 'UPDATE_POST', payload: updatedPost });
        dispatch({ type: 'SET_ACTIVE_REVISION', payload: newRevision });
        dispatch({ type: 'SET_ERROR', payload: null });
        return newRevision;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to create revision' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    addComment: async (revisionId, commentData) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Create new comment
        const newComment: Comment = {
          id: `comment-${Date.now()}`,
          userId: commentData.userId,
          userName: commentData.userName,
          userAvatar: commentData.userAvatar,
          content: commentData.content,
          timestamp: new Date().toISOString(),
          resolved: false,
          coordinates: commentData.coordinates,
          parentId: commentData.parentId,
          replies: commentData.replies || []
        };
        
        dispatch({ type: 'ADD_COMMENT', payload: { revisionId, comment: newComment } });
        dispatch({ type: 'SET_ERROR', payload: null });
        return newComment;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to add comment' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    resolveComment: async (commentId) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        dispatch({ type: 'RESOLVE_COMMENT', payload: commentId });
        dispatch({ type: 'SET_ERROR', payload: null });
        return true;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to resolve comment' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    schedulePost: async (postId, scheduleData) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Find the post
        const post = state.posts.find(p => p.id === postId);
        if (!post) {
          throw new Error('Post not found');
        }
        
        // Create new schedule
        const newSchedule: PostSchedule = {
          id: `schedule-${Date.now()}`,
          ...scheduleData
        };
        
        // Update the post with the schedule
        const updatedPost: Post = {
          ...post,
          status: 'scheduled',
          updatedAt: new Date().toISOString(),
          schedule: newSchedule
        };
        
        dispatch({ type: 'UPDATE_POST', payload: updatedPost });
        dispatch({ type: 'SET_ERROR', payload: null });
        return newSchedule;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to schedule post' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    submitForReview: async (postId) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Find the post
        const post = state.posts.find(p => p.id === postId);
        if (!post) {
          throw new Error('Post not found');
        }
        
        // Update post status
        const updatedPost: Post = {
          ...post,
          status: 'in_review',
          updatedAt: new Date().toISOString()
        };
        
        dispatch({ type: 'UPDATE_POST', payload: updatedPost });
        dispatch({ type: 'SET_ERROR', payload: null });
        return updatedPost;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to submit post for review' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    approvePost: async (postId) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Find the post
        const post = state.posts.find(p => p.id === postId);
        if (!post) {
          throw new Error('Post not found');
        }
        
        // Update post status
        const updatedPost: Post = {
          ...post,
          status: 'approved',
          updatedAt: new Date().toISOString()
        };
        
        dispatch({ type: 'UPDATE_POST', payload: updatedPost });
        dispatch({ type: 'SET_ERROR', payload: null });
        return updatedPost;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to approve post' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    rejectPost: async (postId, reason) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Find the post
        const post = state.posts.find(p => p.id === postId);
        if (!post) {
          throw new Error('Post not found');
        }
        
        // Create rejection comment
        const rejectionComment: Comment = {
          id: `comment-${Date.now()}`,
          userId: 'user1', // Would come from auth context
          userName: 'Admin',
          userAvatar: 'https://i.pravatar.cc/150?img=1',
          content: `Rejected: ${reason}`,
          timestamp: new Date().toISOString(),
          resolved: false
        };
        
        // Add comment to the current revision
        const currentRevision = post.revisions.find(rev => rev.id === post.currentRevisionId);
        if (currentRevision) {
          currentRevision.comments.push(rejectionComment);
        }
        
        // Update post status
        const updatedPost: Post = {
          ...post,
          status: 'rejected',
          updatedAt: new Date().toISOString()
        };
        
        dispatch({ type: 'UPDATE_POST', payload: updatedPost });
        dispatch({ type: 'SET_ERROR', payload: null });
        return updatedPost;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to reject post' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    publishPost: async (postId, platformIds) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Find the post
        const post = state.posts.find(p => p.id === postId);
        if (!post) {
          throw new Error('Post not found');
        }
        
        // Mock publishing to platforms
        const platforms = platformIds || (post.schedule?.platforms || ['timeline']);
        
        // Update post status
        const updatedPost: Post = {
          ...post,
          status: 'published',
          updatedAt: new Date().toISOString()
        };
        
        dispatch({ type: 'UPDATE_POST', payload: updatedPost });
        dispatch({ type: 'SET_ERROR', payload: null });
        return updatedPost;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to publish post' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    uploadMedia: async (file) => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Mock file upload - would be replaced with real API call
        // For now, just create a mock media item
        const isVideo = file.type.startsWith('video/');
        const newMedia: MediaItem = {
          id: `media-${Date.now()}`,
          type: isVideo ? 'video' : 'image',
          url: URL.createObjectURL(file), // This would be a real URL in production
          thumbnailUrl: isVideo ? URL.createObjectURL(file) : undefined,
          title: file.name,
          size: file.size,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        dispatch({ type: 'ADD_MEDIA_ITEM', payload: newMedia });
        dispatch({ type: 'SET_ERROR', payload: null });
        return newMedia;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to upload media' });
        throw error;
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    removeMedia: (mediaId) => {
      dispatch({ type: 'REMOVE_MEDIA_ITEM', payload: mediaId });
    },

    setEditMode: (isEditMode) => {
      dispatch({ type: 'SET_EDIT_MODE', payload: isEditMode });
    },

    setReviewMode: (isReviewMode) => {
      dispatch({ type: 'SET_REVIEW_MODE', payload: isReviewMode });
    },

    setCommentMode: (isCommentMode) => {
      dispatch({ type: 'SET_COMMENT_MODE', payload: isCommentMode });
    },

    setScheduleMode: (isScheduleMode) => {
      dispatch({ type: 'SET_SCHEDULE_MODE', payload: isScheduleMode });
    },

    setPreviewMode: (isPreviewMode) => {
      dispatch({ type: 'SET_PREVIEW_MODE', payload: isPreviewMode });
    }
  };

  // Return the provider with the full state and actions
  return (
    <PostCreatorContext.Provider 
      value={{
        ...state, // Spread all state properties directly
        ...actions, // Spread all action properties directly
        dispatch
      }}
    >
      {children}
    </PostCreatorContext.Provider>
  );
};

// Custom hook to use the context
export const usePostCreator = () => {
  const context = useContext(PostCreatorContext);
  if (context === undefined) {
    throw new Error('usePostCreator must be used within a PostCreatorProvider');
  }
  return context;
};
