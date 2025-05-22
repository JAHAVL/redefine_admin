import React, { useState, useEffect, Component } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faImage, faVideo, faLayerGroup, 
  faCog, faSearch, faBell, faFilter
} from '@fortawesome/free-solid-svg-icons';

// Import path utilities and components using the centralized path management system
import { getComponentPath } from '../../utils/pathconfig';

// Import components directly for React.lazy to work properly
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';
import ImmersiveCalendar from '../../widgets/PostCreator/components/ImmersiveCalendar';
import VisualPreview from '../../widgets/PostCreator/components/VisualPreview';
import { PostCreatorProvider } from '../../widgets/PostCreator/context/PostCreatorContext';

// Error Boundary Component
class ErrorBoundary extends Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null, errorInfo: React.ErrorInfo | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    console.error("Error in component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#ffeded', 
          border: '1px solid #ff5252',
          borderRadius: '8px',
          margin: '20px',
          color: '#333'
        }}>
          <h2>Something went wrong</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            <summary>Show error details</summary>
            <p style={{ color: 'red' }}>{this.state.error && this.state.error.toString()}</p>
            <div>
              <strong>Component Stack:</strong>
              <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
            </div>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Types
interface Post {
  id: string;
  title: string;
  content: string;
  scheduledDate: string;
  platforms: string[];
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  mediaType?: 'image' | 'video' | 'carousel';
  thumbnail?: string;
  mediaItems: any[];
}

interface SchedulerHeaderProps {
  $expanded?: boolean;
}

interface CalendarViewButtonProps {
  $active?: boolean;
}

interface NavIconProps {
  $active?: boolean;
}

interface ActionButtonProps {
  $primary?: boolean;
  iconOnly?: boolean;
}

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const Header = styled.div<SchedulerHeaderProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  z-index: 10;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ActionButton = styled(motion.button)<ActionButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props: ActionButtonProps) => props.$primary ? '#1976d2' : 'white'};
  color: ${(props: ActionButtonProps) => props.$primary ? 'white' : '#666'};
  border: 1px solid ${(props: ActionButtonProps) => props.$primary ? '#1976d2' : '#e0e0e0'};
  border-radius: 8px;
  padding: ${(props: ActionButtonProps) => props.iconOnly ? '8px' : '8px 16px'};
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  gap: 8px;
  
  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }
`;

const Content = styled.div`
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  position: relative;
`;

const CalendarSection = styled.div`
  width: 68%;
  padding: 20px;
  overflow-y: auto;
  height: 100%;
`;

const PreviewSection = styled.div`
  width: 32%;
  background: linear-gradient(135deg, #f5f7fa, #e4e8f0);
  padding: 20px;
  overflow-y: auto;
  height: 100%;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.05);
`;

const SearchBar = styled.div`
  position: relative;
  margin-right: 24px;
  
  input {
    background: #f5f5f5;
    border: 1px solid #eaeaea;
    border-radius: 30px;
    padding: 8px 16px 8px 40px;
    font-size: 14px;
    width: 280px;
    transition: all 0.2s ease;
    
    &:focus {
      background: white;
      border-color: #bbdefb;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
      outline: none;
      width: 320px;
    }
  }
  
  svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
  }
`;

const IconButton = styled.button<NavIconProps>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f5f5f5;
    color: #1976d2;
  }
  
  &.active {
    background: #e3f2fd;
    color: #1976d2;
  }
`;

const NoPostsMessage = styled.div`
  text-align: center;
  margin-top: 40px;
  color: #757575;
  font-size: 16px;
  
  svg {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }
  
  .title {
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  .subtitle {
    font-size: 14px;
  }
  
  button {
    margin-top: 16px;
    background: #1976d2;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: #1565c0;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
    }
  }
`;

// Mock data
const MOCK_POSTS: Post[] = [
  {
    id: "1",
    title: "New Summer Collection",
    content: "Check out our new summer collection! Available now.",
    scheduledDate: "2025-04-25T10:00:00.000Z",
    platforms: ["instagram", "facebook"],
    status: "scheduled",
    mediaType: "image",
    thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
    mediaItems: [
      {
        id: "m1",
        type: "image",
        url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
      }
    ]
  },
  {
    id: "2",
    title: "Behind the Scenes",
    content: "Take a look behind the scenes of our latest photo shoot!",
    scheduledDate: "2025-04-26T14:30:00.000Z",
    platforms: ["instagram", "twitter"],
    status: "scheduled",
    mediaType: "carousel",
    thumbnail: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d",
    mediaItems: [
      {
        id: "m2-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d"
      },
      {
        id: "m2-2",
        type: "image",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9"
      },
      {
        id: "m2-3",
        type: "image",
        url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
      }
    ]
  },
  {
    id: "3",
    title: "Product Tutorial",
    content: "Learn how to use our best-selling product in this quick tutorial.",
    scheduledDate: "2025-04-27T18:00:00.000Z",
    platforms: ["instagram", "facebook", "twitter"],
    status: "scheduled",
    mediaType: "video",
    thumbnail: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9",
    mediaItems: [
      {
        id: "m3",
        type: "video",
        url: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9"
      }
    ]
  },
  {
    id: "4",
    title: "Customer Spotlight",
    content: "Meet Sarah, who transformed her business using our platform.",
    scheduledDate: "2025-04-28T12:15:00.000Z",
    platforms: ["facebook", "linkedin"],
    status: "scheduled",
    mediaType: "image",
    thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    mediaItems: [
      {
        id: "m4",
        type: "image",
        url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
      }
    ]
  },
  {
    id: "5",
    title: "Weekend Flash Sale",
    content: "48-hour flash sale starting now! Use code FLASH25 for 25% off everything.",
    scheduledDate: "2025-04-30T09:00:00.000Z",
    platforms: ["instagram", "facebook", "twitter", "pinterest"],
    status: "scheduled",
    mediaType: "image",
    thumbnail: "https://images.unsplash.com/photo-1607083206968-13611e3d76db",
    mediaItems: [
      {
        id: "m5",
        type: "image",
        url: "https://images.unsplash.com/photo-1607083206968-13611e3d76db"
      }
    ]
  }
];

