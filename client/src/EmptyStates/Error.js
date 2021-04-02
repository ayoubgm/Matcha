import React from "react";
import { Result, Button } from "antd";

const Error = () => {
  return (
    <Result
      status="error"
      title="Submission Failed"
      subTitle="Please check and modify the information before resubmitting."
      extra={
        <Button style={{ fontSize: "0.6rem" }} type="primary" key="login">
          Login
        </Button>
      }
    />
  );
};

export default Error;
