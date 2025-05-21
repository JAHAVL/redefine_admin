import React from 'react';
import styled from 'styled-components';
import { theme } from '../theme';

interface AddButtonProps {
    onClick: () => void;
}

const Button = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: ${theme.colors.primary};
    color: white;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: ${theme.colors.primaryDark};
        transform: scale(1.05);
    }
    
    &:active {
        transform: scale(0.95);
    }
    
    svg {
        width: 24px;
        height: 24px;
    }
`;

const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
    return (
        <Button onClick={onClick}>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        </Button>
    );
};

export default AddButton;
