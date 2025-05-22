import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faSearch, faFilter, faSortAmountDown, 
  faClock, faEye, faEdit, faTrash, faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';

// Import components
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';
import { PostCreatorProvider } from '../../widgets/PostCreator/context/PostCreatorContext';
import { usePostCreatorState } from '../../widgets/PostCreator/hooks/usePostCreatorState';

// Types
interface Post {
  id: string;
  title: string;
  content: string;
  scheduledDate: string | null;
  platforms: string[];
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  mediaType?: 'image' | 'video' | 'carousel';
  thumbnail?: string;
  mediaItems: any[];
  lastEdited?: string;
  author?: string;
}

// Mock data
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Summer Product Launch',
    content: 'Introducing our new summer collection! Check out the latest styles at our website.',
    platforms: ['instagram', 'facebook'],
    scheduledDate: null,
    status: 'draft',
    mediaType: 'image',
    thumbnail: 'https://source.unsplash.com/random/400x300?summer',
    mediaItems: [{id: '1a', url: 'https://source.unsplash.com/random/800x600?summer', type: 'image'}],
    lastEdited: new Date(2025, 3, 23, 14, 30).toISOString(),
    author: 'Jordan H.'
  },
  {
    id: '2',
    title: 'Customer Testimonial Video',
    content: 'Hear what our customers are saying about our services!',
    platforms: ['facebook', 'linkedin'],
    scheduledDate: new Date(2025, 4, 5, 10, 0).toISOString(),
    status: 'scheduled',
    mediaType: 'video',
    thumbnail: 'https://source.unsplash.com/random/400x300?testimonial',
    mediaItems: [{id: '2a', url: 'https://example.com/video1.mp4', type: 'video'}],
    lastEdited: new Date(2025, 3, 22, 16, 45).toISOString(),
    author: 'Sarah L.'
  },
  {
    id: '3',
    title: 'Industry Conference Highlights',
    content: 'We had a great time at the annual industry conference. Here are some highlights!',
    platforms: ['twitter', 'linkedin', 'instagram'],
    scheduledDate: new Date(2025, 3, 18, 12, 0).toISOString(),
    status: 'published',
    mediaType: 'carousel',
    thumbnail: 'https://source.unsplash.com/random/400x300?conference',
    mediaItems: [
      {id: '3a', url: 'https://source.unsplash.com/random/800x600?conference1', type: 'image'},
      {id: '3b', url: 'https://source.unsplash.com/random/800x600?conference2', type: 'image'},
      {id: '3c', url: 'https://source.unsplash.com/random/800x600?conference3', type: 'image'}
    ],
    lastEdited: new Date(2025, 3, 15, 9, 20).toISOString(),
    author: 'Alex T.'
  },
  {
    id: '4',
    title: 'Weekly Tip: Productivity Hacks',
    content: 'Boost your productivity with these 5 simple tips from our experts.',
    platforms: ['instagram', 'twitter'],
    scheduledDate: null,
    status: 'draft',
    mediaType: 'image',
    thumbnail: 'https://source.unsplash.com/random/400x300?productivity',
    mediaItems: [{id: '4a', url: 'https://source.unsplash.com/random/800x600?productivity', type: 'image'}],
    lastEdited: new Date(2025, 3, 24, 11, 15).toISOString(),
    author: 'Jordan H.'
  },
  {
    id: '5',
    title: 'New Office Grand Opening',
    content: 'We\'re excited to announce the opening of our new headquarters!',
    platforms: ['facebook', 'linkedin', 'instagram'],
    scheduledDate: new Date(2025, 5, 2, 14, 0).toISOString(),
    status: 'scheduled',
    mediaType: 'video',
    thumbnail: 'https://source.unsplash.com/random/400x300?office',
    mediaItems: [{id: '5a', url: 'https://example.com/video2.mp4', type: 'video'}],
    lastEdited: new Date(2025, 3, 21, 13, 10).toISOString(),
    author: 'Taylor R.'
  },
  {
    id: '6',
    title: 'Holiday Special Promotion',
    content: 'Get 25% off all products for the upcoming holiday season! Limited time offer.',
    platforms: ['facebook', 'instagram'],
    scheduledDate: new Date(2025, 4, 15, 9, 30).toISOString(),
    status: 'scheduled',
    mediaType: 'image',
    thumbnail: 'https://source.unsplash.com/random/400x300?holiday',
    mediaItems: [{id: '6a', url: 'https://source.unsplash.com/random/800x600?holiday', type: 'image'}],
    lastEdited: new Date(2025, 3, 20, 15, 45).toISOString(),
    author: 'Jordan H.'
  }
];

