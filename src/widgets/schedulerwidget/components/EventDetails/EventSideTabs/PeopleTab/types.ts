// Type definitions for the People tab

/**
 * Team member data type
 */
export interface TeamMemberData {
    id: number;
    name: string;
    status: 'confirmed' | 'pending' | 'declined';
}

/**
 * Position data type
 */
export interface PositionData {
    id: number;
    name: string;
    members: TeamMemberData[];
}

/**
 * Department data type
 */
export interface DepartmentData {
    id: number;
    name: string;
    positions: PositionData[];
}

/**
 * Team data type
 */
export interface TeamData {
    id: number;
    name: string;
    departments: DepartmentData[];
}

/**
 * Status colors mapping
 */
export interface StatusColors {
    confirmed: string;
    pending: string;
    declined: string;
}

/**
 * Modal option type
 */
export interface ModalOption {
    id: string;
    label: string;
    icon?: string;
    action: () => void;
}
