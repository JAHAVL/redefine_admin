import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import usePostCreatorState from '../hooks/usePostCreatorState';
import { MediaItem as MediaItemType, PostRevision } from '../types';

interface PostEditorProps {
  initialContent?: string;
  initialTitle?: string;
  initialMediaItems?: MediaItemType[];
  revisions?: PostRevision[];
  onSave: (content: string | { text: string; title: string }, mediaItems?: MediaItemType[]) => void;
  collaborative?: boolean;
}

interface EditorHeaderProps {
  collapsed?: boolean;
}

interface ToolbarActionProps {
  active?: boolean;
}

interface MediaItemProps {
  selected?: boolean;
}

interface CollapsiblePanelProps {
  collapsed?: boolean;
}

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

const EditorHeader = styled.div<EditorHeaderProps>`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;

  button {
    background: none;
    border: none;
    color: #616161;
    margin-right: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #e0e0e0;
    }

    &.active {
      background-color: #e3f2fd;
      color: #1976d2;
    }
  }
  
  .separator {
    width: 1px;
    height: 20px;
    background-color: #e0e0e0;
    margin: 0 8px;
  }
`;

const ContentArea = styled.div`
  padding: 16px;
  min-height: 350px;
  outline: none;
  
  &:focus {
    border-color: #bbdefb;
  }
`;

const VersionHistoryPanel = styled.div`
  background-color: #f9f9f9;
  border-left: 1px solid #e0e0e0;
  width: 280px;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const VersionItem = styled.div<{ active: boolean }>`
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props: { active: boolean }) => props.active ? '#e3f2fd' : 'white'};
  border: 1px solid ${(props: { active: boolean }) => props.active ? '#bbdefb' : '#e0e0e0'};
  
  &:hover {
    background-color: ${(props: { active: boolean }) => props.active ? '#e3f2fd' : '#f5f5f5'};
  }
  
  .version-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    
    .version-number {
      font-weight: 500;
      color: #1976d2;
    }
    
    .version-date {
      font-size: 12px;
      color: #757575;
    }
  }
  
  .version-author {
    font-size: 13px;
    color: #616161;
    margin-bottom: 6px;
  }
  
  .version-changes {
    font-size: 12px;
    color: #757575;
  }
`;

const EditorLayout = styled.div`
  display: flex;
  height: 100%;
`;

const CollaborationIndicator = styled.div`
  display: flex;
  align-items: center;
  background-color: #e8f5e9;
  padding: 4px 12px;
  border-radius: 12px;
  margin-left: auto;
  
  .dot {
    width: 8px;
    height: 8px;
    background-color: #4caf50;
    border-radius: 50%;
    margin-right: 6px;
  }
  
  .status {
    font-size: 12px;
    color: #2e7d32;
  }
`;

const UsersCollaborating = styled.div`
  display: flex;
  margin-left: 12px;
  
  .user-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #bbdefb;
    color: #1976d2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 500;
    margin-left: -8px;
    border: 2px solid white;
    
    &:first-child {
      margin-left: 0;
    }
  }
`;

const MediaPanel = styled.div`
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  
  .media-header {
    font-weight: 500;
    margin-bottom: 12px;
    color: #424242;
  }
  
  .media-items {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .media-item {
    width: 100px;
    height: 100px;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    border: 1px solid #e0e0e0;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .media-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
      
      button {
        background: white;
        border: none;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 4px;
        cursor: pointer;
        
        &:hover {
          background-color: #f5f5f5;
        }
      }
    }
    
    &:hover .media-overlay {
      opacity: 1;
    }
  }
  
  .upload-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    border-radius: 4px;
    border: 2px dashed #e0e0e0;
    color: #9e9e9e;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      border-color: #bbdefb;
      color: #1976d2;
    }
    
    svg {
      margin-bottom: 6px;
    }
  }
`;

const HistoryButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  background-color: ${(props: { active: boolean }) => props.active ? '#e3f2fd' : 'transparent'};
  color: ${(props: { active: boolean }) => props.active ? '#1976d2' : '#616161'};
  border: 1px solid ${(props: { active: boolean }) => props.active ? '#bbdefb' : '#e0e0e0'};
  padding: 6px 12px;
  border-radius: 4px;
  margin-left: auto;
  cursor: pointer;
  font-size: 14px;
  
  svg {
    margin-right: 6px;
  }
  
  &:hover {
    background-color: ${(props: { active: boolean }) => props.active ? '#bbdefb' : '#f5f5f5'};
  }
`;

const ToolbarAction = styled.button<ToolbarActionProps>`
  background: ${(props: { active: boolean }) => props.active ? '#e3f2fd' : 'transparent'};
  border: none;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  color: ${(props: { active: boolean }) => props.active ? '#1976d2' : '#616161'};
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const CollapsiblePanel = styled.div<CollapsiblePanelProps>`
  width: ${(props: { collapsed: boolean }) => props.collapsed ? '40px' : '300px'};
  height: 100%;
  overflow: hidden;
  transition: width 0.3s ease;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
`;

const MediaItem = styled.div<MediaItemProps>`
  position: relative;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  border: 2px solid ${(props: { selected: boolean }) => props.selected ? '#2196f3' : 'transparent'};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .media-item-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    padding: 4px;
    display: flex;
    justify-content: space-between;
    
    button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 2px;
      
      &:hover {
        color: #bbdefb;
      }
    }
  }
