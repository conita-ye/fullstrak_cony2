import React, { createContext, useContext, ReactNode } from 'react';

interface NavigationContextType {
  navigate: (page: string, data?: any) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ 
  children, 
  navigate 
}: { 
  children: ReactNode; 
  navigate: (page: string, data?: any) => void;
}) => {
  return (
    <NavigationContext.Provider value={{ navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

