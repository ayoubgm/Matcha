import React, { useState, useContext } from "react";
import { Context } from "../Contexts/Context";
import { Row, Col, Form, Input, Button, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { changePassword } from "../actions/editActions";

export const Security = () => {
  const { state } = useContext(Context);
  const [form] = Form.useForm();
  const [passwords, setPasswords] = useState({
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
  });

  const clearStatePass = () => {
    setPasswords({
      oldpassword: "",
      newpassword: "",
      confirmpassword: "",
    });
  };

  const handleUPasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const submitChangePass = async () => {
    message.loading("Loading...", 2);
    const res = await changePassword(state.token, passwords);

    clearStatePass();
    if (res.success) {
      setTimeout(() => {
        message.success(res.message, 4);
      }, 3000);
    } else {
      setTimeout(() => {
        message.error(res.error, 4);
      }, 3000);
    }
  };

  return (
    <Row>
      <Col md={12} span={24}>
        <Form form={form}>
          <Form.Item name="oldpassword">
            <Input.Password
              autoComplete="on"
              name="oldpassword"
              type="password"
              onChange={(e) => handleUPasswordChange(e)}
              prefix={<LockOutlined style={{ marginRight: "6px" }} />}
              placeholder="Current password"
            />
          </Form.Item>
          <Form.Item name="newpassword">
            <Input.Password
              autoComplete="on"
              name="newpassword"
              type="password"
              onChange={(e) => handleUPasswordChange(e)}
              prefix={<LockOutlined style={{ marginRight: "6px" }} />}
              placeholder="New password"
            />
          </Form.Item>
          <Form.Item name="confirmpassword" required>
            <Input.Password
              autoComplete="on"
              name="confirmpassword"
              type="password"
              onChange={(e) => handleUPasswordChange(e)}
              prefix={<LockOutlined style={{ marginRight: "6px" }} />}
              placeholder="Confirm Password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              onClick={(e) => {
                submitChangePass();
                form.resetFields();
              }}
              type="primary"
              style={{
                fontSize: "0.7em",
                marginTop: "20px",
                borderRadius: "8px",
                padding: "4px 10px",
              }}>
              Change password
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
