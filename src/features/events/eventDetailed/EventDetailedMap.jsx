import React from "react";
import { Segment, Icon } from "semantic-ui-react";
import GoogleMapReact from "google-map-react";

const Marker = () => {
  return <Icon name="marker" size="big" color="red" />;
};

const EventDetailedMap = ({ latLng }) => {
  const zoom = 15;

  return (
    <Segment attached="bottom" style={{ padding: 0 }}>
      <div style={{ height: 300, width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyCnz4Avd4LMn2WLK3Zv_w1MPL3q0f0UJ3M" }}
          center={latLng}
          zoom={zoom}
        >
          <Marker lat={latLng.lat} lng={latLng.lng} />
        </GoogleMapReact>
      </div>
    </Segment>
  );
};

export default EventDetailedMap;
