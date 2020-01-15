const flexDirections = {
  vertical: 'column',
  horizontal: 'row',
};

export const getCssTranslationStr = (direction, offset) => {
  const viewportOffset = 100 * -offset;
  if (direction === 'vertical') {
    return `translateY(${viewportOffset}vh)`;
  } else if (direction === 'horizontal') {
    return `translateX(${viewportOffset}vw)`;
  }
};

export const getCssTranslationPxStr = (direction, offset, dragOffset) => {
  return direction === 'horizontal'
    ? `translateX(${window.innerWidth * -offset + dragOffset.x}px)`
    : `translateY(${window.innerHeight * -offset + dragOffset.y}px)`;
};

export const getFlexDirection = direction => {
  return flexDirections[direction];
};
