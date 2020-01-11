import React, {
  Children,
  useReducer,
  useCallback,
  useMemo,
  // useEffect,
} from 'react';
import classes from './FullPageSection.module.css';
import {getScrollDirection} from '../../util/navUtil';
import {incrementIfLte, decrementIfGte} from '../../util/mathUtil';
import {getCssTranslationStr, getFlexDirection} from '../../util/cssUtil';
import {useFullPageContext} from '../context/FullPage.react';

const reducer = (offset, action) => {
  if (action.type === 'scroll') {
    return action.scrollDirection === 'up' || action.scrollDirection === 'left'
      ? offset - 1
      : offset + 1;
  } else if (action.type === 'navigate') {
    return action.offset;
  }
};

const FullPageSection = ({direction, children, _navigate = null}) => {
  const {isHandlingAnimation, setHandlingAnimation} = useFullPageContext();

  const [offset, dispatch] = useReducer(reducer, 0);

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

  const willAnimate = useCallback(
    scrollDirection => {
      switch (direction) {
        case 'vertical':
          return (
            (scrollDirection === 'up' &&
              decrementIfGte(offset, 0) !== offset) ||
            (scrollDirection === 'down' &&
              incrementIfLte(offset, Children.count(children) - 1) !== offset)
          );
        case 'horizontal':
          return (
            (scrollDirection === 'left' &&
              decrementIfGte(offset, 0) !== offset) ||
            (scrollDirection === 'right' &&
              incrementIfLte(offset, Children.count(children) - 1) !== offset)
          );
        default:
          return false;
      }
    },
    [direction, children, offset],
  );

  const handleScrollAction = useCallback(
    (scrollDirection, event) => {
      if (!isHandlingAnimation && willAnimate(scrollDirection)) {
        event.stopPropagation();
        setHandlingAnimation(true);
        dispatch({type: 'scroll', scrollDirection});
      }
    },
    [isHandlingAnimation, setHandlingAnimation, willAnimate],
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

  const childrenWithNavigation = useMemo(() => {
    return Children.map(children, (child, index) => {
      return React.cloneElement(child, {
        _navigate: () => {
          if (_navigate) {
            _navigate();
          }
          dispatch({type: 'navigate', offset: index});
        },
      });
    })
  }, [children, _navigate]);

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
        {childrenWithNavigation}
      </div>
    </div>
  );
};

export default FullPageSection;
