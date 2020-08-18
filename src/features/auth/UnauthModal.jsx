import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Divider } from "semantic-ui-react";
import { openModal } from "../../app/common/modals/modalReducer";

const UnauthModal = ({ history, setModalOpen }) => {
  const [open, setOpen] = useState(true);
  const { prevLocation } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleClose = () => {
    if (!history) {
      setOpen(false);
      setModalOpen(false);
      return;
    }
    if (history && prevLocation) {
      history.push(prevLocation.pathname);
    } else {
      history.push("/events");
    }

    setOpen(false);
  };

  const handleOpenLoginModal = (modalType) => {
    dispatch(openModal({ modalType }));
    setOpen(false);
    setModalOpen(false);
  };

  return (
    <Modal open={open} size="mini" onClose={handleClose}>
      <Modal.Header content="You need to be signed in" />
      <Modal.Content>
        <p>Please log in or register to see this content</p>
        <Button.Group widths={4}>
          <Button
            fluid
            color="teal"
            content="Login"
            onClick={() => handleOpenLoginModal("LoginForm")}
          />
          <Button.Or />
          <Button
            fluid
            color="green"
            content="Register"
            onClick={() => handleOpenLoginModal("RegisterForm")}
          />
        </Button.Group>
        <Divider />
        <div style={{ textAlign: "center" }}>
          <p>Or Click cancel to continue as a guest</p>
          <Button onClick={handleClose} content="Cancel" />
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default UnauthModal;
