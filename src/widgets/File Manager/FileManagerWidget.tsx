import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Tag, File } from './types';
import theme from './theme';
import { TagLibrary } from './components/TagLibrary';
import FileGroupAccess from './components/FileGroupAccess';
import './FileManagerWidget.css';

// File type icons
import folderIcon from './components/assets/folder.svg';
import fileIcon from './components/assets/file.svg';
import pdfIcon from './components/assets/pdf.svg';
import imageIcon from './components/assets/image.svg';
import docIcon from './components/assets/doc.svg';
import excelIcon from './components/assets/excel.svg';

// Import styled components
import {
  FileManagerContainer,
  FileManagerHeader,
  FileManagerBreadcrumb,
  BreadcrumbButton,
  BreadcrumbText,
  FileManagerSearch,
  SearchInput,
  FileManagerActionsTop,
  ActionButton,
  UploadButton,
  ViewOptionsContainer,
  ViewOptionButton,
  FileManagerActions,
  DeleteButton,
  ShareButton,
  FileManagerContent,
  FileListHeader,
  FileListHeaderItem,
  SortIndicator,
  FileList,
  DropOverlay,
  DropOverlayText,
  EmptyState,
  FileItem,
  FileIcon,
  FileInfo,
  FileName,
  FileModified,
  FileSize,
  FileShared,
  FileTags,
  FileTag,
  GridContainer,
  GridItem,
  GridIcon,
  GridInfo,
  GridName,
  GridDetails,
  GridTags
} from './FileManagerWidgetStyled';

// Use require for react-dropzone to avoid TypeScript errors
const { useDropzone } = require('react-dropzone');

// Mock data for initial files
const initialFiles = [
  { id: '1', name: 'Documents', type: 'folder', size: null, modified: '2025-04-05', tags: [], path: '/Documents', shared: true, sharedWith: ['group-1', 'group-2'] },
  { id: '2', name: 'Images', type: 'folder', size: null, modified: '2025-04-04', tags: ['Important'], path: '/Images', shared: false },
  { id: '3', name: 'Project Plan.pdf', type: 'pdf', size: 1024 * 1024 * 2.5, modified: '2025-04-03', tags: ['Draft'], path: '/', shared: true, sharedWith: ['group-3'] },
  { id: '4', name: 'Meeting Notes.docx', type: 'doc', size: 1024 * 512, modified: '2025-04-02', tags: ['Team'], path: '/', shared: true, sharedWith: ['group-1'] },
  { id: '5', name: 'Budget.xlsx', type: 'excel', size: 1024 * 256, modified: '2025-04-01', tags: ['Finance', 'Confidential'], path: '/', shared: false },
  { id: '6', name: 'Logo.png', type: 'image', size: 1024 * 1024, modified: '2025-03-28', tags: ['Design'], path: '/Images', shared: true, sharedWith: ['group-4'] },
  { id: '7', name: 'Profile.jpg', type: 'image', size: 1024 * 768, modified: '2025-03-27', tags: [], path: '/Images', shared: false },
  { id: '8', name: 'Resume.pdf', type: 'pdf', size: 1024 * 1024, modified: '2025-03-26', tags: ['HR'], path: '/Documents', shared: false },
  { id: '9', name: 'Contract.docx', type: 'doc', size: 1024 * 384, modified: '2025-03-25', tags: ['Legal'], path: '/Documents', shared: true, sharedWith: ['group-2'] },
  { id: '10', name: 'Presentation.pptx', type: 'doc', size: 1024 * 1024 * 5, modified: '2025-03-24', tags: ['Marketing', 'Final'], path: '/Documents', shared: false },
];

