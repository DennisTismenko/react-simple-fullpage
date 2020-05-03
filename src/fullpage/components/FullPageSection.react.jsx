import React, {Children, useMemo, useReducer} from 'react';
import classes from './FullPageSection.module.css';
import {
  getFlexDirection,
  getCssTranslationPxStr,
  getCssTranslationStr,
} from '../../util/cssUtil';
import {useFullPageContext} from '../context/FullPage.react';
import {
  getTouchDragOrientation,
} from '../../util/navUtil';
import touchReducer from '../reducer/touchReducer';
import {
  startTouchAction,
  moveTouchAction,
  endTouchAction,
} from '../actions/touchActions';

const initialTouchState = {
  startCoordinates: null,
  touchCoordinates: null,
};

const FullPageSection = ({orientation, loop, children, offset}) => {
  const {
    isHandlingAnimation,
    setHandlingAnimation,
    isHandlingDrag,
    isHandlingDragAnimation,
    onStartDrag,
    onEndDrag,
    onEndDragAnimation,
  } = useFullPageContext();
  const [{startCoordinates, touchCoordinates}, dispatch] = useReducer(
    touchReducer,
    initialTouchState,
  );

  // const canNavigateToDirection = useCallback(
  //   (direction, targetOrientation, currentOffset) => {
  //     if (targetOrientation !== orientation) return false;
  //     const childCount = Children.count(children);
  //     if (orientation === 'vertical') {
  //       if (direction === 'down') {
  //         return currentOffset + 1 < childCount;
  //       } else if (direction === 'up') {
  //         return currentOffset - 1 >= 0;
  //       }
  //     } else if (orientation === 'horizontal') {
  //       if (direction === 'right') {
  //         return currentOffset + 1 < childCount;
  //       } else if (direction === 'left') {
  //         return currentOffset - 1 >= 0;
  //       }
  //     }
  //     return false;
  //   },
  //   [children, orientation],
  // );

  const memoizedPanelStyles = useMemo(() => {
    const styles = {
      flexDirection: getFlexDirection(orientation),
    };
    if (orientation === 'vertical') {
      styles.height = `${100 * Children.count(children)}vh`;
    } else if (orientation === 'horizontal') {
      styles.width = `${100 * Children.count(children)}vw`;
    }
    return styles;
  }, [orientation, children]);

  const panelStyles = {
    ...memoizedPanelStyles,
    transform: touchCoordinates
      ? getCssTranslationPxStr(orientation, offset, touchCoordinates)
      : getCssTranslationStr(orientation, offset),
  };

  return (
    <div className={classes.FullPageContainer}>
      <div
        className={[
          classes.FullPageSection,
          isHandlingAnimation ? classes['transition'] : null,
          isHandlingDragAnimation ? classes['drag-transition'] : null,
        ].join(' ')}
        style={panelStyles}
        onTransitionEnd={() => {
          isHandlingAnimation
            ? setHandlingAnimation(false)
            : onEndDragAnimation();
        }}
        onTouchStart={(e) => {
          if (
            !isHandlingDrag &&
            !isHandlingDragAnimation &&
            !startCoordinates
          ) {
            const {screenX, screenY} = e.changedTouches[0];
            dispatch(startTouchAction({x: screenX, y: screenY}));
          }
        }}
        onTouchMove={(e) => {
          if (e.touches[0].identifier === 0) {
            const {screenX, screenY} = e.touches[0];
            if (
              !isHandlingDrag &&
              !isHandlingDragAnimation &&
              startCoordinates
            ) {
              const targetCoordinates = {
                x: screenX - startCoordinates.x,
                y: screenY - startCoordinates.y,
              };
              const targetOrientation = getTouchDragOrientation(
                targetCoordinates,
              );
              if (targetOrientation === orientation) {
                e.stopPropagation();
                onStartDrag(targetOrientation);
                dispatch(moveTouchAction(targetCoordinates));
              }
            } else {
              if (touchCoordinates) {
                e.stopPropagation();
                dispatch(
                  moveTouchAction({
                    x: screenX - startCoordinates.x,
                    y: screenY - startCoordinates.y,
                  }),
                );
              }
            }
          }
        }}
        onTouchEnd={(e) => {
          if (
            e.changedTouches.length === 0 || // Firefox RDM returns empty TouchList
            e.changedTouches[0].identifier === 0
          ) {
            if (touchCoordinates) {
              onEndDrag({orientation, touchCoordinates});
            }
            dispatch(endTouchAction());
          }
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default FullPageSection;
