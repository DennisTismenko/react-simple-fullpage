import React, {
  Children,
  useCallback,
  useMemo,
  useState,
  useReducer,
} from 'react';
import classes from './FullPageSection.module.css';
import {
  getRelativeTouchScrollDirection,
  getTouchScrollDirection,
  getNavigableDirections,
  getAllowableOffsetValues,
} from '../../util/navUtil';
import {
  getCssTranslationStr,
  getFlexDirection,
  getCssTranslationPxStr,
} from '../../util/cssUtil';
import {useFullPageContext} from '../context/FullPage.react';

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
  offset,
}) => {
  const {
    isHandlingAnimation,
    setHandlingAnimation,
    isHandlingDrag,
    setHandlingDrag,
  } = useFullPageContext();
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

  const setDragOffset = useCallback(
    offset => {
      dispatch({
        ...getAllowableOffsetValues(direction, navigableDirections, offset),
        type: 'setOffset',
      });
    },
    [direction, navigableDirections],
  );

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


  return (
    <div className={classes.FullPageContainer}>
      <div
        className={[
          classes.FullPageSection,
          isHandlingAnimation && classes.Transition,
        ].join(' ')}
        style={panelStyles}
        onTransitionEnd={() => {
          setHandlingAnimation(false);
        }}
        onTouchStart={e => {
          if (!isHandlingDrag && !isHandlingAnimation) {
            const {screenX, screenY} = e.changedTouches[0];
            setStartCoordinates({x: screenX, y: screenY});
          }
        }}
        onTouchMove={e => {
          const {screenX, screenY} = e.changedTouches[0];
          if (!isHandlingDrag && !isHandlingAnimation) {
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
            // handleScrollAction(scrollDirection, e);
          }
          setHandlingDrag(false);
        }}
      >
        {/* {childrenWithProps} */}
        {children}
      </div>
    </div>
  );
};

export default FullPageSection;
