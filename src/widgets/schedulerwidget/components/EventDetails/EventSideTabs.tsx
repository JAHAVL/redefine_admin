import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/index';
import { SongExpandStateData } from '../../types/songInterfaces';
import SongList from './SongList';
import ElementList from './ElementList';
import HeaderList from './HeaderList';
import SongLibrary from './SongLibrary';
import { ActionModal } from '../../../WidgetTemplate/components/modals';

// Types
export enum SidebarTab {
    TIME = 'time',
    SONG = 'songs',
    PEOPLE = 'people'
}

// Interfaces for proper TypeScript type safety
interface TeamMemberData {
    id: number;
    name: string;
    status: 'confirmed' | 'pending' | 'declined';
}

interface PositionData {
    id: number;
    name: string;
    members: TeamMemberData[];
}

interface DepartmentData {
    id: number;
    name: string;
    positions: PositionData[];
}

interface TeamData {
    id: number;
    name: string;
    departments: DepartmentData[];
}

interface StatusColors {
    confirmed: string;
    pending: string;
    declined: string;
}

interface ModalOption {
    id: string;
    label: string;
    icon?: string;
    action: () => void;
}

// Song type definition matching the SongLibrary component
interface Song {
    id: number;
    title: string;
    artist: string;
    key?: string;
    bpm?: number;
}

// Main component props
interface EventSideTabsProps {
    activeTab: SidebarTab;
    setActiveTab: (tab: SidebarTab) => void;
    onSongDrop?: (song: Song, dropIndex?: number) => void;
    onExternalSongSet?: (song: Song) => void;  // New prop for setting external song reference
}

// Mock data for tabs 
// These would normally come from API calls but we're using mock data for now
const mockSongList = [
    { id: 1, title: 'Amazing Grace', artist: 'John Newton', key: 'G', bpm: 78 },
    { id: 2, title: 'How Great is Our God', artist: 'Chris Tomlin', key: 'C', bpm: 86 },
    { id: 3, title: 'Good Good Father', artist: 'Chris Tomlin', key: 'A', bpm: 72 },
    { id: 4, title: 'Build My Life', artist: 'Housefires', key: 'D', bpm: 68 },
];

// Note: Elements and Headers components have been moved to the main content area in EventDetailView

// Time type interface
interface TimeItem {
    id: number;
    type: string;
    time: string;
    day?: string;
    serviceType?: 'live' | 'pre-recorded' | 'sim-live';
}

// Mock time data
const mockTimes = {
    schedule: [
        { id: 1, type: 'Sound Check', time: '8:00 AM' },
        { id: 2, type: 'Rehearsal', time: '8:30 AM' },
        { id: 3, type: 'Pre-Service Prayer', time: '9:30 AM' }
    ] as TimeItem[],
    eventDay: [
        { id: 4, type: 'Service Start', time: '10:00 AM', serviceType: 'live' },
        { id: 5, type: 'Service End', time: '11:30 AM' },
        { id: 8, type: 'Online Service', time: '12:30 PM', serviceType: 'sim-live' }
    ] as TimeItem[],
    other: [
        { id: 6, type: 'Team Meeting', day: 'Thursday', time: '7:00 PM' },
        { id: 7, type: 'Setup', day: 'Saturday', time: '6:00 PM' }
    ] as TimeItem[]
};

// Mock team data for the team schedule
const mockTeams: TeamData[] = [
    {
        id: 1,
        name: 'Worship Team',
        departments: [
            {
                id: 1,
                name: 'Worship',
                positions: [
                    {
                        id: 1,
                        name: 'Worship Leader',
                        members: [
                            { id: 1, name: 'John Doe', status: 'confirmed' }
                        ]
                    },
                    {
                        id: 2,
                        name: 'Vocalist',
                        members: [
                            { id: 2, name: 'Jane Smith', status: 'confirmed' },
                            { id: 3, name: 'Emma Wilson', status: 'pending' }
                        ]
                    },
                ]
            }
        ]
    },
    {
        id: 2,
        name: 'Production Team',
        departments: [
            {
                id: 2,
                name: 'Audio',
                positions: [
                    {
                        id: 3,
                        name: 'Sound Engineer',
                        members: [
                            { id: 4, name: 'David Brown', status: 'confirmed' }
                        ]
                    }
                ]
            },
            {
                id: 3,
                name: 'Visual',
                positions: [
                    {
                        id: 4,
                        name: 'ProPresenter',
                        members: [
                            { id: 5, name: 'Michael Scott', status: 'pending' }
                        ]
                    }
                ]
            }
        ]
    }
];

