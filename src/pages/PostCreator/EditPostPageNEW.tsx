import React from 'react';
import { useParams } from 'react-router-dom';

// Import components directly
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';
import PostCreatorWidget from '../../widgets/PostCreator/PostCreatorWidget';

/**
 * EditPostPageNEW Component
 * 
 * Dedicated page for editing posts in the content creation system
 */
const EditPostPageNEW: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  
  return (
    <MainPageTemplate pageTitle="Edit Content">
      <PostCreatorWidget initialMode="edit" postId={postId} />
    </MainPageTemplate>
  );
};

export default EditPostPageNEW;
