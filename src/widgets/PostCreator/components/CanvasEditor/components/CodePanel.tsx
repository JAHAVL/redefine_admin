import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faJs, 
  faHtml5, 
  faCss3Alt, 
  faReact 
} from '@fortawesome/free-brands-svg-icons';
import { 
  faCopy, 
  faCode,
  faDownload,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { useEditor } from '../EditorContext';
import { generateHtml } from '../utils/htmlGenerator';
import { generateCss } from '../utils/cssGenerator';
import { generateJavaScript } from '../utils/jsGenerator';
import { generateJsx } from '../utils/jsxGenerator';
import { generateTsx } from '../utils/tsxGenerator';
import { parseReactToElements } from '../utils/codeParser';

const CodePanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const CodeHeader = styled.div`
  padding: 6px 10px;
  border-bottom: 1px solid #e0e0e0;
`;

const CodeTitle = styled.h3`
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const SelectContainer = styled.div`
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const FormatIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 14px;
  color: #1976d2;
`;

const FormatSelect = styled.select`
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  font-size: 12px;
  background-color: white;
  flex: 1;
  
  &:focus {
    outline: none;
    border-color: #1976d2;
  }
`;

const SelectRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 8px;
`;

const SyntaxSelect = styled.select`
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  font-size: 12px;
  background-color: white;
  width: 80px;
  
  &:focus {
    outline: none;
    border-color: #1976d2;
  }
`;

const Label = styled.label`
  font-size: 12px;
  margin-right: 4px;
  white-space: nowrap;
`;

const CodeContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 50px);
`;

const CodeDisplay = styled.textarea`
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 8px;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 11px;
  line-height: 1.3;
  color: #333;
  overflow: auto;
  margin: 0 0 6px 0;
  border: 1px solid #e0e0e0;
  flex: 1;
  min-height: 120px;
  resize: none;
  white-space: pre;
  tab-size: 2;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 6px;
  gap: 6px;
  min-height: 28px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 3px;
  border: 1px solid #e0e0e0;
  background-color: white;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &.primary {
    background-color: #1976d2;
    color: white;
    border-color: #1976d2;
    
    &:hover {
      background-color: #1565c0;
    }
  }
  
  svg {
    font-size: 11px;
  }
`;

const PreviewStatus = styled.div`
  margin-top: 8px;
  margin-bottom: 12px;
  padding: 8px;
  background-color: #f0f7ff;
  border-radius: 4px;
  border-left: 3px solid #1976d2;
  font-size: 12px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HighlightInfo = styled.div`
  margin-top: 4px;
  font-size: 11px;
  color: #666;
  font-style: italic;
`;

