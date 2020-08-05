export const INCREMENT_COUNTER = "INCREMENT_COUNTER";
export const DECREMENT_COUNTER = "DECREMENT_COUNTER";

const initialState = {
  data: 43,
};

export const increment = (number) => {
  return {
    type: INCREMENT_COUNTER,
    payload: number,
  };
};

export const decrement = (number) => {
  return {
    type: DECREMENT_COUNTER,
    payload: number,
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
