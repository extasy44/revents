import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { asyncActionStart, asyncActionFinish } from "../async/asyncReducer";
import { dataFromSnapshot } from "../firestore/firestoreService";

export const useFirestoreCollection = ({ query, data, deps }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncActionStart());

    const unsubscribe = query().onSnapshot(
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => dataFromSnapshot(doc));
        data(docs);
        dispatch(asyncActionFinish());
      },
      (error) => dispatch(asyncActionFinish)
    );

    return () => unsubscribe();
  }, deps); //eslint-disable-line react-hooks/exhaustive-deps
};

export default useFirestoreCollection;
