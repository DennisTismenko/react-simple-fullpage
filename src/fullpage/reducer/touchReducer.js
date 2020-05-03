import {touchActionTypes} from '../actions/touchActions';

const startTouch = ({startCoordinates}) => {
  return {
    startCoordinates,
    touchCoordinates: null,
  };
};
const moveTouch = (state, {touchCoordinates}) => {
  return {
    ...state,
    touchCoordinates,
  };
};
const endTouch = () => {
  return {
    startCoordinates: null,
    touchCoordinates: null,
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