// Styled components
const TabContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const TabContent = styled.div`
    padding: ${theme.spacing.sm} 0;
    width: 100%;
    box-sizing: border-box;
    flex: 0 0 auto;
    overflow: hidden;
    min-width: 100%;
    max-width: 100%; /* Force consistent width */
`;

// Common SectionTitle component to be used across tabs
const SectionTitle = styled.div`
    font-weight: ${theme.typography.fontWeights.semibold};
    font-size: ${theme.typography.fontSizes.md};
    margin: 0;
    padding: 0;
    margin-bottom: ${theme.spacing.sm};
    color: ${theme.colors.text.primary};
`;

const TabsContainer = styled.div`
    width: 100%;
    box-sizing: border-box;
    flex: 0 0 auto;
    overflow: hidden;
    min-width: var(--container-width, 100%);
    max-width: var(--container-width, 100%);
    /* Add this to force the container to maintain a fixed width */
    & > * {
        width: 100%;
        box-sizing: border-box;
    }
`;

const TabButtons = styled.div`
    display: flex;
    border-bottom: 1px solid ${theme.colors.border};
    width: 100%;
`;

const TabButton = styled.button<{ active: boolean }>`
    flex: 1;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    background: ${(props: { active: boolean }) => props.active ? theme.colors.primary : 'transparent'};
    color: ${(props: { active: boolean }) => props.active ? theme.colors.text.white : theme.colors.text.primary};
    border: none;
    border-bottom: ${(props: { active: boolean }) => props.active ? `2px solid ${theme.colors.primaryDark}` : 'none'};
    cursor: pointer;
    font-weight: ${(props: { active: boolean }) => props.active ? theme.typography.fontWeights.bold : theme.typography.fontWeights.medium};
    font-size: ${theme.typography.fontSizes.md};
    transition: all 0.2s ease;
    
    &:hover {
        background: ${(props: { active: boolean }) => props.active ? theme.colors.primary : 'rgba(52, 120, 255, 0.1)'};
    }
`;

// Floating action button component that stays on top of the sidebar
const ActionButton = styled.button`
    position: fixed;
    right: 200px;
    bottom: 40px;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: ${theme.colors.primary};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    border: none;
    cursor: pointer;
    z-index: 1000;
    font-size: 24px;
    transition: all 0.2s ease-in-out;
    
    &:hover {
        background-color: ${theme.colors.primaryDark};
        transform: scale(1.05);
    }
    
    &:focus {
        outline: none;
    }
`;

// Modal option styling - used with ActionModal
const ModalOption = styled.div`
    padding: ${theme.spacing.sm};
    cursor: pointer;
    border-radius: ${theme.borderRadius.sm};
    display: flex;
    align-items: center;
    font-size: ${theme.typography.fontSizes.sm};
    transition: all 0.2s;
    color: white;
    
    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

// Team components
const TeamSectionTitle = styled.h2`
    font-size: ${theme.typography.fontSizes.lg};
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.sm};
    margin: 0;
`;

const ScheduleEmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing.md};
    border: 1px dashed ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    text-align: center;
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing.md};
    font-size: ${theme.typography.fontSizes.sm};
`;

const RemoveButton = styled.button`
    background: none;
    border: none;
    color: ${theme.colors.danger};
    cursor: pointer;
    padding: 4px;
    margin-left: ${theme.spacing.xs};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    
    &:hover {
        background-color: rgba(255, 0, 0, 0.1);
    }
`;

const ActionIconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    margin-left: ${theme.spacing.xs};
    
    &.chat {
        color: ${theme.colors.primary};
        &:hover {
            background-color: rgba(52, 120, 255, 0.1);
        }
    }
    
    &.email {
        color: ${theme.colors.success};
        &:hover {
            background-color: rgba(76, 175, 80, 0.1);
        }
    }
    
    &.delete {
        color: ${theme.colors.danger};
        &:hover {
            background-color: rgba(255, 0, 0, 0.1);
        }
    }