// Styled Components
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f9fafc;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

interface ActionButtonProps {
  $primary?: boolean;
  iconOnly?: boolean;
}

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

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 8px 16px;
  width: 300px;
  
  svg {
    color: #999;
    margin-right: 10px;
  }
  
  input {
    border: none;
    background: transparent;
    width: 100%;
    outline: none;
    font-size: 14px;
    color: #333;
    
    &::placeholder {
      color: #999;
    }
  }
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
`;

const FilterOptions = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  padding: 6px 12px;
  background: ${props => props.$active ? '#e3f2fd' : 'white'};
  color: ${props => props.$active ? '#1976d2' : '#666'};
  border: 1px solid ${props => props.$active ? '#1976d2' : '#e0e0e0'};
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.$active ? '#e3f2fd' : '#f5f5f5'};
  }
`;

const SortDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const SortButton = styled.button`
  padding: 6px 12px;
  background: white;
  color: #666;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const PostCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }
`;

const PostThumbnail = styled.div<{ $mediaType?: string }>`
  height: 180px;
  background-size: cover;
  background-position: center;
  background-color: #f5f5f5;
  position: relative;
  
  &::after {
    content: '${props => props.$mediaType === 'video' ? 'VIDEO' : 
      props.$mediaType === 'carousel' ? 'CAROUSEL' : ''}';
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    display: ${props => props.$mediaType === 'image' ? 'none' : 'block'};
  }
`;

const PostInfo = styled.div`
  padding: 16px;
`;

const PostTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostContent = styled.p`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

const PostDate = styled.div`
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const PostPlatforms = styled.div`
  display: flex;
  gap: 8px;
`;

