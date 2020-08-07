import React from "react";
import { useDispatch } from "react-redux";

import * as Yup from "yup";
import { Formik, Form } from "formik";
import { Button, Label, Divider } from "semantic-ui-react";

import MyTextInput from "../../app/common/form/MyTextInput";
import ModalWrappers from "../../app/common/modals/ModalWrappers";
import { closeModal } from "../../app/common/modals/modalReducer";
import { registerInFirebase } from "../../app/firestore/firebaseService";
import SocialLogin from "./SocialLogin";

const RegisterForm = () => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    displayName: Yup.string().required(),
    email: Yup.string().required().email(),
    password: Yup.string().required(),
  });

  return (
    <ModalWrappers size="mini" header="Register to Re-vents">
      <Formik
        initialValues={{ displayName: "", email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            await registerInFirebase(values);
            setSubmitting(false);
            dispatch(closeModal());
          } catch (error) {
            setErrors({ auth: error.message });
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, isValid, dirty, errors }) => (
          <Form className="ui form">
            <MyTextInput name="displayName" placeholder="DisplayName" />
            <MyTextInput name="email" placeholder="Email Address" />
            <MyTextInput
              name="password"
              placeholder="Password"
              type="password"
            />
            {errors.auth && (
              <Label
                basic
                color="red"
                style={{ marginBottom: 12 }}
                content={errors.auth}
              />
            )}
            <Button
              loading={isSubmitting}
              disabled={!isValid || !dirty || isSubmitting}
              type="submit"
              fluid
              size="large"
              color="teal"
              content="Register"
            />
            <Divider horizontal> Or </Divider>
            <SocialLogin />
          </Form>
        )}
      </Formik>
    </ModalWrappers>
  );
};

export default RegisterForm;
