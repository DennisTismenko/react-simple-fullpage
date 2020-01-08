import React, {
  Children,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import classes from './FullPageSection.module.css';
import {getScrollDirection, getArrowDirection} from '../../util/navUtil';
import {incrementIfLte, decrementIfGte} from '../../util/mathUtil';
import {getCssTranslationStr, getFlexDirection} from '../../util/cssUtil';
import {useFullPageContext} from '../context/FullPage.react';

const FullPageSection = ({direction, children}) => {
  const {isHandlingAnimation, setHandlingAnimation} = useFullPageContext();
  const reducer = useCallback(
    (offset, scrollDirection) => {
      let newOffset = null;
      if (direction === 'vertical') {
        if (scrollDirection === 'down') {
          newOffset = incrementIfLte(offset, Children.count(children) - 1);
        } else if (scrollDirection === 'up') {
          newOffset = decrementIfGte(offset, 0);
        }
      } else if (direction === 'horizontal') {
        if (scrollDirection === 'right') {
          newOffset = incrementIfLte(offset, Children.count(children) - 1);
        } else if (scrollDirection === 'left') {
          newOffset = decrementIfGte(offset, 0);
        }
      }
      if (newOffset !== null && newOffset !== offset) {
        setHandlingAnimation(true);
        return newOffset;
      }
      return offset;
    },
    [direction, children, setHandlingAnimation],
  );

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

  const handleScrollAction = useCallback(
    scrollDirection => {
      if (!isHandlingAnimation) {
        dispatch(scrollDirection);
      }
    },
    [isHandlingAnimation],
  );

  // TODO: this implementation of KeyListener will NOT work for complex nested FullPageSections, and thus should be deleted
  useEffect(() => {
    const keyListener = e => {
      const arrowDirection = getArrowDirection(e);
      if (arrowDirection) {
        handleScrollAction(arrowDirection);
      }
    };
    window.addEventListener('keydown', keyListener);
    return () => window.removeEventListener('keydown', keyListener);
  }, [handleScrollAction]);

  return (
    <div className={classes.FullPageContainer}>
      <div
        className={classes.FullPageSection}
        style={panelStyles}
        onWheel={e => {
          handleScrollAction(getScrollDirection(e));
        }}
        onTransitionEnd={() => {
          setHandlingAnimation(false);
        }}
      >
        {Children.map(children, child => {
          return <div className={classes.Page}>{child}</div>;
        })}
      </div>
    </div>
  );
};

export default FullPageSection;
