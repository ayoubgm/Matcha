import React from "react";
import { Card, Col, Row } from "antd";

const About = () => {
  return (
    <Row
      style={{
        width: "100%",
        textAlign: "center",
        margin: "25vh 20px",
      }}
    >
      <div>
        <span style={{ color: "white", fontSize: "60px" }}>About us</span>
        <Row gutter={[16, 16]} className="site-card-wrapper">
          <Col xs={16} lg={7} span={24}>
            <Card
              title="Our values makes us what we are"
              bordered={false}
              id="card"
            >
              Our core values form the foundation of our success and our
              enthusiasm for technology. They are also our incentive for
              bringing people together. Here, you can learn more about what
              makes us tick and what you can expect when you work with us.
            </Card>
          </Col>
          <Col xs={16} lg={7} span={24}>
            <Card title="Matcha loves you!" bordered={false} id="card">
              Our members are not anonymous users, but rather individual
              personalities. We can only offer you a product that meets your
              needs if we know what you are thinking and feeling. The reason why
              we developed Matcha is very special: We wanted to created a new
              way to meet interesting people nearby.
            </Card>
          </Col>
          <Col xs={16} lg={7} span={24}>
            <Card
              title="The right path isn't always the easiest"
              bordered={false}
              id="card"
            >
              We've always followed our own path and aren't afraid of putting
              ideas into practice. Even if that means taking risks. It is
              important to quickly determine whether you are on the right track
              or not. This is the only way to develop true innovations and
              sustainable technologies.
            </Card>
          </Col>
        </Row>
      </div>
    </Row>
  );
};

export default About;
