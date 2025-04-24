import React, { useState } from 'react';

/**
 * Fixed version of the GroupsWidget
 * This avoids problematic imports with spaces in directory paths
 */
const GroupsWidgetFixed: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('myGroups');
  
  // Sample groups data
  const groups = [
    { id: '1', name: 'Administrators', members: 15, owner: 'Admin', description: 'Administrative user group with full access' },
    { id: '2', name: 'Content Creators', members: 8, owner: 'Jane Smith', description: 'Team responsible for creating and uploading content' },
    { id: '3', name: 'Finance Team', members: 5, owner: 'John Doe', description: 'Group for finance department staff' },
    { id: '4', name: 'Marketing', members: 12, owner: 'Sarah Johnson', description: 'Marketing department with access to brand assets' },
    { id: '5', name: 'IT Support', members: 6, owner: 'Mike Wilson', description: 'Technical support team' },
  ];
  
  // Handle new group modal
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  
  return (
    <div style={{ padding: '20px', height: '100%' }}>
      {/* Group Management Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px' 
      }}>
        <h2 style={{ margin: 0 }}>Groups Management</h2>
        <button 
          style={{
            padding: '8px 16px',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => setShowNewGroupModal(true)}
        >
          Create Group
        </button>
      </div>
      
      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #ddd',
        marginBottom: '20px'
      }}>
        <button 
          style={{
            padding: '10px 20px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'myGroups' ? '2px solid #4caf50' : 'none',
            fontWeight: activeTab === 'myGroups' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('myGroups')}
        >
          My Groups
        </button>
        <button 
          style={{
            padding: '10px 20px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'allGroups' ? '2px solid #4caf50' : 'none',
            fontWeight: activeTab === 'allGroups' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('allGroups')}
        >
          All Groups
        </button>
        <button 
          style={{
            padding: '10px 20px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'pending' ? '2px solid #4caf50' : 'none',
            fontWeight: activeTab === 'pending' ? 'bold' : 'normal',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('pending')}
        >
          Pending Invitations
        </button>
      </div>
      
      {/* Search and Filter */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <input 
            type="text" 
            placeholder="Search groups..." 
            style={{
              width: '100%',
              padding: '8px 12px',
              paddingLeft: '30px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <span style={{
            position: 'absolute',
            left: '8px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}>🔍</span>
        </div>
        <select style={{
          padding: '8px 12px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}>
          <option>Sort by: Name</option>
          <option>Sort by: Members</option>
          <option>Sort by: Owner</option>
          <option>Sort by: Recent</option>
        </select>
      </div>
      
      {/* Groups List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {groups.map(group => (
          <div 
            key={group.id}
            style={{
              padding: '16px',
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>{group.name}</div>
              <div style={{ color: '#666', fontSize: '14px' }}>{group.description}</div>
              <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
                <span style={{ fontSize: '14px' }}><strong>Members:</strong> {group.members}</span>
                <span style={{ fontSize: '14px' }}><strong>Owner:</strong> {group.owner}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                padding: '6px 12px',
                background: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                View
              </button>
              <button style={{
                padding: '6px 12px',
                background: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* New Group Modal (placeholder - would be implemented with proper modal component) */}
      {showNewGroupModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '20px',
            width: '500px',
            maxWidth: '90%'
          }}>
            <h3 style={{ marginTop: 0 }}>Create New Group</h3>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Group Name</label>
              <input type="text" style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
              <textarea style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                style={{ padding: '8px 16px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                onClick={() => setShowNewGroupModal(false)}
              >
                Cancel
              </button>
              <button 
                style={{ padding: '8px 16px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                onClick={() => setShowNewGroupModal(false)}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsWidgetFixed;
