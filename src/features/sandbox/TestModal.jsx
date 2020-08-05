import React from "react";
import ModalWrappers from "../../app/common/modals/ModalWrappers";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "semantic-ui-react";
import { increment, decrement } from "./testReducer";
import { openModal } from "../../app/common/modals/modalReducer";

const TestModal = () => {
  const { data } = useSelector((state) => state.test);
  const dispatch = useDispatch();
  return (
    <div>
      <ModalWrappers size="mini" header="test modals">
        <div>Ths data is : {data}</div>
        <Button
          onClick={() => dispatch(increment(20))}
          content="increment"
          color="green"
        />
        <Button
          onClick={() => dispatch(decrement(20))}
          content="decrement"
          color="red"
        />
        <Button
          onClick={() => dispatch(increment(20))}
          content="increment"
          color="green"
        />
        <Button
          onClick={() =>
            dispatch(
              openModal({ modalType: "TestModal", modalProps: { data } })
            )
          }
          content="Open Modal"
          color="teal"
        />
      </ModalWrappers>
    </div>
  );
};

export default TestModal;
