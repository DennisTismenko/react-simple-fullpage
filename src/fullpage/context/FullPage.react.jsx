import React, {useState, useContext, useEffect} from 'react';

const FullPageContext = React.createContext(null);

export const FullPage = ({children}) => {
  const [isHandlingAnimation, setHandlingAnimation] = useState(false);
  const [currentPath, setCurrentPath] = useState(null);

  const navigateTo = path => {
    setCurrentPath(path);
  };

  useEffect(() => {
    const handleHashChange = e => {
      e.preventDefault();
      if (window.location.hash) {
        const routeTarget = window.location.hash.substring(1);
        navigateTo(routeTarget);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  });

  return (
    <FullPageContext.Provider
      value={{
        isHandlingAnimation,
        setHandlingAnimation,
        currentPath,
        navigateTo,
      }}
    >
      {children}
    </FullPageContext.Provider>
  );
};

export const useFullPageContext = () => useContext(FullPageContext);
