/**
 * Type definitions for the PostCreator module
 */

/**
 * Post content types
 */
export type PostContentType = 'text' | 'image' | 'video' | 'mixed';

/**
 * Post review status
 */
export type PostStatus = 'draft' | 'in_review' | 'approved' | 'scheduled' | 'published' | 'rejected';

/**
 * Social media platforms
 */
export type SocialPlatform = 
  | 'facebook' 
  | 'instagram' 
  | 'twitter' 
  | 'youtube' 
  | 'linkedin'
  | 'pinterest'
  | 'timeline';

/**
 * Media item interface
 */
export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
  duration?: number; // For videos (in seconds)
  size: number; // File size in bytes
  createdAt: string;
  updatedAt: string;
}

/**
 * Comment interface
 */
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  resolved: boolean;
  coordinates?: { x: number; y: number }; // For pinned comments
  parentId?: string; // For threaded comments
  replies?: Comment[];
}

/**
 * Post revision interface
 */
export interface PostRevision {
  id: string;
  revisionNumber: number;
  content: string;
  mediaItems: MediaItem[];
  createdBy: string;
  createdAt: string;
  comments: Comment[];
}

/**
 * Post scheduling interface
 */
export interface PostSchedule {
  id: string;
  scheduledFor: string;
  timezone: string;
  platforms: SocialPlatform[];
  platformSpecificSettings: {
    [key in SocialPlatform]?: {
      audiences?: string[];
      customText?: string;
      hashtags?: string[];
    };
  };
}

/**
 * Post interface
 */
export interface Post {
  id: string;
  title: string;
  content: string;
  contentType: PostContentType;
  status: PostStatus;
  mediaItems: MediaItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  currentRevisionId: string;
  revisions: PostRevision[];
  schedule?: PostSchedule;
  assignedReviewers?: string[];
  tags: string[];
  categories: string[];
}

/**
 * User interface (simplified)
 */
export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: 'admin' | 'creator' | 'approver' | 'viewer';
}

/**
 * PostCreator context state interface
 */
export interface PostCreatorState {
  posts: Post[];
  currentPost: Post | null;
  users: User[];
  selectedMediaItems: MediaItem[];
  activeRevision: PostRevision | null;
  isEditMode: boolean;
  isReviewMode: boolean;
  isCommentMode: boolean;
  isScheduleMode: boolean;
  isPreviewMode: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * PostCreator context actions interface
 */
export interface PostCreatorActions {
  createPost: (postData: Partial<Post>) => Promise<Post>;
  updatePost: (id: string, postData: Partial<Post>) => Promise<Post>;
  deletePost: (id: string) => Promise<boolean>;
  fetchPost: (id: string) => Promise<Post>;
  fetchPosts: () => Promise<Post[]>;
  setCurrentPost: (post: Post | null) => void;
  createRevision: (postId: string, content: string, mediaItems: MediaItem[]) => Promise<PostRevision>;
  addComment: (revisionId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => Promise<Comment>;
  resolveComment: (commentId: string) => Promise<boolean>;
  schedulePost: (postId: string, schedule: Omit<PostSchedule, 'id'>) => Promise<PostSchedule>;
  submitForReview: (postId: string) => Promise<Post>;
  approvePost: (postId: string) => Promise<Post>;
  rejectPost: (postId: string, reason: string) => Promise<Post>;
  publishPost: (postId: string, platformIds?: SocialPlatform[]) => Promise<Post>;
  uploadMedia: (file: File) => Promise<MediaItem>;
  removeMedia: (mediaId: string) => void;
  setEditMode: (isEditMode: boolean) => void;
  setReviewMode: (isReviewMode: boolean) => void;
  setCommentMode: (isCommentMode: boolean) => void;
  setScheduleMode: (isScheduleMode: boolean) => void;
  setPreviewMode: (isPreviewMode: boolean) => void;
}
