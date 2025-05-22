import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUpload, 
  faImage, 
  faVideo, 
  faSearch, 
  faPlay, 
  faPlus, 
  faTrash, 
  faTimes 
} from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { useEditor } from '../EditorContext';
import { MediaItem } from '../EditorTypes';
import {
  SidebarSection,
  SidebarSectionTitle,
} from '../styled/SidebarStyles';
import styled from 'styled-components';

// Media Library styled components
const MediaLibraryContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const MediaLibraryHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 0 8px;
`;

const SearchIcon = styled(FontAwesomeIcon)`
  color: #999;
  margin-right: 8px;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  padding: 8px 4px;
  outline: none;
  width: 100%;
  font-size: 14px;
`;

const MediaLibraryActions = styled.div`
  display: flex;
  margin-left: 16px;
`;

const MediaLibraryButton = styled.button`
  display: flex;
  align-items: center;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  
  svg {
    margin-right: 6px;
  }
  
  &:hover {
    background-color: #2176d6;
  }
`;

const MediaLibraryTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
`;

const MediaLibraryTab = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  background-color: ${props => props.active ? '#2196f3' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#2196f3' : 'transparent'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: ${props => props.active ? '#2196f3' : '#f5f5f5'};
  }
`;

const MediaLibraryContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
`;

const EmptyStateText = styled.div`
  margin: 16px 0;
  font-size: 16px;
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
`;

const MediaItem = styled.div`
  position: relative;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    
    > div {
      opacity: 1;
    }
  }
`;

const MediaItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MediaItemVideo = styled.div`
  width: 100%;
  height: 100%;
  background-color: #000;
  position: relative;
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlayIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 24px;
`;

const MediaItemOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 50%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const MediaItemName = styled.div`
  color: white;
  font-size: 12px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MediaItemActions = styled.div`
  display: flex;
`;

const MediaItemAction = styled.button`
  background: transparent;
  border: none;
  color: white;
  padding: 4px;
  cursor: pointer;
  
  &:hover {
    color: #4a90e2;
  }
`;

const UploadModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const UploadModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
`;

const UploadModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #eee;
`;

const UploadModalTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  
  &:hover {
    color: #999;
  }
`;

const UploadModalBody = styled.div`
  padding: 16px;
`;

const UploadDropzone = styled.div`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  
  &:hover {
    border-color: #4a90e2;
    background-color: #f8f8f8;
  }
`;

const UploadDropzoneText = styled.div`
  margin-top: 16px;
  color: #666;
  
  &.small {
    font-size: 12px;
    color: #999;
    margin-top: 8px;
  }
`;

const UploadProgress = styled.div`
  margin-top: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
  height: 20px;
  position: relative;
  overflow: hidden;
`;

const UploadProgressBar = styled.div<{ width: number }>`
  background-color: #4a90e2;
  height: 100%;
  width: ${props => props.width}%;
  transition: width 0.3s ease;
`;

