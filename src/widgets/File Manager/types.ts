export interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface File {
  id: string;
  name: string;
  type: string;
  size: number | null;
  modified: string;
  tags: string[]; // Array of tag IDs
  path: string;
  shared?: boolean; // Whether the file is shared with others
  sharedWith?: string[]; // IDs of groups or users the file is shared with
}

export interface TagLibrary {
  tags: Tag[];
  addTag: (tag: Omit<Tag, 'id'>) => void;
  removeTag: (id: string) => void;
  updateTag: (tag: Tag) => void;
  getTag: (id: string) => Tag | undefined;
}

export interface User {
  id: string;
  name: string;
  email?: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file' | 'pdf' | 'image' | 'doc' | 'excel';
  size: number | null;
  modified: string;
  shared: boolean;
  parentId?: string;
  access: 'private' | 'shared' | 'public';
  owner_id?: string;
  shared_with?: string[];
  shared_groups?: ShareGroup[];
}

export interface ShareGroup {
  id: string;
  name: string;
  description?: string;
  owner_id?: string;
  member_count?: number;
  permission_level?: 'read' | 'write' | 'admin';
  members?: User[];
  owner?: User;
}
