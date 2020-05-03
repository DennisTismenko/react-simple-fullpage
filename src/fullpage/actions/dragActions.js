export const dragActionTypes = {
  START_DRAG: 'START_DRAG',
  END_DRAG: 'END_DRAG',
  START_DRAG_ANIMATION: 'START_DRAG_ANIMATION',
  END_DRAG_ANIMATION: 'END_DRAG_ANIMATION',
};

export const startDragAction = (orientation) => {
  return {
    type: dragActionTypes.START_DRAG,
    orientation,
  };
};

export const endDragAction = () => {
  return {type: dragActionTypes.END_DRAG};
};

export const startDragAnimationAction = () => {
  return {type: dragActionTypes.START_DRAG_ANIMATION};
};

export const endDragAnimationAction = () => {
  return {type: dragActionTypes.END_DRAG_ANIMATION};
};
