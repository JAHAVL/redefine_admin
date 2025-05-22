import React, { useState, useRef, useEffect } from 'react';
import {
    TimeTabContainer,
    SectionTitle,
    TimeItem,
    TimeTypeTag,
    TimeValue,
    ServiceTypeBadge,
    AddButton,
    NoTimesMessage,
    TimeSection
} from './styles';
import TimeEditModal, { TimeItemType, TimeFormData } from '../../../modals/TimeEditModal';
import { PlusIcon } from '@heroicons/react/24/outline';

// Mock team data
interface TeamData {
    id: number;
    name: string;
}

const mockTeams: TeamData[] = [
    { id: 1, name: 'Production Team' },
    { id: 2, name: 'Worship Team' },
    { id: 3, name: 'Greeting Team' },
    { id: 4, name: 'Tech Team' },
    { id: 5, name: 'Kids Ministry' }
];

// Mock data for demonstration
const mockEventDayTimes: TimeItemType[] = [
    { id: 1, type: 'Setup', day: 'Saturday', time: '8:00 AM', color: '#e74c3c' }
];

const mockRehearsalTimes: TimeItemType[] = [
    { id: 2, type: 'Rehearsal', day: 'Saturday', time: '2:00 PM', color: '#f39c12' },
    { id: 3, type: 'Sound Check', day: 'Sunday', time: '8:00 AM', color: '#9b59b6' }
];

const mockSimLiveTimes: TimeItemType[] = [
    { id: 4, type: 'Pre-Service', time: '9:00 AM', serviceType: 'pre-recorded', color: '#3498db' },
    { id: 5, type: 'Message', time: '10:00 AM', serviceType: 'sim-live', color: '#1abc9c' }
];

const mockOtherTimes: TimeItemType[] = [
    { id: 6, type: 'Tech Setup', time: '7:30 AM', color: '#34495e' },
    { id: 7, type: 'Team Breakfast', time: '8:00 AM', color: '#d35400' }
];

