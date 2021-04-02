import React from "react";
import { Layout, Carousel } from "antd";
import logo from "../assets/images/logo.svg";
import "../assets/css/Landing.less";
import About from "../components/About";
import Join from "../components/Join";
const { Header, Content, Footer } = Layout;

const LandingPage = () => {
  return (
    <Layout>
      <Header
        style={{
          position: "fixed",
          zIndex: 1,
          width: "100%",
          background: "#f5f1f1",
          textAlign: "center",
        }}
      >
        <img className="logo" alt="logo" src={logo}></img>
      </Header>
      <Content
        className="site-layout"
        style={{ padding: "0", marginTop: "64px" }}
      >
        <Carousel autoplay className="carousel">
          <Join />
          <About />
        </Carousel>
      </Content>
      <Footer
        style={{
          textAlign: "center",
          background: "#f5f1f1",
          color: "#d9374b",
        }}
      >
        Matcha ©2021 Made with <i className="las la-lg la-heart" />
      </Footer>
    </Layout>
  );
};

export default LandingPage;
