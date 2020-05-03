import { dragActionTypes } from '../actions/dragActions';

const startDrag = ({orientation}) => {
  return {
    isHandlingDrag: true,
    isHandlingDragAnimation: false,
    dragOrientation: orientation,
  };
};

const endDrag = () => {
  return {
    isHandlingDrag: false,
    isHandlingDragAnimation: true,
    dragOrientation: null,
  };
};

const startDragAnimation = (state) => {
  return {...state, isHandlingDragAnimation: true};
};

const endDragAnimation = (state) => {
  return {...state, isHandlingDragAnimation: false};
};

const dragReducer = (state, action) => {
  switch (action.type) {
    case dragActionTypes.START_DRAG:
      return startDrag(action);
    case dragActionTypes.END_DRAG:
      return endDrag();
    case dragActionTypes.START_DRAG_ANIMATION:
      return startDragAnimation(state);
    case dragActionTypes.END_DRAG_ANIMATION:
      return endDragAnimation(state);
    default:
      return state;
  }
};
export default dragReducer;