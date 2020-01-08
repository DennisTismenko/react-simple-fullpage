import React, {useState, useContext} from 'react';

const FullPageContext = React.createContext(null);

export const FullPage = ({children}) => {
  const [isHandlingAnimation, setHandlingAnimation] = useState(false);
  return (
    <FullPageContext.Provider
      value={{isHandlingAnimation, setHandlingAnimation}}
    >
      {children}
    </FullPageContext.Provider>
  );
};

export const useFullPageContext = () => useContext(FullPageContext);
