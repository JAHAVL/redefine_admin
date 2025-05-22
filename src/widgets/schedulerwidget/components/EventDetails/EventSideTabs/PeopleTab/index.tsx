import React, { useState, useEffect, useRef } from 'react';
import { theme } from '../../../../theme';
import ActionModal from '../../../modals/ActionModal';
import {
    TeamSectionTitle,
    TeamSection,
    TeamTitle,
    DepartmentItem,
    DepartmentTitle,
    PositionItem,
    PositionTitle,
    TeamMemberList,
    TeamMember,
    MemberActionsContainer,
    ActionIconButton,
    ActionButton,
    ModalOption,
    ScheduleEmptyState,
    StatusDot
} from './styles';

// Types definitions for the PeopleTab component
interface TeamData {
    id: number;
    name: string;
    departments: DepartmentData[];
}

interface DepartmentData {
    id: number;
    name: string;
    positions: PositionData[];
}

interface PositionData {
    id: number;
    name: string;
    members: TeamMemberData[];
}

interface TeamMemberData {
    id: number;
    name: string;
    status: 'confirmed' | 'pending' | 'declined';
}

interface StatusColors {
    [key: string]: string;
}

interface ModalOption {
    id: string;
    label: string;
    action: () => void;
}

// Mock team data for development
const mockTeams: TeamData[] = [
    {
        id: 1,
        name: 'Worship Team',
        departments: [
            {
                id: 1,
                name: 'Music',
                positions: [
                    {
                        id: 1,
                        name: 'Worship Leader',
                        members: [
                            { id: 1, name: 'John Smith', status: 'confirmed' },
                            { id: 2, name: 'Sarah Johnson', status: 'pending' }
                        ]
                    },
                    {
                        id: 2,
                        name: 'Vocalist',
                        members: [
                            { id: 3, name: 'Michael Brown', status: 'confirmed' },
                            { id: 4, name: 'Emily Davis', status: 'declined' },
                            { id: 5, name: 'Jessica Wilson', status: 'confirmed' }
                        ]
                    },
                    {
                        id: 3,
                        name: 'Guitarist',
                        members: [
                            { id: 6, name: 'David Lee', status: 'confirmed' },
                            { id: 7, name: 'Robert Thompson', status: 'pending' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        name: 'Tech Team',
        departments: [
            {
                id: 2,
                name: 'Audio/Visual',
                positions: [
                    {
                        id: 4,
                        name: 'Sound Engineer',
                        members: [
                            { id: 8, name: 'Chris Wilson', status: 'confirmed' }
                        ]
                    },
                    {
                        id: 5,
                        name: 'ProPresenter',
                        members: [
                            { id: 9, name: 'Amanda Lewis', status: 'declined' },
                            { id: 10, name: 'Ryan Moore', status: 'pending' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        name: 'Host Team',
        departments: [
            {
                id: 3,
                name: 'Greeters',
                positions: [
                    {
                        id: 6,
                        name: 'Front Door',
                        members: [
                            { id: 11, name: 'Lisa Davis', status: 'confirmed' },
                            { id: 12, name: 'Kevin Martin', status: 'confirmed' }
                        ]
                    },
                    {
                        id: 7,
                        name: 'Sanctuary',
                        members: [
                            { id: 13, name: 'Patricia Clark', status: 'pending' }
                        ]
                    }
                ]
            }
        ]
    }
];

/**
 * PeopleTab Component
 * 
 * Displays a team management interface for organizing event personnel
 */
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
                data-component-name="P"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-component-name="AddButton">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12" data-component-name="AddButton"></line>
                </svg>
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

export default PeopleTab;