const CodePanel: React.FC = () => {
  const { state, dispatch } = useEditor();
  // Get the elements from the current canvas
  const elements = state.currentCanvas?.elements || [];
  // Get the canvas for dimension information
  const canvas = state.currentCanvas;
  
  // Load saved format and syntax preferences from localStorage
  const getSavedFormat = (): 'html' | 'css' | 'javascript' | 'react' => {
    try {
      const savedFormat = localStorage.getItem('canvasEditorCodeFormat');
      return savedFormat ? (savedFormat as 'html' | 'css' | 'javascript' | 'react') : 'react';
    } catch (error) {
      console.error('Error loading saved format:', error);
      return 'react';
    }
  };
  
  const getSavedSyntax = (): 'jsx' | 'tsx' => {
    try {
      const savedSyntax = localStorage.getItem('canvasEditorReactSyntax');
      return savedSyntax ? (savedSyntax as 'jsx' | 'tsx') : 'jsx';
    } catch (error) {
      console.error('Error loading saved syntax:', error);
      return 'jsx';
    }
  };
  
  const getSavedCode = (): string => {
    try {
      const savedCode = localStorage.getItem('canvasEditorCodeContent');
      return savedCode || '';
    } catch (error) {
      console.error('Error loading saved code:', error);
      return '';
    }
  };
  
  // State for the active format and code content
  const [activeFormat, setActiveFormat] = useState<'html' | 'css' | 'javascript' | 'react'>(getSavedFormat());
  const [reactSyntax, setReactSyntax] = useState<'jsx' | 'tsx'>(getSavedSyntax());
  const [codeValue, setCodeValue] = useState<string>(getSavedCode());
  const [isCodeUserModified, setIsCodeUserModified] = useState<boolean>(false);
  
  // Ref for code textarea for selection management
  const codeDisplayRef = useRef<HTMLTextAreaElement>(null);
  
  // Generate code whenever elements change
  useEffect(() => {
    if (!isCodeUserModified) {
      const generatedCode = generateCode();
      setCodeValue(generatedCode);
    }
  }, [elements, activeFormat, reactSyntax]);
  
  // Save preferences when they change
  useEffect(() => {
    try {
      localStorage.setItem('canvasEditorCodeFormat', activeFormat);
    } catch (error) {
      console.error('Error saving format preference:', error);
    }
  }, [activeFormat]);
  
  useEffect(() => {
    try {
      localStorage.setItem('canvasEditorReactSyntax', reactSyntax);
    } catch (error) {
      console.error('Error saving syntax preference:', error);
    }
  }, [reactSyntax]);
  
  // When code is modified by user, save it
  useEffect(() => {
    if (isCodeUserModified) {
      try {
        localStorage.setItem('canvasEditorCodeContent', codeValue);
        
        // Real-time code to canvas update
        if (activeFormat === 'react' && codeValue.trim()) {
          try {
            // Parse React code and update canvas
            const elements = parseReactToElements(codeValue);
            if (elements && elements.length > 0) {
              dispatch({
                type: 'CLEAR_CANVAS',
                payload: { keepBackground: true }
              });
              
              elements.forEach(element => {
                dispatch({
                  type: 'ADD_ELEMENT',
                  payload: element
                });
              });
            }
          } catch (error) {
            console.error('Error rendering code to canvas:', error);
          }
        } else if (!codeValue.trim()) {
          // If code is empty, clear canvas
          dispatch({
            type: 'CLEAR_CANVAS',
            payload: { keepBackground: true }
          });
        }
        
        // Add a timestamp to track when the code was last saved
        localStorage.setItem('canvasEditorCodeLastSaved', new Date().toISOString());
      } catch (error) {
        console.error('Error saving code content:', error);
      }
    }
  }, [codeValue, isCodeUserModified]);
  
  // Get the icon for the current format
  const getFormatIcon = () => {
    switch (activeFormat) {
      case 'html':
        return <FontAwesomeIcon icon={faHtml5} />;
      case 'css':
        return <FontAwesomeIcon icon={faCss3Alt} />;
      case 'javascript':
        return <FontAwesomeIcon icon={faJs} />;
      case 'react':
        return <FontAwesomeIcon icon={faReact} />;
      default:
        return <FontAwesomeIcon icon={faCode} />;
    }
  };
  
  // Generate code based on the active format
  const generateCode = () => {
    switch (activeFormat) {
      case 'html':
        return generateHtml(elements, canvas);
      case 'css':
        return generateCss(elements);
      case 'javascript':
        return generateJavaScript(elements);
      case 'react':
        return reactSyntax === 'jsx' 
          ? generateJsx(elements, canvas) 
          : generateTsx(elements, canvas);
      default:
        return '';
    }
  };
  
  // Handle code changes
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCodeValue(newValue);
    setIsCodeUserModified(true);
  };
  
  // Copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeValue)
      .then(() => {
        alert('Code copied to clipboard!');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };
  
  // Download code as file
  const downloadCode = () => {
    let extension = '';
    let filename = '';
    
    switch (activeFormat) {
      case 'html':
        extension = 'html';
        filename = 'canvas-export.html';
        break;
      case 'css':
        extension = 'css';
        filename = 'canvas-styles.css';
        break;
      case 'javascript':
        extension = 'js';
        filename = 'canvas-script.js';
        break;
      case 'react':
        extension = reactSyntax === 'jsx' ? 'jsx' : 'tsx';
        filename = `CanvasComponent.${extension}`;
        break;
    }
    
    const blob = new Blob([codeValue], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Clear the saved code
  const handleClearCode = () => {
    if (window.confirm('Are you sure you want to clear your code? This cannot be undone.')) {
      setCodeValue('');
      setIsCodeUserModified(false);
      localStorage.removeItem('canvasEditorCodeContent');
      
      // Clear the canvas elements
      dispatch({
        type: 'CLEAR_CANVAS',
        payload: { keepBackground: true }
      });
      
      console.log('Canvas and code cleared');
    }
  };
  
  return (
    <CodePanelContainer>
      <CodeHeader>
        <CodeTitle>Generate Code</CodeTitle>
        <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>Convert canvas design to code</p>
      </CodeHeader>
      
      <CodeContent>
        <SelectContainer>
          <FormatIcon>{getFormatIcon()}</FormatIcon>
          <FormatSelect 
            value={activeFormat}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setActiveFormat(e.target.value as 'html' | 'css' | 'javascript' | 'react')}
          >
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="javascript">JS</option>
            <option value="react">React</option>
          </FormatSelect>
          
          {activeFormat === 'react' && (
            <SelectRow>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Label>Syntax:</Label>
                <SyntaxSelect 
                  value={reactSyntax}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReactSyntax(e.target.value as 'jsx' | 'tsx')}
                >
                  <option value="jsx">JSX</option>
                  <option value="tsx">TSX</option>
                </SyntaxSelect>
              </div>
            </SelectRow>
          )}
        </SelectContainer>
        
        <PreviewStatus>
          <FontAwesomeIcon icon={faCode} style={{ fontSize: '16px', color: '#1976d2' }} />
          <div>
            <div>Code Preview</div>
            <HighlightInfo>This code preview is a representation of your canvas design.</HighlightInfo>
          </div>
        </PreviewStatus>
        
        <CodeDisplay 
          value={codeValue}
          onChange={handleCodeChange}
          spellCheck={false}
          ref={codeDisplayRef}
        />
        
        <ActionBar>
          {isCodeUserModified && (
            <ActionButton onClick={() => {
              setIsCodeUserModified(false);
              const generatedCode = generateCode();
              setCodeValue(generatedCode);
            }}>
              <FontAwesomeIcon icon={faCode} />
              Reset
            </ActionButton>
          )}
          <div style={{ display: 'flex', marginTop: '8px', gap: '8px' }}>
            <ActionButton onClick={copyToClipboard}>
              <FontAwesomeIcon icon={faCopy} /> Copy
            </ActionButton>
            <ActionButton onClick={downloadCode}>
              <FontAwesomeIcon icon={faDownload} /> Save
            </ActionButton>
            {isCodeUserModified && (
              <ActionButton onClick={handleClearCode}>
                <FontAwesomeIcon icon={faTrash} /> Clear
              </ActionButton>
            )}
          </div>
        </ActionBar>
      </CodeContent>
    </CodePanelContainer>
  );
};

export default CodePanel;