`;

// Function to generate team color based on team id
const getTeamColor = (teamId: number): string => {
    // Array of team color options that work well on dark backgrounds
    const teamColors = [
        'rgba(52, 120, 255, 0.08)',   // Blue
        'rgba(76, 175, 80, 0.08)',    // Green
        'rgba(255, 152, 0, 0.08)',    // Orange
        'rgba(156, 39, 176, 0.08)',   // Purple
        'rgba(0, 188, 212, 0.08)',    // Cyan
        'rgba(233, 30, 99, 0.08)',    // Pink
        'rgba(255, 180, 0, 0.08)'     // Gold/Yellow
    ];
    return teamColors[teamId % teamColors.length];
};

const MemberActionsContainer = styled.div`
    position: absolute;
    right: ${theme.spacing.sm};
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s, visibility 0.2s;
    z-index: 10;
    background-color: rgba(34, 34, 34, 0.7);
    backdrop-filter: blur(2px);
    border-radius: ${theme.borderRadius.sm};
    padding: 2px;
`;

const TeamSection = styled.div<{ teamId: number }>`
    margin-bottom: ${theme.spacing.md};
    background-color: ${(props: { teamId: number }) => getTeamColor(props.teamId)};
    border-radius: ${theme.borderRadius.sm};
    padding: ${theme.spacing.sm};
    border: 1px solid ${(props: { teamId: number }) => getTeamColor(props.teamId).replace('0.08', '0.2')};
`;

const TeamTitle = styled.h3`
    font-size: ${theme.typography.fontSizes.md};
    color: ${theme.colors.text.primary};
    font-weight: ${theme.typography.fontWeights.bold};
    margin: 0;
    margin-bottom: ${theme.spacing.sm};
`;

const DepartmentItem = styled.div`
    margin: ${theme.spacing.sm} 0;
    padding: ${theme.spacing.xs};
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: ${theme.borderRadius.sm};
`;

const DepartmentTitle = styled.h4`
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.text.primary};
    font-weight: ${theme.typography.fontWeights.medium};
    margin-bottom: ${theme.spacing.xs};
    padding-left: ${theme.spacing.xs};
`;

const PositionItem = styled.div`
    margin: ${theme.spacing.sm} 0;
    padding-left: 0;
`;

const PositionTitle = styled.h5`
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.text.primary};
    font-weight: ${theme.typography.fontWeights.medium};
    margin-bottom: ${theme.spacing.xs};
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const TeamMemberList = styled.div`
    margin-top: ${theme.spacing.xs};
    display: flex;
    flex-direction: column;
`;

const TeamMember = styled.div`
    padding: ${theme.spacing.xs} ${theme.spacing.xs};
    display: flex;
    align-items: center;
    min-height: 32px;
    margin-left: 0;
    border-bottom: 1px solid ${theme.colors.border};
    position: relative;
    
    &:hover {
        background-color: rgba(255, 255, 255, 0.05);
        
        .member-actions {
            opacity: 1;
            visibility: visible;
        }
    }
`;

const StatusDot = styled.div<{ status: string }>`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: ${theme.spacing.sm};
    background-color: ${(props: { status: string }) => {
        switch(props.status) {
            case 'confirmed':
                return theme.colors.success;
            case 'pending':
                return theme.colors.warning;
            case 'declined':
                return theme.colors.danger;
            default:
                return theme.colors.border;
        }
    }};
`;

// Styled components for the Time tab
// Create a forwarded ref version of the TimeItem component
const TimeItemBase = styled.div<{ color?: string }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacing.sm};
    padding: ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.sm};
    background: ${theme.colors.card};
    border-left: 3px solid ${(props: { color?: string }) => props.color || theme.colors.primary};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
    
    &:hover {
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
    }
`;

// Forward ref to allow TimeItem to accept refs
const TimeItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { color?: string }>((props, ref) => {
    const { color, ...restProps } = props;
    return <TimeItemBase ref={ref} color={color} {...restProps} />;
});

const TimeTypeTag = styled.span<{ serviceType?: string }>`
    font-size: ${theme.typography.fontSizes.sm};
    font-weight: ${theme.typography.fontWeights.medium};
    color: ${theme.colors.text.primary};
    display: flex;
    align-items: center;
