import {touchActionTypes} from '../actions/touchActions';
import update from 'immutability-helper';

const TOUCH_HISTORY_SIZE = 5;

const startTouch = ({startCoordinates}) => {
  return {
    startCoordinates,
    touchCoordinates: null,
    touchHistory: [],
  };
};

const moveTouch = (state, {touchCoordinates}) => {
  return {
    ...state,
    touchCoordinates,
    touchHistory:
      state.touchHistory.length >= TOUCH_HISTORY_SIZE
        ? update(state.touchHistory, {
            $splice: [
              [0, 1],
              [1, 0, touchCoordinates],
            ],
          })
        : update(state.touchHistory, {$push: [touchCoordinates]}),
  };
};
const endTouch = () => {
  return {
    startCoordinates: null,
    touchCoordinates: null,
    touchHistory: [],
  };
};

const touchReducer = (state, action) => {
  switch (action.type) {
    case touchActionTypes.START_TOUCH:
      return startTouch(action);
    case touchActionTypes.MOVE_TOUCH:
      return moveTouch(state, action);
    case touchActionTypes.END_TOUCH:
      return endTouch();
    default:
      return state;
  }
};

export default touchReducer;
