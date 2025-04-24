/**
 * Type definitions for the Locations widget
 */

/**
 * Share group interface for location sharing
 */
export interface ShareGroup {
  id: string;
  name: string;
  type: 'team' | 'department' | 'role' | 'custom';
  members?: string[];
  permission_level?: 'read' | 'write' | 'admin';
}

/**
 * Location interface
 */
export interface Location {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  max_distance_to_notify?: number;
  created_at?: string;
  updated_at?: string;
  shared?: boolean;
  access?: 'private' | 'shared' | 'public';
  shared_with?: string[];
  shared_groups?: ShareGroup[];
  created_by?: string;
  status?: 'Active' | 'Inactive' | 'Maintenance';
}

/**
 * Location form data interface
 */
export interface LocationFormData {
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  max_distance_to_notify: number | null;
  shared?: boolean;
  access?: 'private' | 'shared' | 'public';
  shared_with?: string[];
}

/**
 * View mode for locations display
 */
export type ViewMode = 'grid' | 'list';
