/* global google */
import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Segment, Header, Button, Confirm } from "semantic-ui-react";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { categoryData } from "../../../app/api/categoryOptions";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import MyDateInput from "../../../app/common/form/MyDateInput";
import MyPlaceInput from "../../../app/common/form/MyPlaceInput";

import {
  listenToEventFromFirestore,
  updateEventInFirestoe,
  addEventToFirestore,
  cancelEventToggle,
  deleteEventInFirestore,
} from "../../../app/firestore/firestoreService";
import useFirestoreDoc from "../../../app/hooks/useFirestoreDoc";
import {
  listenToSelectedEvent,
  deleteEvent,
  updateEvent,
  clearSelectedEvent,
} from "../eventActions";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useEffect } from "react";

const EventForm = ({ match, history, location }) => {
  const { selectedEvent } = useSelector((state) => state.event);

  const { loading, error } = useSelector((state) => state.async);

  const dispatch = useDispatch();
  const [loadingCancel, setLoadingCancel] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/createEvent") return;
    dispatch(clearSelectedEvent());
  }, [dispatch, location.pathname]);

  const initialValues = selectedEvent ?? {
    title: "",
    category: "",
    description: "",
    city: { address: "", latLng: null },
    venue: { address: "", latLng: null },
    date: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("You must provide title"),
    category: Yup.string().required("You must provide category"),
    description: Yup.string().required("You must provide description"),
    city: Yup.object().shape({
      address: Yup.string().required("City is required"),
    }),
    venue: Yup.object().shape({
      address: Yup.string().required("venue is required"),
    }),
    date: Yup.string().required(),
  });

  const handleCancelToggle = async (event) => {
    setConfirmOpen(false);
    setLoadingCancel(true);

    try {
      await cancelEventToggle(event);
      setLoadingCancel(false);
      updateCancelToggle(event);
    } catch (error) {
      setLoadingCancel(false);
      toast.error(error.message);
    }
  };

  const handleDelete = (eventId) => {
    deleteEventInFirestore(eventId);
    dispatch(deleteEvent(eventId));
  };

  const updateCancelToggle = (event) => {
    event.isCancelled = !event.isCancelled;
    dispatch(updateEvent(event));
  };

  useFirestoreDoc({
    query: () => listenToEventFromFirestore(match.params.id),
    data: (event) => dispatch(listenToSelectedEvent(event)),
    deps: [match.params.id, dispatch],
    shouldExecute:
      match.params.id !== selectedEvent?.id &&
      location.pathname !== "/createEvent",
  });

  if (loading) return <LoadingComponent />;
  if (error) return <Redirect to="/error" />;

  return (
    <Segment clearing>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            selectedEvent
              ? await updateEventInFirestoe(values)
              : await addEventToFirestore(values);

            selectedEvent
              ? toast.success("Post updated")
              : toast.success("Post created");
          } catch (error) {
            toast.error(error.message);
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, dirty, isValid, values }) => (
          <Form className="ui form">
            <Header sub color="orange" content="Event Details" />
            <MyTextInput name="title" placeholder="Event title" />
            <MySelectInput
              name="category"
              placeholder="Category"
              options={categoryData}
            />
            <MyTextArea name="description" placeholder="Description" rows={4} />

            <Header sub color="orange" content="Event Location Details" />
            <MyPlaceInput name="city" placeholder="City" autoComplete="off" />
            <MyPlaceInput
              name="venue"
              placeholder="Venue"
              disabled={!values.city.latLng}
              autoComplete="off"
              options={{
                location: new google.maps.LatLng(values.city.latLng),
                radius: 1000,
                type: ["establishment"],
              }}
            />
            <MyDateInput
              name="date"
              placeholderText="Event Date"
              type="date"
              timeFormat="HH:mm"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm a"
              autoComplete="off"
            />
            {selectedEvent && (
              <Button
                loading={loadingCancel}
                type="button"
                floated="left"
                color={selectedEvent.isCancelled ? "green" : "red"}
                content={
                  selectedEvent.isCancelled
                    ? "Re-Activate Event"
                    : "Cancel Event"
                }
                onClick={() => setConfirmOpen(true)}
              />
            )}
            <Button
              type="submit"
              floated="right"
              positive
              content="Submit"
              loading={isSubmitting}
              disabled={!isValid || !dirty || isSubmitting}
            />
            <Button
              type="submit"
              floated="right"
              content="Cancel"
              as={Link}
              disabled={isSubmitting}
              to="/events"
            />
          </Form>
        )}
      </Formik>
      {selectedEvent && (
        <>
          <Confirm
            content={
              selectedEvent.isCancelled
                ? "This will re-activate the event. Are you sure?"
                : "This will cancel the event. Are you sure?"
            }
            open={confirmOpen}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={() => handleCancelToggle(selectedEvent)}
          />
          <Button
            onClick={() => handleDelete(selectedEvent.id)}
            color="red"
            floated="right"
            content="Delete"
          />
        </>
      )}
    </Segment>
  );
};

export default EventForm;
