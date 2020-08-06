import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Segment, Header, Button } from "semantic-ui-react";

const ErrorComponent = () => {
  const { error } = useSelector((state) => state.async);
  return (
    <Segment placeholder>
      <Header
        textAlign="center"
        content={error?.message || "Oops - something went wrong"}
      />
      <Button
        as={Link}
        to="/events"
        primary
        style={{ marginTop: 20 }}
        content="Return to Event List"
      />
    </Segment>
  );
};

export default ErrorComponent;
