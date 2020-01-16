import React, {
  Children,
  useCallback,
  useMemo,
  useState,
  useEffect,
  useReducer,
} from 'react';
import classes from './FullPageSection.module.css';
import {
  getScrollDirection,
  getRelativeTouchScrollDirection,
  getTouchScrollDirection,
  getNavigableDirections,
  getAllowableOffsetValues,
} from '../../util/navUtil';
import {incrementIfLte, decrementIfGte} from '../../util/mathUtil';
import {
  getCssTranslationStr,
  getFlexDirection,
  getCssTranslationPxStr,
} from '../../util/cssUtil';
import {useFullPageContext} from '../context/FullPage.react';
import Page from './Page.react';

const initialCoordinates = {x: 0, y: 0};
const initialDragState = {direction: null, offset: initialCoordinates};

// const isDragging = dragOffset => {
//   return dragOffset.x !== 0 || dragOffset.y !== 0;
// };

const reducer = (state, action) => {
  switch (action.type) {
    case 'setOffset':
      const {x, y} = action;
      return {...state, offset: {x, y}};
    case 'setDirection':
      return {...state, direction: action.direction};
    case 'reset':
      return initialDragState;
    default:
      return state;
  }
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
    isHandlingDrag,
    setHandlingDrag,
    navigateTo,
  } = useFullPageContext();
  const [offset, setOffset] = useState(0);
  const [childPaths, setChildPaths] = useState([]);
  const [startCoordinates, setStartCoordinates] = useState(initialCoordinates);
  const [dragState, dispatch] = useReducer(reducer, initialDragState);

  const navigableDirections = useMemo(
    () =>
      getNavigableDirections(
        direction,
        offset,
        0,
        Children.count(children) - 1,
      ),
    [children, direction, offset],
  );
  const getPathFromOffset = useCallback(
    offsetVal => {
      return children[offsetVal].type === Page
        ? children[offsetVal].props.path
        : childPaths[offsetVal];
    },
    [childPaths, children],
  );

  const setDragOffset = useCallback(
    offset => {
      dispatch({
        ...getAllowableOffsetValues(direction, navigableDirections, offset),
        type: 'setOffset',
      });
    },
    [direction, navigableDirections],
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
    transform: !isHandlingDrag
      ? getCssTranslationStr(direction, offset)
      : getCssTranslationPxStr(direction, offset, dragState.offset),
  };

  // console.log(panelStyles.transform);

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
        className={[
          classes.FullPageSection,
          isHandlingAnimation && classes.Transition,
        ].join(' ')}
        style={panelStyles}
        onWheel={e => {
          handleScrollAction(getScrollDirection(e), e);
        }}
        onTransitionEnd={() => {
          setHandlingAnimation(false);
        }}
        onTouchStart={e => {
          if (!isHandlingDrag) {
            const {screenX, screenY} = e.changedTouches[0];
            setStartCoordinates({x: screenX, y: screenY});
          }
        }}
        onTouchMove={e => {
          const {screenX, screenY} = e.changedTouches[0];
          if (!isHandlingDrag) {
            const direction = getTouchScrollDirection(
              startCoordinates,
              {
                x: screenX,
                y: screenY,
              },
              0,
            );
            if (navigableDirections.includes(direction)) {
              e.stopPropagation();
              setHandlingDrag(true);
              dispatch({type: 'setDirection', direction});
              setDragOffset({
                x: screenX - startCoordinates.x,
                y: screenY - startCoordinates.y,
              });
            }
          } else {
            if (dragState.direction) {
              setDragOffset({
                x: screenX - startCoordinates.x,
                y: screenY - startCoordinates.y,
              });
            }
          }
        }}
        onTouchEnd={e => {
          const {screenX, screenY} = e.changedTouches[0];
          const endCoordinates = {x: screenX, y: screenY};
          const scrollDirection = getRelativeTouchScrollDirection(
            startCoordinates,
            endCoordinates,
            direction,
          );
          dispatch({type: 'reset'});
          if (scrollDirection) {
            handleScrollAction(scrollDirection, e);
          }
          setHandlingDrag(false);
        }}
      >
        {childrenWithProps}
      </div>
    </div>
  );
};

export default FullPageSection;
