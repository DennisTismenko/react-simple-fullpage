import React, {useState, useContext, useEffect, useCallback} from 'react';
import { parseHashValue } from '../../util/navUtil';

const FullPageContext = React.createContext(null);

export const FullPage = ({children}) => {
  const [isHandlingAnimation, setHandlingAnimation] = useState(false);
  const [isHandlingDrag, setHandlingDrag] = useState(false);
  const [currentPath, setCurrentPath] = useState(null);

  const navigateTo = path => {
    window.location.hash = path;
  };

  const routeToHash = useCallback(() => {
    const hash = window.location.hash;
      if (hash) {
        const routeTarget = parseHashValue(hash);
        setCurrentPath(routeTarget);
      }
  }, []);

  // Initialize global event listeners
  useEffect(() => {
    const handleLoad = () => {
      routeToHash();
    };
    const handleHashChange = e => {
      e.preventDefault();
      routeToHash();
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('load', handleLoad);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('load', handleLoad);
    };
  }, [routeToHash]);

  return (
    <FullPageContext.Provider
      value={{
        isHandlingAnimation,
        setHandlingAnimation,
        isHandlingDrag,
        setHandlingDrag,
        currentPath,
        navigateTo,
      }}
    >
      {children}
    </FullPageContext.Provider>
  );
};

export const useFullPageContext = () => useContext(FullPageContext);
