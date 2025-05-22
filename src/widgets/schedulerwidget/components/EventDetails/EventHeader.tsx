import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/index';
import { ExtendedSeriesEvent } from '../../types/songInterfaces';

interface EventHeaderProps {
    event: ExtendedSeriesEvent;
    onEditEvent: () => void;
}

const EventHeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${theme.spacing.lg};
    padding: ${theme.spacing.md};
    background-color: ${theme.colors.card};
    border-radius: ${theme.borderRadius.md};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const EventInfo = styled.div`
    flex: 1;
    display: flex;
    gap: ${theme.spacing.md};
`;

const EventInfoContent = styled.div`
    flex: 1;
`;

const EventGraphic = styled.div`
    width: 120px;
    height: 120px;
    border-radius: ${theme.borderRadius.sm};
    overflow: hidden;
    flex-shrink: 0;
    
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const EventTitleHeader = styled.h1`
    margin: 0;
    font-size: ${theme.typography.fontSizes.xl};
`;

const EventDate = styled.div`
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.fontSizes.md};
    margin-bottom: ${theme.spacing.sm};
`;

const EventDescription = styled.div`
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSizes.sm};
    line-height: 1.5;
    margin-top: ${theme.spacing.sm};
    max-width: 600px;
`;

const EventActions = styled.div`
    display: flex;
    gap: ${theme.spacing.md};
    align-items: center;
`;

const ActionButton = styled.button`
    background-color: ${theme.colors.secondary};
    color: ${theme.colors.text.white};
    border: none;
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-weight: ${theme.typography.fontWeights.semibold};
    cursor: pointer;
    transition: ${theme.transitions.default};

    &:hover {
        background-color: ${theme.colors.primaryDark};
    }
`;

/**
 * EventHeader component - Displays event title, date, description, and actions
 */
const EventHeader: React.FC<EventHeaderProps> = ({ event, onEditEvent }) => {
    // Generate a description if one isn't provided
    const description = event.description || 
        `Join us for our ${event.event_name} service. This special event will feature worship, prayer, and a message from our pastor. Everyone is welcome to attend and participate in this gathering.`;
    
    // Generate a placeholder image using the first letter of the event name
    const placeholderImageUrl = `https://via.placeholder.com/500x500/4a90e2/ffffff?text=${encodeURIComponent(event.event_name.slice(0, 1))}`;
    
    return (
        <EventHeaderContainer>
            <EventInfo>
                <EventGraphic>
                    <img 
                        src={event.image_url || placeholderImageUrl} 
                        alt={`${event.event_name} graphic`} 
                    />
                </EventGraphic>
                <EventInfoContent>
                    <EventTitleHeader>{event.event_name}</EventTitleHeader>
                    <EventDate>{event.event_date} ({event.event_day})</EventDate>
                    <EventDescription>
                        {description}
                    </EventDescription>
                </EventInfoContent>
            </EventInfo>
            <EventActions>
                <ActionButton onClick={onEditEvent}>
                    Edit Event
                </ActionButton>
            </EventActions>
        </EventHeaderContainer>
    );
};

export default EventHeader;