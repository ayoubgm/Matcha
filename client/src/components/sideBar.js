import { useState, useContext, useEffect } from "react";

import { Menu, Avatar, Drawer, Badge, List, Row, Col, Button } from "antd";
import { useLocation, Link, useHistory } from "react-router-dom";
import { Context } from "../Contexts/Context";
//icons
import {
  HomeOutlined,
  MessageOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  PoweroffOutlined,
  DeleteTwoTone,
} from "@ant-design/icons";

//css
import "../assets/css/sidebar.less";
import { openMessageError } from "../helper/Verifications";

//actions
import { logoutAction } from "../actions/userAction";
import {
  notifyAction,
  setNotifSeen,
  setAllNotifSeen,
  deleteNotif,
  deleteAllNotif,
} from "../actions/notifyActions";
import moment from "moment";
import { socketConn as socket } from "../sockets";

const SideBar = () => {
  const { state, dispatch } = useContext(Context);
  const location = useLocation();
  let history = useHistory();
  const [itemClicked, setItemClicked] = useState(0);
  const [showDrawer, setshowDrawer] = useState(false);
  // eslint-disable-next-line
  const [Notifs, setNotifs] = useState([]);
  const [countUnread, setCount] = useState(0);

  useEffect(() => {
    let isLoading = true;

    const getNotifs = async () => {
      try {
        const res = await notifyAction(state.token);

        if (res.success && isLoading) {
          setNotifs(res.data);
          setCount(res.countUnread);
        } else {
          if (isLoading) openMessageError(res.error);
        }
      } catch (e) {
        if (isLoading) openMessageError("Something is wrong !");
      }
    };
    getNotifs();
    // eslint-disable-next-line
    return () => (isLoading = false);
    // eslint-disable-next-line
  }, [Notifs]);

  useEffect(() => {
    socket.on("notifications", (data) => {
      setNotifs(data.data);
      setCount(data.countUnread);
    });
  }, [Notifs, countUnread]);

  const handleClickNotif = (id, username) => {
    // SET NOTIF has been seen
    setNotifSeen(state.token, id);
    history.push("/profile/" + username);
  };
  const handleDeleteNotif = (id) => {
    Notifs.filter((item) => item.id === id);
    deleteNotif(state.token, id);
  };
  const handleReadAllNotif = () => {
    setAllNotifSeen(state.token);
  };

  const handleDeleteAllNotif = () => {
    deleteAllNotif(state.token);
  };

  const Logout = async () => {
    await logoutAction(state.id, dispatch);
  };
  const handleMenuClick = (key) => {
    setItemClicked(key);
    if (key === 4) setshowDrawer(true);
    else history.push(["", "/home", "/chat", "/profile", "", "/settings"][key]);
  };

  return (
    <div>
      <Menu style={{ background: "#f5f1f1" }}>
        <div
          id="sidebar-active"
          style={{
            display:
              location.pathname === "/home" && showDrawer === false
                ? "block"
                : "none",
          }}></div>
        <Menu.Item
          key="1"
          icon={<HomeOutlined />}
          onClick={() => handleMenuClick(1)}>
          HOME
        </Menu.Item>
        <div
          id="sidebar-active"
          style={{
            display:
              location.pathname === "/chat" && showDrawer === false
                ? "block"
                : "none",
          }}></div>
        <Menu.Item
          key="2"
          icon={<MessageOutlined />}
          onClick={() => handleMenuClick(2)}>
          CHAT
          <Badge
            className="badge"
            // count={1000}
            // overflowCount={999}
            offset={[88, -5]}></Badge>
        </Menu.Item>
        <div
          id="sidebar-active"
          style={{
            display:
              location.pathname === "/profile" && showDrawer === false
                ? "block"
                : "none",
          }}></div>
        <Menu.Item
          key="3"
          icon={<UserOutlined />}
          onClick={() => handleMenuClick(3)}>
          PROFILE
        </Menu.Item>
        <div
          id=""
          style={{
            display:
              itemClicked === 4 && showDrawer === true ? "block" : "none",
          }}></div>
        <Menu.Item
          key="4"
          icon={
            // <Badge dot offset={[-13, 4]}>
            <BellOutlined />
            /* </Badge> */
          }
          onClick={() => handleMenuClick(4)}>
          NOTIFICATION
          <Badge
            className="badge"
            count={countUnread}
            offset={[20, -5]}></Badge>
        </Menu.Item>
        <div
          id="sidebar-active"
          style={{
            display:
              location.pathname === "/settings" && showDrawer === false
                ? "block"
                : "none",
          }}></div>
        <Menu.Item
          key="5"
          icon={<SettingOutlined />}
          onClick={() => handleMenuClick(5)}>
          SETTINGS
        </Menu.Item>

        <Menu.Item
          id="logout-menu"
          icon={<PoweroffOutlined />}
          onClick={Logout}>
          <Link to="/" type="text" style={{ fontSize: "1rem" }}>
            LOGOUT
          </Link>
        </Menu.Item>
      </Menu>
      <Drawer
        title="NOTIFICATION"
        placement="left"
        onClose={() => setshowDrawer(false)}
        visible={showDrawer}>
        <Row>
          <Col span={12}>
            <Button
              style={{
                fontSize: "0.6em",
                boxShadow: "0px 4px 9px rgb(42 139 242 / 20%)",
                marginLeft: "5px",
                width: "153px",
                height: "50px",
              }}
              onClick={() => handleReadAllNotif()}>
              See All
            </Button>
          </Col>
          <Col span={12}>
            <Button
              style={{
                fontSize: "0.6em",
                boxShadow: "0px 4px 9px rgb(42 139 242 / 20%)",
                width: "153px",
                height: "50px",
              }}
              onClick={() => handleDeleteAllNotif()}>
              Delete All
            </Button>
          </Col>
        </Row>

        <List
          dataSource={Notifs}
          renderItem={(item) => (
            <Row
              style={{
                boxShadow: "0px 4px 9px rgb(42 139 242 / 20%)",
                marginTop: "10px",
              }}>
              <Col span={20}>
                <List.Item
                  key={item.id}
                  style={
                    item.seen
                      ? {
                          backgroundColor: "white",
                          cursor: "pointer",
                          padding: "10px",
                        }
                      : {
                          backgroundColor: "#fff1f0",
                          cursor: "pointer",
                          padding: "10px",
                        }
                  }
                  onClick={() => {
                    handleClickNotif(item.id, item.username);
                  }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={"http://localhost:3001/api/" + item.profile}
                      />
                    }
                    title={
                      // eslint-disable-next-line
                      <span>
                        {item.firstname} {item.lastname}
                      </span>
                    }
                    description={item.content}
                  />
                  <span
                    style={{
                      fontSize: "10px",
                      color: "gray",
                    }}>
                    {moment(item.createdAt).from(Date.now())}
                  </span>
                </List.Item>
              </Col>
              <Col
                span={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <DeleteTwoTone
                  twoToneColor="red"
                  style={{ fontSize: "1rem", marginRight: "10px" }}
                  onClick={() => {
                    handleDeleteNotif(item.id);
                  }}
                />
              </Col>
            </Row>
          )}></List>
      </Drawer>
    </div>
  );
};

export default SideBar;