`;

const TimeValue = styled.span`
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.text.secondary};
    display: flex;
    align-items: center;
`;

// Define common form components
const Label = styled.label`
    display: block;
    margin-bottom: ${theme.spacing.xs};
    font-size: ${theme.typography.fontSizes.sm};
    font-weight: ${theme.typography.fontWeights.medium};
    color: ${theme.colors.text.primary};
`;

const Input = styled.input`
    width: 100%;
    padding: ${theme.spacing.sm};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.text.primary};
    background: ${theme.colors.background};
    transition: border-color 0.2s ease;
    
    &:focus {
        outline: none;
        border-color: ${theme.colors.primary};
    }
    
    &::placeholder {
        color: ${theme.colors.text.secondary};
    }
`;

// Define the TimeItem interface
interface TimeItem {
    id: number;
    type: string;
    time: string;
    day?: string;
    serviceType?: 'live' | 'pre-recorded' | 'sim-live';
}

const ServiceTypeBadge = styled.span<{ type?: 'live' | 'pre-recorded' | 'sim-live' }>`
    font-size: ${theme.typography.fontSizes.xs};
    padding: 2px 6px;
    border-radius: 12px;
    margin-left: ${theme.spacing.xs};
    background: ${(props: { type?: 'live' | 'pre-recorded' | 'sim-live' }) => {
        switch (props.type) {
            case 'live': return theme.colors.success + '20';
            case 'pre-recorded': return theme.colors.warning + '20';
            case 'sim-live': return theme.colors.info + '20';
            default: return theme.colors.background;
        }
    }};
    color: ${(props: { type?: 'live' | 'pre-recorded' | 'sim-live' }) => {
        switch (props.type) {
            case 'live': return theme.colors.success;
            case 'pre-recorded': return theme.colors.warning;
            case 'sim-live': return theme.colors.info;
            default: return theme.colors.text.secondary;
        }
    }};
`;

const AddTimeButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: ${theme.spacing.sm};
    margin-top: ${theme.spacing.sm};
    background: ${theme.colors.background};
    border: 1px dashed ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    color: ${theme.colors.primary};
    font-size: ${theme.typography.fontSizes.sm};
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: ${theme.colors.highlight};
        border-color: ${theme.colors.primary};
    }
    
    svg {
        margin-right: ${theme.spacing.xs};
    }
`;

const NoTimesMessage = styled.div`
    padding: ${theme.spacing.md};
    text-align: center;
    color: ${theme.colors.text.secondary};
    font-style: italic;
    background: ${theme.colors.background};
    border-radius: ${theme.borderRadius.sm};
    margin-bottom: ${theme.spacing.md};
`;

const TimeSection = styled.div`
    margin-bottom: ${theme.spacing.lg};
`;

// Color picker styled components
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
    background: white;
    border-radius: 4px;
    top: 50%;
    left: ${(props: { left: number }): string => `${props.left}%`};
    transform: translate(-50%, -50%);
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
    pointer-events: none;
`;

const ColorPreview = styled.div<{ color: string }>`
    width: 100%;
    height: 30px;
    margin-top: ${theme.spacing.sm};
    background-color: ${(props: { color: string }): string => props.color};
    border-radius: ${theme.borderRadius.sm};
    border: 1px solid rgba(0, 0, 0, 0.1);
