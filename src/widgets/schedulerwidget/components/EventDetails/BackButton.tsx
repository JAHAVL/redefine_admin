import React from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/index';

interface BackButtonProps {
    onClick: () => void;
    children?: React.ReactNode;
}

const ImprovedBackButton = styled.button`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    background: none;
    border: none;
    color: ${theme.colors.primary};
    cursor: pointer;
    font-size: ${theme.typography.fontSizes.sm};
    margin-bottom: ${theme.spacing.md};
    padding: ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.sm};
    transition: background-color 0.2s;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        text-decoration: underline;
    }
    
    svg {
        width: 16px;
        height: 16px;
    }
`;

/**
 * BackButton component - Provides a styled back button with an arrow icon
 */
const BackButton: React.FC<BackButtonProps> = ({ onClick, children }) => {
    return (
        <ImprovedBackButton onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {children || 'Back'}
        </ImprovedBackButton>
    );
};

export default BackButton;