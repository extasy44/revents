import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "semantic-ui-react";
import { increment, decrement } from "./testReducer";

const Sandbox = () => {
  const { data } = useSelector((state) => state.test);
  const dispatch = useDispatch();
  return (
    <div>
      <h1>Testing 123</h1>
      <h2>The data is : {data}</h2>
      <Button
        onClick={() => dispatch(increment(20))}
        content="increment"
        color="green"
      />
      <Button
        onClick={() => dispatch(decrement(20))}
        content="decrement"
        color="red"
      />
    </div>
  );
};

export default Sandbox;
