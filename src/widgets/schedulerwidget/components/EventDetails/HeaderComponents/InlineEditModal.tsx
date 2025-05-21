import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ReactDOM from 'react-dom';

// Props interface
interface InlineEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTitleChange: (title: string) => void;
    currentTitle: string;
    anchorElement: HTMLElement | null;
    containerSelector: string; // CSS selector for the container to render inside
}

/**
 * Inline modal for editing header title
 * Renders inside a specified container using React Portal
 */
const InlineEditModal: React.FC<InlineEditModalProps> = ({
    isOpen,
    onClose,
    onTitleChange,
    currentTitle,
    anchorElement,
    containerSelector
}) => {
    const [title, setTitle] = useState<string>(currentTitle);
    const modalRef = useRef<HTMLDivElement>(null);
    const [modalStyle, setModalStyle] = useState<React.CSSProperties>({});
    
    // Handle title change
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setTitle(e.target.value);
    };
    
    // Save changes
    const handleSave = (): void => {
        if (title.trim()) {
            onTitleChange(title);
        }
        onClose();
    };
    
    // Handle key press
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    };
    
    // Calculate modal position based on the anchor element
    useEffect(() => {
        if (!isOpen || !anchorElement) return;

        const anchorRect = anchorElement.getBoundingClientRect();
        const containerElement = document.querySelector(containerSelector);
        
        if (!containerElement) return;
        
        const containerRect = containerElement.getBoundingClientRect();
        
        // Position modal relative to the container's coordinate system
        const left = anchorRect.left - containerRect.left + anchorRect.width / 2;
        const top = anchorRect.top - containerRect.top + anchorRect.height;
        
        setModalStyle({
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            transform: 'translateX(-50%)',
            zIndex: 1000
        });
        
        // Focus input after position is set
        setTimeout(() => {
            const inputElement = document.getElementById('edit-header-input') as HTMLInputElement;
            if (inputElement) {
                inputElement.focus();
                inputElement.select();
            }
        }, 50);
    }, [isOpen, anchorElement, containerSelector]);
    
    // Handle clicks outside the modal
    useEffect(() => {
        if (!isOpen) return;
        
        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current && 
                !modalRef.current.contains(event.target as Node) &&
                anchorElement !== event.target &&
                !anchorElement?.contains(event.target as Node)
            ) {
                onClose();
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose, anchorElement]);
    
    if (!isOpen || !document.querySelector(containerSelector)) return null;
    
    // Use ReactDOM.createPortal to render inside the specified container
    return ReactDOM.createPortal(
        <ModalContainer ref={modalRef} style={modalStyle}>
            <Input 
                id="edit-header-input"
                type="text" 
                value={title}
                onChange={handleTitleChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter header title"
            />
            <ButtonGroup>
                <CancelButton type="button" onClick={onClose}>
                    Cancel
                </CancelButton>
                <SaveButton type="button" onClick={handleSave}>
                    Save
                </SaveButton>
            </ButtonGroup>
        </ModalContainer>,
        document.querySelector(containerSelector) as Element
    );
};

// Styled components
const ModalContainer = styled.div`
    background: rgba(30, 41, 59, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    padding: 12px;
    width: 220px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const Input = styled.input`
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    padding: 8px 12px;
    color: white;
    font-size: 14px;
    width: 100%;
    
    &:focus {
        outline: none;
        border-color: rgba(255, 255, 255, 0.5);
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
`;

const Button = styled.button`
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
`;

const CancelButton = styled(Button)`
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    
    &:hover {
        background: rgba(255, 255, 255, 0.1);
    }
`;

const SaveButton = styled(Button)`
    background: rgba(59, 130, 246, 0.9);
    border: 1px solid rgba(59, 130, 246, 0.5);
    color: white;
    
    &:hover {
        background: rgba(59, 130, 246, 1);
    }
`;

export default InlineEditModal;
