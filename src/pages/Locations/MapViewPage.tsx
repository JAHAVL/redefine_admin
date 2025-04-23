import React, { useState, useEffect, useRef } from 'react';
import '../../styles/TaskManagerPage.css';
import LeftMenu from '../../components/Left Menu/LeftMenu';
import RAIChat from '../../components/RAI_Chat/RAIChat';
import TopMenu from '../../components/Top Menu/TopMenu';
import SubMenu from '../../components/Sub Menu/SubMenu';
import { getLocations } from '../../widgets/Locations/actions';
import { Location } from '../../widgets/Locations/types';

// Define interface for icon props
interface IconProps {
  size?: number;
  color?: string;
  [key: string]: any;
}

// Define type for icon components
type IconComponent = React.FC<IconProps>;

// Initialize icon components
let Menu: IconComponent;
let X: IconComponent;

try {
  const icons = require('lucide-react');
  Menu = icons.Menu;
  X = icons.X;
} catch (e) {
  // Fallback SVG components if lucide-react is not available
  Menu = () => null;
  X = () => null;
}

const MapViewPage: React.FC = () => {
  // State for mobile menu
  const [menuOpen, setMenuOpen] = useState(false);
  // State for collapsed left menu - initialize as collapsed (true) to match LeftMenu component
  const [leftMenuCollapsed, setLeftMenuCollapsed] = useState(true);
  // State for RAI Chat expanded state
  const [raiChatExpanded, setRaiChatExpanded] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const headerRef = useRef<HTMLElement | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle left menu collapse state
  const handleMenuCollapse = (collapsed: boolean) => {
    setLeftMenuCollapsed(collapsed);
  };

  // Handle RAI Chat expand state
  const handleRaiChatExpand = (expanded: boolean) => {
    setRaiChatExpanded(expanded);
  };

  // Fetch locations data
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsData = await getLocations();
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Initialize map when component mounts
  useEffect(() => {
    if (mapRef.current && !isLoading && locations.length > 0) {
      // This is a placeholder for actual map initialization
      // In a real implementation, you would use Google Maps or another mapping library
      console.log('Map would be initialized with locations:', locations);
      
      // Create a simple visual representation of the map
      const mapContainer = mapRef.current;
      mapContainer.innerHTML = '';
      mapContainer.style.position = 'relative';
      
      locations.forEach((location, index) => {
        const marker = document.createElement('div');
        marker.className = 'map-marker';
        marker.style.position = 'absolute';
        marker.style.width = '20px';
        marker.style.height = '20px';
        marker.style.borderRadius = '50%';
        marker.style.backgroundColor = '#3478ff';
        marker.style.border = '2px solid white';
        marker.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
        
        // Position markers randomly for demo purposes
        // In a real implementation, you would use proper geo-positioning
        const left = 10 + (index * 50) % (mapContainer.offsetWidth - 40);
        const top = 10 + (index * 30) % (mapContainer.offsetHeight - 40);
        
        marker.style.left = `${left}px`;
        marker.style.top = `${top}px`;
        marker.style.cursor = 'pointer';
        
        // Add tooltip with location name
        marker.title = location.name;
        
        // Add click event
        marker.addEventListener('click', () => {
          alert(`Location: ${location.name}\nAddress: ${location.address}`);
        });
        
        mapContainer.appendChild(marker);
      });
    }
  }, [isLoading, locations]);

  // Handle window resize to close menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992 && menuOpen) {
        setMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen]);

  // Update header height on mount and resize
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--header-height",
          `${height}px`
        );
      } else {
        // Set default if ref is not available
        document.documentElement.style.setProperty(
          "--header-height",
          "80px"
        );
      }
    };

    // Use ResizeObserver to monitor changes
    const resizeObserver = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    } else {
      // Call once if ref is not available
      updateHeaderHeight();
    }

    // Cleanup observer on unmount
    return () => {
      if (headerRef.current) {
        resizeObserver.unobserve(headerRef.current);
      }
    };
  }, []);

  return (
    <div className="task-manager-page">
      {/* Top Menu Component */}
      <TopMenu 
        toggleMenu={toggleMenu} 
        menuOpen={menuOpen} 
        headerRef={headerRef}
      />

      {/* Sub Menu Component - Note that we set activeItem and mainSection */}
      <SubMenu activeItem="map" mainSection="locations" />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {/* Left Sidebar/Menu - Now in a detached container with rounded corners */}
        <div className={`admin-dashboard-left ${leftMenuCollapsed ? 'collapsed' : ''}`}>
          <LeftMenu 
            activeItem="locations" 
            onCollapse={handleMenuCollapse}
          />
        </div>
        
        {/* Main Content - Will dynamically resize based on sidebar and chat states */}
        <main className={`task-manager-content ${raiChatExpanded ? 'rai-expanded' : 'rai-collapsed'}`}>
          <div className="file-manager-container">
            {/* Map View Container */}
            <div className="locations-widget">
              <div className="locations-header">
                <h2 className="locations-title">Map View</h2>
              </div>
              
              {isLoading ? (
                <div className="locations-loading">
                  <p>Loading map...</p>
                </div>
              ) : (
                <div 
                  ref={mapRef} 
                  className="locations-map-container"
                  style={{
                    height: '600px',
                    backgroundColor: 'rgba(30, 30, 30, 0.7)',
                    borderRadius: '8px',
                    padding: '16px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  {locations.length === 0 ? (
                    <div className="locations-empty-state">
                      <p>No locations found. Add locations to see them on the map.</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </main>
        
        {/* AI Chat Component */}
        <RAIChat 
          expanded={raiChatExpanded} 
          onExpand={handleRaiChatExpand} 
        />
      </div>

      {/* Mobile Menu - Only visible on mobile devices */}
      <div className={`mobileMenuDesign ${menuOpen ? "open" : ""}`} style={{ top: '100px' }}> 
        <div className="mobile-menu-content">
          <LeftMenu activeItem="locations" />
        </div>
      </div>
    </div>
  );
};

export default MapViewPage;
