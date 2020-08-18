import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";

import { Grid } from "semantic-ui-react";

import EventDetailedHeader from "./EventDetailedHeader";
import EventDetailedInfo from "./EventDetailedInfo";
import EventDetailedChat from "./EventDetailedChat";
import EventDetailedSidebar from "./EventDetailedSidebar";
import useFirestoreDoc from "../../../app/hooks/useFirestoreDoc";
import { listenToEventFromFirestore } from "../../../app/firestore/firestoreService";
import { listenToSelectedEvent } from "../eventActions";
import LoadingComponent from "../../../app/layout/LoadingComponent";

const EventDetailedPage = ({ match }) => {
  const event = useSelector((state) => state.event.selectedEvent);

  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.async);
  const isHost = event?.hostUid === currentUser?.uid;
  const isGoing = event?.attendees?.some((a) => a.id === currentUser?.uid);

  useFirestoreDoc({
    query: () => listenToEventFromFirestore(match.params.id),
    data: (event) => dispatch(listenToSelectedEvent(event)),
    deps: [match.params.id, dispatch],
  });

  if (loading || (!event && !error)) return <LoadingComponent />;
  if (error) return <Redirect to="/error" />;

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventDetailedHeader
          event={event}
          isGoing={isGoing}
          isHost={isHost}
          isCancelled={event.isCancelled}
        />
        <EventDetailedInfo event={event} />
        <EventDetailedChat eventId={event.id} />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventDetailedSidebar
          attendees={event?.attendees}
          hostUid={event.hostUid}
        />
      </Grid.Column>
    </Grid>
  );
};

export default EventDetailedPage;
