import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ActionModal from './ActionModal'; // Use local ActionModal
import { theme } from '../../../WidgetTemplate/theme';

// Props interface
interface HeaderEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTitleChange: (title: string) => void;
    onColorChange?: (color: string) => void;
    currentTitle: string;
    currentColor?: string;
    triggerRef: React.RefObject<HTMLElement>;
    buttonPosition?: {top: number; left: number; right: number; width: number} | null; // Using explicit position values
}

interface HSLColor {
    h: number; // 0-360
    s: number; // 0-100
    l: number; // 0-100
}

// Styled components
const ModalContent = styled.div`
    padding: ${theme.spacing.md};
`;

const InputGroup = styled.div`
    margin-bottom: ${theme.spacing.md};
`;

const Label = styled.label`
    display: block;
    margin-bottom: ${theme.spacing.sm};
    color: white;
    font-size: 14px;
`;

const Input = styled.input`
    width: 100%;
    padding: ${theme.spacing.sm};
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: ${theme.borderRadius.sm};
    color: white;
    font-size: 14px;
    
    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
    }
`;

const ColorPickerGroup = styled.div`
    margin-bottom: ${theme.spacing.md};
`;

const ColorPickerWrapper = styled.div`
    position: relative;
`;

const ColorPickerBox = styled.div<{ color: string }>`
    width: 100%;
    height: 100px;
    border-radius: ${theme.borderRadius.sm};
    /* Create a gradient from white to color to black for proper HSL color picking */
    background: ${(props: { color: string }): string => `
        linear-gradient(to top, #000, transparent),
        linear-gradient(to right, #fff, ${props.color})
    `};
    position: relative;
    cursor: crosshair;
`;

const ColorPickerSelector = styled.div<{ top: number; left: number }>`
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid white;
    top: ${(props: { top: number }): string => `${props.top}px`};
    left: ${(props: { left: number }): string => `${props.left}px`};
    transform: translate(-50%, -50%);
    pointer-events: none;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
`;

const HueSlider = styled.div`
    width: 100%;
    height: 12px;
    margin-top: ${theme.spacing.sm};
    background: linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);
    border-radius: ${theme.borderRadius.sm};
    position: relative;
    cursor: pointer;
`;

const HueSliderHandle = styled.div<{ left: number }>`
    position: absolute;
    width: 12px;
    height: 20px;
    border-radius: 3px;
    background: white;
    top: 50%;
    left: ${(props: { left: number }): string => `${props.left}%`};
    transform: translate(-50%, -50%);
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
`;

const ColorPreview = styled.div<{ color: string }>`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${(props: { color: string }): string => props.color};
    margin-right: ${theme.spacing.sm};
    border: 1px solid rgba(255, 255, 255, 0.3);
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${theme.spacing.sm};
    margin-top: ${theme.spacing.md};
`;

const ButtonBase = styled.button`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border-radius: ${theme.borderRadius.sm};
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        opacity: 0.9;
    }
    
    &:active {
        transform: translateY(1px);
    }
`;

const CancelButton = styled(ButtonBase)`
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SaveButton = styled(ButtonBase)`
    background-color: ${theme.colors.primary};
    color: white;
    border: none;
`;

// Helper function for color conversions
const hexToHsl = (hex: string): HSLColor => {
    // Remove the # if present
    hex = hex.replace('#', '');
    
    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Find min and max values
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    
    // Calculate lightness
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
        // Calculate saturation
        s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
        
        // Calculate hue
        if (max === r) {
            h = (g - b) / (max - min) + (g < b ? 6 : 0);
        } else if (max === g) {
            h = (b - r) / (max - min) + 2;
        } else if (max === b) {
            h = (r - g) / (max - min) + 4;
        }
        
        h /= 6;
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
};

// Helper function to convert HSL to hex
const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    
    let r, g, b;
    
    if (h >= 0 && h < 60) {
        [r, g, b] = [c, x, 0];
    } else if (h >= 60 && h < 120) {
        [r, g, b] = [x, c, 0];
    } else if (h >= 120 && h < 180) {
        [r, g, b] = [0, c, x];
    } else if (h >= 180 && h < 240) {
        [r, g, b] = [0, x, c];
    } else if (h >= 240 && h < 300) {
        [r, g, b] = [x, 0, c];
    } else {
        [r, g, b] = [c, 0, x];
    }
    
    // Convert to hex
    const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');
    
    return `#${rHex}${gHex}${bHex}`;
};

/**
 * Modal for editing header title and color
 * 
 * POSITIONING LOGIC:
 * This modal uses ActionModal which positions itself relative to the triggerRef button.
 * The positioning is entirely handled by ActionModal which places the modal to the right
 * of the button element. We maintain a simple implementation that matches other modals.
 */
const HeaderEditModal: React.FC<HeaderEditModalProps> = ({
    isOpen,
    onClose,
    onTitleChange,
    onColorChange,
    currentTitle,
    currentColor = '#3b82f6',
    triggerRef,
    buttonPosition
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
    
    // Handle color picker click/drag
    const handleColorPickerInteraction = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (!colorPickerRef.current) return;
        
        const rect = colorPickerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
        
        // Calculate saturation and lightness based on position
        const s = Math.round((x / rect.width) * 100);
        const l = Math.round(100 - (y / rect.height) * 100);
        
        // Create a new HSLA object to avoid stale state issues
        const newHsla = {
            ...hsla,
            s,
            l
        };
        
        setHsla(newHsla);
        // Use the current function values, not the state which might be stale
        setColor(hslToHex(newHsla.h, s, l));
    };
    
    // Handle hue slider click/drag
    const handleHueSliderInteraction = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (!hueSliderRef.current) return;
        
        const rect = hueSliderRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        
        // Calculate hue based on position (0-360)
        const h = Math.round((x / rect.width) * 360);
        
        // Create a new HSLA object to avoid stale state issues
        const newHsla = {
            ...hsla,
            h
        };
        
        setHsla(newHsla);
        // Use the current function values, not the state which might be stale
        setColor(hslToHex(h, newHsla.s, newHsla.l));
    };
    
    // Mouse event handlers for dragging
    useEffect(() => {
        if (!isDragging) return;
        
        const handleMouseMove = (e: MouseEvent): void => {
            if (e.target === colorPickerRef.current || colorPickerRef.current?.contains(e.target as Node)) {
                handleColorPickerInteraction(e as unknown as React.MouseEvent<HTMLDivElement>);
            } else if (e.target === hueSliderRef.current || hueSliderRef.current?.contains(e.target as Node)) {
                handleHueSliderInteraction(e as unknown as React.MouseEvent<HTMLDivElement>);
            }
        };
        
        const handleMouseUp = (): void => {
            setIsDragging(false);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);
    
    // We're using the simple positioning provided by ActionModal
    // which consistently places the modal to the right of the trigger button

    // Update UI when currentColor changes
    useEffect(() => {
        setColor(currentColor);
        setHsla(hexToHsl(currentColor));
    }, [currentColor]);
    
    // Update UI when currentTitle changes
    useEffect(() => {
        setTitle(currentTitle);
    }, [currentTitle]);
    
    return (
        <ActionModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Header"
            triggerRef={triggerRef}
            buttonPosition={buttonPosition}
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
                        placeholder="Enter header title"
                    />
                </InputGroup>
                
                {onColorChange && (
                    <ColorPickerGroup>
                        <Label>Color</Label>
                        <ColorPickerWrapper>
                            <ColorPickerBox
                                ref={colorPickerRef}
                                color={`hsl(${hsla.h}, 100%, 50%)`}
                                onMouseDown={(e: React.MouseEvent<HTMLDivElement>): void => {
                                    setIsDragging(true);
                                    handleColorPickerInteraction(e);
                                }}
                            >
                                <ColorPickerSelector
                                    top={(100 - hsla.l) * 1}
                                    left={hsla.s}
                                />
                            </ColorPickerBox>
                            
                            <HueSlider
                                ref={hueSliderRef}
                                onMouseDown={(e: React.MouseEvent<HTMLDivElement>): void => {
                                    setIsDragging(true);
                                    handleHueSliderInteraction(e);
                                }}
                            >
                                <HueSliderHandle left={(hsla.h / 360) * 100} />
                            </HueSlider>
                            
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: theme.spacing.sm }}>
                                <ColorPreview color={color} />
                                <span style={{ color: 'white', fontSize: '12px' }}>{color.toUpperCase()}</span>
                            </div>
                        </ColorPickerWrapper>
                    </ColorPickerGroup>
                )}
                
                <ButtonGroup>
                    <CancelButton 
                        onClick={onClose}
                        type="button"
                    >
                        Cancel
                    </CancelButton>
                    <SaveButton 
                        onClick={handleSave}
                        type="button"
                    >
                        Save
                    </SaveButton>
                </ButtonGroup>
            </ModalContent>
        </ActionModal>
    );
};

export default HeaderEditModal;
