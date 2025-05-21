import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ActionModal } from '../../../../WidgetTemplate/components/modals';
import ReactDOM from 'react-dom';

// Props interface
interface HeaderEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTitleChange: (title: string) => void;
    onColorChange?: (color: string) => void;
    currentTitle: string;
    currentColor?: string;
    triggerRef: React.RefObject<HTMLElement>;
    containerSelector?: string; // Optional CSS selector for portal container
}

interface HSLColor {
    h: number; // 0-360
    s: number; // 0-100
    l: number; // 0-100
}

/**
 * Modal for editing header title and color
 */
const HeaderEditModal: React.FC<HeaderEditModalProps> = ({
    isOpen,
    onClose,
    onTitleChange,
    onColorChange,
    currentTitle,
    currentColor = '#3b82f6',
    triggerRef,
    containerSelector
}) => {
    const [title, setTitle] = useState<string>(currentTitle);
    const [color, setColor] = useState<string>(currentColor);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [hsla, setHsla] = useState<HSLColor>(hexToHsl(currentColor));
    
    const colorPickerRef = useRef<HTMLDivElement>(null);
    const hueSliderRef = useRef<HTMLDivElement>(null);
    
    // Handle title change
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setTitle(e.target.value);
    };
    
    // Save changes
    const handleSave = (): void => {
        if (title.trim()) {
            onTitleChange(title);
        }
        if (onColorChange && color !== currentColor) {
            onColorChange(color);
        }
        onClose();
    };
    
    // Convert hex to HSL
    function hexToHsl(hex: string): HSLColor {
        // Remove the # if present
        hex = hex.replace(/^#/, '');
        
        // Parse the hex values
        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;
        
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        return { h: h * 360, s: s * 100, l: l * 100 };
    }
    
    // Convert HSL to hex
    function hslToHex(h: number, s: number, l: number): string {
        h /= 360;
        s /= 100;
        l /= 100;
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p: number, q: number, t: number): number => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = (x: number): string => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    
    // Store active drag state in refs to avoid re-renders during drag
    const isDraggingRef = useRef<boolean>(false);
    const activeElementRef = useRef<'picker' | 'slider' | null>(null);
    
    // Functions to update the color based on coordinates
    const updateColorFromPickerCoordinates = (clientX: number, clientY: number): void => {
        if (!colorPickerRef.current) return;
        
        const rect = colorPickerRef.current.getBoundingClientRect();
        
        // Calculate position within the picker box, clamped to 0-1
        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
        
        // Update saturation and lightness
        const newS = x * 100;
        const newL = (1 - y) * 50 + 25; // Scale to 25-75% to avoid too dark/light
        
        setHsla(prev => {
            const newColor = hslToHex(prev.h, newS, newL);
            setColor(newColor);
            return { ...prev, s: newS, l: newL };
        });
    };
    
    const updateColorFromSliderCoordinates = (clientX: number): void => {
        if (!hueSliderRef.current) return;
        
        const rect = hueSliderRef.current.getBoundingClientRect();
        
        // Calculate position within the slider, clamped to 0-1
        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        
        // Update hue
        const newH = x * 360;
        
        setHsla(prev => {
            const newColor = hslToHex(newH, prev.s, prev.l);
            setColor(newColor);
            return { ...prev, h: newH };
        });
    };
    
    // Centralized handlers for mouse events
    const handleMouseDown = (e: React.MouseEvent, element: 'picker' | 'slider'): void => {
        e.preventDefault();
        e.stopPropagation();
        
        // Store the active element and set dragging state
        activeElementRef.current = element;
        isDraggingRef.current = true;
        
        // Update the color based on the initial click position
        if (element === 'picker') {
            updateColorFromPickerCoordinates(e.clientX, e.clientY);
        } else {
            updateColorFromSliderCoordinates(e.clientX);
        }
        
        // Force the component to update to show active state
        setIsDragging(true);
    };
    
    // Set up global event listeners for drag tracking
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent): void => {
            if (!isDraggingRef.current) return;
            
            e.preventDefault();
            
            if (activeElementRef.current === 'picker') {
                updateColorFromPickerCoordinates(e.clientX, e.clientY);
            } else if (activeElementRef.current === 'slider') {
                updateColorFromSliderCoordinates(e.clientX);
            }
        };
        
        const handleGlobalMouseUp = (e: MouseEvent): void => {
            if (!isDraggingRef.current) return;
            
            e.preventDefault();
            
            // Reset dragging state
            isDraggingRef.current = false;
            activeElementRef.current = null;
            setIsDragging(false);
        };
        
        // Add event listeners
        document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
        document.addEventListener('mouseup', handleGlobalMouseUp, { passive: false });
        
        // Clean up
        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isOpen]); // Only re-add listeners if modal open state changes
    
    // Update HSL when color prop changes
    useEffect(() => {
        if (currentColor !== color) {
            setColor(currentColor);
            setHsla(hexToHsl(currentColor));
        }
    }, [currentColor, isOpen]);
    
    // Handle key press
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
    };
    
    // Use React Portal if a container selector is provided
    const modalContent = (
        <ActionModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Header"
            triggerRef={triggerRef}
            maxWidth="240px"
        >
            <ModalContent>
                <InputGroup>
                    <Label htmlFor="header-title">Title</Label>
                    <Input 
                        id="header-title"
                        type="text" 
                        value={title}
                        onChange={handleTitleChange}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        placeholder="Enter header title"
                    />
                </InputGroup>
                
                <ColorPickerGroup>
                    <Label>Color</Label>
                    <ColorPickerWrapper>
                        {/* Main color picker - saturation and lightness */}
                        <ColorPickerBox 
                            ref={colorPickerRef}
                            hue={hsla.h}
                            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleMouseDown(e, 'picker')}
                        >
                            <ColorPickerSelector 
                                style={{
                                    left: `${hsla.s}%`,
                                    top: `${100 - ((hsla.l - 25) * 2)}%`
                                }}
                            />
                        </ColorPickerBox>
                        
                        {/* Hue slider */}
                        <HueSlider 
                            ref={hueSliderRef}
                            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleMouseDown(e, 'slider')}
                        >
                            <HueSliderHandle 
                                style={{ left: `${hsla.h / 360 * 100}%` }}
                            />
                        </HueSlider>
                        
                        {/* Color preview */}
                        <ColorPreview style={{ backgroundColor: color }} />
                    </ColorPickerWrapper>
                </ColorPickerGroup>
                
                <ButtonGroup>
                    <CancelButton type="button" onClick={onClose}>
                        Cancel
                    </CancelButton>
                    <SaveButton type="button" onClick={handleSave}>
                        Save
                    </SaveButton>
                </ButtonGroup>
            </ModalContent>
        </ActionModal>
    );
    
    // If we have a container selector and it exists in the DOM, use a portal
    if (containerSelector && isOpen) {
        const container = document.querySelector(containerSelector);
        if (container) {
            return ReactDOM.createPortal(modalContent, container);
        }
    }
    
    // Otherwise render normally
    return modalContent;
};

