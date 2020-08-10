import React from "react";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "semantic-ui-react";
import { toast } from "react-toastify";

import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import { updateUserProfile } from "../../../app/firestore/firestoreService";

const ProfileForm = ({ profile }) => {
  return (
    <Formik
      initialValues={{
        displayName: profile.displayName,
        description: profile.description || "",
      }}
      validationSchema={Yup.object({
        displayName: Yup.string().required(),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await updateUserProfile(values);
        } catch (error) {
          toast.error(error.message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form className="ui form">
          <MyTextInput name="displayName" placeholder="Display Name" />
          <MyTextArea name="description" placholder="Description" />
          <Button
            loading={isSubmitting}
            disabled={isSubmitting || !isValid || !dirty}
            type="submit"
            size="large"
            floated="right"
            positive
            content="Update Profile"
          />
        </Form>
      )}
    </Formik>
  );
};

export default ProfileForm;
