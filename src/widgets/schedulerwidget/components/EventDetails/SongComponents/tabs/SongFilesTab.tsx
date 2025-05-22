import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../../theme/index';
import { SongExpandStateData } from '../../../../types/songInterfaces';

// Types
interface SongFilesTabProps {
    song: {
        id: number;
        title: string;
        artist: string;
        key: string;
        bpm: number;
    };
    songExpandState: Record<number, SongExpandStateData>;
    setSongExpandState: React.Dispatch<React.SetStateAction<Record<number, SongExpandStateData>>>;
}

interface ViewToggleButtonProps {
    active: boolean;
}

// Styled components
const FilesContainer = styled.div`
    padding: ${theme.spacing.sm} 0;
    background-color: ${theme.colors.highlight};
    color: ${theme.colors.text.primary};
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    max-width: 100%;
`;

const SectionLabel = styled.h4`
    font-size: ${theme.typography.fontSizes.md};
    margin: 0 0 ${theme.spacing.sm} 0;
    color: white;
`;

const ViewToggleContainer = styled.div`
    display: flex;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    overflow: hidden;
`;

const ViewToggleButton = styled.button<ViewToggleButtonProps>`
    background-color: ${(props: ViewToggleButtonProps) => props.active ? theme.colors.primary : 'transparent'};
    color: ${(props: ViewToggleButtonProps) => props.active ? 'white' : theme.colors.text.secondary};
    border: 1px solid ${theme.colors.border};
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    cursor: pointer;
    font-size: ${theme.typography.fontSizes.sm};
    transition: all 0.2s;
    
    &:first-child {
        border-top-left-radius: ${theme.borderRadius.sm};
        border-bottom-left-radius: ${theme.borderRadius.sm};
    }
    
    &:last-child {
        border-top-right-radius: ${theme.borderRadius.sm};
        border-bottom-right-radius: ${theme.borderRadius.sm};
    }
    
    &:hover {
        background-color: ${(props: ViewToggleButtonProps) => props.active ? theme.colors.primary : 'rgba(0, 0, 0, 0.05)'};
    }
    
    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
    }
`;

const GridFilesList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: ${theme.spacing.md};
    margin-top: ${theme.spacing.md};
`;

const FileCard = styled.div`
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    background-color: ${theme.colors.highlight};
    color: ${theme.colors.text.primary};
    transition: transform 0.2s, box-shadow 0.2s;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
`;

const FileIconContainer = styled.div`
    padding: ${theme.spacing.md};
    display: flex;
    justify-content: center;
    background-color: ${theme.colors.highlight};
`;

type FileType = 'pdf' | 'audio' | 'video' | 'image' | 'zip' | 'document' | 'other';

interface FileIconProps {
    type: FileType;
}

const FileIcon = styled.div<FileIconProps>`
    width: 50px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${(props: FileIconProps) => {
        const fileType = props.type as keyof typeof theme.colors.fileTypes;
        return theme.colors.fileTypes[fileType] || theme.colors.fileTypes.other;
    }};
    color: white;
    font-weight: bold;
    font-size: ${theme.typography.fontSizes.md};
    border-radius: ${theme.borderRadius.sm};
    position: relative;
    
    &:before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        border-width: 0 10px 10px 0;
        border-style: solid;
        border-color: rgba(0, 0, 0, 0.2) ${theme.colors.background};
    }
`;

const FileInfo = styled.div`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
`;

const FileName = styled.div`
    font-size: ${theme.typography.fontSizes.sm};
    font-weight: ${theme.typography.fontWeights.medium};
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const FileSize = styled.div`
    font-size: ${theme.typography.fontSizes.xs};
    color: ${theme.colors.text.secondary};
    margin-top: ${theme.spacing.xs};
`;

const FileActions = styled.div`
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    display: flex;
    justify-content: flex-end;
    gap: ${theme.spacing.xs};
    border-top: 1px solid ${theme.colors.border};
    background-color: ${theme.colors.highlight};
`;

const IconButton = styled.button`
    background: none;
    border: none;
    color: ${theme.colors.primary};
    font-size: ${theme.typography.fontSizes.xs};
    cursor: pointer;
    padding: ${theme.spacing.xs};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${theme.borderRadius.sm};
    width: 30px;
    height: 30px;
    transition: all 0.2s;
    
    &:hover {
        background-color: rgba(255, 255, 255, 0.05);
        transform: translateY(-1px);
    }
`;

const FileButton = styled.button`
    background: none;
    border: none;
    color: ${theme.colors.primary};
    font-size: ${theme.typography.fontSizes.xs};
    cursor: pointer;
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    
    &:hover {
        text-decoration: underline;
    }
`;

const TableFilesList = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: ${theme.spacing.md};
    text-align: left;
`;

const TableHeader = styled.th`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-weight: ${theme.typography.fontWeights.medium};
    font-size: ${theme.typography.fontSizes.sm};
    color: ${theme.colors.text.secondary};
    border-bottom: 1px solid ${theme.colors.border};
`;

const TableRow = styled.tr`
    &:nth-child(odd) {
        background-color: rgba(0, 0, 0, 0.02);
    }
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }
`;

const TableCell = styled.td`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.typography.fontSizes.sm};
    border-bottom: 1px solid ${theme.colors.border};
`;

const TableIconCell = styled(TableCell)`
    width: 50px;
    text-align: center;