`;

// HSL color type for the color picker
interface HSLColor {
    h: number; // 0-360
    s: number; // 0-100
    l: number; // 0-100
}

// Color conversion utility functions
const hexToHsl = (hex: string): HSLColor => {
    // Default to primary color if hex is invalid
    if (!hex || !/^#[0-9A-F]{6}$/i.test(hex)) {
        hex = theme.colors.primary;
    }
    
    // Convert hex to RGB
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;
    
    // Find min and max RGB values
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    
    // Calculate lightness
    let l = (max + min) / 2;
    
    // Calculate saturation
    let s = 0;
    if (max !== min) {
        s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
    }
    
    // Calculate hue
    let h = 0;
    if (max !== min) {
        if (max === r) {
            h = (g - b) / (max - min) + (g < b ? 6 : 0);
        } else if (max === g) {
            h = (b - r) / (max - min) + 2;
        } else {
            h = (r - g) / (max - min) + 4;
        }
        h *= 60;
    }
    
    return {
        h: Math.round(h),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
};

const hslToHex = (h: number, s: number, l: number): string => {
    // Convert to 0-1 range
    h = h % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;
    
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

// Time management form for the modal
interface TimeFormData {
    id?: number;
    type: string;
    time: string;
    day?: string;
    serviceType?: 'live' | 'pre-recorded' | 'sim-live';
    color?: string; // Hex color for the left border
}

// Time tab component
const TimeTab: React.FC = () => {
    // Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<'eventDay' | 'schedule' | 'other'>('eventDay');
    const [currentTimeItem, setCurrentTimeItem] = useState<TimeFormData | null>(null);
    
    // Color picker state
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [hsla, setHsla] = useState<HSLColor>({ h: 210, s: 70, l: 50 }); // Default blue
    
    // Create refs for color picker
    const colorPickerRef = useRef<HTMLDivElement>(null);
    const hueSliderRef = useRef<HTMLDivElement>(null);
    
    // Create refs for buttons
    const eventDayAddButtonRef = useRef<HTMLButtonElement>(null);
    const scheduleAddButtonRef = useRef<HTMLButtonElement>(null);
    const otherAddButtonRef = useRef<HTMLButtonElement>(null);
    
    // Create refs for items that can be clicked to edit (we'll create these dynamically)
    const itemRefs = useRef<{ [id: number]: React.RefObject<HTMLDivElement> }>({});
    
    // Current active element reference for modal positioning
    const [activeElementRef, setActiveElementRef] = useState<React.RefObject<HTMLElement> | null>(null);
    
    // Initialize or get a ref for a time item
    const getItemRef = (id: number) => {
        if (!itemRefs.current[id]) {
            itemRefs.current[id] = React.createRef<HTMLDivElement>();
        }
        return itemRefs.current[id];
    };
    
    // Open add time modal
    const handleAddTime = (section: 'eventDay' | 'schedule' | 'other') => {
        setSelectedSection(section);
        setCurrentTimeItem({
            type: '',
            time: '',
            day: section === 'other' ? 'Monday' : undefined,
            serviceType: section === 'eventDay' ? 'live' : undefined
        });
        
        // Set the active button reference based on the section
        let ref: React.RefObject<HTMLElement> | null = null;
        switch (section) {
            case 'eventDay':
                ref = eventDayAddButtonRef as unknown as React.RefObject<HTMLElement>;
                break;
            case 'schedule':
                ref = scheduleAddButtonRef as unknown as React.RefObject<HTMLElement>;
                break;
            case 'other':
                ref = otherAddButtonRef as unknown as React.RefObject<HTMLElement>;
                break;
        }
        
        setActiveElementRef(ref);
        setIsAddModalOpen(true);
    };
    
    // Open edit time modal
    const handleEditTime = (item: TimeItem, section: 'eventDay' | 'schedule' | 'other') => {
        setSelectedSection(section);
        setCurrentTimeItem({
            id: item.id,
            type: item.type,
            time: item.time,
            day: item.day,
            serviceType: item.serviceType
        });
        
        // Use the ref for this item for positioning
        setActiveElementRef(getItemRef(item.id) as unknown as React.RefObject<HTMLElement>);
        setIsEditModalOpen(true);
    };
    
    // Save time (mock implementation)
    const handleSaveTime = () => {
        // Here you would typically make an API call to save the time
        console.log('Saving time:', currentTimeItem);
        
        // Close modals
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
    };
    
    // Render service type badge if applicable
    const renderServiceTypeBadge = (serviceType?: 'live' | 'pre-recorded' | 'sim-live') => {
        if (!serviceType) return null;
        
        return (
            <ServiceTypeBadge type={serviceType}>
                {serviceType === 'live' ? 'Live' : 
                 serviceType === 'pre-recorded' ? 'Pre-recorded' : 'Sim-Live'}
            </ServiceTypeBadge>
        );
    };
    
    // Render a section of time items
    const renderTimeSection = (
        title: string, 
        items: TimeItem[], 
        section: 'eventDay' | 'schedule' | 'other'
    ) => (
        <TimeSection>
            <SectionTitle>{title}</SectionTitle>
            {items.length > 0 ? (
                <>
                    {items.map(item => (
                        <TimeItem 
                            key={item.id} 
                            ref={getItemRef(item.id)}
                            onClick={() => handleEditTime(item, section)}
                        >
                            <TimeTypeTag>
                                {item.type}
                                {renderServiceTypeBadge(item.serviceType)}
                            </TimeTypeTag>
                            <TimeValue>
                                {item.day ? `${item.day}, ` : ''}
                                {item.time}
                            </TimeValue>
                        </TimeItem>
                    ))}
                </>
            ) : (
                <NoTimesMessage>No times scheduled</NoTimesMessage>
            )}
            <AddTimeButton 
                ref={section === 'eventDay' ? eventDayAddButtonRef : 
                     section === 'schedule' ? scheduleAddButtonRef : 
                     otherAddButtonRef}
                onClick={() => handleAddTime(section)}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Time
            </AddTimeButton>
        </TimeSection>
    );
    
    // Render the time form for the modal
    const renderTimeForm = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
            <div>
                <Label htmlFor="time-type">Event Type</Label>
                <Input 
                    id="time-type"
                    type="text"
                    placeholder="e.g., Service Start, Sound Check"
                    value={currentTimeItem?.type || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentTimeItem(prev => ({ ...prev!, type: e.target.value }))}
                />
            </div>
            
            <div>
                <Label htmlFor="time-value">Time</Label>
                <Input 
                    id="time-value"
                    type="text"
                    placeholder="e.g., 10:00 AM"
                    value={currentTimeItem?.time || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentTimeItem(prev => ({ ...prev!, time: e.target.value }))}
                />
            </div>
            
            {selectedSection === 'other' && (
                <div>
                    <Label htmlFor="time-day">Day</Label>
                    <Input 
                        id="time-day"
                        type="text"
                        placeholder="e.g., Monday"
                        value={currentTimeItem?.day || ''}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCurrentTimeItem(prev => ({ ...prev!, day: e.target.value }))}
                    />
                </div>
            )}
            
            {selectedSection === 'eventDay' && (
                <div>
                    <Label htmlFor="service-type">Service Type</Label>
                    <select
                        id="service-type"
                        value={currentTimeItem?.serviceType || 'live'}
                        onChange={(e) => setCurrentTimeItem(prev => ({ 
                            ...prev!, 
                            serviceType: e.target.value as 'live' | 'pre-recorded' | 'sim-live' 
                        }))}
                        style={{
                            width: '100%',
                            padding: theme.spacing.sm,
                            borderRadius: theme.borderRadius.sm,
                            border: `1px solid ${theme.colors.border}`,
                            background: theme.colors.background,
                            color: theme.colors.text.primary
                        }}
                    >
                        <option value="live">Live</option>
                        <option value="pre-recorded">Pre-recorded</option>
                        <option value="sim-live">Sim-Live</option>
                    </select>
                </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: theme.spacing.sm, marginTop: theme.spacing.sm }}>
                <button 
                    onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                    style={{
                        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                        background: 'transparent',
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: theme.borderRadius.sm,
                        color: theme.colors.text.primary,
                        cursor: 'pointer'
                    }}
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSaveTime}
                    style={{
                        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                        background: theme.colors.primary,
                        border: `1px solid ${theme.colors.primary}`,
                        borderRadius: theme.borderRadius.sm,
                        color: theme.colors.text.white,
                        cursor: 'pointer'
                    }}
                >
                    Save
                </button>
            </div>
        </div>
    );

    return (
        <div>
            {renderTimeSection('Event Day', mockTimes.eventDay, 'eventDay')}
            {renderTimeSection('Pre-Event Schedule', mockTimes.schedule, 'schedule')}
            {renderTimeSection('Other Important Times', mockTimes.other, 'other')}
            
            {/* Add Time Modal */}
            {activeElementRef && (
                <ActionModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    title="Add New Time"
                    triggerRef={activeElementRef}
                >
                    {renderTimeForm()}
                </ActionModal>
            )}
            
            {/* Edit Time Modal */}
            {activeElementRef && (
                <ActionModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    title="Edit Time"
                    triggerRef={activeElementRef}
                >
                    {renderTimeForm()}
                </ActionModal>
            )}
        </div>
    );
};

// Song tab component - Displays a library of songs that can be dragged to the event program
interface SongTabProps {
    onSongDrop?: (song: Song, dropIndex?: number) => void;
    onExternalSongSet?: (song: Song) => void;  // New prop for setting external song reference
}

const SongTab: React.FC<SongTabProps> = ({ onSongDrop, onExternalSongSet }) => {
    // Handlers for drag and drop events
    const handleDragStart = (song: Song): void => {
        console.log('Started dragging song:', song.title);
        
        // Set the song as the current external song being dragged
        if (onExternalSongSet) {
            onExternalSongSet(song);
        }
    };
    
    const handleDragEnd = (song: Song, evt?: any): void => {
        console.log('Finished dragging song:', song.title);
        
        // We don't need to call onSongDrop here anymore
        // The handleReorderItems function in EventDetailView will handle it
        // This prevents adding the song twice
        
        // For debugging, we'll just log the drag end event
        if (evt && evt.to && evt.to !== evt.from) {
            console.log('Song was dropped in the event list');
        } else {
            console.log('Song was not dropped in a valid target');
        }
    };
    
    return (
        <div style={{ height: 'calc(100vh - 200px)' }}>
            <SongLibrary 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd} 
            />
        </div>
    );
};

// People tab component
const PeopleTab: React.FC = () => {
    // State for modal visibility and button position
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    
    // Handle clicks outside modal
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setIsModalOpen(false);
            }
        };
        
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    
    // Function to close modal
    const handleCloseModal = (): void => {
        setIsModalOpen(false);
    };
    
    // Status colors mapping
    const statusColors: StatusColors = {
        confirmed: theme.colors.success,
        pending: theme.colors.warning,
        declined: theme.colors.danger
    };
    
    // Modal options
    const modalOptions: ModalOption[] = [
        {
            id: 'add-team',
            label: 'Add Team',
            action: () => {
                console.log('Add team action');
                handleCloseModal();
            }
        },
        {
            id: 'load-template',
            label: 'Load Template',
            action: () => {
                console.log('Load template action');
                handleCloseModal();
            }
        },
        {
            id: 'save-template',
            label: 'Save Template',
            action: () => {
                console.log('Save template action');
                handleCloseModal();
            }
        },
        {
            id: 'view-templates',
            label: 'View Templates',
            action: () => {
                console.log('View templates action');
                handleCloseModal();
            }
        }
    ];
    
    return (
        <div style={{ position: 'relative', paddingBottom: '50px', overflow: 'visible' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '1rem' }}>
                <TeamSectionTitle style={{ margin: 0, textAlign: 'left', borderLeft: `4px solid ${theme.colors.primary}`, paddingLeft: '1rem' }}>Team Schedule</TeamSectionTitle>
            </div>
            
            {mockTeams.length === 0 ? (
                <ScheduleEmptyState>
                    <span style={{ fontSize: theme.typography.fontSizes.md, marginBottom: theme.spacing.sm }}>No teams scheduled</span>
                    <p>
                        Add teams to this event to help organize your personnel. 
                        You can create custom teams or use templates.
                    </p>
                </ScheduleEmptyState>
            ) : (
                mockTeams.map((team: TeamData) => (
                    <TeamSection key={team.id} teamId={team.id}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: theme.spacing.sm
                        }}>
                            <TeamTitle>
                                <div style={{ 
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    textAlign: 'left',
                                    marginLeft: 0
                                }}>
                                    {team.name}
                                </div>
                            </TeamTitle>
                        </div>
                        
                        {team.departments.map((department: DepartmentData) => (
                            <DepartmentItem key={department.id}>
                                <DepartmentTitle>
                                    <div style={{ 
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        textAlign: 'left',
                                        marginLeft: 0,
                                        padding: '0.25rem 0.5rem',
                                        backgroundColor: theme.colors.card,
                                        borderRadius: '4px'
                                    }}>
                                        {department.name}
                                    </div>
                                </DepartmentTitle>
                                
                                {department.positions.map((position: PositionData) => (
                                    <PositionItem key={position.id}>
                                        <PositionTitle>
                                            <div style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '0.5rem',
                                                textAlign: 'left',
                                                marginLeft: 0,
                                                padding: '0.25rem 0.5rem',
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                borderRadius: '4px'
                                            }}>
                                                {position.name}
                                            </div>
                                            <div style={{ 
                                                fontSize: '0.75rem', 
                                                color: theme.colors.primary,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: theme.spacing.sm
                                            }}>
                                                <span>
                                                    {position.members.filter((m: TeamMemberData) => m.status === 'confirmed').length}/{position.members.length} confirmed
                                                </span>
                                            </div>
                                        </PositionTitle>
                                        
                                        <TeamMemberList>
                                            {position.members.map((member: TeamMemberData) => (
                                                <TeamMember key={member.id}>
                                                    <div style={{ 
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        textAlign: 'left',
                                                        width: '100%',
                                                        marginLeft: 0
                                                    }}>
                                                        <StatusDot status={member.status} />
                                                        <span style={{ fontWeight: 500, flex: 1 }}>{member.name}</span>
                                                        <MemberActionsContainer className="member-actions">
                                                            <ActionIconButton className="chat" title="Chat">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.418 16.97 20 12 20C10.5 20 9.062 19.684 7.8 19.1L3 20L4.3 16.1C3.5 14.9 3 13.5 3 12C3 7.582 7.03 4 12 4C16.97 4 21 7.582 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                </svg>
                                                            </ActionIconButton>
                                                            <ActionIconButton className="email" title="Email">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                </svg>
                                                            </ActionIconButton>
                                                            <ActionIconButton className="delete" title="Delete">
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M3 6H5H21M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M10 11V17M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                                </svg>
                                                            </ActionIconButton>
                                                        </MemberActionsContainer>
                                                    </div>
                                                </TeamMember>
                                            ))}
                                        </TeamMemberList>
                                    </PositionItem>
                                ))}
                            </DepartmentItem>
                        ))}
                    </TeamSection>
                ))
            )}
            
            {/* Floating action button */}
            <ActionButton 
                ref={buttonRef}
                onClick={() => {
                    if (buttonRef.current) {
                        setButtonRect(buttonRef.current.getBoundingClientRect());
                        setIsModalOpen(!isModalOpen);
                    }
                }}
            >
                +
            </ActionButton>
            
            {/* Action Modal with team options */}
            <ActionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                triggerRef={buttonRef}
                title="Team Options"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {modalOptions.map((option: ModalOption) => (
                        <ModalOption key={option.id} onClick={option.action}>
                            {option.label}
                        </ModalOption>
                    ))}
                </div>
            </ActionModal>
        </div>
    );
};

// Main component - Sidebar tabs for event detail view
const EventSideTabs: React.FC<EventSideTabsProps> = ({ activeTab, setActiveTab, onSongDrop, onExternalSongSet }) => {
    return (
        <TabContainer>
            <TabsContainer>
                <TabButtons>
                    <TabButton 
                        active={activeTab === SidebarTab.TIME} 
                        onClick={() => setActiveTab(SidebarTab.TIME)}
                    >
                        Time
                    </TabButton>
                    <TabButton 
                        active={activeTab === SidebarTab.SONG} 
                        onClick={() => setActiveTab(SidebarTab.SONG)}
                    >
                        Songs
                    </TabButton>
                    <TabButton 
                        active={activeTab === SidebarTab.PEOPLE} 
                        onClick={() => setActiveTab(SidebarTab.PEOPLE)}
                    >
                        People
                    </TabButton>
                </TabButtons>
                
                <TabContent>
                    {activeTab === SidebarTab.TIME && <TimeTab />}
                    {activeTab === SidebarTab.SONG && <SongTab onSongDrop={onSongDrop} onExternalSongSet={onExternalSongSet} />}
                    {activeTab === SidebarTab.PEOPLE && <PeopleTab />}
                </TabContent>
            </TabsContainer>
        </TabContainer>
    );
};

export default EventSideTabs;