// Styled components
const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 100%;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
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
    margin-top: 8px;
`;

const ColorPickerGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const ColorPickerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
`;

const ColorPickerBox = styled.div<{ hue: number }>`
    width: 100%;
    height: 120px;
    position: relative;
    border-radius: 4px;
    cursor: crosshair;
    background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0) 0%,
        rgba(0, 0, 0, 0.5) 100%
    ),
    linear-gradient(
        to right,
        rgba(128, 128, 128, 1) 0%,
        hsla(${(props: { hue: number }) => props.hue}, 100%, 50%, 1) 100%
    );
    user-select: none;
    touch-action: none; /* Prevents scrolling while dragging on touch devices */
`;

const ColorPickerSelector = styled.div`
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 0 0 0 2px rgba(0, 0, 0, 0.1);
    transform: translate(-50%, -50%);
    pointer-events: none;
`;

const HueSlider = styled.div`
    width: 100%;
    height: 16px;
    position: relative;
    border-radius: 4px;
    cursor: pointer;
    background: linear-gradient(
        to right,
        #ff0000 0%,
        #ffff00 17%,
        #00ff00 33%,
        #00ffff 50%,
        #0000ff 67%,
        #ff00ff 83%,
        #ff0000 100%
    );
    user-select: none;
    touch-action: none; /* Prevents scrolling while dragging on touch devices */
`;

const HueSliderHandle = styled.div`
    position: absolute;
    width: 8px;
    height: 16px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 2px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    transform: translateX(-50%);
    pointer-events: none;
`;

const ColorPreview = styled.div`
    width: 100%;
    height: 24px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.2);
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

export default HeaderEditModal;
