import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../../theme/index';
import { SongExpandStateData } from '../../types/songInterfaces';
import SongList from './SongList';
import ElementList from './ElementList';
import HeaderList from './HeaderList';
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

// Main component props
interface EventSideTabsProps {
    activeTab: SidebarTab;
    setActiveTab: (tab: SidebarTab) => void;
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

const mockTimes = {
    schedule: [
        { id: 1, type: 'Sound Check', time: '8:00 AM' },
        { id: 2, type: 'Rehearsal', time: '8:30 AM' },
        { id: 3, type: 'Pre-Service Prayer', time: '9:30 AM' }
    ],
    eventDay: [
        { id: 4, type: 'Service Start', time: '10:00 AM' },
        { id: 5, type: 'Service End', time: '11:30 AM' }
    ],
    other: [
        { id: 6, type: 'Team Meeting', day: 'Thursday', time: '7:00 PM' },
        { id: 7, type: 'Setup', day: 'Saturday', time: '6:00 PM' }
    ]
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

// Time tab component
const TimeTab: React.FC = () => {
    return (
        <div>
            <SectionTitle>Event Day</SectionTitle>
            <div style={{ marginBottom: theme.spacing.lg }}>
                {mockTimes.eventDay.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing.sm, paddingBottom: theme.spacing.sm, borderBottom: `1px solid ${theme.colors.border}` }}>
                        <span>{item.type}</span>
                        <span>{item.time}</span>
                    </div>
                ))}
            </div>
            
            <SectionTitle>Pre Event Schedule</SectionTitle>
            <div style={{ marginBottom: theme.spacing.lg }}>
                {mockTimes.schedule.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing.sm, paddingBottom: theme.spacing.sm, borderBottom: `1px solid ${theme.colors.border}` }}>
                        <span>{item.type}</span>
                        <span>{item.time}</span>
                    </div>
                ))}
            </div>
            
            <SectionTitle>Other Important Times</SectionTitle>
            <div>
                {mockTimes.other.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing.sm, paddingBottom: theme.spacing.sm, borderBottom: `1px solid ${theme.colors.border}` }}>
                        <span>{item.type}</span>
                        <span>{item.day}, {item.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Song tab component
const SongTab: React.FC = () => {
    // Mock song list display that will be replaced by the main content area
    return (
        <div style={{ padding: theme.spacing.md, color: theme.colors.text.secondary, textAlign: 'center' }}>
            <p>Song list is now displayed in the main content area.</p>
            <p>Please refer to the main panel for Songs, Elements, and Headers.</p>
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

// Main component
const EventSideTabs: React.FC<EventSideTabsProps> = ({ activeTab, setActiveTab }) => {
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
                    {activeTab === SidebarTab.SONG && <SongTab />}
                    {activeTab === SidebarTab.PEOPLE && <PeopleTab />}
                </TabContent>
            </TabsContainer>
        </TabContainer>
    );
};

export default EventSideTabs;
