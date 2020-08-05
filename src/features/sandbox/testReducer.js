import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError,
} from "../../app/async/asyncReducer";
import { delay } from "../../app/common/utils/util";
import { toast } from "react-toastify";

export const INCREMENT_COUNTER = "INCREMENT_COUNTER";
export const DECREMENT_COUNTER = "DECREMENT_COUNTER";

const initialState = {
  data: 43,
};

export const increment = (number) => {
  return async (dispatch) => {
    try {
      dispatch(asyncActionStart());
      await delay(1000);
      dispatch({ type: INCREMENT_COUNTER, payload: number });
      dispatch(asyncActionFinish());
      toast.success("Success Notification !", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      dispatch(asyncActionError(error));
      toast.error(error, {
        position: toast.POSITION.TOP_LEFT,
      });
    }
  };
};

export const decrement = (number) => {
  return async (dispatch) => {
    try {
      dispatch(asyncActionStart());
      await delay(1000);
      throw "oops!!";
      dispatch({ type: DECREMENT_COUNTER, payload: number });
      dispatch(asyncActionFinish());
    } catch (error) {
      dispatch(asyncActionError(error));
      toast.error(error);
    }
  };
};

const testReducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return {
        ...state,
        data: state.data + action.payload,
      };
    case DECREMENT_COUNTER:
      return {
        ...state,
        data: state.data - action.payload,
      };
    default:
      return state;
  }
};

export default testReducer;
