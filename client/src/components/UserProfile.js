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
  Card,
  Statistic,
  Modal,
  List,
} from "antd";
import {
  EnvironmentOutlined,
  ManOutlined,
  WomanOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import { Context } from "../Contexts/Context";

const UserProfile = () => {
  const { state } = useContext(Context);
  let history = useHistory();
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
    views: 0,
    followers: 0,
    following: 0,
    status: "",
  });
  const [isModalVisible, setisModalVisible] = useState(false);
  const [modalName, setmodalName] = useState("");
  const [modalList, setmodalList] = useState([]);

  let response = null;

  const getConnectedUser = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.token}`,
      },
    };
    response = await axios.get(
      "http://localhost:3001/api/users/find/profile",
      config
    );
  };

  // eslint-disable-next-line
  useEffect(async () => {
    let userData;

    await getConnectedUser();

    if (response.status === 200) {
      userData = response.data;

      setUser({
        ...user,
        profile: userData.images?.map((i) => {
          return i.profile === 1 ? i.url : null;
        })[0],

        // eslint-disable-next-line
        images: userData.images.filter((i) => {
          if (i.profile === 0) return i;
        }),
        id: userData.id,
        firstname: userData.firstname,
        lastname: userData.lastname,
        username: userData.username,
        tags: userData.tags,
        gender: userData.gender,
        looking: userData.looking,
        bio: userData.bio,
        fame: userData.fame,
        lat: userData.lat,
        lang: userData.lang,
        country: userData.country,
        city: userData.city,
        age: userData.age,
        views: userData.views,
        followers: userData.followers,
        following: userData.following,
        status: userData.status,
      });
    } else if (response.status === 400) {
      history.push("/undefined");
    } else {
      history.push("/404");
    }
    return () => {
      setUser({});
    };

    // eslint-disable-next-line
  }, []);

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
    if (response.data.success) {
      return response.data;
    } else {
      return false;
    }
  };

  const handleCancelModal = () => {
    setisModalVisible(false);
  };

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
              <Col xs={24} lg={7} md={12}>
                <Card
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    borderRadius: "8px",
                    width: "100%",
                  }}
                  onClick={() => openModal(`viewers`)}>
                  <span style={{ color: "#a8a8a8", fontSize: "12px" }}>
                    Views
                  </span>
                  <Statistic
                    value={user.views}
                    valueStyle={{ color: "#d9374b", fontSize: "16px" }}
                  />
                </Card>
              </Col>

              <Col xs={24} lg={7} md={12}>
                <Card
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    borderRadius: "8px",
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
              <Col xs={24} lg={7} md={16}>
                <Card
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
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
            {user.tags.map((tag, index) => (
              <Tag key={index}>{tag.name}</Tag>
            ))}
          </div>
        </div>
      </Col>
      <Col xs={24} md={13} span={16}>
        <div id="main-container">
          <div id="name-div">
            <span id="fullname">{`${user.firstname} ${user.lastname}`}</span>
            <Button
              id="edit-button"
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => history.push("/settings")}
            />
          </div>
          <Divider />
          <div>
            <span id="description-title">Description</span>
            <p>{user.bio}</p>
          </div>
          <div>
            <span id="pictures-title">Pictures</span>
            <div id="profile-pictures">
              {user.images.map((img, index) => (
                <Image
                  key={index}
                  src={"http://localhost:3001/api/" + img?.url}
                  style={{ borderRadius: "8px" }}></Image>
              ))}
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default UserProfile;
