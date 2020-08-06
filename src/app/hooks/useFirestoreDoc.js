import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError,
} from "../async/asyncReducer";
import { dataFromSnapshot } from "../firestore/firestoreService";

export const useFirestoreDoc = ({
  query,
  data,
  deps,
  shouldExecute = true,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!shouldExecute) return;
    dispatch(asyncActionStart());

    const unsubscribe = query().onSnapshot(
      (snapshot) => {
        if (!snapshot.exists) {
          dispatch(
            asyncActionError({
              code: "not-found",
              message: "Could not find the document",
            })
          );
          return;
        }
        data(dataFromSnapshot(snapshot));
        dispatch(asyncActionFinish());
      },
      () => dispatch(asyncActionFinish())
    );

    return () => unsubscribe();
  }, deps); //eslint-disable-line react-hooks/exhaustive-deps
};

export default useFirestoreDoc;
