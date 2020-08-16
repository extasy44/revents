import firebase from "../config/firebase";

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

export const fetchEventsFromFirestore = (
  predicate,
  limit,
  lastDocSnapshot = null
) => {
  const user = firebase.auth().currentUser;
  let eventsRef = db
    .collection("events")
    .orderBy("date")
    .startAfter(lastDocSnapshot)
    .limit(limit);

  switch (predicate.get("filter")) {
    case "isGoing":
      return eventsRef
        .where("attendeeIDs", "array-contains", user.uid)
        .where("date", ">=", predicate.get("startDate"));
    case "isHosting":
      return eventsRef
        .where("hostUid", "==", user.uid)
        .where("date", ">=", predicate.get("startDate"));

    default:
      return eventsRef.where("date", ">=", predicate.get("startDate"));
  }
};

export const listenToEventFromFirestore = (eventId) => {
  return db.collection("events").doc(eventId);
};

export const addEventToFirestore = (event) => {
  const user = firebase.auth().currentUser;

  return db.collection("events").add({
    ...event,
    hostUid: user.uid,
    isCancelled: false,
    hostedBy: user.displayName,
    hostPhotoURL: user.photoURL || null,
    attendees: firebase.firestore.FieldValue.arrayUnion({
      id: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL || null,
    }),

    attendeeIDs: firebase.firestore.FieldValue.arrayUnion(user.uid),
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

export const getUserProfile = (userId) => {
  return db.collection("users").doc(userId);
};

export const updateUserProfile = async (profile) => {
  const user = firebase.auth().currentUser;

  try {
    if (user.displayName !== profile.displayName) {
      await user.updateProfile({
        displayName: profile.displayName,
      });
    }
    return await db.collection("users").doc(user.uid).update(profile);
  } catch (error) {
    throw error;
  }
};

export const updateUserProfilePhoto = async (downloadURL, filename) => {
  const user = firebase.auth().currentUser;
  const userDocRef = db.collection("users").doc(user.uid);
  try {
    const userDoc = await userDocRef.get();
    if (!userDoc.data().photoURL) {
      await db.collection("users").doc(user.uid).update({
        photoURL: downloadURL,
      });
      await user.updateProfile({
        photoURL: downloadURL,
      });
    }
    return await db.collection("users").doc(user.uid).collection("photos").add({
      name: filename,
      url: downloadURL,
    });
  } catch (error) {
    throw error;
  }
};

export const getUserPhotos = (userUid) => {
  return db.collection("users").doc(userUid).collection("photos");
};

export const setMainPhoto = async (photo) => {
  const user = firebase.auth().currentUser;
  const today = new Date();

  const eventDocQuery = db
    .collection("event")
    .where("attendeeIDs", "array-contains", user.uid)
    .where("date", ">=", today);
  const userFollowingRef = db
    .collection("following")
    .doc(user.uid)
    .collection("userFollowing");

  const batch = db.batch();

  batch.update(db.collection("users").doc(user.uid), {
    photoURL: photo.url,
  });

  try {
    const eventsQuerySnap = await eventDocQuery.get();

    for (let i = 0; i < eventsQuerySnap.docs.length; i++) {
      let eventDoc = eventsQuerySnap.docs[i];
      if (eventDoc.data().hostUid === user.uid) {
        batch.update(eventsQuerySnap.docs[i].ref, {
          hostPhotoURL: photo.url,
        });
      }

      batch.update(eventsQuerySnap.docs[i].ref, {
        attendees: eventDoc.data().attendees.filter((attendee) => {
          if (attendee.id === user.id) {
            attendee.photoURL = photo.url;
          }

          return attendee;
        }),
      });
    }

    const userFollowingSnap = await userFollowingRef.get();

    userFollowingSnap.docs.foreEach((docRef) => {
      let followingDocRef = db
        .collection("following")
        .doc(docRef.id)
        .collection("userFollowers")
        .doc(user.uid);

      batch.update(followingDocRef, {
        photoURL: photo.url,
      });
    });
    await batch.commit();

    return await user.updateProfile({
      photoURL: photo.url,
    });
  } catch (error) {
    throw error;
  }
};

export const deletePhotoFromCollection = (photoId) => {
  const userUid = firebase.auth().currentUser.uid;

  return db
    .collection("users")
    .doc(userUid)
    .collection("photos")
    .doc(photoId)
    .delete();
};

export const addUserAttendance = (event) => {
  const user = firebase.auth().currentUser;

  return db
    .collection("events")
    .doc(event.id)
    .update({
      attendees: firebase.firestore.FieldValue.arrayUnion({
        id: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL || null,
      }),
      attendeeIDs: firebase.firestore.FieldValue.arrayUnion(user.uid),
    });
};

export const cancelUserAttendance = async (event) => {
  const user = firebase.auth().currentUser;

  try {
    const eventDoc = await db.collection("events").doc(event.id).get();

    return db
      .collection("events")
      .doc(event.id)
      .update({
        attendeeIDs: firebase.firestore.FieldValue.arrayRemove(user.uid),
        attendees: eventDoc
          .data()
          .attendees.filter((attendee) => attendee.id !== user.uid),
      });
  } catch (error) {
    throw error;
  }
};

export const getUserEventsQuery = (activeTab, userUid) => {
  let eventsRef = db.collection("events");

  const today = new Date();

  switch (activeTab) {
    case 1:
      return eventsRef
        .where("attendeeIDs", "array-contains", userUid)
        .where("date", "<=", today);

    case 2:
      return eventsRef.where("hostUid", "==", userUid).orderBy("date");

    default:
      return eventsRef
        .where("attendeeIDs", "array-contains", userUid)
        .where("date", ">=", today)
        .orderBy("date");
  }
};

export const followUser = async (profile) => {
  const user = firebase.auth().currentUser;
  const batch = db.batch();

  try {
    batch.set(
      db
        .collection("following")
        .doc(user.uid)
        .collection("userFollowing")
        .doc(profile.id),
      {
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        uid: profile.id,
      }
    );

    batch.update(db.collection("users").doc(user.uid), {
      followingCount: firebase.firestore.FieldValue.increment(1),
    });

    return await batch.commit();
  } catch (error) {
    throw error;
  }
};

export const unfollowUser = async (profile) => {
  const user = firebase.auth().currentUser;
  const batch = db.batch();
  try {
    batch.delete(
      db
        .collection("following")
        .doc(user.uid)
        .collection("userFollowing")
        .doc(profile.id)
    );

    batch.update(db.collection("users").doc(user.uid), {
      followingCount: firebase.firestore.FieldValue.increment(-1),
    });

    return await batch.commit();
  } catch (error) {
    throw error;
  }
};

export const getFollowersCollection = (profileId) => {
  return db.collection("following").doc(profileId).collection("userFollowers");
};

export const getFollowingCollection = (profileId) => {
  return db.collection("following").doc(profileId).collection("userFollowing");
};

export const getFollowingDoc = (profileId) => {
  const userUid = firebase.auth().currentUser.uid;
  return db
    .collection("following")
    .doc(userUid)
    .collection("userFollowing")
    .doc(profileId)
    .get();
};
