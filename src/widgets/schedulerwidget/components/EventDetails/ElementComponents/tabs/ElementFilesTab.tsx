import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../../../../theme/index';
import { SongExpandStateData } from '../../../../types/songInterfaces';

// Types
interface ElementFilesTabProps {
    element: {
        id: number;
        title: string;
        description?: string;
    };
    elementExpandState: Record<number, SongExpandStateData>;
    setElementExpandState: React.Dispatch<React.SetStateAction<Record<number, SongExpandStateData>>>;
}

interface ViewToggleButtonProps {
    active: boolean;
}

type FileType = 'pdf' | 'doc' | 'ppt' | 'image' | 'video' | 'audio' | 'other';

interface FileIconProps {
    type: FileType;
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
    color: ${theme.colors.text.primary};
    font-weight: ${theme.typography.fontWeights.semibold};
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
    border: none;
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
    background-color: ${theme.colors.background};
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
    align-items: center;
    background-color: ${theme.colors.highlight};
`;

const FileIcon = styled.div<FileIconProps>`
    width: 50px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props: FileIconProps) => {
        switch(props.type) {
            case 'pdf': return '#F40F02';
            case 'doc': return '#295396';
            case 'ppt': return '#D04423';
            case 'image': return '#41A6CA';
            case 'video': return '#FF5722';
            case 'audio': return '#8BC34A';
            default: return '#9E9E9E';
        }
    }};
    color: white;
    font-weight: ${theme.typography.fontWeights.bold};
    font-size: ${theme.typography.fontSizes.sm};
    position: relative;
    border-radius: 4px;
    
    &:before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        border-width: 0 15px 15px 0;
        border-style: solid;
        border-color: rgba(0,0,0,0.2) ${(props: FileIconProps) => {
            switch(props.type) {
                case 'pdf': return '#F40F02';
                case 'doc': return '#295396';
                case 'ppt': return '#D04423';
                case 'image': return '#41A6CA';
                case 'video': return '#FF5722';
                case 'audio': return '#8BC34A';
                default: return '#9E9E9E';
            }
        }};
    }
`;

const FileInfo = styled.div`
    padding: ${theme.spacing.sm};
`;

const FileName = styled.h5`
    margin: 0 0 ${theme.spacing.xs} 0;
    font-size: ${theme.typography.fontSizes.sm};
    font-weight: ${theme.typography.fontWeights.medium};
    color: ${theme.colors.text.primary};
    word-break: break-word;
`;

const FileSize = styled.p`
    margin: 0;
    font-size: ${theme.typography.fontSizes.xs};
    color: ${theme.colors.text.secondary};
`;

const FileActions = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    border-top: 1px solid ${theme.colors.border};
    background-color: ${theme.colors.highlight};
`;

const IconButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: ${theme.colors.text.secondary};
    padding: ${theme.spacing.xs};
    margin-left: ${theme.spacing.xs};
    border-radius: ${theme.borderRadius.sm};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    
    &:hover {
        color: ${theme.colors.primary};
        background-color: rgba(0, 0, 0, 0.05);
    }
    
    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
    }
`;

const TableContainer = styled.div`
    margin-top: ${theme.spacing.md};
    overflow-x: auto;
    width: 100%;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    font-size: ${theme.typography.fontSizes.sm};
`;

const TableHeader = styled.th`
    text-align: left;
    padding: ${theme.spacing.sm};
    border-bottom: 2px solid ${theme.colors.border};
    font-weight: ${theme.typography.fontWeights.semibold};
    color: ${theme.colors.text.primary};
`;

const TableCell = styled.td`
    padding: ${theme.spacing.sm};
    border-bottom: 1px solid ${theme.colors.border};
    color: ${theme.colors.text.primary};
`;

const UploadContainer = styled.div`
    margin-top: ${theme.spacing.md};
    padding: ${theme.spacing.md};
    border: 2px dashed ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${theme.colors.background};
    transition: all 0.3s;
    
    &.dragging {
        border-color: ${theme.colors.primary};
        background-color: rgba(37, 99, 235, 0.05);
    }
`;

const UploadInput = styled.input`
    display: none;
`;

const UploadButton = styled.button`
    background-color: ${theme.colors.primary};
    color: white;
    border: none;
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-weight: ${theme.typography.fontWeights.semibold};
    cursor: pointer;
    margin-top: ${theme.spacing.md};
    transition: ${theme.transitions.default};
    
    &:hover {
        background-color: ${theme.colors.primaryDark};
    }
    
    &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    }
`;

const UploadText = styled.p`
    margin: ${theme.spacing.md} 0;
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.fontSizes.md};
    text-align: center;
