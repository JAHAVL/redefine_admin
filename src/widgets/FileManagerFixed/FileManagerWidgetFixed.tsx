import React, { useState, useCallback } from 'react';

/**
 * Fixed version of the FileManagerWidget
 * This avoids problematic imports with spaces in directory paths
 */
const FileManagerWidgetFixed: React.FC = () => {
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [currentPath, setCurrentPath] = useState<string[]>(['Home']);
  
  // Sample files data
  const files = [
    { id: '1', name: 'Documents', type: 'folder', path: 'Home/Documents' },
    { id: '2', name: 'Images', type: 'folder', path: 'Home/Images' },
    { id: '3', name: 'Project Plan.pdf', type: 'pdf', path: 'Home/Project Plan.pdf' },
    { id: '4', name: 'Budget.xlsx', type: 'excel', path: 'Home/Budget.xlsx' },
    { id: '5', name: 'Meeting Notes.docx', type: 'doc', path: 'Home/Meeting Notes.docx' },
    { id: '6', name: 'Logo.png', type: 'image', path: 'Home/Logo.png' },
  ];
  
  // Navigate to a folder
  const navigateToFolder = useCallback((folderName: string) => {
    setCurrentPath(prev => [...prev, folderName]);
  }, []);
  
  // Navigate up one level
  const navigateUp = useCallback(() => {
    if (currentPath.length > 1) {
      setCurrentPath(prev => prev.slice(0, -1));
    }
  }, [currentPath.length]);
  
  // Navigate to specific path index
  const navigateTo = useCallback((index: number) => {
    if (index < currentPath.length) {
      setCurrentPath(prev => prev.slice(0, index + 1));
    }
  }, [currentPath.length]);

  return (
    <div style={{ padding: '20px', height: '100%' }}>
      {/* File Manager Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px' 
      }}>
        <h2 style={{ margin: 0 }}>File Manager</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{
            padding: '8px 16px',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Upload File
          </button>
          <button style={{
            padding: '8px 16px',
            background: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }} onClick={() => setCurrentView('grid')}>
            Grid View
          </button>
          <button style={{
            padding: '8px 16px',
            background: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }} onClick={() => setCurrentView('list')}>
            List View
          </button>
        </div>
      </div>
      
      {/* Breadcrumb Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 0',
        marginBottom: '20px'
      }}>
        {currentPath.map((path, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span style={{ margin: '0 8px' }}>/</span>}
            <button 
              onClick={() => navigateTo(index)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                color: index === currentPath.length - 1 ? '#000' : '#4285f4'
              }}
            >
              {path}
            </button>
          </React.Fragment>
        ))}
      </div>
      
      {/* Files Grid/List View */}
      <div style={{
        display: currentView === 'grid' ? 'grid' : 'flex',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '16px',
        flexDirection: currentView === 'list' ? 'column' : undefined,
      }}>
        {files.map(file => (
          <div 
            key={file.id}
            style={{
              padding: '16px',
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: currentView === 'grid' ? 'column' : 'row',
              alignItems: currentView === 'grid' ? 'center' : 'flex-start',
              gap: '12px',
              cursor: file.type === 'folder' ? 'pointer' : 'default'
            }}
            onClick={() => file.type === 'folder' && navigateToFolder(file.name)}
          >
            {/* File Type Icon */}
            <div style={{
              width: '48px',
              height: '48px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: file.type === 'folder' ? '#e3f2fd' : 
                         file.type === 'pdf' ? '#ffebee' :
                         file.type === 'excel' ? '#e8f5e9' :
                         file.type === 'doc' ? '#e8eaf6' :
                         file.type === 'image' ? '#fff3e0' : '#f5f5f5',
              borderRadius: '8px'
            }}>
              {/* Icon representation */}
              {file.type === 'folder' ? '📁' :
               file.type === 'pdf' ? '📄' :
               file.type === 'excel' ? '📊' :
               file.type === 'doc' ? '📝' :
               file.type === 'image' ? '🖼️' : '📄'}
            </div>
            
            {/* File Name */}
            <div>
              <div style={{
                fontWeight: 500,
                fontSize: '16px',
                textAlign: currentView === 'grid' ? 'center' : 'left'
              }}>
                {file.name}
              </div>
              {currentView === 'list' && (
                <div style={{ color: '#666', fontSize: '14px' }}>
                  {file.type.charAt(0).toUpperCase() + file.type.slice(1)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileManagerWidgetFixed;
