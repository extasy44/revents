import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Segment, Header, Form, Button } from "semantic-ui-react";
import cuid from "cuid";

const EventForm = ({
  setFormOpen,
  createEvent,
  selectedEvent,
  updateEvent,
}) => {
  const initialValues = selectedEvent ?? {
    title: "",
    category: "",
    description: "",
    city: "",
    venue: "",
    date: "",
  };

  const [values, setValues] = useState(initialValues);

  const handleFormSubmit = () => {
    selectedEvent
      ? updateEvent({ ...selectedEvent, ...values })
      : createEvent({
          ...values,
          id: cuid(),
          hostedBy: "Jun",
          attendees: [],
          hostedPhotoURL: "./assets/user.png",
        });

    setFormOpen(false);
  };

  const hadnleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(selectedEvent);
    setValues({ ...values, [name]: value });
  };

  return (
    <Segment clearing>
      <Header content={selectedEvent ? "Edit the event" : "Create new event"} />
      <Form onSubmit={handleFormSubmit}>
        <Form.Field>
          <input
            type="text"
            name="title"
            placeholder="Event title"
            onChange={(e) => hadnleInputChange(e)}
            value={values.title}
          />
        </Form.Field>
        <Form.Field>
          <input
            onChange={(e) => hadnleInputChange(e)}
            type="text"
            name="category"
            placeholder="Category"
            value={values.category}
          />
        </Form.Field>
        <Form.Field>
          <input
            onChange={(e) => hadnleInputChange(e)}
            type="text"
            name="description"
            placeholder="Description"
            value={values.description}
          />
        </Form.Field>
        <Form.Field>
          <input
            onChange={(e) => hadnleInputChange(e)}
            type="text"
            name="city"
            placeholder="City"
            value={values.city}
          />
        </Form.Field>
        <Form.Field>
          <input
            onChange={(e) => hadnleInputChange(e)}
            type="text"
            name="venue"
            placeholder="Venue"
            value={values.venue}
          />
        </Form.Field>
        <Form.Field>
          <input
            onChange={(e) => hadnleInputChange(e)}
            type="date"
            name="date"
            placeholder="Date"
            value={values.date}
          />
        </Form.Field>
        <Button type="submit" floated="right" positive content="Submit" />
        <Button
          type="submit"
          floated="right"
          content="Cancel"
          as={Link}
          to="/events"
        />
      </Form>
    </Segment>
  );
};

export default EventForm;
