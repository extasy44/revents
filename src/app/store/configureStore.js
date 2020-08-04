import { createStore } from "redux";
import testReducer from "../../features/sandbox/testReducer";

export const configureStore = () => {
  return createStore(testReducer);
};
