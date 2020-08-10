import { combineReducers } from "redux";
import testReducer from "../../features/sandbox/testReducer";
import eventReducer from "../../features/events/eventReducer";
import modalReducer from "../common/modals/modalReducer";
import authReducer from "../../features/auth/authReducer";
import asyncReducer from "../async/asyncReducer";
import profileReducer from "../../features/profiles/profilePage/profileReducer";

const rootReducer = combineReducers({
  test: testReducer,
  event: eventReducer,
  modal: modalReducer,
  auth: authReducer,
  async: asyncReducer,
  profile: profileReducer,
});

export default rootReducer;
