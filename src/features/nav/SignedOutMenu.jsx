import React from "react";
import { Menu, Button } from "semantic-ui-react";

const SignedOutMenu = ({ setAuthenticated }) => {
  return (
    <Menu.Item position="right">
      <Button
        onClick={() => setAuthenticated(true)}
        basic
        inverted
        content="Login"
      />
      <Button basic inverted content="Register" style={{ margin: "0.5rem" }} />
    </Menu.Item>
  );
};

export default SignedOutMenu;
