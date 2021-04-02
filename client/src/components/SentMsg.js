import React from "react";
import { Row } from "antd";
//from me
export const SentMsg = (props) => {
  return (
    <Row
      type="flex"
      style={{ justifyContent: "flex-end", marginBottom: "20px" }}>
      {props.message ? (
        <p
          style={{
            marginBottom: "0px",
            marginLeft: "10px",
            padding: "10px",
            borderRadius: "15px",
            borderBottomRightRadius: "0",
            boxShadow: "5px 3px 24px 3px rgba(208, 216, 243, 0.6)",
          }}>
          {props.message.message}
        </p>
      ) : (
        ""
      )}
    </Row>
  );
};
