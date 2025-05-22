import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import ActionModal from './ActionModal';
import { theme } from '../../theme';
import {
    ColorPickerGroup,
    ColorPickerWrapper,
    ColorPickerBox,
    ColorPickerSelector,
    HueSlider,
    HueSliderHandle
} from '../EventDetails/EventSideTabs/TimeTab/styles';

// Types
export type TimeItemType = {
    id: number;
    type: string;
    day?: string;
    time: string;
    serviceType?: 'live' | 'pre-recorded' | 'sim-live';
    color?: string;
    teams?: number[]; // Array of team IDs
    dayOfWeek?: string; // For Sim-Live section - day of the week
    destinationGroup?: string; // For Sim-Live section - destination group
};

export type TimeFormData = Omit<TimeItemType, 'id'> & { id?: number };

type HSLColor = {
    h: number;
    s: number;
    l: number;
};

interface TeamData {
    id: number;
    name: string;
}

interface TimeEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    triggerRef: React.RefObject<HTMLElement>;
    timeData: TimeFormData | null;
    section: 'eventDay' | 'rehearsal' | 'simLive' | 'other';
    onSave: (timeData: TimeFormData) => void;
    teams: TeamData[];
}

// Styled components
const FormGroup = styled.div`
    margin-bottom: ${theme.spacing.md};
`;

const Label = styled.label`
    display: block;
    margin-bottom: ${theme.spacing.xs};
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.text.secondary};
`;

const Input = styled.input`
    width: 100%;
    padding: ${theme.spacing.sm};
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSizes.sm};
    transition: all 0.2s ease;
    
    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 2px ${theme.colors.primary}20;
    }
`;

const Select = styled.select`
    width: 100%;
    padding: ${theme.spacing.sm};
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSizes.sm};
    transition: all 0.2s ease;
    
    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
        box-shadow: 0 0 0 2px ${theme.colors.primary}20;
    }

    option {
        background: ${theme.colors.card};
    }
`;

const MultiSelectContainer = styled.div`
    margin-top: ${theme.spacing.xs};
`;

const MultiSelectHeader = styled.div`
    padding: ${theme.spacing.sm};
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm} ${theme.borderRadius.sm} 0 0;
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSizes.sm};
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    &:hover {
        background: rgba(255, 255, 255, 0.15);
    }
`;

const ChevronIcon = styled.span<{ isOpen: boolean }>`
    font-size: 12px;
    transform: ${(props: { isOpen: boolean }) => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
    transition: transform 0.2s ease;
`;

const DropdownContainer = styled.div`
    max-height: 200px;
    overflow-y: auto;
    background: ${theme.colors.card};
    border: 1px solid ${theme.colors.border};
    border-top: none;
    border-radius: 0 0 ${theme.borderRadius.sm} ${theme.borderRadius.sm};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
`;

const DropdownItem = styled.div`
    padding: ${theme.spacing.sm};
    cursor: pointer;
    font-size: ${theme.typography.fontSizes.sm};
    transition: background 0.2s;
    display: flex;
    align-items: center;
    
    &:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    &:not(:last-child) {
        border-bottom: 1px solid ${theme.colors.border};
    }
`;

const CheckboxInput = styled.input`
    margin-right: ${theme.spacing.sm};
`;

const SearchInput = styled.input`
    width: 100%;
    padding: ${theme.spacing.xs};
    background: rgba(255, 255, 255, 0.05);
    border: none;
    border-bottom: 1px solid ${theme.colors.border};
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSizes.sm};
    &:focus {
        outline: none;
    }
`;

const SelectedCount = styled.span`
    background: ${theme.colors.primary};
    color: white;
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 11px;
    margin-left: ${theme.spacing.sm};
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${theme.spacing.sm};
    margin-top: ${theme.spacing.md};
`;

const CancelButton = styled.button`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    background: transparent;
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.fontSizes.sm};
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: ${theme.colors.background};
    }
`;

