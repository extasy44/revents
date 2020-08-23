import React from "react";
import { Segment, Container, Button, Icon } from "semantic-ui-react";

const HomePage = ({ history }) => {
  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container>
        <Button onClick={() => history.push("/events")} size="huge" inverted>
          Get Started <Icon name="right arrow" inverted />
        </Button>
      </Container>
    </Segment>
  );
};

export default HomePage;