// Main component
const VisualSchedulerPageNEW: React.FC = () => {
  console.log('Rendering VisualSchedulerPageNEW component');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // Add mock data for testing
  const [mockPosts, setMockPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'Understanding React Hooks',
      content: 'React Hooks are a powerful way to use state and lifecycle features in functional components...',
      platforms: ['facebook', 'instagram'],
      scheduledDate: new Date(2025, 3, 26, 14, 30).toISOString(),
      status: 'scheduled',
      mediaItems: [
        { id: '101', url: 'https://source.unsplash.com/random/400x300?react', type: 'image' }
      ],
      thumbnail: 'https://source.unsplash.com/random/400x300?react',
      mediaType: 'image'
    },
    {
      id: '2',
      title: 'TypeScript Best Practices',
      content: 'TypeScript enhances your JavaScript code with types to help catch errors early...',
      platforms: ['twitter', 'linkedin'],
      scheduledDate: new Date(2025, 3, 28, 10, 0).toISOString(),
      status: 'draft',
      mediaItems: [
        { id: '102', url: 'https://source.unsplash.com/random/400x300?typescript', type: 'image' }
      ],
      thumbnail: 'https://source.unsplash.com/random/400x300?typescript',
      mediaType: 'image'
    }
  ]);

  useEffect(() => {
    console.log('VisualSchedulerPageNEW mounted');
    // Here you would typically fetch the posts data
    return () => {
      console.log('VisualSchedulerPageNEW unmounted');
    };
  }, []);

  // Handle post click from calendar
  const handlePostClick = (postId: string) => {
    const post = mockPosts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
    }
  };
  
  // Handle date click from calendar
  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', format(date, 'yyyy-MM-dd'));
    // Could open a modal to create a post for this date
  };
  
  // Handle add post
  const handleAddPost = (date: Date) => {
    console.log('Add post for date:', format(date, 'yyyy-MM-dd'));
    // Could navigate to post creation page with this date pre-selected
  };
  
  // Initialize selected post
  useEffect(() => {
    if (mockPosts.length > 0 && !selectedPost) {
      setSelectedPost(mockPosts[0]);
    }
  }, [mockPosts, selectedPost]);
  
  return (
    <ErrorBoundary>
      <PostCreatorProvider>
        <MainPageTemplate pageTitle="Social Media Scheduling">
          <Container>
            <Header>
              <Title>Visual Content Calendar</Title>
              <HeaderActions>
                <SearchBar>
                  <FontAwesomeIcon icon={faSearch} />
                  <input type="text" placeholder="Search posts..." />
                </SearchBar>
                
                <IconButton>
                  <FontAwesomeIcon icon={faFilter} />
                </IconButton>
                
                <IconButton>
                  <FontAwesomeIcon icon={faBell} />
                </IconButton>
                
                <IconButton>
                  <FontAwesomeIcon icon={faCog} />
                </IconButton>
                
                <ActionButton 
                  $primary={true}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  New Post
                </ActionButton>
              </HeaderActions>
            </Header>
            
            <Content>
              {mockPosts.length > 0 ? (
                <>
                  <CalendarSection>
                    <ImmersiveCalendar 
                      posts={mockPosts}
                      onPostClick={handlePostClick}
                      onDateClick={handleDateClick}
                      onAddPost={handleAddPost}
                    />
                  </CalendarSection>
                  
                  <PreviewSection>
                    {selectedPost && (
                      <VisualPreview 
                        title={selectedPost.title}
                        content={selectedPost.content}
                        mediaItems={selectedPost.mediaItems}
                        platforms={selectedPost.platforms}
                      />
                    )}
                  </PreviewSection>
                </>
              ) : (
                <NoPostsMessage>
                  <FontAwesomeIcon icon={faLayerGroup} />
                  <div className="title">No scheduled posts</div>
                  <div className="subtitle">Start creating and scheduling content for your social media channels</div>
                  <button>
                    <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} />
                    Create your first post
                  </button>
                </NoPostsMessage>
              )}
            </Content>
          </Container>
        </MainPageTemplate>
      </PostCreatorProvider>
    </ErrorBoundary>
  );
};

export default VisualSchedulerPageNEW;
