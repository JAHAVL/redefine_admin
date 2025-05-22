import React from 'react';
import { useParams } from 'react-router-dom';

// Import components directly
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';
import PostCreatorWidget from '../../widgets/PostCreator/PostCreatorWidget';

/**
 * ReviewPostPageNEW Component
 * 
 * Dedicated page for reviewing posts in the content creation system
 */
const ReviewPostPageNEW: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  
  return (
    <MainPageTemplate pageTitle="Review Content">
      <PostCreatorWidget initialMode="review" postId={postId} />
    </MainPageTemplate>
  );
};

export default ReviewPostPageNEW;
