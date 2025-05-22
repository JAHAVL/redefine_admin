import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPencilAlt, faImage, faEye, faCalendarAlt, 
  faChevronRight, faChevronLeft, faSave, faTimes,
  faHistory, faUndo, faRedo, faCloudUploadAlt
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';

import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';
import { PostCreatorProvider } from '../../widgets/PostCreator/context/PostCreatorContext';
import { usePostCreatorState } from '../../widgets/PostCreator/hooks/usePostCreatorState';
import { CanvasEditor } from '../../widgets/PostCreator/components/CanvasEditor';
import PostEditor from '../../widgets/PostCreator/components/PostEditor';
import VisualPreview from '../../widgets/PostCreator/components/VisualPreview';
import ScheduleManager from '../../widgets/PostCreator/components/ScheduleManager';

// Mock data for a single post
interface PostData {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  scheduledDate: string | null;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  mediaType?: 'image' | 'video' | 'carousel';
  thumbnail?: string;
  mediaItems: any[];
  lastEdited: string;
  author?: string;
  revisionHistory?: Array<{
    id: string;
    date: string;
    author: string;
  }>;
  canvasData?: any;
}

const MOCK_POST: PostData = {
  id: '123',
  title: 'Summer Campaign Launch',
  content: 'Introducing our new summer collection! Check out the latest styles at our website.',
  platforms: ['instagram', 'facebook'],
  scheduledDate: null,
  status: 'draft',
  mediaType: 'image',
  thumbnail: 'https://source.unsplash.com/random/400x300?summer',
  mediaItems: [{id: '1a', url: 'https://source.unsplash.com/random/800x600?summer', type: 'image'}],
  lastEdited: new Date().toISOString(),
  author: 'Jordan H.',
  revisionHistory: [
    { id: 'rev1', date: new Date(Date.now() - 86400000).toISOString(), author: 'Jordan H.' },
    { id: 'rev2', date: new Date(Date.now() - 172800000).toISOString(), author: 'Sarah L.' }
  ]
};

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f9fafc;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Step = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  background: ${(props: { $active: boolean }) => props.$active ? '#e3f2fd' : 'transparent'};
  color: ${(props: { $active: boolean }) => props.$active ? '#1976d2' : '#666'};
  font-weight: ${(props: { $active: boolean }) => props.$active ? '500' : 'normal'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${(props: { $active: boolean }) => props.$active ? '#e3f2fd' : '#f5f5f5'};
  }
`;

const StepSeparator = styled.div`
  width: 20px;
  height: 1px;
  background: #e0e0e0;
`;

const Content = styled.div`
  flex: 1;
  padding: 24px;
  overflow: auto;
`;

const StepContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: calc(100vh - 180px);
  overflow: hidden;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: white;
  border-top: 1px solid #e0e0e0;
  margin-top: 24px;
`;

const Button = styled(motion.button)<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  
  background: ${(props: { $primary?: boolean }) => props.$primary ? '#1976d2' : 'white'};
  color: ${(props: { $primary?: boolean }) => props.$primary ? 'white' : '#666'};
  border: 1px solid ${(props: { $primary?: boolean }) => props.$primary ? '#1976d2' : '#e0e0e0'};
  
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: ${(props: { $primary?: boolean }) => props.$primary ? '#1565c0' : '#f5f5f5'};
  }
`;

const RevisionHistory = styled.div`
  position: fixed;
  top: 80px;
  right: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 280px;
  z-index: 10;
  overflow: hidden;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const RevisionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: #f9fafc;
`;

const RevisionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
`;

const RevisionList = styled.div`
  overflow-y: auto;
  max-height: calc(80vh - 50px);
`;

const RevisionItem = styled.div<{ $active?: boolean }>`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  background: ${(props: { $active?: boolean }) => props.$active ? '#e3f2fd' : 'white'};
  
  &:hover {
    background: ${(props: { $active?: boolean }) => props.$active ? '#e3f2fd' : '#f9fafc'};
  }
`;

const RevisionDate = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

