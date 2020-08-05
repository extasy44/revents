import React from "react";
import { useDispatch } from "react-redux";

import * as Yup from "yup";
import { Formik, Form } from "formik";
import { Button } from "semantic-ui-react";

import MyTextInput from "../../app/common/form/MyTextInput";
import ModalWrappers from "../../app/common/modals/ModalWrappers";
import { signInUser } from "./authActions";
import { closeModal } from "../../app/common/modals/modalReducer";

const LoginForm = () => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    email: Yup.string().required().email(),
    password: Yup.string().required(),
  });

  return (
    <ModalWrappers size="mini" header="Sign in to Re-vents">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          dispatch(signInUser(values));
          setSubmitting(false);
          dispatch(closeModal());
        }}
      >
        {({ isSubmitting, isValid, dirty }) => (
          <Form className="ui form">
            <MyTextInput name="email" placeholder="Email Address" />
            <MyTextInput
              name="password"
              placeholder="Password"
              type="password"
            />
            <Button
              loading={isSubmitting}
              disabled={!isValid || !dirty || isSubmitting}
              type="submit"
              fluid
              size="large"
              color="teal"
              content="Login"
            />
          </Form>
        )}
      </Formik>
    </ModalWrappers>
  );
};

export default LoginForm;
