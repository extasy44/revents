import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Segment, Comment, Header } from "semantic-ui-react";
import { formatDistance } from "date-fns";
import EventDetailedChatForm from "./EventDetailedChatForm";
import {
  getEventChatRef,
  firebaseObjectToArray,
} from "../../../app/firestore/firebaseService";
import { listenToEventChat } from "../eventActions";
import { CLEAR_COMMENTS } from "../eventConstants";
import { createDataTree } from "../../../app/common/utils/util";

const EventDetailedChat = ({ eventId }) => {
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.event);
  const [showReplyForm, setShowReplyForm] = useState({
    open: false,
    commentId: null,
  });

  const handleCloseReplyForm = () => {
    setShowReplyForm({ open: false, commentId: null });
  };

  useEffect(() => {
    getEventChatRef(eventId).on("value", (snapshot) => {
      if (!snapshot.exists()) return;

      dispatch(
        listenToEventChat(firebaseObjectToArray(snapshot.val()).reverse())
      );
    });

    return () => {
      dispatch({ type: CLEAR_COMMENTS });
      getEventChatRef().off();
    };
  }, [eventId, dispatch]);

  return (
    <>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        <Header>Chat about this event</Header>
      </Segment>

      <Segment attached>
        <EventDetailedChatForm eventId={eventId} parentId={0} />
        <Comment.Group>
          {createDataTree(comments).map((comment) => (
            <Comment key={comment.id}>
              <Comment.Avatar src={comment.photoURL || "assets/user.png"} />
              <Comment.Content>
                <Comment.Author as={Link} to={`/profile/${comment.uid}`}>
                  {comment.displayName}
                </Comment.Author>
                <Comment.Metadata>
                  <div>{formatDistance(comment.date, new Date())}</div>
                </Comment.Metadata>
                <Comment.Text>
                  {comment.text.split("\n").map((text, i) => (
                    <span key={i}>
                      {text} <br />
                    </span>
                  ))}
                </Comment.Text>
                <Comment.Actions>
                  <Comment.Action
                    onClick={() =>
                      setShowReplyForm({
                        open: true,
                        commentId: comment.id,
                      })
                    }
                  >
                    Reply
                  </Comment.Action>
                  <Comment.Actions>
                    {showReplyForm.open &&
                      showReplyForm.commentId === comment.id && (
                        <EventDetailedChatForm
                          eventId={eventId}
                          parentId={0}
                          closeForm={handleCloseReplyForm}
                        />
                      )}
                  </Comment.Actions>
                </Comment.Actions>
              </Comment.Content>
              {comment.childNodes.length > 0 && (
                <Comment.Group>
                  {comment.childNodes.map((child) => (
                    <Comment key={child.id}>
                      <Comment.Avatar
                        src={comment.photoURL || "assets/user.png"}
                      />
                      <Comment.Content>
                        <Comment.Author as={Link} to={`/profile/${child.uid}`}>
                          {child.displayName}
                        </Comment.Author>
                        <Comment.Metadata>
                          <div>{formatDistance(child.date, new Date())}</div>
                        </Comment.Metadata>
                        <Comment.Text>
                          {child.text.split("\n").map((text, i) => (
                            <span key={i}>
                              {text} <br />
                            </span>
                          ))}
                        </Comment.Text>
                        <Comment.Actions>
                          <Comment.Action
                            onClick={() =>
                              setShowReplyForm({
                                open: true,
                                commentId: child.id,
                              })
                            }
                          >
                            Reply
                          </Comment.Action>
                          <Comment.Actions>
                            {showReplyForm.open &&
                              showReplyForm.commentId === child.id && (
                                <EventDetailedChatForm
                                  eventId={eventId}
                                  parentId={child.parentId}
                                  closeForm={handleCloseReplyForm}
                                />
                              )}
                          </Comment.Actions>
                        </Comment.Actions>
                      </Comment.Content>
                    </Comment>
                  ))}
                </Comment.Group>
              )}
            </Comment>
          ))}
        </Comment.Group>
      </Segment>
    </>
  );
};

export default EventDetailedChat;
