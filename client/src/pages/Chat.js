import Layout from "../layout/default";
import "../assets/css/Profile.less";
import { Row, Col, Card, Avatar, Divider, Collapse, Button, Input } from "antd";

import { ReceivedMsg } from "../components/ReceivedMsg";
import { SentMsg } from "../components/SentMsg";
import { SendOutlined } from "@ant-design/icons";
import { Context } from "../Contexts/Context";
import { matchingAction, msgAction } from "../actions/chatActions";
import { useContext, useEffect, useState } from "react";
import { socketConn as socket } from "../sockets";

const { Panel } = Collapse;
const Chat = () => {
  const { state } = useContext(Context);

  const [matchers, setMatchers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState({
    userid: null,
    chatid: null,
  });
  const [messageToSend, setMessageToSend] = useState("");

  const loadMessages = async () => {
    const res = await msgAction(state.token, activeChat.chatid);
    if (res) {
      setMessages(res.data);
    }
  };

  const openChat = (userid, chatid) => {
    setActiveChat({
      userid: userid,
      chatid: chatid,
    });

    loadMessages();
  };

  const handlTyping = (e) => {
    if (e.target.value !== "") {
      setMessageToSend(e.target.value);
      socket.emit("isTyping", { chatid: activeChat });
    }
  };

  const handleSendMsg = async () => {
    socket.emit("sendMessage", {
      message: messageToSend,
      sender: state.id,
      receiver: activeChat.userid,
      chat_id: activeChat.chatid,
    });
    setTimeout(() => {
      loadMessages();
    }, 500);
  };

  useEffect(() => {
    const Matchers = async () => {
      const res = await matchingAction(state.token);
      setMatchers(res.users);
    };
    Matchers();
    return () => {
      setMatchers([]);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on("newMessage", (data) => {
      setMessages([...messages, data.message]);
    });
  }, [messages]);

  return (
    <Layout>
      <Row justify="center">
        <Col lg={8} span={24} style={{ padding: "10px" }}>
          <Collapse
            defaultActiveKey={["0"]}
            accordion
            style={{ borderRadius: "15px", overflow: "auto" }}
          >
            <Panel header="Conversations :" key="0">
              <div
                style={{
                  padding: "0px",
                  height: "700px",
                  maxHeight: 700,
                  overflowY: "auto",
                  textAlign: "center",
                  borderRadius: "30px",
                }}
              >
                {matchers.map((item) => (
                  <Card
                    hoverable={true}
                    onClick={() => openChat(item.id, item.chatid)}
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      marginBottom: "15px",
                    }}
                  >
                    <Row align="middle">
                      <Avatar
                        src={"http://localhost:3001/api/" + item.profile}
                      />
                      <h3 style={{ marginBottom: "0px", marginLeft: "10px" }}>
                        {item.lastname}_{item.firstname}
                      </h3>
                    </Row>
                    <div></div>
                  </Card>
                ))}
              </div>
            </Panel>
          </Collapse>
        </Col>
        <Col lg={14} span={24} style={{ height: "800px", padding: "10px" }}>
          <Card
            style={{
              width: "100%",
              borderRadius: "15px",
              height: "100%",
            }}
          >
            <Divider />
            <Card
              style={{
                marginBottom: "15px",
                border: "none",
                maxHeight: 550,
                minHeight: 550,
                overflow: "scroll",
                overflowX: "hidden",
              }}
            >
              {messages.map((item) =>
                item.user_id === state.id ? (
                  <>
                    <SentMsg message={item} />
                  </>
                ) : (
                  <>
                    <ReceivedMsg message={item} />
                  </>
                )
              )}
            </Card>
            {activeChat.chatid !== null ? (
              <Row
                type="flex"
                style={{
                  alignItems: "center",
                  border: "1px solid #cdcd",
                  padding: "5px",
                  borderRadius: "15px",
                  width: "100%",
                }}
              >
                <Col xs={19} md={22} span={20}>
                  <Input
                    onChange={(e) => handlTyping(e)}
                    className="input-reply"
                    maxLength={100}
                    style={{
                      borderRadius: "13px",
                      height: "80px",
                      border: "none",
                      outline: "none",
                    }}
                    placeholder="Type a message here"
                  />
                </Col>
                <Col xs={4} md={2} span={2}>
                  <Button
                    type="primary"
                    shape="circle"
                    onClick={() => handleSendMsg()}
                    icon={<SendOutlined style={{ fontSize: "0.8rem" }} />}
                  />
                </Col>
              </Row>
            ) : (
              ""
            )}
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default Chat;
