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

export const getRelativeTouchScrollDirection = (startCoordinates, endCoordinates, direction, threshold=50) => {
  const scrollDirection = getTouchScrollDirection(startCoordinates, endCoordinates, threshold);
  switch (direction) {
    case 'vertical': return scrollDirection === 'up' || scrollDirection === 'down' ? scrollDirection : null;
    case 'horizontal': return scrollDirection === 'left' || scrollDirection === 'right' ? scrollDirection : null;
    default: return null;
  }
}

export const parseHashValue = hash => hash.substring(1);
