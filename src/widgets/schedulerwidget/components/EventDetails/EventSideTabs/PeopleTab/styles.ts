import styled from 'styled-components';
import { theme } from '../../../../theme';

// Function to generate team color based on team id
const getTeamColor = (teamId: number): string => {
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

// People tab styled components
export const TeamSectionTitle = styled.h3`
    font-size: ${theme.typography.fontSizes.md};
    font-weight: ${theme.typography.fontWeights.semibold};
    margin-bottom: ${theme.spacing.sm};
    color: ${theme.colors.text.primary};
`;

export const TeamSection = styled.div<{ teamId: number }>`
    margin-bottom: ${theme.spacing.md};
    background-color: ${(props: { teamId: number }) => getTeamColor(props.teamId)};
    border-radius: ${theme.borderRadius.sm};
    padding: ${theme.spacing.sm};
    border: 1px solid ${(props: { teamId: number }) => getTeamColor(props.teamId).replace('0.08', '0.2')};
`;

export const TeamTitle = styled.h4`
    font-size: ${theme.typography.fontSizes.md};
    font-weight: ${theme.typography.fontWeights.semibold};
    margin: 0;
    color: ${theme.colors.text.primary};
`;

export const DepartmentItem = styled.div`
    margin-top: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.sm};
    background: rgba(55, 65, 81, 0.05);
    border-radius: ${theme.borderRadius.sm};
    padding: ${theme.spacing.sm};
`;

export const DepartmentTitle = styled.h5`
    font-size: ${theme.typography.fontSizes.sm};
    font-weight: ${theme.typography.fontWeights.medium};
    margin: 0 0 ${theme.spacing.sm} 0;
    color: ${theme.colors.text.primary};
`;

export const PositionItem = styled.div`
    margin-left: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.sm};
`;

export const PositionTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: ${theme.typography.fontSizes.sm};
    font-weight: ${theme.typography.fontWeights.medium};
    margin-bottom: ${theme.spacing.xs};
    color: ${theme.colors.text.primary};
`;

export const TeamMemberList = styled.div`
    margin-left: ${theme.spacing.md};
`;

export const StatusDot = styled.span<{ status: string }>`
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 8px;
    background-color: ${(props: { status: string }): string => {
        switch (props.status) {
            case 'confirmed': return theme.colors.success;
            case 'pending': return theme.colors.warning;
            case 'declined': return theme.colors.danger;
            default: return theme.colors.text.secondary;
        }
    }};
`;

export const ActionIconButton = styled.button`
    background: transparent;
    border: none;
    padding: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.text.secondary};
    border-radius: ${theme.borderRadius.sm};
    
    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: ${theme.colors.primary};
    }
    
    &.delete:hover {
        color: ${theme.colors.danger};
    }
`;

export const ModalOption = styled.button`
    background-color: transparent;
    border: none;
    padding: ${theme.spacing.sm};
    text-align: left;
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.text.primary};
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    cursor: pointer;
    border-radius: ${theme.borderRadius.sm};
    width: 100%;
    
    &:hover {
        background-color: ${theme.colors.background};
    }
`;

export const TeamMember = styled.div`
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.xs};
    background: rgba(255, 255, 255, 0.02);
    border-radius: ${theme.borderRadius.sm};
    position: relative;
    transition: all 0.2s ease;
    
    &:hover {
        background: rgba(255, 255, 255, 0.05);
        
        .member-actions {
            opacity: 1;
            visibility: visible;
        }
    }
`;

export const MemberName = styled.span`
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.text.primary};
    margin-left: 4px;
    flex: 1;
`;

export const MemberStatus = styled.span<{ status: 'confirmed' | 'pending' | 'declined' }>`
    display: none; /* Hide status text, using dots instead */
    font-size: ${theme.typography.fontSizes.xs};
    padding: 2px 6px;
    border-radius: 12px;
    background: ${(props: { status: string }): string => {
        switch (props.status) {
            case 'confirmed':
                return `${theme.colors.success}20`;
            case 'pending':
                return `${theme.colors.warning}20`;
            case 'declined':
                return `${theme.colors.danger}20`;
            default:
                return theme.colors.background;
        }
    }};
    color: ${(props: { status: string }): string => {
        switch (props.status) {
            case 'confirmed':
                return theme.colors.success;
            case 'pending':
                return theme.colors.warning;
            case 'declined':
                return theme.colors.danger;
            default:
                return theme.colors.text.secondary;
        }
    }};
`;

export const MemberActionsContainer = styled.div`
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

export const MemberActionButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    color: ${theme.colors.text.secondary};
    padding: ${theme.spacing.xs};
    border-radius: ${theme.borderRadius.sm};
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
        background: ${theme.colors.background};
        color: ${theme.colors.primary};
    }
`;

export const PositionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

export const PositionStatus = styled.span`
    font-size: ${theme.typography.fontSizes.xs};
    color: ${theme.colors.text.secondary};
    padding: 2px 6px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    margin-right: ${theme.spacing.sm};
`;

export const ActionButton = styled.button`
    position: fixed;
    right: 200px;
    bottom: 66px;
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
    transition: all 0.2s ease-in-out;
    
    &:hover {
        background-color: ${theme.colors.primaryDark};
        transform: scale(1.05);
    }
`;

export const ModalContainer = styled.div<{ buttonRect: DOMRect | null }>`
    position: absolute;
    bottom: ${(props: { buttonRect: DOMRect | null }): string => 
        props.buttonRect ? `${props.buttonRect.height + 10}px` : '60px'};
    right: ${(props: { buttonRect: DOMRect | null }): string => 
        props.buttonRect ? `20px` : '20px'};
    width: 180px;
    background: ${theme.colors.card};
    border-radius: ${theme.borderRadius.sm};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    overflow: hidden;
`;

export const ModalOptionList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

export const ModalOptionItem = styled.li`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    
    &:hover {
        background: ${theme.colors.background};
        color: ${theme.colors.primary};
    }
    
    &:not(:last-child) {
        border-bottom: 1px solid ${theme.colors.border};
    }
`;

export const ScheduleEmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing.lg};
    background: rgba(0, 0, 0, 0.05);
    border-radius: ${theme.borderRadius.md};
    text-align: center;
    margin: ${theme.spacing.md} 0;
    
    p {
        color: ${theme.colors.text.secondary};
        margin-top: ${theme.spacing.xs};
        font-size: ${theme.typography.fontSizes.sm};
    }
`;
