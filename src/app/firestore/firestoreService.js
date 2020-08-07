import firebase from "../config/firebase";
import cuid from "cuid";

const db = firebase.firestore();

export const dataFromSnapshot = (snapshot) => {
  if (!snapshot.exists) return undefined;

  const data = snapshot.data();

  for (const prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (data[prop] instanceof firebase.firestore.Timestamp) {
        data[prop] = data[prop].toDate();
      }
    }
  }

  return {
    ...data,
    id: snapshot.id,
  };
};

export const listenToEventsFromFirestore = () => {
  return db.collection("events");
};

export const listenToEventFromFirestore = (eventId) => {
  return db.collection("events").doc(eventId);
};

export const addEventToFirestore = (event) => {
  return db.collection("events").add({
    ...event,
    isCancelled: false,
    hostedBy: "Anna",
    hostPhotoURL: "https://randomuser.me/api/portraits/women/32.jpg",
    attendees: firebase.firestore.FieldValue.arrayUnion({
      id: cuid(),
      displayName: "Anna",
      photoURL: "https://randomuser.me/api/portraits/women/32.jpg",
    }),
  });
};

export const updateEventInFirestoe = (event) => {
  return db.collection("events").doc(event.id).update(event);
};

export const deleteEventInFirestore = (eventId) => {
  return db.collection("events").doc(eventId).delete();
};

export const cancelEventToggle = ({ id, isCancelled }) => {
  return db.collection("events").doc(id).update({
    isCancelled: !isCancelled,
  });
};

export const setUserProfileData = (user) => {
  return db
    .collection("users")
    .doc(user.uid)
    .set({
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL || null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
};
