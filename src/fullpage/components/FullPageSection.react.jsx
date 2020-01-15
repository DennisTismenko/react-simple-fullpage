import React, {
  Children,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import classes from './FullPageSection.module.css';
import {getScrollDirection, getRelativeTouchScrollDirection} from '../../util/navUtil';
import {incrementIfLte, decrementIfGte} from '../../util/mathUtil';
import {
  getCssTranslationStr,
  getFlexDirection,
  getCssTranslationPxStr,
} from '../../util/cssUtil';
import {useFullPageContext} from '../context/FullPage.react';
import Page from './Page.react';

const initialCoordinates = {x: 0, y: 0};

const isDragging = dragOffset => {
  return dragOffset.x !== 0 || dragOffset.y !== 0;
};

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
  const [startCoordinates, setStartCoordinates] = useState(initialCoordinates);
  const [dragOffset, setDragOffset] = useState(initialCoordinates);

  const getPathFromOffset = useCallback(
    offsetVal => {
      return children[offsetVal].type === Page
        ? children[offsetVal].props.path
        : childPaths[offsetVal];
    },
    [childPaths, children],
  );

  useEffect(() => {
    if (_setPathInParent) {
      _setPathInParent(getPathFromOffset(offset));
    }
  }, [_setPathInParent, offset, getPathFromOffset]);

  const memoizedPanelStyles = useMemo(() => {
    const styles = {
      flexDirection: getFlexDirection(direction),
    };
    if (direction === 'vertical') {
      styles.height = `${100 * Children.count(children)}vh`;
    } else if (direction === 'horizontal') {
      styles.width = `${100 * Children.count(children)}vw`;
    }
    return styles;
  }, [direction, children]);

  const panelStyles = {
    ...memoizedPanelStyles,
    transform: !isDragging(dragOffset)
      ? getCssTranslationStr(direction, offset)
      : getCssTranslationPxStr(direction, offset, dragOffset),
  };

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
      };
      if (child.type === FullPageSection) {
        childProps._setPathInParent = path => {
          setChildPaths(prevPaths => {
            if (prevPaths[index] === path) {
              return prevPaths;
            }
            const childPaths = [...prevPaths];
            childPaths[index] = path;
            return childPaths;
          });
        };
      }
      return React.cloneElement(child, childProps);
    });
  }, [children, _navigate]);

  const handleScrollAction = useCallback(
    (scrollDirection, event) => {
      if (!isHandlingAnimation) {
        const [willAnimate, newOffset] = willAnimateValue(scrollDirection);
        if (willAnimate) {
          event.stopPropagation();
          setHandlingAnimation(true);
          navigateTo(getPathFromOffset(newOffset));
        }
      }
    },
    [
      isHandlingAnimation,
      setHandlingAnimation,
      willAnimateValue,
      getPathFromOffset,
      navigateTo,
    ],
  );
  return (
    <div className={classes.FullPageContainer}>
      <div
        className={[classes.FullPageSection, isHandlingAnimation && classes.Transition].join(' ')}
        style={panelStyles}
        onWheel={e => {
          handleScrollAction(getScrollDirection(e), e);
        }}
        onTransitionEnd={() => {
          setHandlingAnimation(false);
        }}
        onTouchStart={e => {
          const {screenX, screenY} = e.changedTouches[0];
          console.log(screenX, screenY);
          setStartCoordinates({x: screenX, y: screenY});
        }}
        onTouchMove={e => {
          e.stopPropagation();
          const {screenX, screenY} = e.changedTouches[0];
          setDragOffset({
            x: screenX - startCoordinates.x,
            y: screenY - startCoordinates.y,
          });
        }}
        onTouchEnd={e => {
          const {screenX, screenY} = e.changedTouches[0];
          const endCoordinates = {x: screenX, y: screenY};
          console.log(screenX, screenY);
          const scrollDirection = getRelativeTouchScrollDirection(
            startCoordinates,
            endCoordinates,
            direction
          );
          console.log(scrollDirection);
          if (scrollDirection) {
            setDragOffset(initialCoordinates);
            handleScrollAction(scrollDirection, e);
          } else {
            setDragOffset(initialCoordinates);
          }
        }}
      >
        {childrenWithProps}
      </div>
    </div>
  );
};

export default FullPageSection;
