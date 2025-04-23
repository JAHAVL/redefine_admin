import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../api';
import type { ShareGroup } from '../api';
import type { FileItem } from '../types';
import theme from '../theme';

const Container = styled.div`
  margin-top: ${theme.spacing.sm};
`;

const GroupList = styled.div`
  margin-top: ${theme.spacing.xs};
`;

const GroupItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${theme.colors.secondary.main};
  margin-bottom: ${theme.spacing.xs};
  font-size: 0.9em;
  
  &:hover {
    background-color: ${theme.colors.background.hover};
  }
`;

const GroupName = styled.div`
  color: ${theme.colors.text.primary};
  font-weight: 500;
`;

const PermissionBadge = styled.span<{ permission: 'read' | 'write' | 'admin' }>`
  padding: calc(${theme.spacing.xs} / 2) ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.8em;
  font-weight: bold;
  background-color: ${props => {
    switch (props.permission) {
      case 'read':
        return `rgba(${parseInt(theme.colors.status.info.slice(1, 3), 16)}, ${parseInt(theme.colors.status.info.slice(3, 5), 16)}, ${parseInt(theme.colors.status.info.slice(5, 7), 16)}, 0.2)`;
      case 'write':
        return `rgba(${parseInt(theme.colors.status.warning.slice(1, 3), 16)}, ${parseInt(theme.colors.status.warning.slice(3, 5), 16)}, ${parseInt(theme.colors.status.warning.slice(5, 7), 16)}, 0.2)`;
      case 'admin':
        return `rgba(${parseInt(theme.colors.status.error.slice(1, 3), 16)}, ${parseInt(theme.colors.status.error.slice(3, 5), 16)}, ${parseInt(theme.colors.status.error.slice(5, 7), 16)}, 0.2)`;
      default:
        return `rgba(${parseInt(theme.colors.status.info.slice(1, 3), 16)}, ${parseInt(theme.colors.status.info.slice(3, 5), 16)}, ${parseInt(theme.colors.status.info.slice(5, 7), 16)}, 0.2)`;
    }
  }};
  color: ${props => {
    switch (props.permission) {
      case 'read':
        return theme.colors.status.info;
      case 'write':
        return theme.colors.status.warning;
      case 'admin':
        return theme.colors.status.error;
      default:
        return theme.colors.status.info;
    }
  }};
`;

const EmptyState = styled.div`
  color: ${theme.colors.text.secondary};
  font-style: italic;
  font-size: 0.9em;
  padding: ${theme.spacing.xs} 0;
`;

const LoadingState = styled.div`
  color: ${theme.colors.text.secondary};
  font-style: italic;
  font-size: 0.9em;
  padding: ${theme.spacing.xs} 0;
`;

const ErrorState = styled.div`
  color: ${theme.colors.status.error};
  font-size: 0.9em;
  padding: ${theme.spacing.xs} 0;
`;

const SectionTitle = styled.div`
  font-weight: bold;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs};
  font-size: 0.95em;
`;

interface FileGroupAccessProps {
  file: FileItem;
  onOpenShareDialog?: () => void;
}

const FileGroupAccess: React.FC<FileGroupAccessProps> = ({ file, onOpenShareDialog }) => {
  const [groups, setGroups] = useState<ShareGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchGroups();
  }, [file.id]);
  
  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError('');
      
      const documentGroups = await api.getDocumentGroups(file.id);
      setGroups(documentGroups);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching document groups:', err);
      setError('Failed to load groups');
      setLoading(false);
    }
  };
  
  const getPermissionLabel = (permission: string) => {
    switch (permission) {
      case 'read':
        return 'Read';
      case 'write':
        return 'Write';
      case 'admin':
        return 'Admin';
      default:
        return 'Read';
    }
  };
  
  return (
    <Container>
      <SectionTitle>
        Shared with Groups
        {onOpenShareDialog && (
          <span 
            style={{ 
              marginLeft: theme.spacing.sm, 
              color: theme.colors.primary.main,
              cursor: 'pointer',
              fontSize: '0.9em'
            }}
            onClick={onOpenShareDialog}
          >
            Manage
          </span>
        )}
      </SectionTitle>
      
      {loading ? (
        <LoadingState>Loading groups...</LoadingState>
      ) : error ? (
        <ErrorState>{error}</ErrorState>
      ) : groups.length === 0 ? (
        <EmptyState>Not shared with any groups</EmptyState>
      ) : (
        <GroupList>
          {groups.map(group => (
            <GroupItem key={group.id}>
              <GroupName>{group.name}</GroupName>
              <PermissionBadge permission={group.permission_level || 'read' as 'read' | 'write' | 'admin'}>
                {getPermissionLabel(group.permission_level || 'read')}
              </PermissionBadge>
            </GroupItem>
          ))}
        </GroupList>
      )}
    </Container>
  );
};

export default FileGroupAccess;
