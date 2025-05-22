import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Import MainPageTemplate directly
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';

// Import types directly as they don't need path management
import { Post, PostStatus } from '../../widgets/PostCreator/types';

// Styled components
const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0;
`;

const CreateButton = styled.button`
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #1565c0;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

interface FilterButtonProps {
  active: boolean;
}

const FilterButton = styled.button<FilterButtonProps>`
  background-color: ${(props: FilterButtonProps) => props.active ? '#e3f2fd' : 'transparent'};
  color: ${(props: FilterButtonProps) => props.active ? '#1976d2' : '#616161'};
  border: 1px solid ${(props: FilterButtonProps) => props.active ? '#bbdefb' : '#e0e0e0'};
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: ${(props: FilterButtonProps) => props.active ? '#bbdefb' : '#f5f5f5'};
  }
`;

const SearchInput = styled.input`
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  flex-grow: 1;
  max-width: 300px;
  
  &:focus {
    outline: none;
    border-color: #bbdefb;
  }
`;

const PostsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px;
  color: #616161;
  font-weight: 500;
  border-bottom: 2px solid #e0e0e0;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f5f5f5;
  }
  
  cursor: pointer;
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
`;

interface StatusBadgeProps {
  status: PostStatus;
}

const StatusBadge = styled.span<StatusBadgeProps>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  background-color: ${(props: StatusBadgeProps) => {
    switch(props.status) {
      case 'draft': return '#f5f5f5';
      case 'in_review': return '#fff8e1';
      case 'approved': return '#e8f5e9';
      case 'scheduled': return '#e3f2fd';
      case 'published': return '#e8f5e9';
      case 'rejected': return '#ffebee';
      default: return '#f5f5f5';
    }
  }};
  
  color: ${(props: StatusBadgeProps) => {
    switch(props.status) {
      case 'draft': return '#757575';
      case 'in_review': return '#ff8f00';
      case 'approved': return '#43a047';
      case 'scheduled': return '#1976d2';
      case 'published': return '#2e7d32';
      case 'rejected': return '#d32f2f';
      default: return '#757575';
    }
  }};
`;

/**
 * Sample data - replace with actual data fetching
 */
const samplePosts: Post[] = [
  {
    id: '1',
    title: 'How to Boost Engagement on Social Media',
    content: '<p>Content goes here...</p>',
    contentType: 'text',
    status: 'published',
    mediaItems: [],
    createdBy: 'John Doe',
    createdAt: '2025-04-20T10:30:00Z',
    updatedAt: '2025-04-21T14:20:00Z',
    currentRevisionId: 'rev1',
    revisions: [],
    tags: ['social media', 'engagement'],
    categories: ['marketing', 'social media']
  },
  {
    id: '2',
    title: 'Upcoming Product Launch Announcement',
    content: '<p>Content goes here...</p>',
    contentType: 'mixed',
    status: 'scheduled',
    mediaItems: [],
    createdBy: 'Jane Smith',
    createdAt: '2025-04-22T09:15:00Z',
    updatedAt: '2025-04-22T16:45:00Z',
    currentRevisionId: 'rev2',
    revisions: [],
    tags: ['product', 'launch'],
    categories: ['announcements', 'products'],
    schedule: {
      id: 'sched1',
      scheduledFor: '2025-05-01T09:00:00Z',
      timezone: 'America/New_York',
      platforms: ['facebook', 'instagram', 'twitter'],
      platformSpecificSettings: {}
    }
  },
  {
    id: '3',
    title: 'Customer Success Story: XYZ Corp',
    content: '<p>Content goes here...</p>',
    contentType: 'mixed',
    status: 'in_review',
    mediaItems: [],
    createdBy: 'John Doe',
    createdAt: '2025-04-23T11:20:00Z',
    updatedAt: '2025-04-23T15:30:00Z',
    currentRevisionId: 'rev3',
    revisions: [],
    tags: ['case study', 'success story'],
    categories: ['case studies', 'customer stories']
  },
  {
    id: '4',
    title: 'Social Media Strategy for Q3',
    content: '<p>Content goes here...</p>',
    contentType: 'text',
    status: 'draft',
    mediaItems: [],
    createdBy: 'Jane Smith',
    createdAt: '2025-04-24T08:45:00Z',
    updatedAt: '2025-04-24T08:45:00Z',
    currentRevisionId: 'rev4',
    revisions: [],
    tags: ['strategy', 'planning'],
    categories: ['planning', 'strategy']
  }
];

/**
 * AllPostsPageNEW Component
 * 
 * Display a list of all posts with filtering and search capabilities
 */
const AllPostsPageNEW: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [activeFilter, setActiveFilter] = useState<PostStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load posts (simulated)
  useEffect(() => {
    // In a real app, this would fetch from an API
    setPosts(samplePosts);
    setFilteredPosts(samplePosts);
  }, []);
  
  // Filter posts when filter or search changes
  useEffect(() => {
    let result = posts;
    
    // Apply status filter
    if (activeFilter !== 'all') {
      result = result.filter(post => post.status === activeFilter);
    }
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(term) || 
        post.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredPosts(result);
  }, [activeFilter, searchTerm, posts]);
  
  // Handle filter change
  const handleFilterChange = (filter: PostStatus | 'all') => {
    setActiveFilter(filter);
  };
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Navigate to create new post
  const handleCreateNew = () => {
    navigate('/post-creator/new');
  };
  
  // Navigate to post detail
  const handlePostClick = (postId: string) => {
    navigate(`/post-creator/${postId}`);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <MainPageTemplate pageTitle="Content Posts">
      <Container>
        <Header>
          <Title>Content Posts</Title>
          <CreateButton onClick={handleCreateNew}>Create New</CreateButton>
        </Header>
        
        <FilterBar>
          <FilterButton 
            active={activeFilter === 'all'} 
            onClick={() => handleFilterChange('all')}
          >
            All
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'draft'} 
            onClick={() => handleFilterChange('draft')}
          >
            Drafts
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'in_review'} 
            onClick={() => handleFilterChange('in_review')}
          >
            In Review
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'approved'} 
            onClick={() => handleFilterChange('approved')}
          >
            Approved
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'scheduled'} 
            onClick={() => handleFilterChange('scheduled')}
          >
            Scheduled
          </FilterButton>
          <FilterButton 
            active={activeFilter === 'published'} 
            onClick={() => handleFilterChange('published')}
          >
            Published
          </FilterButton>
          
          <SearchInput 
            type="text" 
            placeholder="Search posts..." 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </FilterBar>
        
        <PostsTable>
          <thead>
            <tr>
              <TableHeader>Title</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Created</TableHeader>
              <TableHeader>Updated</TableHeader>
              <TableHeader>Author</TableHeader>
              <TableHeader>Tags</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map(post => (
              <TableRow key={post.id} onClick={() => handlePostClick(post.id)}>
                <TableCell>{post.title}</TableCell>
                <TableCell>
                  <StatusBadge status={post.status}>
                    {post.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </StatusBadge>
                </TableCell>
                <TableCell>{formatDate(post.createdAt)}</TableCell>
                <TableCell>{formatDate(post.updatedAt)}</TableCell>
                <TableCell>{post.createdBy}</TableCell>
                <TableCell>{post.tags.join(', ')}</TableCell>
              </TableRow>
            ))}
            {filteredPosts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                  No posts found matching the current filters.
                </TableCell>
              </TableRow>
            )}
          </tbody>
        </PostsTable>
      </Container>
    </MainPageTemplate>
  );
};

export default AllPostsPageNEW;
