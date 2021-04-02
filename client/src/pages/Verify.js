import React, { useState, useEffect } from "react";
import { Result, Button, Spin } from "antd";
import axios from "axios";

const Verify = (props) => {
  const [reqStatus, setStatus] = useState("sending");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const aToken = props.location.search.split("=")[1];
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  // eslint-disable-next-line
  useEffect(async () => {
    await verifyAccount();
    // eslint-disable-next-line
  }, []);

  const verifyAccount = async () => {
    setTimeout(async () => {
      try {
        await axios
          .patch(
            "http://localhost:3001/api/users/verify",
            { token: aToken },
            config
          )
          .then((res) => {
            if (res.data) {
              setLoading(false);
              setStatus("true");
              setMessage(res.data.message);
            }
          })
          .catch((err) => {
            if (err.response.data) {
              setLoading(false);
              setStatus("false");
              setMessage(err.response.data.error);
            }
          });
      } catch (error) {
        setLoading(false);
        setStatus("false");
        setMessage("An error has occurred !");
      }
    }, 4000);
  };

  const alert =
    reqStatus === "sending" ? (
      <Result status="404" title="On verifying.." />
    ) : reqStatus === "true" ? (
      <Result
        status="success"
        title="Verified successfully"
        subTitle={message}
        extra={
          <Button
            style={{ fontSize: "0.6rem" }}
            type="primary"
            key="login"
            href="/login">
            Login
          </Button>
        }
      />
    ) : (
      <Result
        status="error"
        title="Failed to verify account"
        subTitle={message}
        extra={
          <Button
            style={{ fontSize: "0.6rem" }}
            type="primary"
            key="/"
            href="/">
            Back To Home
          </Button>
        }
      />
    );
  return (
    <>
      <div align="middle">
        <Spin spinning={loading} delay={200} size="large">
          {alert}
        </Spin>
      </div>
    </>
  );
};

export default Verify;
