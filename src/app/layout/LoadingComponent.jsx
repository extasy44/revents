import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

const LoadingComponent = ({ interted = true, content = "Loading..." }) => {
  return (
    <Dimmer inverted={interted} active={true}>
      <Loader content={content} />
    </Dimmer>
  );
};

export default LoadingComponent;
