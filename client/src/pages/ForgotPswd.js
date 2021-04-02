import React from "react";

import { Row, Col, Form, Input, Button, Typography, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import logo from "../assets/images/logo.svg";
import login from "../assets/images/login.svg";
import { Link } from "react-router-dom";

import "../assets/css/auth.less";
import { useLocation } from "react-router-dom";
import { resetAction, changePasswordAction } from "../actions/userAction";

import { useHistory } from "react-router-dom";
import { openMessageError, openMessageSuccess } from "../helper/Verifications";

const { Title } = Typography;

const ForgotPswd = () => {
  let history = useHistory();
  const token = useLocation().search.split("=")[1];

  const submit = async (values) => {
    if (!token) {
      const res = await resetAction(values);
      message.loading("Loading...", 3);
      if (res.success) {
        openMessageSuccess(res.message);
      } else {
        openMessageError(res.error);
      }
    } else {
      const res = await changePasswordAction(values, token);
      message.loading("Loading...", 2);
      if (res.success) {
        openMessageSuccess(res.message);
        history.replace("/login");
      } else {
        openMessageError(res.error);
      }
    }
  };
  let rules = {
    password: [
      { required: true, message: "Please entre your Password!" },
      {
        pattern: new RegExp(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*_-]).{8,}$/
        ),
        message:
          "The password should be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character !",
      },
    ],
  };
  return (
    <Row gutter={0}>
      <Col xs={0} md={14} span={24}>
        <div id="left-container">
          <div id="titles">
            <Title level={1} id="title">
              Find Your Lover
            </Title>
            <Title level={2} id="subtitle">
              Get Started
            </Title>
          </div>
          <img id="img" alt="ForgotPswd svg" src={login} />
        </div>
      </Col>
      <Col md={10} span={24} id="right-bg">
        <div id="right-container">
          <img id="logo" alt="logo" src={logo}></img>
          <Form
            name="ForgotPswd"
            id="form"
            initialValues={{ remember: true }}
            onFinish={submit}>
            <div id="add-margin-bottom">
              {!token && (
                <Form.Item name="email">
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>
              )}
              {token && (
                <Form.Item name="password" rules={rules.password}>
                  <Input.Password
                    autoComplete="on"
                    prefix={<LockOutlined />}
                    placeholder="Password"
                  />
                </Form.Item>
              )}
            </div>

            <Form.Item>
              <Button
                id="button"
                type="primary"
                htmlType="submit"
                shape="round">
                {!token && "Send Email"}
                {token && "Change Password"}
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Col span={24}>
          <div id="footer-links">
            <Link to="/">About us</Link>
            <Link to="/Policy">Policy</Link>
            <Link to="/">Home</Link>
          </div>
        </Col>
      </Col>
    </Row>
  );
};

export default ForgotPswd;
