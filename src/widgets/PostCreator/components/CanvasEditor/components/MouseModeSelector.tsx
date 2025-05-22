import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faComment, faArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { useEditor } from '../EditorContext';
import { 
  ToolbarSection, 
  ToolbarLabel, 
  ToolbarRow, 
  Tool 
} from '../styled/ToolbarStyles';

const MouseModeSelector: React.FC = () => {
  const { state, dispatch } = useEditor();
  
  return (
    <ToolbarSection>
      <ToolbarLabel>Mouse Mode</ToolbarLabel>
      <ToolbarRow>
        <Tool 
          active={state.mouseMode === 'edit'} 
          onClick={() => dispatch({ type: 'SET_MOUSE_MODE', payload: 'edit' })}
          title="Edit Mode"
        >
          <FontAwesomeIcon icon={faEdit} />
        </Tool>
        <Tool 
          active={state.mouseMode === 'comment'} 
          onClick={() => dispatch({ type: 'SET_MOUSE_MODE', payload: 'comment' })}
          title="Comment Mode"
        >
          <FontAwesomeIcon icon={faComment} />
        </Tool>
        <Tool 
          active={state.mouseMode === 'navigate'} 
          onClick={() => dispatch({ type: 'SET_MOUSE_MODE', payload: 'navigate' })}
          title="Navigate Mode"
        >
          <FontAwesomeIcon icon={faArrowsAlt} />
        </Tool>
      </ToolbarRow>
    </ToolbarSection>
  );
};

export default MouseModeSelector;
