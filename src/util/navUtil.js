const keyDirections = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
};

export const getScrollDirection = (e) => {
  if (e.deltaY < 0) {
    return 'up';
  } else if (e.deltaY > 0) {
    return 'down';
  }
  if (e.deltaX < 0) {
    return 'left';
  } else if (e.deltaX > 0) {
    return 'right';
  }
};

const directions = ['up', 'down', 'left', 'right'];

export const isDirection = (str) => directions.includes(str);

export const getNavigableDirections = (
  direction,
  offset,
  lowerBound,
  upperBound,
) => {
  const navigableirections = [];
  if (offset > lowerBound) {
    navigableirections.push(direction === 'horizontal' ? 'left' : 'up');
  }
  if (offset < upperBound) {
    navigableirections.push(direction === 'horizontal' ? 'right' : 'down');
  }

  return navigableirections;
};

export const getArrowDirection = (e) => {
  return keyDirections[e.key];
};

// export const getTouchScrollDirection = (
//   startCoordinates,
//   endCoordinates,
//   threshold = 50,
// ) => {
//   const deltaX = endCoordinates.x - startCoordinates.x;
//   const deltaY = endCoordinates.y - startCoordinates.y;
//   const absDx = Math.abs(deltaX);
//   const absDy = Math.abs(deltaY);
//   if (absDx >= absDy) {
//     if (absDx >= threshold) {
//       return deltaX > 0 ? 'left' : 'right';
//     }
//   } else {
//     if (absDy >= threshold) {
//       return deltaY > 0 ? 'up' : 'down';
//     }
//   }
//   return null;
// };

// export const getFirstTouch = (changedTouches) => {
//   if (changedTouches.length === 1) return changedTouches[0];
//   for (let i = 0; i < changedTouches.length; i++) {
//     if (changedTouches[i].identifier === 0) {
//       return changedTouches[i];
//     }
//   }
// };

export const getTouchDragDirection = (touchCoordinates) => {
  const {x, y} = touchCoordinates;
  const absDx = Math.abs(x);
  const absDy = Math.abs(y);
  if (absDx >= absDy) {
    return x > 0 ? 'left' : 'right';
  } else {
    return y > 0 ? 'up' : 'down';
  }
};

export const getTouchDragOrientation = (touchCoordinates) => {
  const {x, y} = touchCoordinates;
  const absDx = Math.abs(x);
  const absDy = Math.abs(y);
  return absDx >= absDy ? 'horizontal' : 'vertical';
};

export const getRelativeTouchDragDirection = (
  touchEvent,
  withThreshold = true,
) => {
  const {orientation, touchCoordinates} = touchEvent;
  const {x, y} = touchCoordinates;
  const threshold = withThreshold
    ? orientation === 'vertical'
      ? window.innerHeight / 2
      : window.innerWidth / 2
    : 0;
  if (orientation === 'vertical') {
    const absDy = Math.abs(y);
    return absDy > threshold ? (y > 0 ? 'up' : 'down') : null;
  } else if (orientation === 'horizontal') {
    const absDx = Math.abs(x);
    return absDx > threshold ? (x > 0 ? 'left' : 'right') : null;
  } else {
    return null;
  }
};

export const getAllowableOffsetValues = (
  direction,
  navigableDirections,
  deltaOffset,
) => {
  let {x, y} = deltaOffset;
  if (
    direction === 'vertical' &&
    ((!navigableDirections.includes('up') && y > 0) ||
      (!navigableDirections.includes('down') && y < 0))
  ) {
    y = 0;
  } else if (
    direction === 'horizontal' &&
    ((!navigableDirections.includes('left') && x > 0) ||
      (!navigableDirections.includes('right') && x < 0))
  ) {
    x = 0;
  }
  return {x, y};
};

export const parseHashValue = (hash) => {
  if (!hash) return null;
  return hash.substring(1);
};
export const getHashValueFromURL = (URL) => URL.split('#')[1];