// Time tab component
const TimeTab: React.FC = () => {
    // Modal state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<'eventDay' | 'rehearsal' | 'simLive' | 'other'>('eventDay');
    const [currentTimeItem, setCurrentTimeItem] = useState<TimeFormData | null>(null);
    
    // Create refs for buttons
    const eventDayAddButtonRef = useRef<HTMLButtonElement>(null);
    const rehearsalAddButtonRef = useRef<HTMLButtonElement>(null);
    const simLiveAddButtonRef = useRef<HTMLButtonElement>(null);
    const otherAddButtonRef = useRef<HTMLButtonElement>(null);
    
    // Create refs for items that can be clicked to edit (we'll create these dynamically)
    const itemRefs = useRef<Record<number, React.RefObject<HTMLDivElement>>>({});
    
    // Active element ref for modal positioning
    const [activeElementRef, setActiveElementRef] = useState<React.RefObject<HTMLElement> | null>(null);
    
    // Function to get ref for a specific item
    const getItemRef = (id: number): React.RefObject<HTMLDivElement> => {
        if (!itemRefs.current[id]) {
            itemRefs.current[id] = React.createRef<HTMLDivElement>();
        }
        return itemRefs.current[id];
    };
    

    
    // Open add time modal
    const handleAddTime = (section: 'eventDay' | 'rehearsal' | 'simLive' | 'other') => {
        // Set initial values for the form
        setCurrentTimeItem({
            type: '',
            time: '',
            serviceType: section === 'simLive' ? 'sim-live' : undefined,
            color: '#4e7ac7', // Default color
            teams: []
        });
        
        // Set which section we're adding to
        setSelectedSection(section);
        
        // Set the ref for the add button in this section
        let buttonRef: React.RefObject<HTMLButtonElement> | null = null;
        if (section === 'eventDay') buttonRef = eventDayAddButtonRef;
        else if (section === 'rehearsal') buttonRef = rehearsalAddButtonRef;
        else if (section === 'simLive') buttonRef = simLiveAddButtonRef;
        else buttonRef = otherAddButtonRef;
        
        setActiveElementRef(buttonRef as React.RefObject<HTMLElement>);
        setIsAddModalOpen(true);
    };
    
    // Open edit time modal
    const handleEditTime = (item: TimeItemType, section: 'eventDay' | 'rehearsal' | 'simLive' | 'other') => {
        // Set the section
        setSelectedSection(section);
        
        // Set the form data
        setCurrentTimeItem({
            id: item.id,
            type: item.type,
            day: item.day,
            time: item.time,
            serviceType: item.serviceType,
            color: item.color || '#4e7ac7',
            teams: item.teams || []
        });
        
        // Use the ref for this item for positioning
        setActiveElementRef(getItemRef(item.id) as unknown as React.RefObject<HTMLElement>);
        setIsEditModalOpen(true);
    };
    
    // Cancel add/edit
    const handleCancel = () => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setCurrentTimeItem(null);
    };
    
    // Save time (mock implementation)
    const handleSaveTime = () => {
        // Here you would typically make an API call to save the time
        console.log('Saving time:', currentTimeItem);
        
        if (currentTimeItem) {
            // For demo purposes, update the mock data to reflect the changes
            // In a real implementation, you'd update your state properly
            if (selectedSection === 'eventDay' && currentTimeItem.id) {
                const index = mockEventDayTimes.findIndex(item => item.id === currentTimeItem.id);
                if (index >= 0) {
                    mockEventDayTimes[index] = {
                        ...mockEventDayTimes[index],
                        ...currentTimeItem,
                        id: currentTimeItem.id
                    };
                }
            } else if (selectedSection === 'rehearsal' && currentTimeItem.id) {
                const index = mockRehearsalTimes.findIndex(item => item.id === currentTimeItem.id);
                if (index >= 0) {
                    mockRehearsalTimes[index] = {
                        ...mockRehearsalTimes[index],
                        ...currentTimeItem,
                        id: currentTimeItem.id
                    };
                }
            } else if (selectedSection === 'simLive' && currentTimeItem.id) {
                const index = mockSimLiveTimes.findIndex(item => item.id === currentTimeItem.id);
                if (index >= 0) {
                    mockSimLiveTimes[index] = {
                        ...mockSimLiveTimes[index],
                        ...currentTimeItem,
                        id: currentTimeItem.id
                    };
                }
            } else if (selectedSection === 'other' && currentTimeItem.id) {
                const index = mockOtherTimes.findIndex(item => item.id === currentTimeItem.id);
                if (index >= 0) {
                    mockOtherTimes[index] = {
                        ...mockOtherTimes[index],
                        ...currentTimeItem,
                        id: currentTimeItem.id
                    };
                }
            }
            
            console.log(`Saving time with color: ${currentTimeItem.color}`);
        }
        
        // Close modals
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
    };
    
    // Render a badge for the service type
    const renderServiceTypeBadge = (serviceType?: 'live' | 'pre-recorded' | 'sim-live') => {
        if (!serviceType) return null;
        
        return (
            <ServiceTypeBadge type={serviceType}>
                {serviceType === 'live' ? 'LIVE' : serviceType === 'pre-recorded' ? 'PRE-REC' : 'SIM-LIVE'}
            </ServiceTypeBadge>
        );
    };
    

    
    // Render a section of times
    const renderTimeSection = (title: string, times: TimeItemType[], section: 'eventDay' | 'rehearsal' | 'simLive' | 'other') => {
        // Set the add button ref
        const addButtonRef = section === 'eventDay'
            ? eventDayAddButtonRef
            : section === 'rehearsal'
                ? rehearsalAddButtonRef
                : section === 'simLive'
                    ? simLiveAddButtonRef
                    : otherAddButtonRef;
        
        return (
            <TimeSection>
                <SectionTitle>{title}</SectionTitle>
                
                {times.length === 0 ? (
                    <NoTimesMessage>No times added yet</NoTimesMessage>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {times.map((item) => (
                            <TimeItem 
                                key={item.id} 
                                ref={getItemRef(item.id)}
                                onClick={() => handleEditTime(item, section)}
                                color={item.color}
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
                    </div>
                )}
                
                <AddButton ref={addButtonRef} onClick={() => handleAddTime(section)}>
                    <PlusIcon width={14} /> Add Time
                </AddButton>
            </TimeSection>
        );
    };
    
    return (
        <TimeTabContainer>
            {renderTimeSection('Event Day', mockEventDayTimes, 'eventDay')}
            {renderTimeSection('Rehearsal', mockRehearsalTimes, 'rehearsal')}
            {renderTimeSection('Sim-Live', mockSimLiveTimes, 'simLive')}
            {renderTimeSection('Other', mockOtherTimes, 'other')}
            
            {/* Add Time Modal */}
            <TimeEditModal
                isOpen={isAddModalOpen}
                onClose={handleCancel}
                title="Add Time"
                triggerRef={activeElementRef as React.RefObject<HTMLElement>}
                timeData={currentTimeItem}
                section={selectedSection}
                onSave={handleSaveTime}
                teams={mockTeams}
            />
            
            {/* Edit Time Modal */}
            <TimeEditModal
                isOpen={isEditModalOpen}
                onClose={handleCancel}
                title="Edit Time"
                triggerRef={activeElementRef as React.RefObject<HTMLElement>}
                timeData={currentTimeItem}
                section={selectedSection}
                onSave={handleSaveTime}
                teams={mockTeams}
            />
        </TimeTabContainer>
    );
};

export default TimeTab;