// File Manager Widget Component
const FileManagerWidget: React.FC = () => {
  // Initialize files from localStorage or use initialFiles if none exist
  const [files, setFiles] = useState<File[]>(() => {
    const savedFiles = localStorage.getItem('fileManagerFiles');
    if (savedFiles) {
      try {
        return JSON.parse(savedFiles);
      } catch (e) {
        console.error('Error parsing saved files:', e);
        return initialFiles;
      }
    }
    return initialFiles;
  });
  const [tags, setTags] = useState<Tag[]>([
    { id: '1', name: 'Important', color: '#ff0000' },
    { id: '2', name: 'Draft', color: '#ffa500' },
    { id: '3', name: 'Final', color: '#00ff00' },
    { id: '4', name: 'Team', color: '#0000ff' },
    { id: '5', name: 'Design', color: '#800080' },
  ]);
  const [currentFolder, setCurrentFolder] = useState('/');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'size'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('New Folder');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const newFolderInputRef = useRef<HTMLInputElement>(null);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => {
      const fileType = getFileType(file.name);
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: fileType,
        size: file.size ? Number((file.size / (1024 * 1024)).toFixed(1)) : null, // Convert to MB if size exists
        modified: new Date().toISOString().split('T')[0],
        tags: [],
        path: currentFolder
      };
    });
    
    // Update files state with the new files
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    
    // Save to localStorage
    localStorage.setItem('fileManagerFiles', JSON.stringify(updatedFiles));
  }, [currentFolder, files]);

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    noClick: true, // Disable opening file dialog on click
    noKeyboard: true // Disable opening file dialog on keypress
  });

  // Get file type based on extension
  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) return 'file';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) return 'image';
    if (['pdf'].includes(extension)) return 'pdf';
    if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) return 'doc';
    if (['xls', 'xlsx', 'csv'].includes(extension)) return 'excel';
    
    return 'file';
  };

  // Get icon based on file type
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder': return folderIcon;
      case 'pdf': return pdfIcon;
      case 'image': return imageIcon;
      case 'doc': return docIcon;
      case 'excel': return excelIcon;
      default: return fileIcon;
    }
  };

  // Format file size
  const formatFileSize = (size: number | null) => {
    if (size === null) return '';
    return `${size} MB`;
  };

  // Handle file selection and folder navigation
  const handleFileSelect = (id: string, event: React.MouseEvent) => {
    // Prevent default browser behavior that might trigger Finder
    event.preventDefault();
    
    const file = files.find(f => f.id === id);
    
    // If it's a folder, navigate into it
    if (file && file.type === 'folder') {
      handleFolderOpen(id);
      return;
    }
    
    // Otherwise handle regular file selection
    if (event.ctrlKey || event.metaKey) {
      // Add or remove from selection with Ctrl/Cmd key
      setSelectedFiles(prev => 
        prev.includes(id) ? prev.filter(fileId => fileId !== id) : [...prev, id]
      );
    } else {
      // Select only this file
      setSelectedFiles([id]);
    }
  };

  // Handle folder navigation
  const handleFolderOpen = (id: string) => {
    const folder = files.find(file => file.id === id);
    if (folder && folder.type === 'folder') {
      // Create the new path by combining current folder with the folder name
      const newPath = folder.path === '/' 
        ? `/${folder.name}` 
        : `${folder.path}/${folder.name}`;
      
      // Use setTimeout to ensure proper state update and prevent Finder from opening
      setTimeout(() => {
        setCurrentFolder(newPath);
        // Clear selection when navigating
        setSelectedFiles([]);
      }, 0);
    }
  };

  // Handle navigation to parent folder
  const handleNavigateUp = () => {
    if (currentFolder === '/') return;
    
    // Extract the parent path
    const pathParts = currentFolder.split('/');
    pathParts.pop(); // Remove the last part (current folder)
    
    // If we're in a direct child of root, go to root
    if (pathParts.length <= 1) {
      setCurrentFolder('/');
    } else {
      // Otherwise, go to the parent folder
      setCurrentFolder(pathParts.join('/'));
    }
    
    // Clear selection when navigating
    setSelectedFiles([]);
  };

  // Sort files
  const sortedFiles = [...files].sort((a, b) => {
    // Folders always come first
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    
    // Then sort by the selected criteria
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    
    if (sortBy === 'modified') {
      return sortDirection === 'asc'
        ? new Date(a.modified).getTime() - new Date(b.modified).getTime()
        : new Date(b.modified).getTime() - new Date(a.modified).getTime();
    }
    
    if (sortBy === 'size') {
      // Handle null sizes (folders)
      if (a.size === null && b.size === null) return 0;
      if (a.size === null) return -1;
      if (b.size === null) return 1;
      
      return sortDirection === 'asc' ? a.size - b.size : b.size - a.size;
    }
    
    return 0;
  });

  // Filter files by search query and current folder
  const filteredFiles = sortedFiles.filter(file => {
    // For root folder, show only files directly in root
    if (currentFolder === '/') {
      return file.path === '/' && file.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    // For subfolders, show only files directly in that folder
    return file.path === currentFolder && file.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Handle sort change
  const handleSortChange = (criteria: 'name' | 'modified' | 'size') => {
    if (sortBy === criteria) {
      // Toggle direction if same criteria
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new criteria and reset direction
      setSortBy(criteria);
      setSortDirection('asc');
    }
  };

  // Handle new folder creation
  const handleCreateFolder = () => {
    setIsCreatingFolder(true);
    // Focus the input after the state update and component re-render
    setTimeout(() => {
      if (newFolderInputRef.current) {
        newFolderInputRef.current.focus();
        newFolderInputRef.current.select();
      }
    }, 50);
  };
  
  // Handle file sharing
  const handleShareFile = (fileId: string) => {
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.map(file => {
        if (file.id === fileId) {
          // Toggle shared status
          const isShared = !file.shared;
          return {
            ...file,
            shared: isShared,
            sharedWith: isShared ? file.sharedWith || ['group-1'] : []
          };
        }
        return file;
      });
      
      // Save to localStorage
      localStorage.setItem('fileManagerFiles', JSON.stringify(updatedFiles));
      
      return updatedFiles;
    });
  };
  
  // Get the currently selected file
  const getSelectedFile = () => {
    if (selectedFiles.length === 1) {
      return files.find(file => file.id === selectedFiles[0]);
    }
    return null;
  };
  
  // Open share dialog
  const handleOpenShareDialog = () => {
    // This would open a modal dialog to manage sharing
    // For now, we'll just toggle sharing
    if (selectedFiles.length === 1) {
      handleShareFile(selectedFiles[0]);
    }
  };

  // Save the new folder
  const handleSaveNewFolder = () => {
    if (newFolderName.trim()) {
      const newFolderId = `folder-${Date.now()}`;
      const newFolderPath = `${currentFolder === '/' ? '' : currentFolder}/${newFolderName.trim()}`;
      
      const newFolder = {
        id: newFolderId,
        name: newFolderName.trim(),
        type: 'folder',
        size: null,
        modified: new Date().toISOString().split('T')[0],
        tags: [],
        path: currentFolder
      };
      
      // Update files state with the new folder
      const updatedFiles = [...files, newFolder];
      setFiles(updatedFiles);
      
      // Save to localStorage
      localStorage.setItem('fileManagerFiles', JSON.stringify(updatedFiles));
      
      setIsCreatingFolder(false);
      setNewFolderName('New Folder');
      
      // Navigate into the newly created folder
      // Use setTimeout to ensure the folder is added to the files array first
      setTimeout(() => {
        setCurrentFolder(newFolderPath);
      }, 0);
    }
  };

  // Handle input change for new folder name
  const handleNewFolderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFolderName(e.target.value);
  };

  // Handle key press for new folder input
  const handleNewFolderKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveNewFolder();
    } else if (e.key === 'Escape') {
      setIsCreatingFolder(false);
      setNewFolderName('New Folder');
    }
  };

  // Cancel new folder creation when clicking outside
  // Handle adding a new tag to a file
  const handleAddNewTag = (tag: Omit<Tag, 'id'>) => {
    const newTag: Tag = {
      ...tag,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTags(prev => [...prev, newTag]);
  };

  const handleUpdateTag = (tag: Tag) => {
    setTags(prev => prev.map(t => t.id === tag.id ? tag : t));
  };

  const handleRemoveTagFromLibrary = (tagId: string) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
    // Remove this tag from all files
    setFiles(prev => prev.map(file => ({
      ...file,
      tags: file.tags.filter(id => id !== tagId)
    })));
  };

  const handleSelectTag = (tag: Tag) => {
    if (selectedFiles.length > 0) {
      handleAddTag(selectedFiles[0], tag.id);
    }
  };

  const handleAddTag = (fileId: string, tagId: string) => {
    
    setFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        // Only add the tag if it doesn't already exist
        if (!file.tags.includes(tagId)) {
          return {
            ...file,
            tags: [...file.tags, tagId]
          };
        }
      }
      return file;
    }));
    
    setNewTag('');
    setIsAddingTag(false);
  };

  // Handle removing a tag from a file
  const handleRemoveTag = (fileId: string, tagToRemove: string) => {
    setFiles(prev => prev.map(file => {
      if (file.id === fileId) {
        return {
          ...file,
          tags: file.tags.filter(tag => tag !== tagToRemove)
        };
      }
      return file;
    }));
  };

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCreatingFolder && newFolderInputRef.current && !newFolderInputRef.current.contains(e.target as Node)) {
      handleSaveNewFolder();
    }
  };

  // Render the file list based on view mode
  const renderFileList = () => {
    if (filteredFiles.length === 0 && !isCreatingFolder) {
      return (
        <EmptyState>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v2" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
          <p>No files found in this folder</p>
        </EmptyState>
      );
    }

    if (viewMode === 'grid') {
      return (
        <GridContainer>
          {isCreatingFolder && (
            <GridItem 
              key="new-folder" 
              fileType="folder" 
              selected={false}
              onClick={(e) => e.stopPropagation()}
            >
              <GridIcon>
                <img src={folderIcon} alt="folder" width="32" height="32" />
              </GridIcon>
              
              <GridInfo>
                <input
                  ref={newFolderInputRef}
                  type="text"
                  value={newFolderName}
                  onChange={handleNewFolderNameChange}
                  onKeyDown={handleNewFolderKeyPress}
                  style={{
                    background: 'rgba(52, 120, 255, 0.1)',
                    border: '1px solid #3478ff',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    color: '#fff',
                    width: '100%',
                    outline: 'none'
                  }}
                />
              </GridInfo>
            </GridItem>
          )}
          
          {filteredFiles.map(file => (
            <GridItem 
              key={file.id}
              fileType={file.type}
              selected={selectedFiles.includes(file.id)}
              onClick={(e) => handleFileSelect(file.id, e)}
            >
              <GridIcon>
                <img src={getFileIcon(file.type)} alt={file.type} width="32" height="32" />
              </GridIcon>
              
              <GridInfo>
                <GridName>
                  {file.name}
                  {file.shared && (
                    <svg 
                      width="12" 
                      height="12" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#0bb783" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      style={{ marginLeft: '4px', verticalAlign: 'middle' }}
                    >
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                  )}
                </GridName>
                <GridDetails>{file.type === 'folder' ? '--' : formatFileSize(file.size)}</GridDetails>
                {isAddingTag && selectedFiles[0] === file.id ? (
                  <GridTags>
                    <div style={{ position: 'relative', width: '0', height: '0' }}>
                      <TagLibrary
                        tags={tags}
                        onAddTag={handleAddNewTag}
                        onUpdateTag={handleUpdateTag}
                        onRemoveTag={handleRemoveTagFromLibrary}
                        onSelectTag={handleSelectTag}
                      />
                    </div>
                  </GridTags>
                ) : file.tags.length > 0 ? (
                  <GridTags>
                    {file.tags.map(tag => (
                      <FileTag 
                    key={tag} 
                    tagType={tag} 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleRemoveTag(file.id, tag); 
                    }}
                  >
                    {tag} ×
                  </FileTag>
                    ))}
                  </GridTags>
                ) : (
                  <GridTags>
                    <FileTag 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFiles([file.id]);
                        setIsAddingTag(true);
                      }}
                      data-action="add"
                    >
                      + Add Tag
                    </FileTag>
                  </GridTags>
                )}
              </GridInfo>
            </GridItem>
          ))}
        </GridContainer>
      );
    }

    return (
      <>
        {isCreatingFolder && (
          <FileItem 
            key="new-folder" 
            fileType="folder" 
            selected={false}
            onClick={(e) => e.stopPropagation()}
          >
            <FileIcon>
              <img src={folderIcon} alt="folder" width="24" height="24" />
            </FileIcon>
            
            <FileInfo>
              <input
                ref={newFolderInputRef}
                type="text"
                value={newFolderName}
                onChange={handleNewFolderNameChange}
                onKeyDown={handleNewFolderKeyPress}
                style={{
                  background: 'rgba(52, 120, 255, 0.1)',
                  border: '1px solid #3478ff',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  color: '#fff',
                  width: '100%',
                  maxWidth: '200px',
                  outline: 'none'
                }}
              />
              <div>--</div>
              <FileModified>Just now</FileModified>
              <FileSize>--</FileSize>
            </FileInfo>
          </FileItem>
        )}
        
        {filteredFiles.map(file => (
          <FileItem 
            key={file.id}
            fileType={file.type}
            selected={selectedFiles.includes(file.id)}
            onClick={(e) => handleFileSelect(file.id, e)}
          >
            <FileIcon>
              <img src={getFileIcon(file.type)} alt={file.type} width="24" height="24" />
            </FileIcon>
            
            <FileInfo>
              <FileName>{file.name}</FileName>
              <FileShared className={file.shared ? '' : 'not-shared'}>
                {file.shared ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    {file.sharedWith?.length || 1}
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Private
                  </>
                )}
              </FileShared>
              {isAddingTag && selectedFiles[0] === file.id ? (
                <FileTags>
                  <div style={{ position: 'relative', width: '0', height: '0' }}>
                    <TagLibrary
                      tags={tags}
                      onAddTag={handleAddNewTag}
                      onUpdateTag={handleUpdateTag}
                      onRemoveTag={handleRemoveTagFromLibrary}
                      onSelectTag={handleSelectTag}
                    />
                  </div>
                </FileTags>
              ) : file.tags.length > 0 ? (
                <FileTags>
                  {file.tags.map(tag => (
                    <FileTag 
                    key={tag} 
                    tagType={tag} 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleRemoveTag(file.id, tag); 
                    }}
                  >
                    {tag} ×
                  </FileTag>
                  ))}
                </FileTags>
              ) : (
                <FileTags>
                  <FileTag 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFiles([file.id]);
                      setIsAddingTag(true);
                    }}
                    data-action="add"
                  >
                    + Add Tag
                  </FileTag>
                </FileTags>
              )}
              <FileModified>{file.modified}</FileModified>
              <FileSize>{file.type === 'folder' ? '--' : formatFileSize(file.size)}</FileSize>
            </FileInfo>
          </FileItem>
        ))}
      </>
    );
  };

  return (
    <FileManagerContainer onClick={handleClickOutside}>
      <FileManagerHeader>
        <FileManagerBreadcrumb>
          <BreadcrumbButton onClick={handleNavigateUp} disabled={currentFolder === '/'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </BreadcrumbButton>
          <BreadcrumbText>{currentFolder}</BreadcrumbText>
        </FileManagerBreadcrumb>
        
        <FileManagerSearch>
          <SearchInput 
            type="text" 
            placeholder="Search files..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </FileManagerSearch>
        
        <FileManagerActionsTop>
          <ActionButton onClick={handleCreateFolder}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v2" />
              <line x1="12" y1="11" x2="12" y2="17" />
              <line x1="9" y1="14" x2="15" y2="14" />
            </svg>
            New Folder
          </ActionButton>
          
          <UploadButton {...getRootProps()}>
            <input {...getInputProps()} />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v2" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload
          </UploadButton>
        
          <ViewOptionsContainer>
            <ViewOptionButton 
              active={viewMode === 'grid'} 
              onClick={() => setViewMode('grid')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </ViewOptionButton>
            <ViewOptionButton 
              active={viewMode === 'list'} 
              onClick={() => setViewMode('list')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </ViewOptionButton>
          </ViewOptionsContainer>
        </FileManagerActionsTop>
      </FileManagerHeader>
      
      {selectedFiles.length > 0 && (
        <FileManagerActions>
          <DeleteButton>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete
          </DeleteButton>
          
          <ShareButton onClick={() => selectedFiles.length === 1 && handleShareFile(selectedFiles[0])}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            {selectedFiles.length === 1 && files.find(f => f.id === selectedFiles[0])?.shared ? 'Unshare' : 'Share'}
          </ShareButton>
        </FileManagerActions>
      )}
      
      <FileManagerContent viewMode={viewMode}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {viewMode === 'list' && (
              <FileListHeader>
                <FileListHeaderItem onClick={() => handleSortChange('name')}>
                  Name
                  {sortBy === 'name' && (
                    <SortIndicator>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </SortIndicator>
                  )}
                </FileListHeaderItem>
                <FileListHeaderItem>
                  Shared
                </FileListHeaderItem>
                <FileListHeaderItem>
                  Tags
                </FileListHeaderItem>
                <FileListHeaderItem onClick={() => handleSortChange('modified')}>
                  Modified
                  {sortBy === 'modified' && (
                    <SortIndicator>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </SortIndicator>
                  )}
                </FileListHeaderItem>
                <FileListHeaderItem onClick={() => handleSortChange('size')}>
                  Size
                  {sortBy === 'size' && (
                    <SortIndicator>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </SortIndicator>
                  )}
                </FileListHeaderItem>
              </FileListHeader>
            )}
        
            <FileList isDragActive={isDragActive} {...getRootProps()}>
              <input {...getInputProps()} />
              
              {isDragActive ? (
                <DropOverlay>
                  <DropOverlayText>Drop files here to upload</DropOverlayText>
                </DropOverlay>
              ) : (
                renderFileList()
              )}
            </FileList>
          </div>
          
          {/* File details sidebar */}
          {selectedFiles.length === 1 && getSelectedFile()?.shared && (
            <div style={{ 
              width: '280px', 
              borderLeft: `1px solid ${theme.colors.border.main}`,
              padding: theme.spacing.md,
              backgroundColor: theme.colors.background.light,
              overflow: 'auto'
            }}>
              <h3 style={{ 
                margin: 0, 
                marginBottom: theme.spacing.md, 
                fontSize: '1rem',
                color: theme.colors.text.primary 
              }}>
                Sharing Details
              </h3>
              
              <FileGroupAccess 
                file={{
                  id: getSelectedFile()!.id,
                  name: getSelectedFile()!.name,
                  type: getSelectedFile()!.type as any,
                  size: getSelectedFile()!.size,
                  modified: getSelectedFile()!.modified,
                  shared: true, // We know it's shared because of the condition above
                  access: 'shared',
                  shared_with: getSelectedFile()!.sharedWith || [],
                  // Mock data for demonstration
                  shared_groups: [
                    { id: 'group-1', name: 'Marketing Team', permission_level: 'write' },
                    { id: 'group-2', name: 'Executive Team', permission_level: 'read' }
                  ]
                }} 
                onOpenShareDialog={handleOpenShareDialog} 
              />
            </div>
          )}
        </div>
      </FileManagerContent>
    </FileManagerContainer>
  );
};

export default FileManagerWidget;
