import React from "react";
import { useSelector } from "react-redux";
import { Container, Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import SignedOutMenu from "./SignedOutMenu";
import SignedInMenu from "./SignedInMenu";

const NavBar = () => {
  const { authenticated } = useSelector((state) => state.auth);

  return (
    <Menu inverted fixed="top">
      <Container>
        <NavLink exact to="/" header>
          <img
            className="logo"
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "10px", marginTop: "20px" }}
            width="120px"
          />
        </NavLink>
        <Menu.Item as={NavLink} to="/events" name="Events" />
        {authenticated ? <SignedInMenu /> : <SignedOutMenu />}
      </Container>
    </Menu>
  );
};

export default NavBar;
