import React, { useState } from 'react';
import './LocationsWidget.css';

/**
 * Settings Widget - Fixed version with no problematic dependencies
 */
const SettingsWidgetFixed: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('general');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [autoCheckIn, setAutoCheckIn] = useState<boolean>(false);
  const [defaultView, setDefaultView] = useState<string>('grid');
  const [mapProvider, setMapProvider] = useState<string>('google');
  
  // Handle settings form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate saving settings
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-widget">
      <div className="widget-header">
        <h2>Location Settings</h2>
      </div>

      <div className="settings-container" style={{ 
        display: 'flex', 
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        minHeight: '500px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
      }}>
        {/* Settings Tabs */}
        <div className="settings-tabs" style={{ 
          width: '220px',
          borderRight: '1px solid #eee',
          backgroundColor: '#f9f9f9' 
        }}>
          <div 
            className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
            style={{ 
              padding: '15px 20px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'general' ? '#fff' : 'transparent',
              borderLeft: activeTab === 'general' ? '3px solid #4CAF50' : '3px solid transparent'
            }}
          >
            General
          </div>
          <div 
            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
            style={{ 
              padding: '15px 20px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'notifications' ? '#fff' : 'transparent',
              borderLeft: activeTab === 'notifications' ? '3px solid #4CAF50' : '3px solid transparent'
            }}
          >
            Notifications
          </div>
          <div 
            className={`settings-tab ${activeTab === 'maps' ? 'active' : ''}`}
            onClick={() => setActiveTab('maps')}
            style={{ 
              padding: '15px 20px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'maps' ? '#fff' : 'transparent',
              borderLeft: activeTab === 'maps' ? '3px solid #4CAF50' : '3px solid transparent'
            }}
          >
            Maps
          </div>
          <div 
            className={`settings-tab ${activeTab === 'permissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('permissions')}
            style={{ 
              padding: '15px 20px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'permissions' ? '#fff' : 'transparent',
              borderLeft: activeTab === 'permissions' ? '3px solid #4CAF50' : '3px solid transparent'
            }}
          >
            Permissions
          </div>
          <div 
            className={`settings-tab ${activeTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('integrations')}
            style={{ 
              padding: '15px 20px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'integrations' ? '#fff' : 'transparent',
              borderLeft: activeTab === 'integrations' ? '3px solid #4CAF50' : '3px solid transparent'
            }}
          >
            Integrations
          </div>
        </div>

        {/* Settings Content */}
        <div className="settings-content" style={{ padding: '20px', flex: 1 }}>
          <form onSubmit={handleSubmit}>
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="general-settings">
                <h3 style={{ margin: '0 0 20px 0' }}>General Settings</h3>
                
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Default View
                  </label>
                  <select 
                    value={defaultView}
                    onChange={(e) => setDefaultView(e.target.value)}
                    style={{ 
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  >
                    <option value="grid">Grid View</option>
                    <option value="table">Table View</option>
                    <option value="map">Map View</option>
                  </select>
                  <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                    Choose which view to show by default when viewing locations
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Auto Check-in
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={autoCheckIn} 
                      onChange={() => setAutoCheckIn(!autoCheckIn)}
                      style={{ marginRight: '8px' }}
                    />
                    <span>Enable automatic check-in for locations</span>
                  </div>
                  <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                    When enabled, users will be automatically checked in when they are within range of a location
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Data Export Format
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                      <input type="radio" name="exportFormat" value="csv" defaultChecked />
                      <span style={{ marginLeft: '5px' }}>CSV</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                      <input type="radio" name="exportFormat" value="excel" />
                      <span style={{ marginLeft: '5px' }}>Excel</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                      <input type="radio" name="exportFormat" value="json" />
                      <span style={{ marginLeft: '5px' }}>JSON</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="notifications-settings">
                <h3 style={{ margin: '0 0 20px 0' }}>Notification Settings</h3>
                
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Notifications
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={notificationsEnabled} 
                      onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                      style={{ marginRight: '8px' }}
                    />
                    <span>Enable location notifications</span>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '20px', opacity: notificationsEnabled ? 1 : 0.5 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Notification Types
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                      <input type="checkbox" defaultChecked disabled={!notificationsEnabled} />
                      <span style={{ marginLeft: '5px' }}>New check-ins</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                      <input type="checkbox" defaultChecked disabled={!notificationsEnabled} />
                      <span style={{ marginLeft: '5px' }}>Capacity alerts</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                      <input type="checkbox" defaultChecked disabled={!notificationsEnabled} />
                      <span style={{ marginLeft: '5px' }}>Status changes</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                      <input type="checkbox" defaultChecked disabled={!notificationsEnabled} />
                      <span style={{ marginLeft: '5px' }}>New location added</span>
                    </label>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '20px', opacity: notificationsEnabled ? 1 : 0.5 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Delivery Methods
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                      <input type="checkbox" defaultChecked disabled={!notificationsEnabled} />
                      <span style={{ marginLeft: '5px' }}>Email</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                      <input type="checkbox" defaultChecked disabled={!notificationsEnabled} />
                      <span style={{ marginLeft: '5px' }}>Push notifications</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center' }}>
                      <input type="checkbox" disabled={!notificationsEnabled} />
                      <span style={{ marginLeft: '5px' }}>SMS</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Maps Settings */}
            {activeTab === 'maps' && (
              <div className="maps-settings">
                <h3 style={{ margin: '0 0 20px 0' }}>Map Settings</h3>
                
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Map Provider
                  </label>
                  <select 
                    value={mapProvider}
                    onChange={(e) => setMapProvider(e.target.value)}
                    style={{ 
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  >
                    <option value="google">Google Maps</option>
                    <option value="mapbox">Mapbox</option>
                    <option value="openstreet">OpenStreetMap</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Default Map Center
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Latitude" 
                      defaultValue="38.8951"
                      style={{ 
                        flex: 1,
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                    />
                    <input 
                      type="text" 
                      placeholder="Longitude" 
                      defaultValue="-77.0364"
                      style={{ 
                        flex: 1,
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Default Zoom Level
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="20" 
                    defaultValue="10"
                    style={{ width: '100%' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
                    <span>Far</span>
                    <span>Medium</span>
                    <span>Close</span>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                    <input type="checkbox" defaultChecked style={{ marginRight: '8px' }} />
                    <span>Show location names on map</span>
                  </label>
                </div>
              </div>
            )}

            {/* Permissions Settings */}
            {activeTab === 'permissions' && (
              <div className="permissions-settings">
                <h3 style={{ margin: '0 0 20px 0' }}>Permission Settings</h3>
                
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Role</th>
                      <th style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}>View</th>
                      <th style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}>Create</th>
                      <th style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}>Edit</th>
                      <th style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}>Delete</th>
                      <th style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}>Export</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Administrator</td>
                      <td style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}><input type="checkbox" defaultChecked /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Manager</td>
                      <td style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}><input type="checkbox" /></td>
                      <td style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}><input type="checkbox" defaultChecked /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Staff</td>
                      <td style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}><input type="checkbox" /></td>
                      <td style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}><input type="checkbox" /></td>
                      <td style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}><input type="checkbox" /></td>
                      <td style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}><input type="checkbox" /></td>
                    </tr>
                    <tr>
                      <td style={{ padding: '10px' }}>User</td>
                      <td style={{ textAlign: 'center', padding: '10px' }}><input type="checkbox" defaultChecked /></td>
                      <td style={{ textAlign: 'center', padding: '10px' }}><input type="checkbox" /></td>
                      <td style={{ textAlign: 'center', padding: '10px' }}><input type="checkbox" /></td>
                      <td style={{ textAlign: 'center', padding: '10px' }}><input type="checkbox" /></td>
                      <td style={{ textAlign: 'center', padding: '10px' }}><input type="checkbox" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Integrations Settings */}
            {activeTab === 'integrations' && (
              <div className="integrations-settings">
                <h3 style={{ margin: '0 0 20px 0' }}>Integration Settings</h3>
                
                <div className="integration-item" style={{ 
                  padding: '15px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  marginBottom: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>Planning Center</h4>
                    <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>Sync locations with Planning Center</p>
                  </div>
                  <div>
                    <button style={{ 
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>Connect</button>
                  </div>
                </div>

                <div className="integration-item" style={{ 
                  padding: '15px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  marginBottom: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>Google Calendar</h4>
                    <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>Sync location events with Google Calendar</p>
                  </div>
                  <div>
                    <button style={{ 
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>Connect</button>
                  </div>
                </div>

                <div className="integration-item" style={{ 
                  padding: '15px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  marginBottom: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>Mailchimp</h4>
                    <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>Connect to send location-based campaigns</p>
                  </div>
                  <div>
                    <button style={{ 
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}>Connect</button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div style={{ marginTop: '30px' }}>
              <button 
                type="submit" 
                style={{ 
                  backgroundColor: '#4CAF50', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsWidgetFixed;
