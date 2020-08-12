import {
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  FETCH_EVENT,
  LISTEN_TO_EVENT_CHAT,
} from "./eventConstants";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError,
} from "../../app/async/asyncReducer";
import { fetchSampleData } from "../../app/api/mockApi";

export const loadEvents = async (dispatch) => {
  dispatch(asyncActionStart());
  try {
    const events = await fetchSampleData();
    dispatch({ type: FETCH_EVENT, payload: events });
    dispatch(asyncActionFinish());
  } catch (err) {
    dispatch(asyncActionError(err));
  }
};

export const listenToEvents = (events) => {
  return {
    type: FETCH_EVENT,
    payload: events,
  };
};

export const createEvent = (event) => {
  return {
    type: CREATE_EVENT,
    payload: event,
  };
};

export const updateEvent = (event) => {
  return {
    type: UPDATE_EVENT,
    payload: event,
  };
};

export const deleteEvent = (eventId) => {
  return {
    type: DELETE_EVENT,
    payload: eventId,
  };
};

export const listenToEventChat = (comment) => {
  return {
    type: LISTEN_TO_EVENT_CHAT,
    payload: comment,
  };
};
