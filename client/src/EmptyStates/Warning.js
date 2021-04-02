import React from "react";
import { Result, Button } from "antd";

const Warning = () => {
  return (
    <Result
      status="warning"
      title="There are some problems with your operation."
      extra={}
    />
  );
};

export default Warning;
