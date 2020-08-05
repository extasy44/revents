import { combineReducers } from "redux";
import testReducer from "../../features/sandbox/testReducer";
import eventReducer from "../../features/events/eventReducer";
import modalReducer from "../common/modals/modalReducer";
import authReducer from "../../features/auth/authReducer";

const rootReducer = combineReducers({
  test: testReducer,
  event: eventReducer,
  modal: modalReducer,
  auth: authReducer,
});

export default rootReducer;