const UploadProgressText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
`;

const MediaLibrary: React.FC = () => {
  const { state, dispatch } = useEditor();
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      // Check if it's an image or video
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      if (!isImage && !isVideo) return;
      
      // Create a new media item
      const mediaItem: MediaItem = {
        id: uuidv4(),
        name: file.name,
        type: isImage ? 'image' : 'video',
        url: URL.createObjectURL(file),
        size: file.size,
        createdAt: new Date().toISOString(),
        thumbnailUrl: isImage ? URL.createObjectURL(file) : '',
        favorite: false
      };
      
      // Add to library
      dispatch({ type: 'ADD_MEDIA_ITEM', payload: mediaItem });
    });
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setShowUploadModal(false);
  };
  
  const filteredMedia = activeTab === 'images' 
    ? state.mediaLibrary.images.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : state.mediaLibrary.videos.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  return (
    <SidebarSection>
      <SidebarSectionTitle>Media Library</SidebarSectionTitle>
      
      <MediaLibraryContainer>
        <MediaLibraryHeader>
          <SearchBar>
            <SearchIcon icon={faSearch} />
            <SearchInput 
              type="text" 
              placeholder="Search media..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          <MediaLibraryActions>
            <MediaLibraryButton onClick={() => setShowUploadModal(true)}>
              <FontAwesomeIcon icon={faUpload} />
              <span>Upload</span>
            </MediaLibraryButton>
          </MediaLibraryActions>
        </MediaLibraryHeader>
        
        <MediaLibraryTabs>
          <MediaLibraryTab 
            active={activeTab === 'images'} 
            onClick={() => setActiveTab('images')}
          >
            <FontAwesomeIcon icon={faImage} />
            <span>Images</span>
          </MediaLibraryTab>
          <MediaLibraryTab 
            active={activeTab === 'videos'} 
            onClick={() => setActiveTab('videos')}
          >
            <FontAwesomeIcon icon={faVideo} />
            <span>Videos</span>
          </MediaLibraryTab>
        </MediaLibraryTabs>
        
        <MediaLibraryContent>
          {filteredMedia.length === 0 ? (
            <EmptyState>
              <FontAwesomeIcon icon={activeTab === 'images' ? faImage : faVideo} size="3x" />
              <EmptyStateText>No {activeTab} found</EmptyStateText>
              <MediaLibraryButton onClick={() => setShowUploadModal(true)}>
                <FontAwesomeIcon icon={faUpload} />
                <span>Upload {activeTab}</span>
              </MediaLibraryButton>
            </EmptyState>
          ) : (
            <MediaGrid>
              {filteredMedia.map(item => (
                <MediaItem key={item.id}>
                  {item.type === 'image' ? (
                    <MediaItemImage src={item.url} alt={item.name} />
                  ) : (
                    <MediaItemVideo>
                      <video src={item.url} />
                      <PlayIcon icon={faPlay} />
                    </MediaItemVideo>
                  )}
                  <MediaItemOverlay>
                    <MediaItemName>{item.name}</MediaItemName>
                    <MediaItemActions>
                      <MediaItemAction onClick={() => {
                        // Add to canvas
                        const element = {
                          id: uuidv4(),
                          type: item.type as 'image' | 'video',
                          position: {
                            x: state.currentCanvas.width / 2 - 150,
                            y: state.currentCanvas.height / 2 - 150,
                          },
                          size: {
                            width: 300,
                            height: 300,
                          },
                          content: item.url,
                          styles: {},
                          isSelected: false,
                          isLocked: false,
                          isVisible: true,
                          name: item.name
                        };
                        dispatch({ type: 'ADD_ELEMENT', payload: element });
                      }}>
                        <FontAwesomeIcon icon={faPlus} />
                      </MediaItemAction>
                      <MediaItemAction onClick={() => {
                        // Toggle favorite
                        dispatch({ type: 'TOGGLE_FAVORITE_MEDIA', payload: item.id });
                      }}>
                        <FontAwesomeIcon icon={item.favorite ? fasStar : farStar} />
                      </MediaItemAction>
                      <MediaItemAction onClick={() => {
                        // Delete item
                        dispatch({ type: 'REMOVE_MEDIA_ITEM', payload: item.id });
                      }}>
                        <FontAwesomeIcon icon={faTrash} />
                      </MediaItemAction>
                    </MediaItemActions>
                  </MediaItemOverlay>
                </MediaItem>
              ))}
            </MediaGrid>
          )}
        </MediaLibraryContent>
        
        {showUploadModal && (
          <UploadModal>
            <UploadModalContent>
              <UploadModalHeader>
                <UploadModalTitle>Upload Media</UploadModalTitle>
                <CloseButton onClick={() => setShowUploadModal(false)}>
                  <FontAwesomeIcon icon={faTimes} />
                </CloseButton>
              </UploadModalHeader>
              <UploadModalBody>
                <UploadDropzone onClick={() => fileInputRef.current?.click()}>
                  <FontAwesomeIcon icon={faUpload} size="3x" />
                  <UploadDropzoneText>
                    Click to browse or drag files here
                  </UploadDropzoneText>
                  <UploadDropzoneText className="small">
                    Supported formats: JPG, PNG, GIF, MP4
                  </UploadDropzoneText>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileUpload}
                  />
                </UploadDropzone>
                
                {state.mediaLibrary.uploadProgress !== undefined && (
                  <UploadProgress>
                    <UploadProgressBar width={state.mediaLibrary.uploadProgress} />
                    <UploadProgressText>
                      {state.mediaLibrary.uploadProgress}%
                    </UploadProgressText>
                  </UploadProgress>
                )}
              </UploadModalBody>
            </UploadModalContent>
          </UploadModal>
        )}
      </MediaLibraryContainer>
    </SidebarSection>
  );
};

export default MediaLibrary;