const RevisionAuthor = styled.div`
  font-size: 13px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const AuthorAvatar = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #1976d2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
`;

// Define steps for content creation
enum CreationStep {
  DESIGN = 'design',
  CONTENT = 'content',
  PREVIEW = 'preview',
  SCHEDULE = 'schedule'
}

// Define slide animations
const slideVariants = {
  enter: { x: '100%', opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 }
};

// Main component
const PostCreatorPageNEW: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState<CreationStep>(CreationStep.DESIGN);
  const [post, setPost] = useState<PostData | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [activeRevision, setActiveRevision] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(id ? true : false);

  // Load post data if we're editing an existing post
  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      // For now, we'll simulate a loading delay
      const timer = setTimeout(() => {
        setPost({...MOCK_POST, id});
        setActiveRevision('rev1');
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // Creating a new post
      setPost({
        id: 'new',
        title: 'Untitled Post',
        content: '',
        platforms: [],
        scheduledDate: null,
        status: 'draft',
        mediaItems: [],
        lastEdited: new Date().toISOString()
      });
    }
  }, [id]);

  // Step labels
  const stepLabels = {
    [CreationStep.DESIGN]: 'Design',
    [CreationStep.CONTENT]: 'Content',
    [CreationStep.PREVIEW]: 'Preview',
    [CreationStep.SCHEDULE]: 'Schedule'
  };

  // Step order for navigation
  const stepOrder = [
    CreationStep.DESIGN,
    CreationStep.CONTENT,
    CreationStep.PREVIEW,
    CreationStep.SCHEDULE
  ];

  // Handle step change
  const handleStepChange = (step: CreationStep) => {
    setCurrentStep(step);
  };

  // Handle next step
  const handleNextStep = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  // Handle save
  const handleSave = () => {
    // Save the current state
    console.log('Saving...', post);
    
    // Show success message
    alert('Post saved successfully!');
    
    // Navigate back to drafts page
    if (post?.id === 'new') {
      navigate('/content-creator/drafts');
    }
  };

  // Handle publish
  const handlePublish = () => {
    console.log('Publishing...', post);
    alert('Post scheduled for publishing!');
    navigate('/content-creator/drafts');
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };
  
  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case CreationStep.DESIGN:
        return (
          <StepContent
            key={currentStep}
            initial="enter"
            animate="center"
            exit="exit"
            variants={slideVariants}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <CanvasEditor 
              initialCanvas={{
                id: post?.id || 'new',
                name: post?.title || 'Untitled Design',
                width: 1080,
                height: 1080,
                backgroundType: 'color' as 'color' | 'image' | 'gradient',
                backgroundColor: '#ffffff',
                elements: [],
              }}
              onSave={(canvas) => {
                setPost((prev: PostData | null) => prev ? ({
                  ...prev,
                  canvasData: canvas,
                  // Store the canvas as a thumbnail if available
                  ...(canvas.elements?.length > 0 ? { thumbnail: 'https://source.unsplash.com/random/400x300?design' } : {})
                }) : null);
                console.log('Canvas saved', canvas);
              }}
            />
          </StepContent>
        );
      
      case CreationStep.CONTENT:
        return (
          <StepContent
            key={currentStep}
            initial="enter"
            animate="center"
            exit="exit"
            variants={slideVariants}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <PostEditor 
              initialContent={post?.content || ''}
              initialTitle={post?.title || ''}
              onSave={(content, mediaItems) => {
                console.log('Saving post content:', content);
                setPost((prev: PostData | null) => prev ? ({
                  ...prev,
                  content: typeof content === 'string' ? content : content.text || '',
                  title: typeof content === 'object' && content.title ? content.title : prev.title,
                  ...(mediaItems ? { mediaItems } : {})
                }) : null);
              }}
            />
          </StepContent>
        );
        
      case CreationStep.PREVIEW:
        return (
          <StepContent
            key={currentStep}
            initial="enter"
            animate="center"
            exit="exit"
            variants={slideVariants}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <VisualPreview 
              // Only pass the specific props that VisualPreview expects
              title={post?.title || ''}
              content={post?.content || ''}
              platforms={post?.platforms || []}
              mediaItems={post?.mediaItems || []}
              onBack={handlePrevStep}
              onNext={handleNextStep}
            />
          </StepContent>
        );
        
      case CreationStep.SCHEDULE:
        return (
          <StepContent
            key={currentStep}
            initial="enter"
            animate="center"
            exit="exit"
            variants={slideVariants}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <ScheduleManager 
              postId={post?.id}
              schedulePost={async (data) => {
                console.log('Scheduling post with data:', data);
                handlePublish();
                return Promise.resolve();
              }}
            />
          </StepContent>
        );
        
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <MainPageTemplate>
        <Container>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div>Loading post...</div>
          </div>
        </Container>
      </MainPageTemplate>
    );
  }

  return (
    <PostCreatorProvider>
      <MainPageTemplate>
        <Container>
          <Header>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Button
                onClick={() => navigate('/content-creator/drafts')}
                whileHover={{ x: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
                Back
              </Button>
              <Title>{post?.id === 'new' ? 'Create New Post' : post?.title || 'Edit Post'}</Title>
            </div>

            <StepIndicator>
              {Object.entries(stepLabels).map(([step, label], index, arr) => (
                <React.Fragment key={step}>
                  <Step
                    $active={currentStep === step}
                    onClick={() => handleStepChange(step as CreationStep)}
                  >
                    <FontAwesomeIcon
                      icon={
                        step === CreationStep.DESIGN
                          ? faImage
                          : step === CreationStep.CONTENT
                          ? faPencilAlt
                          : step === CreationStep.PREVIEW
                          ? faEye
                          : faCalendarAlt
                      }
                    />
                    {label}
                  </Step>
                  {index < arr.length - 1 && <StepSeparator />}
                </React.Fragment>
              ))}
            </StepIndicator>

            <div style={{ display: 'flex', gap: '8px' }}>
              {post?.id !== 'new' && (
                <Button
                  onClick={() => setShowHistory(!showHistory)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon icon={faHistory} />
                  History
                </Button>
              )}
              <Button
                onClick={handleSave}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FontAwesomeIcon icon={faSave} />
                Save Draft
              </Button>
              {currentStep === CreationStep.SCHEDULE && (
                <Button
                  $primary
                  onClick={handlePublish}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon icon={faCloudUploadAlt} />
                  Schedule
                </Button>
              )}
            </div>
          </Header>

          <Content>
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            {showHistory && post?.revisionHistory && (
              <RevisionHistory>
                <RevisionHeader>
                  <RevisionTitle>Revision History</RevisionTitle>
                  <Button
                    onClick={() => setShowHistory(false)}
                    style={{ padding: '4px 8px' }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </Button>
                </RevisionHeader>
                <RevisionList>
                  {post.revisionHistory.map((revision: any) => (
                    <RevisionItem
                      key={revision.id}
                      $active={activeRevision === revision.id}
                      onClick={() => setActiveRevision(revision.id)}
                    >
                      <RevisionDate>{formatDate(revision.date)}</RevisionDate>
                      <RevisionAuthor>
                        <AuthorAvatar>{getInitials(revision.author)}</AuthorAvatar>
                        {revision.author}
                      </RevisionAuthor>
                    </RevisionItem>
                  ))}
                </RevisionList>
              </RevisionHistory>
            )}
          </Content>

          <Footer>
            <div>
              {currentStep !== stepOrder[0] && (
                <Button
                  onClick={handlePrevStep}
                  whileHover={{ x: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                  Previous
                </Button>
              )}
            </div>
            <div>
              {currentStep !== stepOrder[stepOrder.length - 1] && (
                <Button
                  $primary
                  onClick={handleNextStep}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  Next
                  <FontAwesomeIcon icon={faChevronRight} />
                </Button>
              )}
            </div>
          </Footer>
        </Container>
      </MainPageTemplate>
    </PostCreatorProvider>
  );
};

export default PostCreatorPageNEW;
