import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Image, Dropdown } from "semantic-ui-react";
import { toast } from "react-toastify";
import { signOutFirebase } from "../../app/firestore/firebaseService";
import { signOutUser } from "../auth/authActions";

const SignedInMenu = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const history = useHistory();

  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await signOutFirebase();
      history.push("/");
    } catch (error) {
      toast.error(error.message);
      dispatch(signOutUser);
    }
  };

  return (
    <Menu.Item position="right">
      <Image
        avatar
        spaced="right"
        src={currentUser.photoURL || "/assets/user.png"}
      />
      <Dropdown pointing="top left" text={currentUser.displayName}>
        <Dropdown.Menu>
          <Dropdown.Item
            as={Link}
            to="createEvent"
            text="Create Event"
            icon="plus"
          />
          <Dropdown.Item text="My Profile" icon="user" />
          <Dropdown.Item
            as={Link}
            to="/account"
            text="My account"
            icon="settings"
          />
          <Dropdown.Item text="Sign Out" icon="power" onClick={handleSignOut} />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
};

export default SignedInMenu;
