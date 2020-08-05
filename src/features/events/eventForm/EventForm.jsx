/* global google */
import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Segment, Header, Button } from "semantic-ui-react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { updateEvent, createEvent } from "../../events/eventActions";
import { categoryData } from "../../../app/api/categoryOptions";
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import MyDateInput from "../../../app/common/form/MyDateInput";
import MyPlaceInput from "../../../app/common/form/MyPlaceInput";

const EventForm = ({ match }) => {
  const selectedEvent = useSelector((state) =>
    state.event.events.find((e) => e.id === match.params.id)
  );

  const dispatch = useDispatch();

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

  const handleSubmit = (values) => {
    if (values.length > 1000) {
      dispatch(updateEvent(values));
      dispatch(createEvent(values));
    }
    console.log(values);
  };

  return (
    <Segment clearing>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
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
            />

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
    </Segment>
  );
};

export default EventForm;
