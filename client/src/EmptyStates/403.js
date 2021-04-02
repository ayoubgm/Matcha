import React from "react";
import { Result, Button } from "antd";

const Page403 = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button style={{ fontSize: "0.6rem" }} type="primary">
          Back Home
        </Button>
      }
    />
  );
};

export default Page403;
