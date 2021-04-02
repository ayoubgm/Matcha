import React from "react";
import { Result, Button } from "antd";
import { useHistory } from "react-router-dom";

const Page500 = () => {
  let history = useHistory();

  const handlClick = () => {
    history.push("/");
  };

  return (
    <Result
      status="500"
      title="No Data"
      subTitle="Sorry, No user found with this Username."
      extra={
        <Button
          style={{ fontSize: "0.6rem" }}
          type="primary"
          onClick={handlClick}>
          Back Home
        </Button>
      }
    />
  );
};

export default Page500;
