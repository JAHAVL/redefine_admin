import React from 'react';
import styled from 'styled-components';
import { Series } from '../types';
import { theme } from '../theme';

interface SeriesCardProps {
  series: Series;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const Card = styled.div`
  position: relative;
  background-color: ${theme.colors.card};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.sm};
  overflow: hidden;
  transition: ${theme.transitions.default};
  cursor: pointer;
  height: 100%;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${theme.shadows.md};
  }
`;

interface CardImageProps {
  backgroundImage?: string;
}

const CardImage = styled.div<CardImageProps>`
  width: 100%;
  height: 180px;
  background-color: ${theme.colors.highlight};
  background-image: ${(props: CardImageProps) => props.backgroundImage ? `url(${props.backgroundImage})` : `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.primaryDark})`};
  background-size: cover;
  background-position: center;
`;

const CardContent = styled.div`
  padding: ${theme.spacing.md};
`;

const CardTitle = styled.h3`
  margin: 0 0 ${theme.spacing.sm};
  font-size: ${theme.typography.fontSizes.lg};
  font-weight: ${theme.typography.fontWeights.semibold};
  color: ${theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardDate = styled.p`
  margin: 0 0 ${theme.spacing.sm};
  font-size: ${theme.typography.fontSizes.sm};
  color: ${theme.colors.text.secondary};
`;

const DeleteButton = styled.button`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  width: 32px;
  height: 32px;
  border-radius: ${theme.borderRadius.round};
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  opacity: 0;
  transition: ${theme.transitions.default};
  
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
