import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../assets/css/Profile.less";
import {
  Row,
  Col,
  Avatar,
  Progress,
  Tag,
  Tooltip,
  Button,
  Image,
  Divider,
  Dropdown,
  Menu,
  Card,
  Statistic,
  Modal,
  List,
  message,
} from "antd";
import {
  EnvironmentOutlined,
  ManOutlined,
  WomanOutlined,
  WarningTwoTone,
  StopOutlined,
  ReloadOutlined,
  DislikeOutlined,
  LikeOutlined,
} from "@ant-design/icons";

import { Link } from "react-router-dom";
import { Context } from "../Contexts/Context";
import { openMessageError, openMessageSuccess } from "../helper/Verifications";
import {
  blockAction,
  unBlockAction,
  ReportAction,
  LikeAction,
  UnLikeAction,
} from "../actions/editActions";
import moment from "moment";
import { socketConn as socket } from "../sockets";

const UserInfo = (props) => {
  const { state } = useContext(Context);
  const [status, setStatus] = useState({
    online: false,
    status: "",
  });

  const [user, setUser] = useState({
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    gender: "",
    looking: "",
    birthday: "",
    age: "",
    bio: "",
    tags: [],
    lang: "",
    lat: "",
    country: "",
    city: "",
    images: [],
    profile: "",
    followers: "",
    following: "",
    blocked: false,
    liked: false,
  });
  const [isModalVisible, setisModalVisible] = useState(false);
  const [modalName, setmodalName] = useState("");
  const [modalList, setmodalList] = useState([]);
  const getUser = async (username) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
    };

    try {
      const res = await axios.get(
        "http://localhost:3001/api/users/find/user/username/" + username,
        config
      );
      return res.status === 200 ? res.data : false;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const loaduser = async () => {
      const res = await getUser(props.data.username);

      if (res) {
        setUser({
          ...user,
          profile: res.images.map((i) => {
            return i.profile === 1 ? i.url : null;
          })[0],
          // eslint-disable-next-line
          images: res.images.filter((i) => {
            if (i.profile === 0) return i;
          }),
          id: res.id,
          firstname: res.firstname,
          lastname: res.lastname,
          username: res.username,
          tags: res.tags,
          gender: res.gender,
          looking: res.looking,
          bio: res.bio,
          fame: res.fame,
          lat: res.lat,
          lang: res.lang,
          country: res.country,
          city: res.city,
          age: res.age,
          followers: res.followers,
          following: res.following,
          blocked: res.blocked,
          liked: res.liked,
        });
        socket.emit("isOnline", { userid: res.id });
      } else {
        openMessageError("Failed to load user informations !");
      }
    };
    loaduser();
    return () => {
      setUser({});
    };

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user.id) {
      socket.on(user.id + "-online-status", (data) => {
        setStatus({
          online: data.online,
          status: data.status,
        });
      });
    }
    // eslint-disable-next-line
  });

  //* HANDLE LIKE
  const handlLikeUser = async (connid, id) => {
    const res = await LikeAction(state.token, id);
    message.loading("Loading...", 2);
    if (res.success) {
      socket.emit("notify", {
        type: "like",
        visitor: connid,
        visited: id,
      });
      setUser({ ...user, liked: true });
      openMessageSuccess(res.message);
    } else {
      openMessageError(res.error);
    }
  };
  //* HANDLE UNLIKE
  const handlUnLikeUser = async (connid, id) => {
    const res = await UnLikeAction(state.token, id);

    message.loading("Loading...", 2);
    if (res.success) {
      socket.emit("notify", {
        type: "unlike",
        visitor: connid,
        visited: id,
      });
      setUser({ ...user, liked: false });
      openMessageSuccess(res.message);
    } else {
      openMessageError(res.error);
    }
  };

  //* HANDLE REPORT
  const handlReportUser = async (id) => {
    const res = await ReportAction(state.token, id);

    message.loading("Loading...", 2);
    if (res.success) {
      socket.emit("report", { reported: id });
      openMessageSuccess(res.message);
    } else {
      openMessageError(res.error);
    }
  };

  //* HANDLE BLOCK
  const handlBlockUser = async (id) => {
    const res = await blockAction(state.token, id);

    message.loading("Loading...", 2);
    if (res.success) {
      setUser({ ...user, blocked: true });
      openMessageSuccess(res.message);
    } else {
      openMessageError(res.error);
    }
  };
  //* HANDLE UNBLOCK
  const handlUnBlockUser = async (id) => {
    const res = await unBlockAction(state.token, id);

    message.loading("Loading...", 2);
    if (res.success) {
      openMessageSuccess(res.message);
      setUser({ ...user, blocked: false });
    } else {
      openMessageError(res.error);
    }
  };

  const openModal = async (name) => {
    let data;

    setmodalName(name);
    if ((data = await getModalData(name))) {
      setmodalList(data.data);
    }
    setisModalVisible(true);
  };

  const getModalData = async (name) => {
    let response;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
    };

    // eslint-disable-next-line
    switch (name) {
      case "viewers":
        response = await axios.get(
          "http://localhost:3001/api/history/user/viewers",
          config
        );
        break;
      case "following":
        response = await axios.get(
          "http://localhost:3001/api/history/user/following/" + user.id,
          config
        );
        break;
      case "followers":
        response = await axios.get(
          "http://localhost:3001/api/history/user/followers/" + user.id,
          config
        );
        break;
    }
    if (response?.data.success) {
      return response?.data;
    } else {
      return false;
    }
  };

  const handleCancelModal = () => {
    setisModalVisible(false);
  };
  const menu = (
    <Menu>
      <Menu.Item onClick={() => handlReportUser(user.id)}>
        It's a fake account
      </Menu.Item>
    </Menu>
  );

  return (
    <Row>
      <Col xs={24} md={11} span={8}>
        <div id="side-container" style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Avatar
              id="profile-picture"
              size={150}
              src={
                user.profile ? "http://localhost:3001/api/" + user.profile : ""
              }
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px",
            }}>
            <h3 style={{ fontSize: "15px", fontWeight: "bolder" }}>
              {user.username}
            </h3>
          </div>
          <div>
            <Row
              gutter={16}
              style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-around",
              }}>
              <Col xs={24} md={11}>
                <Card
                  style={{
                    textAlign: "center",
                    cursor: "pointer",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                  onClick={() => openModal(`followers`)}>
                  <span style={{ color: "#a8a8a8", fontSize: "12px" }}>
                    Followers
                  </span>
                  <Statistic
                    value={user.followers}
                    valueStyle={{ color: "#d9374b", fontSize: "16px" }}
                  />
                </Card>
              </Col>
              <Col xs={24} md={11}>
                <Card
                  style={{
                    textAlign: "center",
                    cursor: "pointer",
                    borderRadius: "8px",
                  }}
                  onClick={() => openModal(`following`)}>
                  <span style={{ color: "#a8a8a8", fontSize: "12px" }}>
                    Following
                  </span>
                  <Statistic
                    value={user.following}
                    valueStyle={{ color: "#d9374b", fontSize: "16px" }}
                  />
                </Card>
              </Col>
            </Row>
            <Modal
              title={modalName}
              footer={null}
              visible={isModalVisible}
              onCancel={handleCancelModal}>
              {modalList.length ? (
                <List
                  itemLayout="horizontal"
                  dataSource={modalList}
                  renderItem={(item) => (
                    <List.Item>
                      {item ? (
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              size={50}
                              src={"http://localhost:3001/api/" + item.profile}
                            />
                          }
                          title={
                            <>
                              {item.gender === "male" ? (
                                <ManOutlined style={{ marginRight: "5px" }} />
                              ) : (
                                <WomanOutlined style={{ marginRight: "5px" }} />
                              )}
                              <Link to={`/profile/${item.username}`}>
                                {item.firstname} {item.lastname}
                              </Link>
                              <span>, {item.age}</span>
                            </>
                          }
                          description={
                            <Tooltip title={`${item.fame}% Popularity`}>
                              <Progress
                                strokeColor={{
                                  "0%": "#d3ea13",
                                  "100%": "#68d083",
                                }}
                                percent={item.fame}
                                showInfo={false}></Progress>
                            </Tooltip>
                          }
                        />
                      ) : (
                        ""
                      )}
                    </List.Item>
                  )}
                />
              ) : (
                "No users"
              )}
            </Modal>
          </div>

          <div id="popularity">
            <Tooltip title={`${user.fame}% Popularity`}>
              <Progress
                strokeColor={{
                  "0%": "#d3ea13",
                  "100%": "#68d083",
                }}
                percent={user.fame}
                showInfo={false}></Progress>
            </Tooltip>
          </div>
          <div id="location">
            <Tag
              icon={
                <EnvironmentOutlined />
              }>{`${user.city}, ${user.country}`}</Tag>
          </div>
          <div id="gender-interest">
            <Tag
              id="gender"
              icon={
                user.gender === "male" ? (
                  <ManOutlined />
                ) : user.gender === "female" ? (
                  <WomanOutlined />
                ) : (
                  "🏳️‍🌈"
                )
              }
              color="#55acee">
              {user.gender}
            </Tag>
            <p>Looking for</p>
            <Tag
              id="Interest"
              icon={
                user.looking === "male" ? (
                  <ManOutlined />
                ) : user.looking === "female" ? (
                  <WomanOutlined />
                ) : (
                  "🏳️‍🌈"
                )
              }
              color="#ff69b4">
              {user.looking}
            </Tag>
          </div>
          <div id="tags">
            {user.tags?.map((tag, index) => (
              <Tag key={index}>{tag.name}</Tag>
            ))}
          </div>
        </div>
      </Col>
      <Col xs={24} md={13} span={16}>
        <div id="main-container">
          <div id="name-div">
            <span id="fullname">{`${user.firstname} ${user.lastname}`}</span>
            <span
              id="online-dot"
              style={
                status.online
                  ? { backgroundColor: "green" }
                  : { backgroundColor: "#bfc1bf" }
              }></span>
            <span id="online-status">
              {status.online
                ? "Online"
                : "Active " + moment(status.status).fromNow()}
            </span>
            <div style={{ marginLeft: "auto" }}>
              <Button
                shape="circle"
                style={{
                  marginRight: "5px",
                  borderColor: "#d9374b",
                }}>
                {user.liked ? (
                  <DislikeOutlined
                    twoToneColor="#d9374b"
                    onClick={() => handlUnLikeUser(state.id, user.id)}
                  />
                ) : (
                  <LikeOutlined
                    twoToneColor="#d9374b"
                    onClick={() => handlLikeUser(state.id, user.id)}
                  />
                )}
              </Button>
              <Dropdown overlay={menu}>
                <Button
                  shape="circle"
                  style={{
                    marginRight: "5px",
                    borderColor: "#d9374b",
                  }}
                  onClick={(e) => e.preventDefault()}>
                  <WarningTwoTone twoToneColor="#d9374b" />
                </Button>
              </Dropdown>

              <Button
                shape="circle"
                style={{
                  marginRight: "5px",
                  borderColor: "#d9374b",
                }}>
                {user.blocked === true ? (
                  <ReloadOutlined
                    twoToneColor="#d9374b"
                    onClick={() => handlUnBlockUser(user.id)}
                  />
                ) : (
                  <StopOutlined onClick={() => handlBlockUser(user.id)} />
                )}
              </Button>
            </div>
          </div>
          <Divider />
          <div>
            <span id="description-title">Description</span>
            <p>{user.bio}</p>
          </div>
          <div>
            <span id="pictures-title">Pictures</span>
            <div id="profile-pictures">
              {user.images?.map((img, index) => (
                <Image
                  key={index}
                  src={img?.url}
                  style={{ borderRadius: "8px" }}></Image>
              ))}
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default UserInfo;
