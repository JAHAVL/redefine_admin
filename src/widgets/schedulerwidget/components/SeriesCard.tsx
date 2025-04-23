import React from 'react';
import styled from 'styled-components';
import { Series } from '../types';

interface SeriesCardProps {
  series: Series;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const Card = styled.div`
  position: relative;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  height: 100%;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const CardImage = styled.div<{ backgroundImage?: string }>`
  width: 100%;
  height: 180px;
  background-color: #f0f0f0;
  background-image: ${props => props.backgroundImage ? `url(${props.backgroundImage})` : 'none'};
  background-size: cover;
  background-position: center;
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const CardTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardDate = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #666;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
  
  ${Card}:hover & {
    opacity: 1;
  }
  
  &:hover {
    background-color: rgba(255, 0, 0, 0.1);
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: #f44336;
  }
`;

const SeriesCard: React.FC<SeriesCardProps> = ({ series, onClick, onDelete }) => {
  return (
    <Card onClick={onClick}>
      <DeleteButton onClick={onDelete}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </DeleteButton>
      <CardImage backgroundImage={series.banner_1} />
      <CardContent>
        <CardTitle title={series.series_name}>{series.series_name}</CardTitle>
        <CardDate>{series.start_date} - {series.end_date}</CardDate>
      </CardContent>
    </Card>
  );
};

export default SeriesCard;