const SaveButton = styled.button`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border: none;
    border-radius: ${theme.borderRadius.sm};
    background: ${theme.colors.primary};
    color: white;
    font-size: ${theme.typography.fontSizes.sm};
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: ${theme.colors.primaryDark};
    }
`;

// TimeEditModal component
const TimeEditModal: React.FC<TimeEditModalProps> = ({
    isOpen,
    onClose,
    title,
    triggerRef,
    timeData,
    section,
    onSave,
    teams
}) => {
    // Local state for form data
    const [formData, setFormData] = useState<TimeFormData | null>(null);
    
    // Team selection state
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // Filtered teams based on search term
    const filteredTeams = useMemo(() => {
        return teams.filter(team => 
            team.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [teams, searchTerm]);
    
    // Add click outside handler to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);
    
    // Color picker state
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [hsla, setHsla] = useState<HSLColor>({ h: 210, s: 70, l: 50 });
    
    // Create refs for color picker
    const colorPickerRef = useRef<HTMLDivElement>(null);
    const hueSliderRef = useRef<HTMLDivElement>(null);
    
    // Update form data when timeData changes
    useEffect(() => {
        if (timeData) {
            setFormData(timeData);
            
            // Set HSL values for the color picker
            if (timeData.color) {
                setHsla(hexToHsl(timeData.color));
            }
        } else {
            // Default values
            setFormData({
                type: '',
                time: '',
                serviceType: section === 'simLive' ? 'sim-live' : undefined,
                color: '#4e7ac7',
                teams: [],
                dayOfWeek: section === 'simLive' ? 'Sunday' : undefined,
                destinationGroup: section === 'simLive' ? '' : undefined
            });
            setHsla(hexToHsl('#4e7ac7'));
        }
    }, [timeData, section]);
    
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
    
    // Handle color picker click/drag
    const handleColorPickerInteraction = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (!colorPickerRef.current || !formData) return;
        
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
        const newColor = hslToHex(newHsla.h, s, l);
        
        // Update form data color
        setFormData({
            ...formData,
            color: newColor
        });
    };
    
    // Handle hue slider click/drag
    const handleHueSliderInteraction = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (!hueSliderRef.current || !formData) return;
        
        const rect = hueSliderRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        
        // Calculate hue (0-360) based on position
        const h = Math.round((x / rect.width) * 360);
        
        // Create a new HSLA object to avoid stale state issues
        const newHsla = {
            ...hsla,
            h
        };
        
        setHsla(newHsla);
        const newColor = hslToHex(h, hsla.s, hsla.l);
        
        // Update form data color
        setFormData({
            ...formData,
            color: newColor
        });
    };
    
    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!formData) return;
        
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    // Handle team checkbox changes
    const handleTeamChange = (teamId: number, checked: boolean) => {
        if (!formData) return;
        
        const currentTeams = formData.teams || [];
        let newTeams: number[];
        
        if (checked) {
            // Add team if checked
            newTeams = [...currentTeams, teamId];
        } else {
            // Remove team if unchecked
            newTeams = currentTeams.filter(id => id !== teamId);
        }
        
        setFormData({
            ...formData,
            teams: newTeams
        });
    };
    
    // Handle save button click
    const handleSave = () => {
        if (formData) {
            onSave(formData);
        }
        onClose();
    };
    
    // HSL to Hex conversion
    const hslToHex = (h: number, s: number, l: number): string => {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = (n: number) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    };
    
    // Hex to HSL conversion
    const hexToHsl = (hex: string): HSLColor => {
        // Remove # if present
        hex = hex.replace(/^#/, '');
        
        // Parse the hex values
        let r, g, b;
        if (hex.length === 3) {
            r = parseInt(hex.charAt(0) + hex.charAt(0), 16) / 255;
            g = parseInt(hex.charAt(1) + hex.charAt(1), 16) / 255;
            b = parseInt(hex.charAt(2) + hex.charAt(2), 16) / 255;
        } else {
            r = parseInt(hex.substring(0, 2), 16) / 255;
            g = parseInt(hex.substring(2, 4), 16) / 255;
            b = parseInt(hex.substring(4, 6), 16) / 255;
        }
        
        // Find min and max values
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h = Math.round(h * 60);
        }
        
        s = Math.round(s * 100);
        l = Math.round(l * 100);
        
        return { h, s, l };
    };
    
    // If form data is not available, don't render the form
    if (!formData) return null;
    
    return (
        <ActionModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            triggerRef={triggerRef}
            maxWidth="350px"
        >
            <div>
                <FormGroup>
                    <Label>Type</Label>
                    <Input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        placeholder="e.g., Doors Open, Worship, etc."
                    />
                </FormGroup>
                
                {/* Day of Week - For all sections */}
                <FormGroup>
                    <Label>Day of Week</Label>
                    <Select
                        name="dayOfWeek"
                        value={formData.dayOfWeek || 'Sunday'}
                        onChange={handleInputChange}
                    >
                        <option value="Sunday">Sunday</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                    </Select>
                </FormGroup>
                
                <FormGroup>
                    <Label>Time</Label>
                    <Input
                        type="text"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        placeholder="e.g., 9:00 AM"
                    />
                </FormGroup>
                
                {/* Destination Group - Only for Sim-Live section */}
                {section === 'simLive' && (
                    <FormGroup>
                        <Label>Destination Group</Label>
                        <Select
                            name="destinationGroup"
                            value={formData.destinationGroup || ''}
                            onChange={handleInputChange}
                        >
                            <option value="">Select a destination group</option>
                            <option value="facebook">Facebook</option>
                            <option value="youtube">YouTube</option>
                            <option value="churchOnline">Church Online</option>
                            <option value="instagram">Instagram</option>
                        </Select>
                    </FormGroup>
                )}
                
                {/* Team Selection - Only for rehearsal and other sections */}
                {(section === 'rehearsal' || section === 'other') && (
                    <FormGroup>
                        <Label>Teams</Label>
                        <MultiSelectContainer ref={dropdownRef}>
                            <MultiSelectHeader onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                <div>
                                    Select Teams
                                    {formData.teams && formData.teams.length > 0 && (
                                        <SelectedCount>{formData.teams.length}</SelectedCount>
                                    )}
                                </div>
                                <ChevronIcon isOpen={isDropdownOpen}>▼</ChevronIcon>
                            </MultiSelectHeader>
                            
                            {isDropdownOpen && (
                                <DropdownContainer>
                                    <SearchInput
                                        type="text"
                                        placeholder="Search teams..."
                                        value={searchTerm}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                    />
                                    
                                    {filteredTeams.length > 0 ? (
                                        filteredTeams.map((team: TeamData) => (
                                            <DropdownItem
                                                key={team.id}
                                                onClick={(e: React.MouseEvent) => {
                                                    e.stopPropagation();
                                                    // Toggle team selection
                                                    const isSelected = formData.teams?.includes(team.id) || false;
                                                    handleTeamChange(team.id, !isSelected);
                                                }}
                                            >
                                                <CheckboxInput
                                                    type="checkbox"
                                                    checked={formData.teams?.includes(team.id) || false}
                                                    onChange={() => {}}
                                                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                                />
                                                {team.name}
                                            </DropdownItem>
                                        ))
                                    ) : (
                                        <div style={{ padding: theme.spacing.sm, color: theme.colors.text.secondary }}>
                                            No matching teams found
                                        </div>
                                    )}
                                </DropdownContainer>
                            )}
                        </MultiSelectContainer>
                    </FormGroup>
                )}
                
                {/* Color Picker */}
                <ColorPickerGroup>
                    <Label>Border Color</Label>
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
                                top={(100 - hsla.l)}
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
                            <HueSliderHandle
                                left={(hsla.h / 360) * 100}
                            />
                        </HueSlider>
                    </ColorPickerWrapper>
                </ColorPickerGroup>
                
                <ButtonGroup>
                    <CancelButton onClick={onClose}>Cancel</CancelButton>
                    <SaveButton onClick={handleSave}>Save</SaveButton>
                </ButtonGroup>
            </div>
        </ActionModal>
    );
};

export default TimeEditModal;
