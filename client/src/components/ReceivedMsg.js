import React from "react";
import { Col, Row } from "antd";

export const ReceivedMsg = (props) => {
  return (
    <Row type="flex" style={{ marginBottom: "20px" }}>
      <Col xs={24} md={20} span={24}>
        {props.message ? (
          <p
            style={{
              marginBottom: "0px",
              marginLeft: "10px",
              backgroundColor: "#dce4f5",
              padding: "10px",
              borderRadius: "15px",
              borderTopLeftRadius: "0",
            }}
          >
            {props.message.message}
          </p>
        ) : (
          ""
        )}
      </Col>
    </Row>
  );
};
