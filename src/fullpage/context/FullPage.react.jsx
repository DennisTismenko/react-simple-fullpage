import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useReducer,
} from 'react';
import {
  constructFromDOM,
  createDOMComponents,
  navigateAction,
  navigateTo,
} from '../types/FullPageTree';
import {
  getScrollDirection,
  getArrowDirection,
  getHashValueFromURL,
  parseHashValue,
  getRelativeTouchDragDirection,
} from '../../util/navUtil';

import {
  startDragAction,
  endDragAction,
  startDragAnimationAction,
  endDragAnimationAction,
} from '../actions/dragActions';

import dragReducer from '../reducer/dragReducer';

const initialDragState = {
  isHandlingDrag: false,
  isHandlingDragAnimation: false,
  dragOrientation: null,
};

const FullPageContext = React.createContext(null);

export const FullPage = ({updateHash = true, children}) => {
  const [
    {isHandlingDrag, isHandlingDragAnimation, dragOrientation},
    dispatch,
  ] = useReducer(dragReducer, initialDragState);
  const [isHandlingAnimation, setHandlingAnimation] = useState(false);
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

  const handleTreeUpdate = useCallback(
    (updatedPageTree, isDrag) => {
      if (!isDrag) setHandlingAnimation(true);
      if (updateHash && window.location.hash !== updatedPageTree.focused.path) {
        window.location.hash = updatedPageTree.focused.path;
      }
      setPageTree(updatedPageTree);
    },
    [updateHash],
  );

  const handleAction = useCallback(
    (e, actionType) => {
      if (!isHandlingAnimation) {
        let direction;
        switch (actionType) {
          case 'scroll':
            direction = getScrollDirection(e);
            break;
          case 'key':
            direction = getArrowDirection(e);
            break;
          case 'drag':
            direction = getRelativeTouchDragDirection(e);
            break;
          default:
            return;
        }
        if (!direction) return;
        const onSuccess = (updatedPageTree) =>
          handleTreeUpdate(updatedPageTree, actionType === 'drag');
        navigateAction(pageTree, direction, onSuccess);
      }
    },
    [handleTreeUpdate, isHandlingAnimation, pageTree],
  );

  // const hasCollision = useCallback(
  //   (dragOrientation, direction) => {
  //     return pageHasCollision(pageTree.focused, dragOrientation, direction);
  //   },
  //   [pageTree.focused],
  // );

  const handleNavigateTo = useCallback(
    (path) => {
      if (!isHandlingAnimation && !isHandlingDragAnimation) {
        navigateTo(pageTree, pageTree.pathMap.get(path), handleTreeUpdate);
      }
    },
    [pageTree, handleTreeUpdate, isHandlingAnimation, isHandlingDragAnimation],
  );

  // const navigate = useCallback(
  //   (target) => {
  //     if (isDirection(target)) {
  //       navigateAction(pageTree, target, handleTreeUpdate);
  //     } else {
  //       handleNavigateTo(target);
  //     }
  //   },
  //   [handleNavigateTo, handleTreeUpdate, pageTree],
  // );

  useEffect(() => {
    const handleKeyboardAction = (e) => handleAction(e, 'key');
    window.addEventListener('keydown', handleKeyboardAction);
    return () => {
      window.removeEventListener('keydown', handleKeyboardAction);
    };
  }, [handleAction]);

  useEffect(() => {
    const hashChangeHandler = (e) => {
      handleNavigateTo(getHashValueFromURL(e.newURL));
    };
    window.addEventListener('hashchange', hashChangeHandler);
    return () => {
      window.removeEventListener('hashchange', hashChangeHandler);
    };
  }, [handleNavigateTo]);

  useEffect(() => {
    const path = parseHashValue(window.location.hash);
    if (path) {
      handleNavigateTo(path);
    }
    // Only needs to run on initial mount, no dependencies necessary
    // eslint-disable-next-line
  }, []);

  const onStartDrag = useCallback(
    (orientation) => dispatch(startDragAction(orientation)),
    [],
  );
  const onEndDrag = useCallback(
    (dragEvent) => {
      handleAction(dragEvent, 'drag');
      dispatch(endDragAction());
    },
    [handleAction],
  );

  const onStartDragAnimation = useCallback(
    () => dispatch(startDragAnimationAction()),
    [],
  );
  const onEndDragAnimation = useCallback(
    () => dispatch(endDragAnimationAction()),
    [],
  );

  return (
    <div onWheel={(e) => handleAction(e, 'scroll')}>
      <FullPageContext.Provider
        value={{
          isHandlingAnimation,
          setHandlingAnimation,
          onStartDrag,
          onEndDrag,
          onStartDragAnimation,
          onEndDragAnimation,
          isHandlingDrag,
          isHandlingDragAnimation,
          dragOrientation,
        }}
      >
        {pageTreeDOMComponents}
      </FullPageContext.Provider>
    </div>
  );
};

export const useFullPageContext = () => useContext(FullPageContext);
