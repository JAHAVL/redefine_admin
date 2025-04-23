import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { schedulerReducer, initialState } from './schedulerReducer';
import { SchedulerState } from '../types';

// Create the context
const SchedulerContext = createContext<{
  state: SchedulerState;
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Create the provider component
interface SchedulerProviderProps {
  children: ReactNode;
}

export const SchedulerProvider: React.FC<SchedulerProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(schedulerReducer, initialState);

  return (
    <SchedulerContext.Provider value={{ state, dispatch }}>
      {children}
    </SchedulerContext.Provider>
  );
};

// Create a custom hook to use the scheduler context
export const useScheduler = () => {
  const context = useContext(SchedulerContext);
  
  if (context === undefined) {
    throw new Error('useScheduler must be used within a SchedulerProvider');
  }
  
  return context;
};
