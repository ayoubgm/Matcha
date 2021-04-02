import React, { useState, useEffect, useContext } from "react";
import { Layout, Avatar } from "antd";
import SideBar from "../components/sideBar";
import "../assets/css/default.less";
import { Link } from "react-router-dom";
import axios from "axios";
import { Context } from "../Contexts/Context";

const { Header, Sider, Content, Footer } = Layout;

const DefaultLayout = ({ children }) => {
  const [itemClicked, setItemClicked] = useState(0);
  // const content = useRef(null);
  const [state, setState] = useState({
    collapsed: false,
  });

  const ctx = useContext(Context);
  const onCollapse = (collapsed) => {
    collapsed
      ? (document.getElementById("main-section").style.marginLeft = "80px")
      : (document.getElementById("main-section").style.marginLeft = "260px");

    setState({ collapsed });
  };
  const { collapsed } = state;
  const [user, setUser] = useState({
    profile: [],
  });
  // eslint-disable-next-line
  useEffect(async () => {
    // eslint-disable-next-line
    let userData = await getUser();
    // eslint-disable-next-line
    userData.profile = userData.images.filter((i) => {
      if (i.profile === 1) return "http://localhost:3001/api/" + i.url;
    })[0];
    setUser(userData);
    // eslint-disable-next-line
  }, []);

  const getUser = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ctx.state.token}`,
      },
    };
    let user = await axios.get(
      "http://localhost:3001/api/users/find/profile",
      config
    );
    return { ...user.data };
  };

  return (
    <Layout id="main-layout">
      <Sider
        breakpoint="lg"
        theme="light"
        collapsed={collapsed}
        onCollapse={onCollapse}
        collapsedWidth="80px"
        width="260px"
        style={{
          height: "100vh",
          overflow: "hidden",
          position: "fixed",
          zIndex: "1",
          background: "#f5f1f1",
        }}>
        {/* <div className="logo" /> */}
        <SideBar clicked={itemClicked} setClicked={setItemClicked} />
      </Sider>
      <Layout
        id="main-section"
        style={{ background: "transparent", marginLeft: "260px" }}>
        <Header
          style={{
            background: "#f5f1f1",
            boxShadow: "1px 1px 5px #cdcdcdc",
            marginBottom: "20px",
            display: "flex",
          }}>
          <h1
            style={{
              textAlign: "center",
              color: "#d9374b",
              flexBasis: "100%",
            }}>
            <Link to="/home">
              <span style={{ cursor: "pointer" }}>MATCHA</span>
            </Link>
          </h1>
          <div>
            <Link to={"/profile"}>
              <Avatar
                style={{ cursor: "pointer" }}
                size={47}
                src={
                  user.profile.url
                    ? "http://localhost:3001/api/" + user.profile.url
                    : ""
                }></Avatar>
            </Link>
          </div>
        </Header>
        <Content id="content">{children}</Content>
        <Footer
          style={{
            textAlign: "center",
            background: "#f5f1f1",
            color: "#d9374b",
          }}>
          Matcha ©2021 Made with <i className="las la-lg la-heart" />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
