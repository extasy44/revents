import React, { useState } from "react";
import { Container, Menu } from "semantic-ui-react";
import { NavLink, useHistory } from "react-router-dom";
import SignedOutMenu from "./SignedOutMenu";
import SignedInMenu from "./SignedInMenu";

const NavBar = ({ setFormOpen }) => {
  const history = useHistory();
  const [authenticated, setAuthenticated] = useState(false);

  const handleSignOut = () => {
    setAuthenticated(false);
    history.push("/");
  };

  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item as={NavLink} exact to="/" header>
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          />
          Re-vents
        </Menu.Item>
        <Menu.Item as={NavLink} to="/events" name="Events" />
        {authenticated ? (
          <SignedInMenu signOut={handleSignOut} />
        ) : (
          <SignedOutMenu setAuthenticated={setAuthenticated} />
        )}
      </Container>
    </Menu>
  );
};

export default NavBar;
