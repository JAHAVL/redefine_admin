import React, { useState, useEffect } from 'react';
import { Location } from './types';
import { getLocations } from './mock-actions';
import './LocationsWidget.css';

/**
 * Analytics Widget - Fixed version with no problematic dependencies
 */
const AnalyticsWidgetFixed: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('month');
  const [analyticsReady, setAnalyticsReady] = useState<boolean>(false);

  // Load locations on component mount
  useEffect(() => {
    fetchLocations();
  }, []);

  // Simulate analytics loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalyticsReady(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Function to fetch locations
  const fetchLocations = async () => {
    setIsLoading(true);
    try {
      const data = await getLocations();
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle timeframe selection
  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  // Generate random data for analytics charts
  const generateRandomData = (count: number, min: number, max: number) => {
    return Array.from({ length: count }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  };

  // Locations attendance data - simulated
  const attendanceData = {
    labels: locations.map(loc => loc.name),
    datasets: [
      generateRandomData(locations.length, 150, 800),
      generateRandomData(locations.length, 120, 700),
      generateRandomData(locations.length, 100, 600)
    ]
  };

  // Show loading state
  if (isLoading && !analyticsReady) {
    return (
      <div className="analytics-widget loading">
        <div className="loading-indicator">Loading analytics data...</div>
      </div>
    );
  }

  return (
    <div className="analytics-widget">
      <div className="widget-header">
        <h2>Location Analytics</h2>
        <div className="timeframe-controls">
          <button 
            className={`timeframe-btn ${selectedTimeframe === 'week' ? 'active' : ''}`}
            onClick={() => handleTimeframeChange('week')}
          >
            Week
          </button>
          <button 
            className={`timeframe-btn ${selectedTimeframe === 'month' ? 'active' : ''}`}
            onClick={() => handleTimeframeChange('month')}
          >
            Month
          </button>
          <button 
            className={`timeframe-btn ${selectedTimeframe === 'year' ? 'active' : ''}`}
            onClick={() => handleTimeframeChange('year')}
          >
            Year
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="key-metrics" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '15px',
        margin: '20px 0'
      }}>
        <div className="metric-card" style={{ 
          backgroundColor: '#fff', 
          padding: '15px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          textAlign: 'center' 
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Total Attendance</h3>
          <div className="metric-value" style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
            {attendanceData.datasets[0].reduce((a, b) => a + b, 0).toLocaleString()}
          </div>
          <div className="metric-change" style={{ color: 'green', fontSize: '14px' }}>↑ 8.5% from last {selectedTimeframe}</div>
        </div>

        <div className="metric-card" style={{ 
          backgroundColor: '#fff', 
          padding: '15px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          textAlign: 'center' 
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Average Per Location</h3>
          <div className="metric-value" style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>
            {Math.round(attendanceData.datasets[0].reduce((a, b) => a + b, 0) / Math.max(1, locations.length)).toLocaleString()}
          </div>
          <div className="metric-change" style={{ color: 'green', fontSize: '14px' }}>↑ 3.2% from last {selectedTimeframe}</div>
        </div>

        <div className="metric-card" style={{ 
          backgroundColor: '#fff', 
          padding: '15px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          textAlign: 'center' 
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>New Visitors</h3>
          <div className="metric-value" style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>
            {Math.round(attendanceData.datasets[1].reduce((a, b) => a + b, 0) * 0.15).toLocaleString()}
          </div>
          <div className="metric-change" style={{ color: 'green', fontSize: '14px' }}>↑ 12.7% from last {selectedTimeframe}</div>
        </div>

        <div className="metric-card" style={{ 
          backgroundColor: '#fff', 
          padding: '15px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          textAlign: 'center' 
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Online Participants</h3>
          <div className="metric-value" style={{ fontSize: '24px', fontWeight: 'bold', color: '#9C27B0' }}>
            {Math.round(attendanceData.datasets[2].reduce((a, b) => a + b, 0) * 0.8).toLocaleString()}
          </div>
          <div className="metric-change" style={{ color: 'red', fontSize: '14px' }}>↓ 2.1% from last {selectedTimeframe}</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="analytics-charts">
        {/* Attendance by Location Chart */}
        <div className="chart-container" style={{ 
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Attendance by Location</h3>
          <div className="chart-placeholder" style={{ 
            height: '300px',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '10px'
          }}>
            {/* Simulated Bar Chart */}
            <div style={{ display: 'flex', height: '250px', alignItems: 'flex-end', justifyContent: 'space-around' }}>
              {locations.map((location, index) => (
                <div key={location.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: `${100/locations.length}%` }}>
                  <div style={{ 
                    width: '40px', 
                    height: `${attendanceData.datasets[0][index] / 8}px`,
                    backgroundColor: '#4CAF50',
                    borderRadius: '4px 4px 0 0'
                  }}></div>
                  <div style={{ fontSize: '12px', marginTop: '5px', textAlign: 'center', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {location.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance Trends Chart */}
        <div className="chart-container" style={{ 
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Attendance Trends</h3>
          <div className="chart-placeholder" style={{ 
            height: '300px',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            position: 'relative',
            padding: '10px'
          }}>
            {/* Simulated Line Chart */}
            <div style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '10px',
              display: 'flex',
              gap: '15px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#4CAF50', marginRight: '5px', borderRadius: '2px' }}></div>
                <span>In Person</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#2196F3', marginRight: '5px', borderRadius: '2px' }}></div>
                <span>Online</span>
              </div>
            </div>
            
            <svg width="100%" height="250" style={{ marginTop: '30px' }}>
              {/* Green line - In person */}
              <polyline 
                points="0,200 100,150 200,180 300,120 400,100 500,80 600,110" 
                style={{ fill: 'none', stroke: '#4CAF50', strokeWidth: 3 }}
              />
              {/* Blue line - Online */}
              <polyline 
                points="0,220 100,210 200,190 300,200 400,170 500,180 600,150" 
                style={{ fill: 'none', stroke: '#2196F3', strokeWidth: 3 }}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Generate Report Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button style={{ 
          backgroundColor: '#4CAF50', 
          color: 'white', 
          border: 'none', 
          padding: '10px 20px', 
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          Generate Full Report
        </button>
      </div>
    </div>
  );
};

export default AnalyticsWidgetFixed;
