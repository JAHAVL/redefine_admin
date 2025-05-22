/**
 * Post Creator module actions
 * These functions represent high-level actions that can be triggered by the AI
 * Each function has a clear, intent-mappable name and consistent parameter patterns
 */

import { getComponentPath } from '../../utils/pathconfig';

// Import services using the centralized path management system
const apiService = require(getComponentPath('../../', 'API_SERVICE')).default;
const navigationService = require(getComponentPath('../../', 'NAVIGATION_SERVICE')).default;
const operationService = require(getComponentPath('../../', 'OPERATION_SERVICE')).default;

import { Post, PostStatus } from './types';

// Navigation actions

/**
 * Navigate to all posts page (main content listing)
 */
export const navigateToAllPosts = () => {
  navigationService.navigateTo('/content-creator');
};

/**
 * Navigate to create new post page
 */
export const navigateToCreatePost = () => {
  navigationService.navigateTo('/content-creator/new');
};

/**
 * Navigate to edit specific post
 * @param postId ID of the post to edit
 */
export const navigateToEditPost = (postId: string) => {
  navigationService.navigateTo(`/content-creator/${postId}/edit`);
};

/**
 * Navigate to review specific post
 * @param postId ID of the post to review
 */
export const navigateToReviewPost = (postId: string) => {
  navigationService.navigateTo(`/content-creator/${postId}/review`);
};

/**
 * Navigate to schedule specific post
 * @param postId ID of the post to schedule
 */
export const navigateToSchedulePost = (postId: string) => {
  navigationService.navigateTo(`/content-creator/${postId}/schedule`);
};

// Content actions

/**
 * Create a new post
 * @param title Title of the post
 * @param content Initial content (optional)
 * @param tags Tags for the post (optional)
 * @param categories Categories for the post (optional)
 * @returns The created post
 */
export const createPost = async (
  title: string, 
  content?: string, 
  tags?: string[], 
  categories?: string[]
): Promise<Post> => {
  try {
    // Create post via API
    const response = await apiService.post('/posts', {
      title,
      content: content || '<p></p>',
      contentType: 'text',
      tags: tags || [],
      categories: categories || []
    });
    
    // Navigate to edit the new post
    if (response.success && response.data) {
      navigateToEditPost(response.data.id);
      return response.data;
    }
    
    throw new Error('Failed to create post');
  } catch (error) {
    operationService.handleError(error);
    throw error;
  }
};

/**
 * Update an existing post
 * @param postId ID of the post to update
 * @param title New title
 * @param content New content
 * @param tags New tags
 * @param categories New categories
 * @returns The updated post
 */
export const updatePost = async (
  postId: string,
  title?: string, 
  content?: string, 
  tags?: string[], 
  categories?: string[]
): Promise<Post> => {
  try {
    // Update post via API
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (tags !== undefined) updateData.tags = tags;
    if (categories !== undefined) updateData.categories = categories;
    
    const response = await apiService.put(`/posts/${postId}`, updateData);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to update post');
  } catch (error) {
    operationService.handleError(error);
    throw error;
  }
};

/**
 * Submit a post for review
 * @param postId ID of the post to submit for review
 * @returns The updated post
 */
export const submitPostForReview = async (postId: string): Promise<Post> => {
  try {
    // Submit post for review via API
    const response = await apiService.post(`/posts/${postId}/submit-for-review`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to submit post for review');
  } catch (error) {
    operationService.handleError(error);
    throw error;
  }
};

/**
 * Approve a post that is in review
 * @param postId ID of the post to approve
 * @returns The updated post
 */
export const approvePost = async (postId: string): Promise<Post> => {
  try {
    // Approve post via API
    const response = await apiService.post(`/posts/${postId}/approve`);
    
    if (response.success && response.data) {
      navigateToSchedulePost(postId);
      return response.data;
    }
    
    throw new Error('Failed to approve post');
  } catch (error) {
    operationService.handleError(error);
    throw error;
  }
};

/**
 * Reject a post that is in review
 * @param postId ID of the post to reject
 * @param reason Reason for rejection
 * @returns The updated post
 */
export const rejectPost = async (postId: string, reason: string): Promise<Post> => {
  try {
    // Reject post via API
    const response = await apiService.post(`/posts/${postId}/reject`, { reason });
    
    if (response.success && response.data) {
      navigateToAllPosts();
      return response.data;
    }
    
    throw new Error('Failed to reject post');
  } catch (error) {
    operationService.handleError(error);
    throw error;
  }
};

/**
 * Schedule a post for publishing
 * @param postId ID of the post to schedule
 * @param publishDate Date and time to publish
 * @param platforms Platforms to publish to
 * @returns The updated post
 */
export const schedulePost = async (
  postId: string, 
  publishDate: Date, 
  platforms: string[]
): Promise<Post> => {
  try {
    // Schedule post via API
    const response = await apiService.post(`/posts/${postId}/schedule`, {
      publishDate: publishDate.toISOString(),
      platforms
    });
    
    if (response.success && response.data) {
      navigateToAllPosts();
      return response.data;
    }
    
    throw new Error('Failed to schedule post');
  } catch (error) {
    operationService.handleError(error);
    throw error;
  }
};

/**
 * Delete a post
 * @param postId ID of the post to delete
 * @returns Whether the deletion was successful
 */
export const deletePost = async (postId: string): Promise<boolean> => {
  try {
    // Delete post via API
    const response = await apiService.delete(`/posts/${postId}`);
    
    if (response.success) {
      navigateToAllPosts();
      return true;
    }
    
    throw new Error('Failed to delete post');
  } catch (error) {
    operationService.handleError(error);
    throw error;
  }
};
