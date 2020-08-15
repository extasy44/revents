import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Header, Segment, Feed } from "semantic-ui-react";
import {
  getUserFeedRef,
  firebaseObjectToArray,
} from "../../../app/firestore/firebaseService";
import { listenToFeed } from "../../profiles/profilePage/profileActions";
import EventFeedItem from "./EventFeedItem";

const EventsFeed = () => {
  const dispatch = useDispatch();
  const { feed } = useSelector((state) => state.profile);

  useEffect(() => {
    getUserFeedRef().on("value", (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }
      const feed = firebaseObjectToArray(snapshot.val()).reverse();
      dispatch(listenToFeed(feed));
    });

    return () => {
      getUserFeedRef().off();
    };
  }, [dispatch]);

  return (
    <>
      <Header attached color="teal" icon="newspaper" content="News feed" />
      <Segment attached="bottom">
        <Feed>
          {feed.length > 0
            ? feed.map((post) => <EventFeedItem post={post} key={post.id} />)
            : "You have no event feed right now"}
        </Feed>
      </Segment>
    </>
  );
};

export default EventsFeed;