`;

const PostEditor: React.FC<PostEditorProps> = ({ 
  initialContent = '', 
  initialTitle = '',
  initialMediaItems = [],
  revisions = [],
  onSave,
  collaborative = false
}) => {
  const [content, setContent] = useState(initialContent);
  const [mediaItems, setMediaItems] = useState<MediaItemType[]>(initialMediaItems);
  const [boldActive, setBoldActive] = useState(false);
  const [italicActive, setItalicActive] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeRevision, setActiveRevision] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Initialize editor with content and set up contentEditable
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = initialContent;
      contentRef.current.contentEditable = 'true';
    }
  }, [initialContent]);
  
  // Format text selection
  const formatText = useCallback((command: string, value: string = '') => {
    document.execCommand(command, false, value);
    
    // Update active states
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      setBoldActive(document.queryCommandState('bold'));
      setItalicActive(document.queryCommandState('italic'));
    }
  }, []);
  
  // Monitor formatting
  const checkFormatting = useCallback(() => {
    setBoldActive(document.queryCommandState('bold'));
    setItalicActive(document.queryCommandState('italic'));
  }, []);
  
  // Handle save action
  const handleSave = useCallback(() => {
    if (contentRef.current) {
      const newContent = contentRef.current.innerHTML;
      setContent(newContent);
      onSave({ text: newContent, title: initialTitle }, mediaItems);
    }
  }, [mediaItems, onSave, initialTitle]);
  
  // Simulate receiving real-time collaborators (in a real app, would use WebSockets)
  useEffect(() => {
    if (collaborative) {
      const mockCollaborators = ['Jane Smith', 'Mike Johnson'];
      setCollaborators(mockCollaborators);
    }
  }, [collaborative]);
  
  // Handle content change and focus events
  const handleContentChange = () => {
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }
  };
  
  // Handle history toggle
  const toggleHistory = () => {
    setShowHistory(prev => !prev);
  };
  
  // View a specific revision
  const viewRevision = (revisionId: string, revisionContent: string) => {
    if (contentRef.current && revisionContent) {
      contentRef.current.innerHTML = revisionContent;
      setActiveRevision(revisionId);
    }
  };
  
  // Return to current version
  const returnToCurrent = () => {
    if (contentRef.current) {
      contentRef.current.innerHTML = content;
      setActiveRevision(null);
    }
  };
  
  // Format current date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <EditorContainer>
      <EditorHeader>
        <ToolbarAction 
          active={boldActive} 
          onClick={() => formatText('bold')}
          title="Bold"
        >
          B
        </ToolbarAction>
        <ToolbarAction 
          active={italicActive} 
          onClick={() => formatText('italic')}
          title="Italic"
        >
          I
        </ToolbarAction>
        <ToolbarAction onClick={() => formatText('underline')} title="Underline">U</ToolbarAction>
        <div className="separator" />
        <ToolbarAction onClick={() => formatText('insertUnorderedList')} title="Bullet List">•</ToolbarAction>
        <ToolbarAction onClick={() => formatText('insertOrderedList')} title="Numbered List">#</ToolbarAction>
        <div className="separator" />
        <ToolbarAction onClick={() => formatText('createLink', prompt('Enter URL', 'https://') || '')} title="Insert Link">🔗</ToolbarAction>
        <ToolbarAction onClick={() => formatText('insertImage', prompt('Enter image URL', 'https://') || '')} title="Insert Image">🖼️</ToolbarAction>
        
        {collaborative && (
          <>
            <CollaborationIndicator>
              <div className="dot"></div>
              <div className="status">Live Editing</div>
            </CollaborationIndicator>
            <UsersCollaborating>
              {collaborators.map((user, index) => (
                <div key={index} className="user-avatar" title={user}>
                  {user.charAt(0)}
                </div>
              ))}
            </UsersCollaborating>
          </>
        )}
        
        <HistoryButton 
          active={showHistory} 
          onClick={toggleHistory}
        >
          {showHistory ? 'Hide' : 'Show'} History
        </HistoryButton>
      </EditorHeader>
      
      <EditorLayout>
        <ContentArea
          ref={contentRef}
          onInput={handleContentChange}
          onSelect={checkFormatting}
          onBlur={handleSave}
        />
        
        {showHistory && (
          <CollapsiblePanel collapsed={false}>
            <h3>Version History</h3>
            
            {activeRevision && (
              <button 
                onClick={returnToCurrent}
                style={{ marginBottom: 16, padding: '8px 12px' }}
              >
                Return to Current Version
              </button>
            )}
            
            {revisions.map((revision) => (
              <VersionItem 
                key={revision.id} 
                active={activeRevision === revision.id}
                onClick={() => viewRevision(revision.id, revision.content)}
              >
                <div className="version-header">
                  <div className="version-number">Version {revision.revisionNumber}</div>
                  <div className="version-date">{formatDate(revision.createdAt)}</div>
                </div>
                <div className="version-author">By {revision.createdBy}</div>
                <div className="version-changes">
                  {revision.revisionNumber > 1 ? 'Modified content' : 'Initial draft'}
                </div>
              </VersionItem>
            ))}
          </CollapsiblePanel>
        )}
      </EditorLayout>
      
      <MediaPanel>
        <div className="media-header">Media (Drag & drop to position in content)</div>
        <div className="media-items">
          {mediaItems.map((item) => (
            <MediaItem key={item.id} selected={false}>
              <img src={item.thumbnailUrl || item.url} alt={item.title || 'Media'} />
              <div className="media-item-overlay">
                <button title="Insert into content">↑</button>
                <button title="Remove">×</button>
              </div>
            </MediaItem>
          ))}
          <div className="upload-button" onClick={() => {}}>
            <div>
              <div>+</div>
              <div>Upload</div>
            </div>
          </div>
        </div>
      </MediaPanel>
    </EditorContainer>
  );
};

export default PostEditor;
