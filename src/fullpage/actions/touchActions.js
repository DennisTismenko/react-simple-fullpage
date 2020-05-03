export const touchActionTypes = {
  START_TOUCH: 'START_TOUCH',
  MOVE_TOUCH: 'MOVE_TOUCH',
  END_TOUCH: 'END_TOUCH',
  CLEAR_HISTORY: 'CLEAR_HISTORY',
};

export const startTouchAction = (startCoordinates) => {
  return {
    type: touchActionTypes.START_TOUCH,
    startCoordinates,
  };
};
export const moveTouchAction = (touchCoordinates) => {
  return {
    type: touchActionTypes.MOVE_TOUCH,
    touchCoordinates,
  };
};
export const endTouchAction = () => {
  return {
    type: touchActionTypes.END_TOUCH,
  };
};

export const clearTouchHistoryAction = () => {
  return {
    type: touchActionTypes.CLEAR_HISTORY,
  };
};
