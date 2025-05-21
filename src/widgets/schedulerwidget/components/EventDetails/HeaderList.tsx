import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/index';
import HeaderItem from './HeaderComponents/HeaderItem';

interface HeaderListProps {
    headers: Array<{
        id: number;
        title: string;
    }>;
    onAddHeader: () => void;
}

const HeaderListContainer = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    box-sizing: border-box;
    flex-shrink: 0;
    flex-grow: 0;
    /* Force a consistent width regardless of content */
    min-width: var(--content-width, 100%);
    max-width: var(--content-width, 100%);
`;

const EmptyState = styled.div`
    padding: ${theme.spacing.xl};
    text-align: center;
    color: ${theme.colors.text.secondary};
    background-color: rgba(0, 0, 0, 0.02);
    border-radius: ${theme.borderRadius.md};
    border: 1px dashed ${theme.colors.border};
    font-size: ${theme.typography.fontSizes.md};
    margin: ${theme.spacing.md} 0;
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
 * HeaderList component - Displays a list of section headers for an event
 */
const HeaderList: React.FC<HeaderListProps> = ({ 
    headers, 
    onAddHeader 
}) => {
    return (
        <>
            {headers.length === 0 ? (
                <EmptyState>
                    No section headers added yet. Add headers to organize your event.
                </EmptyState>
            ) : (
                <HeaderListContainer>
                    {headers.map(header => (
                        <HeaderItem
                            key={header.id}
                            id={header.id}
                            title={header.title}
                        />
                    ))}
                </HeaderListContainer>
            )}
            {/* Add button removed - now handled by the main + button */}
        </>
    );
};

export default HeaderList;
