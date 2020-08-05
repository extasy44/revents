import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "semantic-ui-react";
import { increment, decrement } from "./testReducer";
import TestPlaceInput from "./TestPlaceInput";
import TestMap from "./TestMap";

const Sandbox = () => {
  const { data } = useSelector((state) => state.test);
  const { loading } = useSelector((state) => state.async);
  const [target, setTarget] = useState(null);
  const dispatch = useDispatch();
  const defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33,
    },
    zoom: 11,
  };

  const [location, setLocation] = useState(defaultProps);

  const handleSetLocation = (latLng) => {
    setLocation({ ...location, center: { lat: latLng.lat, lng: latLng.lng } });
  };

  return (
    <div>
      <h1>Testing 123</h1>
      <h2>The data is : {data}</h2>
      <Button
        name="increment"
        loading={loading && target === "increment"}
        onClick={(e) => {
          dispatch(increment(10));
          setTarget(e.target.name);
        }}
        content="increment"
        color="green"
      />
      <Button
        name="decrement"
        loading={loading && target === "decrement"}
        onClick={(e) => {
          dispatch(decrement(10));
          setTarget(e.target.name);
        }}
        content="decrement"
        color="red"
      />
      <div style={{ marginTop: "30px" }}>
        <TestPlaceInput setLocation={handleSetLocation} />
        <TestMap location={location} />
      </div>
    </div>
  );
};

export default Sandbox;