const PlatformIcon = styled.div<{ $platform: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  
  background-color: ${props => {
    switch(props.$platform) {
      case 'facebook': return '#4267B2';
      case 'instagram': return '#E1306C';
      case 'twitter': return '#1DA1F2';
      case 'linkedin': return '#0077B5';
      default: return '#999';
    }
  }};
  color: white;
`;

const StatusBadge = styled.div<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  
  background-color: ${props => {
    switch(props.$status) {
      case 'draft': return '#FFECB3';
      case 'scheduled': return '#E3F2FD';
      case 'published': return '#E8F5E9';
      case 'failed': return '#FFEBEE';
      default: return '#f5f5f5';
    }
  }};
  
  color: ${props => {
    switch(props.$status) {
      case 'draft': return '#FFA000';
      case 'scheduled': return '#1976D2';
      case 'published': return '#388E3C';
      case 'failed': return '#D32F2F';
      default: return '#666';
    }
  }};
`;

const PostActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const PostActionButton = styled.button`
  background: transparent;
  border: none;
  color: #666;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: #f5f5f5;
    color: #1976d2;
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
`;

const AuthorAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #1976d2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
`;

const AuthorName = styled.span`
  font-size: 12px;
  color: #666;
`;

// Main Component
const AllDraftsPageNEW: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Filter posts based on status and search term
  const filteredPosts = posts.filter(post => {
    // Filter by status
    if (filter !== 'all' && post.status !== filter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !post.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !post.content.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Handle creating a new post
  const handleCreatePost = () => {
    navigate('/content-creator/new');
  };
  
  // Handle editing a post
  const handleEditPost = (id: string) => {
    navigate(`/content-creator/edit/${id}`);
  };
  
  // Handle scheduling a post
  const handleSchedulePost = (id: string) => {
    navigate(`/content-creator/schedule/${id}`);
  };
  
  // Handle deleting a post (in a real app, you'd confirm this action)
  const handleDeletePost = (id: string) => {
    setPosts(posts.filter(post => post.id !== id));
  };
  
  // Platform icon mapping
  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'facebook': return faFacebookF;
      case 'instagram': return faInstagram;
      case 'twitter': return faTwitter;
      case 'linkedin': return faLinkedinIn;
      default: return null;
    }
  };
  
  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled';
    return format(new Date(dateString), 'MMM dd, yyyy • h:mm a');
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <PostCreatorProvider>
      <MainPageTemplate pageTitle="Content Creator">
        <Container>
          <Header>
            <Title>All Content</Title>
            <HeaderActions>
              <SearchBar>
                <FontAwesomeIcon icon={faSearch} />
                <input 
                  type="text" 
                  placeholder="Search posts..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </SearchBar>
              
              <ActionButton 
                $primary 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCreatePost}
              >
                <FontAwesomeIcon icon={faPlus} />
                Create New
              </ActionButton>
            </HeaderActions>
          </Header>
          
          <FilterBar>
            <FilterOptions>
              <FilterButton 
                $active={filter === 'all'} 
                onClick={() => setFilter('all')}
              >
                All
              </FilterButton>
              <FilterButton 
                $active={filter === 'draft'} 
                onClick={() => setFilter('draft')}
              >
                Drafts
              </FilterButton>
              <FilterButton 
                $active={filter === 'scheduled'} 
                onClick={() => setFilter('scheduled')}
              >
                Scheduled
              </FilterButton>
              <FilterButton 
                $active={filter === 'published'} 
                onClick={() => setFilter('published')}
              >
                Published
              </FilterButton>
            </FilterOptions>
            
            <SortDropdown>
              <SortButton>
                <FontAwesomeIcon icon={faSortAmountDown} />
                Sort: Latest edited
              </SortButton>
            </SortDropdown>
          </FilterBar>
          
          <Content>
            <PostGrid>
              {filteredPosts.map(post => (
                <PostCard key={post.id} onClick={() => handleEditPost(post.id)}>
                  <PostThumbnail 
                    style={{ backgroundImage: `url(${post.thumbnail})` }}
                    $mediaType={post.mediaType}
                  />
                  <PostInfo>
                    <StatusBadge $status={post.status}>
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </StatusBadge>
                    <PostTitle>{post.title}</PostTitle>
                    <PostContent>{post.content}</PostContent>
                    
                    <PostPlatforms>
                      {post.platforms.map(platform => (
                        <PlatformIcon key={platform} $platform={platform}>
                          <FontAwesomeIcon icon={getPlatformIcon(platform) || faPlus} />
                        </PlatformIcon>
                      ))}
                    </PostPlatforms>
                    
                    <PostMeta>
                      <PostDate>
                        <FontAwesomeIcon icon={post.scheduledDate ? faCalendarAlt : faClock} />
                        {post.scheduledDate 
                          ? formatDate(post.scheduledDate)
                          : 'Draft'}
                      </PostDate>
                    </PostMeta>
                    
                    {post.author && (
                      <AuthorInfo>
                        <AuthorAvatar>
                          {getInitials(post.author)}
                        </AuthorAvatar>
                        <AuthorName>
                          Last edited by {post.author}
                        </AuthorName>
                      </AuthorInfo>
                    )}
                    
                    <PostActions onClick={(e) => e.stopPropagation()}>
                      <PostActionButton onClick={() => handleEditPost(post.id)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </PostActionButton>
                      <PostActionButton onClick={() => handleSchedulePost(post.id)}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </PostActionButton>
                      <PostActionButton onClick={() => handleDeletePost(post.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </PostActionButton>
                    </PostActions>
                  </PostInfo>
                </PostCard>
              ))}
            </PostGrid>
          </Content>
        </Container>
      </MainPageTemplate>
    </PostCreatorProvider>
  );
};

export default AllDraftsPageNEW;
