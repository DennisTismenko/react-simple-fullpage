const keyDirections = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down"
}

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
}