`;

/**
 * ElementFilesTab component - Displays and manages files associated with an element
 * Includes file upload functionality
 */
const ElementFilesTab: React.FC<ElementFilesTabProps> = ({ 
    element,
    elementExpandState, 
    setElementExpandState 
}): React.ReactElement => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [files, setFiles] = useState<File[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<Array<{
        id: number;
        name: string;
        type: FileType;
        size: string;
        uploadDate: string;
    }>>([
        {
            id: 1,
            name: `${element.title} - Presentation.pdf`,
            type: 'pdf',
            size: '1.2 MB',
            uploadDate: '2025-05-20'
        }
    ]);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const isTableView: boolean = elementExpandState[element.id]?.filesView === 'table';
    
    const setFilesView = (view: 'grid' | 'table'): void => {
        const newState: Record<number, SongExpandStateData> = {...elementExpandState};
        newState[element.id] = { 
            ...newState[element.id],
            filesView: view
        };
        setElementExpandState(newState);
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(true);
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(false);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };
    
    const openFileSelector = (): void => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };
    
    const handleFiles = (fileList: FileList): void => {
        const newFiles = Array.from(fileList);
        setFiles([...files, ...newFiles]);
        
        // Simulate file upload - in a real app this would be an API call
        const newUploadedFiles = newFiles.map((file, index) => {
            const fileType = getFileType(file.name);
            return {
                id: Date.now() + index,
                name: file.name,
                type: fileType,
                size: formatFileSize(file.size),
                uploadDate: new Date().toISOString().split('T')[0]
            };
        });
        
        setUploadedFiles([...uploadedFiles, ...newUploadedFiles]);
    };
    
    const getFileType = (filename: string): FileType => {
        const extension = filename.split('.').pop()?.toLowerCase() || '';
        
        if (['pdf'].includes(extension)) return 'pdf';
        if (['doc', 'docx', 'txt'].includes(extension)) return 'doc';
        if (['ppt', 'pptx'].includes(extension)) return 'ppt';
        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) return 'image';
        if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) return 'video';
        if (['mp3', 'wav', 'ogg'].includes(extension)) return 'audio';
        
        return 'other';
    };
    
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    const handleDeleteFile = (id: number): void => {
        setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
    };
    
    return (
        <FilesContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SectionLabel>Element Files</SectionLabel>
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
            
            <UploadContainer 
                className={isDragging ? 'dragging' : ''}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: theme.colors.primary }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <UploadText>Drag and drop files here or click to browse</UploadText>
                <UploadInput 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                />
                <UploadButton onClick={openFileSelector}>
                    Choose Files
                </UploadButton>
            </UploadContainer>
            
            {uploadedFiles.length > 0 && (
                <>
                    {!isTableView ? (
                        <GridFilesList>
                            {uploadedFiles.map(file => (
                                <FileCard key={file.id}>
                                    <FileIconContainer>
                                        <FileIcon type={file.type}>
                                            {file.type.toUpperCase().substring(0, 3)}
                                        </FileIcon>
                                    </FileIconContainer>
                                    <FileInfo>
                                        <FileName>{file.name}</FileName>
                                        <FileSize>{file.size}</FileSize>
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
                                        <IconButton title="Delete" onClick={() => handleDeleteFile(file.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                            </svg>
                                        </IconButton>
                                    </FileActions>
                                </FileCard>
                            ))}
                        </GridFilesList>
                    ) : (
                        <TableContainer>
                            <Table>
                                <thead>
                                    <tr>
                                        <TableHeader>Name</TableHeader>
                                        <TableHeader>Type</TableHeader>
                                        <TableHeader>Size</TableHeader>
                                        <TableHeader>Date</TableHeader>
                                        <TableHeader>Actions</TableHeader>
                                    </tr>
                                </thead>
                                <tbody>
                                    {uploadedFiles.map(file => (
                                        <tr key={file.id}>
                                            <TableCell>{file.name}</TableCell>
                                            <TableCell>{file.type.toUpperCase()}</TableCell>
                                            <TableCell>{file.size}</TableCell>
                                            <TableCell>{file.uploadDate}</TableCell>
                                            <TableCell>
                                                <div style={{ display: 'flex' }}>
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
                                                    <IconButton title="Delete" onClick={() => handleDeleteFile(file.id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="3 6 5 6 21 6"></polyline>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                            <line x1="10" y1="11" x2="10" y2="17"></line>
                                                            <line x1="14" y1="11" x2="14" y2="17"></line>
                                                        </svg>
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </TableContainer>
                    )}
                </>
            )}
        </FilesContainer>
    );
};

export default ElementFilesTab;
