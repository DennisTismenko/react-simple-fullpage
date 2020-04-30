const keyDirections = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
};

export const getScrollDirection = e => {
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

export const getArrowDirection = e => {
  return keyDirections[e.key];
};

export const getTouchScrollDirection = (
  startCoordinates,
  endCoordinates,
  threshold = 50,
) => {
  const deltaX = endCoordinates.x - startCoordinates.x;
  const deltaY = endCoordinates.y - startCoordinates.y;
  const absDx = Math.abs(deltaX);
  const absDy = Math.abs(deltaY);
  if (absDx >= absDy) {
    if (absDx >= threshold) {
      return deltaX > 0 ? 'left' : 'right';
    }
  } else {
    if (absDy >= threshold) {
      return deltaY > 0 ? 'up' : 'down';
    }
  }
  return null;
};

export const getRelativeTouchScrollDirection = (
  startCoordinates,
  endCoordinates,
  direction,
  threshold = direction === 'vertical'
    ? window.innerHeight / 6
    : window.innerWidth / 6,
) => {
  const scrollDirection = getTouchScrollDirection(
    startCoordinates,
    endCoordinates,
    threshold,
  );
  switch (direction) {
    case 'vertical':
      return scrollDirection === 'up' || scrollDirection === 'down'
        ? scrollDirection
        : null;
    case 'horizontal':
      return scrollDirection === 'left' || scrollDirection === 'right'
        ? scrollDirection
        : null;
    default:
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

export const parseHashValue = hash => hash.substring(1);
export const getHashValueFromURL = (URL) => URL.split('#')[1];
