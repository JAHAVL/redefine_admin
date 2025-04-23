import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Location } from '../types';
import LocationsTheme from '../theme';
// Using inline SVG instead of react-icons/fa

interface LocationsTableProps {
  locations: Location[];
  onEdit: (location: Location) => void;
  onDelete: (locationId: string) => void;
}

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  color: ${LocationsTheme.colors.text.primary};
`;

const TableHead = styled.thead`
  tr th {
    padding: 20px;
    text-align: left;
    font-weight: ${LocationsTheme.typography.fontWeight.medium};
  }
`;

const TableBody = styled.tbody`
  tr {
    background-color: ${LocationsTheme.colors.background.locationCard};
    transition: background-color ${LocationsTheme.transitions.fast};
    
    &:hover {
      background-color: ${LocationsTheme.colors.background.light};
    }
  }
  
  tr td {
    padding: 16px 20px;
    border: none;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${LocationsTheme.colors.text.secondary};
  cursor: pointer;
  margin-right: ${LocationsTheme.spacing.sm};
  transition: color ${LocationsTheme.transitions.fast};
  
  &:hover {
    color: ${LocationsTheme.colors.primary.main};
  }
  
  &.delete:hover {
    color: ${LocationsTheme.colors.status.error};
  }
`;

const ActionsCell = styled.div`
  display: flex;
  align-items: center;
`;

const LocationsTable: React.FC<LocationsTableProps> = ({ locations, onEdit, onDelete }) => {
  // Initialize DataTable if available
  useEffect(() => {
    // Check if jQuery and DataTables are available
    // This is just a type-safe check - actual implementation would require the libraries to be loaded
    if (typeof window !== 'undefined' && window.$ && window.$.fn && window.$.fn.DataTable) {
      const table = window.$('#locationsTable').DataTable({
        responsive: true,
        searching: true,
        ordering: true,
        paging: true,
        info: true,
        language: {
          search: '',
          searchPlaceholder: 'Search locations...'
        }
      });
      
      // Clean up DataTable on component unmount
      return () => {
        if (table && typeof table.destroy === 'function') {
          table.destroy();
        }
      };
    }
  }, [locations]);
  
  const handleEdit = (location: Location) => {
    onEdit(location);
  };
  
  const handleDelete = (locationId: string) => {
    onDelete(locationId);
  };
  
  return (
    <TableContainer>
      <Table id="locationsTable">
        <TableHead>
          <tr>
            <th className="d-none">ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </TableHead>
        <TableBody>
          {locations.map(location => (
            <tr key={location.id}>
              <td className="d-none">{location.id}</td>
              <td>{location.name}</td>
              <td>{location.address}</td>
              <td>{location.latitude}, {location.longitude}</td>
              <td>
                <ActionsCell>
                  <ActionButton onClick={() => handleEdit(location)}>
                    <svg width="18" height="18" viewBox="0 0 576 512">
                      <path fill="currentColor" d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path>
                    </svg>
                  </ActionButton>
                  <ActionButton 
                    className="delete" 
                    onClick={() => handleDelete(location.id)}
                  >
                    <svg width="18" height="18" viewBox="0 0 448 512">
                      <path fill="currentColor" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                    </svg>
                  </ActionButton>
                </ActionsCell>
              </td>
            </tr>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LocationsTable;
