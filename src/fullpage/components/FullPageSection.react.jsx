import React, {
  Children,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import classes from './FullPageSection.module.css';
import {getScrollDirection} from '../../util/navUtil';
import {incrementIfLte, decrementIfGte} from '../../util/mathUtil';
import {getCssTranslationStr, getFlexDirection} from '../../util/cssUtil';
import {useFullPageContext} from '../context/FullPage.react';
import Page from './Page.react';

const FullPageSection = ({
  direction,
  children,
  _navigate = null,
  _setPathInParent = null,
}) => {
  const {
    isHandlingAnimation,
    setHandlingAnimation,
    navigateTo,
  } = useFullPageContext();
  const [offset, setOffset] = useState(0);
  const [childPaths, setChildPaths] = useState([]);

  useEffect(() => {
    if (_setPathInParent) {
      const path =
        children[offset].type === Page
          ? children[offset].props.path
          : childPaths[offset];
      _setPathInParent(path);
    }
  }, [_setPathInParent, offset, children, childPaths]);

  const panelStyles = useMemo(() => {
    const styles = {
      flexDirection: getFlexDirection(direction),
      transform: getCssTranslationStr(direction, offset),
    };
    if (direction === 'vertical') {
      styles.height = `${100 * Children.count(children)}vh`;
    } else if (direction === 'horizontal') {
      styles.width = `${100 * Children.count(children)}vw`;
    }
    return styles;
  }, [direction, children, offset]);

  const willAnimateValue = useCallback(
    scrollDirection => {
      switch (direction) {
        case 'vertical':
          if (scrollDirection === 'up' || scrollDirection === 'down') {
            const newValue =
              scrollDirection === 'up'
                ? decrementIfGte(offset, 0)
                : incrementIfLte(offset, Children.count(children) - 1);
            return [newValue !== offset, newValue !== offset ? newValue : null];
          }
          break;
        case 'horizontal':
          if (scrollDirection === 'left' || scrollDirection === 'right') {
            if (scrollDirection === 'left' || scrollDirection === 'right') {
              const newValue =
                scrollDirection === 'left'
                  ? decrementIfGte(offset, 0)
                  : incrementIfLte(offset, Children.count(children) - 1);
              return [
                newValue !== offset,
                newValue !== offset ? newValue : null,
              ];
            }
          }
          break;
        default:
          return [false, null];
      }
      return [false, null];
    },
    [direction, children, offset],
  );

  const childrenWithProps = useMemo(() => {
    return Children.map(children, (child, index) => {
      const childProps = {
        _navigate: () => {
          if (_navigate) {
            _navigate();
          }
          setOffset(index);
        },
        _focused: index === offset,
      };
      if (child.type === FullPageSection) {
        childProps._setPathInParent = path => {
          setChildPaths(prevPaths => {
            const childPaths = [...prevPaths];
            childPaths[index] = path;
            return childPaths;
          });
        };
      }
      return React.cloneElement(child, childProps);
    });
  }, [children, _navigate, offset]);

  const getPathFromOffset = useCallback(
    offsetVal => {
      return children[offsetVal].type === Page
        ? children[offsetVal].props.path
        : childPaths[offsetVal];
    },
    [childPaths, children],
  );

  const updateParentPath = useCallback(
    path => {
      if (_setPathInParent) _setPathInParent(path);
    },
    [_setPathInParent],
  );

  const updateParentAndRoute = useCallback(
    path => {
      updateParentPath(path);
      navigateTo(path);
    },
    [updateParentPath, navigateTo],
  );

  const handleScrollAction = useCallback(
    (scrollDirection, event) => {
      if (!isHandlingAnimation) {
        const [willAnimate, newOffset] = willAnimateValue(scrollDirection);
        if (willAnimate) {
          event.stopPropagation();
          setHandlingAnimation(true);
          updateParentAndRoute(getPathFromOffset(newOffset));
        }
      }
    },
    [
      isHandlingAnimation,
      setHandlingAnimation,
      willAnimateValue,
      getPathFromOffset,
      updateParentAndRoute,
    ],
  );

  // TODO: this implementation of KeyListener will NOT work for complex nested FullPageSections, and thus should be deleted
  // useEffect(() => {
  //   const keyListener = e => {
  //     const arrowDirection = getArrowDirection(e);
  //     if (arrowDirection) {
  //       handleScrollAction(arrowDirection, e);
  //     }
  //   };
  //   window.addEventListener('keydown', keyListener);
  //   return () => window.removeEventListener('keydown', keyListener);
  // }, [handleScrollAction]);

  return (
    <div className={classes.FullPageContainer}>
      <div
        className={classes.FullPageSection}
        style={panelStyles}
        onWheel={e => {
          handleScrollAction(getScrollDirection(e), e);
        }}
        onTransitionEnd={() => {
          setHandlingAnimation(false);
        }}
      >
        {childrenWithProps}
      </div>
    </div>
  );
};

export default FullPageSection;
