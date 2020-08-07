import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "semantic-ui-react";
import { closeModal } from "../../app/common/modals/modalReducer";
import { socialLogin } from "../../app/firestore/firebaseService";

const SocialLogin = () => {
  const dispatch = useDispatch();

  const handleSocialLogin = (provider) => {
    dispatch(closeModal());
    socialLogin(provider);
  };
  return (
    <>
      <Button
        icon="facebook"
        fluid
        color="facebook"
        style={{ marginBottom: 15 }}
        content="Login with Facebook"
        onClick={() => handleSocialLogin("facebook")}
      />
      <Button
        icon="google"
        fluid
        color="google plus"
        style={{ marginBottom: 15 }}
        content="Login with Google"
        onClick={() => handleSocialLogin("google")}
      />
    </>
  );
};

export default SocialLogin;
