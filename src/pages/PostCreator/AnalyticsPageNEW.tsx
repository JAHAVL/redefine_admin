import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Import components directly
import MainPageTemplate from '../../layouts/MainPageTemplate/MainPageTemplate';

// Styled components for the analytics page
const AnalyticsContainer = styled.div`
  padding: 24px;
`;

const StatCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  
  .stat-title {
    font-size: 14px;
    color: #757575;
    margin-bottom: 8px;
  }
  
  .stat-value {
    font-size: 32px;
    font-weight: 500;
    color: #1976d2;
    margin-bottom: 16px;
  }
  
  .stat-trend {
    display: flex;
    align-items: center;
    font-size: 14px;
    
    &.positive {
      color: #4caf50;
    }
    
    &.negative {
      color: #f44336;
    }
  }
`;

const ChartSection = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
  
  h3 {
    margin: 0 0 24px;
    font-size: 18px;
    font-weight: 500;
  }
  
  .chart-container {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #e0e0e0;
    background-color: #f5f5f5;
  }
`;

const TablesSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const TableContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  
  h3 {
    margin: 0 0 24px;
    font-size: 18px;
    font-weight: 500;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    
    th {
      font-weight: 500;
      color: #757575;
      font-size: 13px;
    }
    
    td {
      font-size: 14px;
    }
    
    tbody tr:hover {
      background-color: #f5f5f5;
    }
  }
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  .filter-group {
    display: flex;
    gap: 12px;
    
    select, button {
      padding: 8px 16px;
      border-radius: 4px;
      border: 1px solid #e0e0e0;
      font-size: 14px;
      background-color: #fff;
    }
    
    button {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      
      &:hover {
        background-color: #f5f5f5;
      }
    }
  }
`;

// Mock data for analytics
const mockAnalyticsData = {
  overview: {
    totalPosts: 157,
    publishedPosts: 124,
    totalViews: 53845,
    totalEngagements: 2731
  },
  trends: {
    viewsGrowth: 12.3,
    engagementGrowth: -4.2,
    postsGrowth: 8.5
  },
  topPerformingPosts: [
    { id: 'post1', title: '10 Tips for Effective Leadership', views: 8732, engagement: 432 },
    { id: 'post2', title: 'How to Increase Productivity in Remote Teams', views: 7654, engagement: 385 },
    { id: 'post3', title: 'The Future of Work: Trends to Watch in 2023', views: 6543, engagement: 321 },
    { id: 'post4', title: 'Building a Strong Company Culture', views: 5432, engagement: 265 },
    { id: 'post5', title: 'Strategic Planning for Small Businesses', views: 4321, engagement: 198 }
  ],
  channelPerformance: [
    { channel: 'LinkedIn', posts: 45, views: 24532, engagement: 1253 },
    { channel: 'Twitter', posts: 32, views: 15321, engagement: 753 },
    { channel: 'Facebook', posts: 28, views: 8765, engagement: 432 },
    { channel: 'Instagram', posts: 19, views: 5227, engagement: 293 }
  ]
};

/**
 * AnalyticsPageNEW Component
 * 
 * Analytics dashboard for content performance tracking
 */
const AnalyticsPageNEW: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | 'custom'>('30days');
  const [analyticsData, setAnalyticsData] = useState(mockAnalyticsData);
  
  // In a real implementation, this would fetch analytics data from an API
  useEffect(() => {
    // Simulating data fetch based on time range
    console.log(`Fetching analytics data for ${timeRange}`);
    // In a real implementation, this would be an API call
    // setAnalyticsData(fetchedData);
  }, [timeRange]);
  
  return (
    <MainPageTemplate pageTitle="Content Analytics">
      <AnalyticsContainer>
        <FilterBar>
          <div className="filter-group">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
            <button>
              <span>Filter</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 7H20M7 12H17M9 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="filter-group">
            <button>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Export Report</span>
            </button>
          </div>
        </FilterBar>
        
        <StatCardGrid>
          <StatCard>
            <div className="stat-title">Total Content</div>
            <div className="stat-value">{analyticsData.overview.totalPosts}</div>
            <div className={`stat-trend ${analyticsData.trends.postsGrowth >= 0 ? 'positive' : 'negative'}`}>
              {analyticsData.trends.postsGrowth >= 0 ? '↑' : '↓'} {Math.abs(analyticsData.trends.postsGrowth)}% from previous period
            </div>
          </StatCard>
          
          <StatCard>
            <div className="stat-title">Published Content</div>
            <div className="stat-value">{analyticsData.overview.publishedPosts}</div>
            <div className="stat-trend positive">
              {Math.round((analyticsData.overview.publishedPosts / analyticsData.overview.totalPosts) * 100)}% publication rate
            </div>
          </StatCard>
          
          <StatCard>
            <div className="stat-title">Total Views</div>
            <div className="stat-value">{analyticsData.overview.totalViews.toLocaleString()}</div>
            <div className={`stat-trend ${analyticsData.trends.viewsGrowth >= 0 ? 'positive' : 'negative'}`}>
              {analyticsData.trends.viewsGrowth >= 0 ? '↑' : '↓'} {Math.abs(analyticsData.trends.viewsGrowth)}% from previous period
            </div>
          </StatCard>
          
          <StatCard>
            <div className="stat-title">Total Engagements</div>
            <div className="stat-value">{analyticsData.overview.totalEngagements.toLocaleString()}</div>
            <div className={`stat-trend ${analyticsData.trends.engagementGrowth >= 0 ? 'positive' : 'negative'}`}>
              {analyticsData.trends.engagementGrowth >= 0 ? '↑' : '↓'} {Math.abs(analyticsData.trends.engagementGrowth)}% from previous period
            </div>
          </StatCard>
        </StatCardGrid>
        
        <ChartSection>
          <h3>Content Performance Over Time</h3>
          <div className="chart-container">
            <p>Performance chart visualization would be implemented here with a charting library</p>
            {/* In a real implementation, this would be a chart component */}
          </div>
        </ChartSection>
        
        <TablesSection>
          <TableContainer>
            <h3>Top Performing Content</h3>
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Views</th>
                  <th>Engagement</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.topPerformingPosts.map(post => (
                  <tr key={post.id}>
                    <td>{post.title}</td>
                    <td>{post.views.toLocaleString()}</td>
                    <td>{post.engagement.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>
          
          <TableContainer>
            <h3>Channel Performance</h3>
            <table>
              <thead>
                <tr>
                  <th>Channel</th>
                  <th>Posts</th>
                  <th>Views</th>
                  <th>Engagement</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.channelPerformance.map(channel => (
                  <tr key={channel.channel}>
                    <td>{channel.channel}</td>
                    <td>{channel.posts}</td>
                    <td>{channel.views.toLocaleString()}</td>
                    <td>{channel.engagement.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>
        </TablesSection>
      </AnalyticsContainer>
    </MainPageTemplate>
  );
};

export default AnalyticsPageNEW;
