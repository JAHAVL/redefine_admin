import React from 'react';
import './TemplatePage.css';
import MainPageTemplate from '../../../components/MainPageTemplate/MainPageTemplate';

/**
 * Template page component that integrates with MainPageTemplate
 * and provides an empty container for widgets
 */
const TemplatePage: React.FC = () => {
  return (
    <MainPageTemplate pageTitle="Admin Template">
      <div className="widget-container">
        {/* Widget content will be loaded here */}
      </div>
    </MainPageTemplate>
  );
};

export default TemplatePage;
