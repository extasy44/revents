import React from "react";
import { useDispatch } from "react-redux";
import { Menu, Button } from "semantic-ui-react";
import { openModal } from "../../app/common/modals/modalReducer";

const SignedOutMenu = ({ setAuthenticated }) => {
  const dispatch = useDispatch();
  return (
    <Menu.Item position="right">
      <Button
        onClick={() => dispatch(openModal({ modalType: "LoginForm" }))}
        basic
        inverted
        content="Login"
      />
      <Button
        onClick={() => dispatch(openModal({ modalType: "RegisterForm" }))}
        basic
        inverted
        content="Register"
        style={{ margin: "0.5rem" }}
      />
    </Menu.Item>
  );
};

export default SignedOutMenu;
