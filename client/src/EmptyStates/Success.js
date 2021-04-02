import React from "react";
import { Result, Button } from "antd";

const Success = () => {
  return (
    <Result
      status="success"
      title="Successfully Registered"
      subTitle="You can Login and find your love"
      extra={
        <Button style={{ fontSize: "0.6rem" }} type="primary" key="login">
          Login
        </Button>
      }
    />
  );
};

export default Success;
