import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../../../WidgetTemplate/theme';
import HeaderEditModal from './HeaderEditModal';

// Types
interface HeaderItemProps {
    id: number;
    title: string;
    color?: string;
    onTitleChange?: (id: number, newTitle: string) => void;
    onColorChange?: (id: number, newColor: string) => void;
}

// Styled components
const HeaderContainer = styled.li<{ bgColor: string }>`
    background-color: ${(props: { bgColor: string }) => `${props.bgColor}66`}; /* Using 40% opacity for more transparency */
    backdrop-filter: blur(10px);
    color: ${theme.colors.text.white};
    font-weight: ${theme.typography.fontWeights.semibold};
    font-size: ${theme.typography.fontSizes.md};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border-radius: ${theme.borderRadius.md};
    margin-bottom: ${theme.spacing.sm};
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    width: 100%;
    box-sizing: border-box;
    max-width: 100%;
    flex-shrink: 0;
    flex-grow: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.15);
    /* Enhanced glass effect */
    position: relative;
    overflow: visible; /* Changed from hidden to visible to allow the modal to show */
    &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0));
    }
`;

const HeaderTitle = styled.h3`
    margin: 0;
    padding: 0;
    font-size: ${theme.typography.fontSizes.md};
    font-weight: ${theme.typography.fontWeights.semibold};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    user-select: none;
    
    &:hover {
        text-decoration: underline;
        opacity: 0.9;
    }
`;

const TitleInput = styled.input`
    margin: 0;
    padding: 0;
    background: transparent;
    border: none;
    color: ${theme.colors.text.white};
    font-size: ${theme.typography.fontSizes.md};
    font-weight: ${theme.typography.fontWeights.semibold};
    width: 100%;
    outline: none;
`;

const ActionButtonsContainer = styled.div`
    display: flex;
    gap: ${theme.spacing.sm};
`;

// Edit Button with subtle highlight
const EditButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: ${theme.colors.text.white};
    opacity: 0.8;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    
    &:hover {
        opacity: 1;
        transform: scale(1.1);
    }
    
    svg {
        width: 16px;
        height: 16px;
    }
`;

const ActionButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: ${theme.colors.text.white};
    opacity: 0.8;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
        opacity: 1;
    }
    
    svg {
        width: 16px;
        height: 16px;
    }
`;



/**
 * HeaderItem component - Displays a section header in the event list
 * Now with customizable colors and glassy transparency
 */
const HeaderItem: React.FC<HeaderItemProps> = ({ 
    id, 
    title,
    color = theme.colors.primary,
    onTitleChange,
    onColorChange,
}): React.ReactElement => {
    // States for inline editing
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedTitle, setEditedTitle] = useState<string>(title);
    const inputRef = useRef<HTMLInputElement>(null);
    
    // State and ref for modal
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const editButtonRef = useRef<HTMLButtonElement>(null);
    
    useEffect(() => {
        // Focus the input when entering edit mode
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);
    
    // Handle inline editing on double click
    const handleDoubleClick = (): void => {
        setEditedTitle(title);
        setIsEditing(true);
    };
    
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setEditedTitle(e.target.value);
    };
    
    const handleTitleBlur = (): void => {
        saveTitle();
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveTitle();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setIsEditing(false);
            setEditedTitle(title); // Reset to original title
        }
    };
    
    const saveTitle = (): void => {
        // Only save if title has changed and is not empty
        if (editedTitle.trim() && editedTitle !== title) {
            if (onTitleChange) {
                onTitleChange(id, editedTitle);
            }
        }
        setIsEditing(false);
    };
    
    // Modal handlers
    const openModal = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        setIsModalOpen(true);
    };
    
    const closeModal = (): void => {
        setIsModalOpen(false);
    };
    
    const handleModalTitleChange = (newTitle: string): void => {
        if (newTitle.trim() && newTitle !== title && onTitleChange) {
            onTitleChange(id, newTitle);
        }
    };
    
    const handleModalColorChange = (newColor: string): void => {
        if (onColorChange) {
            onColorChange(id, newColor);
        }
    };
    
    // Get button element for positioning
    const getButtonElement = (): HTMLElement | null => {
        return editButtonRef.current;
    };
    
    const handleDelete = (): void => {
        console.log(`Delete header with id: ${id}`);
    };
    
    return (
        <HeaderContainer bgColor={color}>
            {isEditing ? (
                <TitleInput
                    ref={inputRef}
                    type="text"
                    value={editedTitle}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleKeyDown}
                    aria-label="Edit header title"
                />
            ) : (
                <HeaderTitle 
                    onDoubleClick={handleDoubleClick}
                    title="Double-click to edit"
                >
                    {title}
                </HeaderTitle>
            )}
            
            <ActionButtonsContainer>
                <EditButton 
                    onClick={openModal}
                    title="Edit Header Title"
                    className="edit-title-button"
                    type="button"
                    aria-haspopup="true"
                    ref={editButtonRef}
                    aria-expanded={isModalOpen}
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                </EditButton>
                <ActionButton onClick={handleDelete} title="Delete Header">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </ActionButton>
            </ActionButtonsContainer>
            
            {/* Edit title and color modal that renders in specified container */}
            <HeaderEditModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onTitleChange={handleModalTitleChange}
                onColorChange={handleModalColorChange}
                currentTitle={title}
                currentColor={color}
                triggerRef={editButtonRef}
                containerSelector=".sc-bXWnss.cyNMQV" /* CSS selector matching the DOM element @[dom-element:div:P] */
            />
        </HeaderContainer>
    );
};

export default HeaderItem;
