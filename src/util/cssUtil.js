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

export const getFlexDirection = direction => {
  return flexDirections[direction];
};
