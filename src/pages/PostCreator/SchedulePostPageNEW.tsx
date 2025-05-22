import React from 'react';
import { useParams } from 'react-router-dom';

// Import components directly
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';
import PostCreatorWidget from '../../widgets/PostCreator/PostCreatorWidget';

/**
 * SchedulePostPageNEW Component
 * 
 * Dedicated page for scheduling posts in the content creation system
 */
const SchedulePostPageNEW: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  
  return (
    <MainPageTemplate pageTitle="Schedule Content">
      <PostCreatorWidget initialMode="schedule" postId={postId} />
    </MainPageTemplate>
  );
};

export default SchedulePostPageNEW;
