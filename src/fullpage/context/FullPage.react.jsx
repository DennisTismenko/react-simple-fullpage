import React, {
  useState,
  useContext,
  // useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  constructFromDOM,
  createDOMComponents,
  downAction,
  upAction,
} from '../types/FullPageTree';
import {getScrollDirection} from '../../util/navUtil';

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
  //   console.debug(pageTree);
  //   console.debug(pageTreeDOMComponents);
  // }, [pageTree, pageTreeDOMComponents]);

  // const willAnimateValue = useCallback(
  //   scrollDirection => {
  //     switch (direction) {
  //       case 'vertical':
  //         if (scrollDirection === 'up' || scrollDirection === 'down') {
  //           const newValue =
  //             scrollDirection === 'up'
  //               ? decrementIfGte(offset, 0)
  //               : incrementIfLte(offset, Children.count(children) - 1);
  //           return [newValue !== offset, newValue !== offset ? newValue : null];
  //         }
  //         break;
  //       case 'horizontal':
  //         if (scrollDirection === 'left' || scrollDirection === 'right') {
  //           if (scrollDirection === 'left' || scrollDirection === 'right') {
  //             const newValue =
  //               scrollDirection === 'left'
  //                 ? decrementIfGte(offset, 0)
  //                 : incrementIfLte(offset, Children.count(children) - 1);
  //             return [
  //               newValue !== offset,
  //               newValue !== offset ? newValue : null,
  //             ];
  //           }
  //         }
  //         break;
  //       default:
  //         return [false, null];
  //     }
  //     return [false, null];
  //   },
  //   [direction, children, offset],
  // );

  // const handleScrollAction = useCallback(
  //   (scrollDirection, event) => {
  //     if (!isHandlingAnimation) {
  //       const [willAnimate, newOffset] = willAnimateValue(scrollDirection);
  //       if (willAnimate) {
  //         event.stopPropagation();
  //         setHandlingAnimation(true);
  //         // navigateTo(getPathFromOffset(newOffset));
  //       }
  //     }
  //   },
  //   [
  //     isHandlingAnimation,
  //     setHandlingAnimation,
  //     willAnimateValue,
  //     // getPathFromOffset,
  //   ],
  // );

  const handleTreeUpdate = useCallback((updatedPageTree) => {
    setHandlingAnimation(true);
    setPageTree(updatedPageTree);
  }, []);

  const handleScrollAction = (e) => {
    if (!isHandlingAnimation) {
      const scrollDirection = getScrollDirection(e);
      switch (scrollDirection) {
        case 'down':
          return downAction(pageTree, handleTreeUpdate);
        case 'up':
          return upAction(pageTree, handleTreeUpdate);
        case 'right':
          console.log('right');
          break;
        case 'left':
          console.log('left');
          break;
        default:
          return;
      }
    }
  };

  return (
    <div onWheel={handleScrollAction}>
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
