import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  constructFromDOM,
  createDOMComponents,
  navigateAction,
} from '../types/FullPageTree';
import {getScrollDirection, getArrowDirection} from '../../util/navUtil';

const FullPageContext = React.createContext(null);

export const FullPage = ({children}) => {
  const [isHandlingAnimation, setHandlingAnimation] = useState(false);
  const [isHandlingDrag, setHandlingDrag] = useState(false);
  const [pageTree, setPageTree] = useState(constructFromDOM(children));

  const pageTreeDOMComponents = useMemo(() => {
    // console.log('Rendering components: ', pageTree);
    return createDOMComponents(pageTree.root);
  }, [pageTree]);

  // Debug
  // useEffect(() => {
  // console.debug(pageTree);
  // console.debug(pageTreeDOMComponents);
  // }, [pageTree, pageTreeDOMComponents]);

  const handleTreeUpdate = useCallback((updatedPageTree) => {
    setHandlingAnimation(true);
    setPageTree(updatedPageTree);
  }, []);

  const handleAction = useCallback((e, actionType) => {
    if (!isHandlingAnimation) {
      let direction;
      switch (actionType) {
        case 'scroll':
          direction = getScrollDirection(e);
          break;
        case 'key':
          direction = getArrowDirection(e);
          break;
        default:
          return;
      }
      if (!direction) return;
      navigateAction(pageTree, direction, handleTreeUpdate);
    }
  }, [handleTreeUpdate, isHandlingAnimation, pageTree]);

  useEffect(() => {
    const handleKeyboardAction = (e) => handleAction(e, 'key');
    window.addEventListener('keydown', handleKeyboardAction);
    return () => {
      window.removeEventListener('keydown', handleKeyboardAction);
    };
  }, [handleAction]);


  return (
    <div onWheel={(e) => handleAction(e, 'scroll')}>
      <FullPageContext.Provider
        value={{
          isHandlingAnimation,
          setHandlingAnimation,
          isHandlingDrag,
          setHandlingDrag,
        }}
      >
        {pageTreeDOMComponents}
      </FullPageContext.Provider>
    </div>
  );
};

export const useFullPageContext = () => useContext(FullPageContext);