`;

/**
 * SongFilesTab component - Displays and manages files associated with a song
 */
const SongFilesTab: React.FC<SongFilesTabProps> = ({ song, songExpandState, setSongExpandState }): React.ReactElement => {
    const isTableView: boolean = songExpandState[song.id]?.filesView === 'table';
    
    const setFilesView = (view: 'grid' | 'table'): void => {
        const newState: Record<number, SongExpandStateData> = {...songExpandState};
        newState[song.id] = { 
            ...newState[song.id],
            filesView: view
        };
        setSongExpandState(newState);
    };
    
    return (
        <FilesContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SectionLabel>Attached Files</SectionLabel>
                <ViewToggleContainer>
                    <ViewToggleButton 
                        active={!isTableView}
                        onClick={() => setFilesView('grid')}
                    >
                        Grid
                    </ViewToggleButton>
                    <ViewToggleButton 
                        active={isTableView}
                        onClick={() => setFilesView('table')}
                    >
                        Table
                    </ViewToggleButton>
                </ViewToggleContainer>
            </div>
            
            {!isTableView ? (
                <GridFilesList>
                    <FileCard>
                        <FileIconContainer>
                            <FileIcon type="pdf">PDF</FileIcon>
                        </FileIconContainer>
                        <FileInfo>
                            <FileName>{song.title} - Chord Chart.pdf</FileName>
                            <FileSize>428 KB</FileSize>
                        </FileInfo>
                        <FileActions>
                            <IconButton title="Download">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                            </IconButton>
                            <IconButton title="Preview">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </IconButton>
                        </FileActions>
                    </FileCard>
                    
                    <FileCard>
                        <FileIconContainer>
                            <FileIcon type="pdf">PDF</FileIcon>
                        </FileIconContainer>
                        <FileInfo>
                            <FileName>{song.title} - Lead Sheet.pdf</FileName>
                            <FileSize>512 KB</FileSize>
                        </FileInfo>
                        <FileActions>
                            <IconButton title="Download">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                            </IconButton>
                            <IconButton title="Preview">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            </IconButton>
                        </FileActions>
                    </FileCard>
                    
                    <FileCard>
                        <FileIconContainer>
                            <FileIcon type="audio">MP3</FileIcon>
                        </FileIconContainer>
                        <FileInfo>
                            <FileName>{song.title} - Demo.mp3</FileName>
                            <FileSize>3.2 MB</FileSize>
                        </FileInfo>
                        <FileActions>
                            <FileButton>Download</FileButton>
                            <FileButton>Play</FileButton>
                        </FileActions>
                    </FileCard>
                    
                    <FileCard>
                        <FileIconContainer>
                            <FileIcon type="zip">ZIP</FileIcon>
                        </FileIconContainer>
                        <FileInfo>
                            <FileName>{song.title} - Stems.zip</FileName>
                            <FileSize>24.7 MB</FileSize>
                        </FileInfo>
                        <FileActions>
                            <FileButton>Download</FileButton>
                        </FileActions>
                    </FileCard>
                </GridFilesList>
            ) : (
                <TableFilesList>
                    <thead>
                        <tr>
                            <TableHeader style={{ width: '50px' }}></TableHeader>
                            <TableHeader>Name</TableHeader>
                            <TableHeader>Size</TableHeader>
                            <TableHeader>Type</TableHeader>
                            <TableHeader>Actions</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        <TableRow>
                            <TableIconCell>
                                <FileIcon type="pdf" style={{ width: '30px', height: '35px', margin: '0 auto', fontSize: '12px' }}>PDF</FileIcon>
                            </TableIconCell>
                            <TableCell>{song.title} - Chord Chart.pdf</TableCell>
                            <TableCell>428 KB</TableCell>
                            <TableCell>PDF Document</TableCell>
                            <TableCell>
                                <FileButton>Download</FileButton>
                                <FileButton>Preview</FileButton>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableIconCell>
                                <FileIcon type="pdf" style={{ width: '30px', height: '35px', margin: '0 auto', fontSize: '12px' }}>PDF</FileIcon>
                            </TableIconCell>
                            <TableCell>{song.title} - Lead Sheet.pdf</TableCell>
                            <TableCell>512 KB</TableCell>
                            <TableCell>PDF Document</TableCell>
                            <TableCell>
                                <FileButton>Download</FileButton>
                                <FileButton>Preview</FileButton>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableIconCell>
                                <FileIcon type="audio" style={{ width: '30px', height: '35px', margin: '0 auto', fontSize: '12px' }}>MP3</FileIcon>
                            </TableIconCell>
                            <TableCell>{song.title} - Demo.mp3</TableCell>
                            <TableCell>3.2 MB</TableCell>
                            <TableCell>Audio</TableCell>
                            <TableCell>
                                <FileButton>Download</FileButton>
                                <FileButton>Play</FileButton>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableIconCell>
                                <FileIcon type="zip" style={{ width: '30px', height: '35px', margin: '0 auto', fontSize: '12px' }}>ZIP</FileIcon>
                            </TableIconCell>
                            <TableCell>{song.title} - Stems.zip</TableCell>
                            <TableCell>24.7 MB</TableCell>
                            <TableCell>Archive</TableCell>
                            <TableCell>
                                <FileButton>Download</FileButton>
                            </TableCell>
                        </TableRow>
                    </tbody>
                </TableFilesList>
            )}
        </FilesContainer>
    );
};

export default SongFilesTab;
