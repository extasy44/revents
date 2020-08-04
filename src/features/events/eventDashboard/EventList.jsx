import React from "react";
import EventListItem from "./EventListItem";

const EventList = ({ events, selectEvent, setFormOpen, deleteEvent }) => {
  return (
    <>
      {events.map((event) => (
        <EventListItem
          key={event.id}
          event={event}
          selectEvent={selectEvent}
          setFormOpen={setFormOpen}
          deleteEvent={deleteEvent}
        />
      ))}
    </>
  );
};

export default EventList;
