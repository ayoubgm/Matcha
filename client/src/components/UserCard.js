import React, { useContext, useState, useEffect } from "react";
import { Card, Tooltip, Progress, Tag } from "antd";
import { EnvironmentTwoTone, UserOutlined } from "@ant-design/icons";
import Avatar from "antd/lib/avatar/avatar";
import { useHistory } from "react-router-dom";
import { Context } from "../Contexts/Context";
import { socketConn as socket } from "../sockets";

export const UserCard = (props) => {
  let history = useHistory();
  const { state } = useContext(Context);
  const [visitor, setVisitor] = useState("");

  useEffect(() => {
    setVisitor(state.id);
    return () => {
      setVisitor("");
    };
    // eslint-disable-next-line
  }, [state.id]);

  const handleUserClicked = (username) => {
    // setTimeout(() => {
    // Emit view event
    socket.emit("notify", {
      type: "view",
      visitor: visitor,
      visited: props.data.id,
    });
    history.push("/profile/" + username);
    // }, 1500);
  };

  return (
    <Card
      onClick={() => handleUserClicked(props.data.username)}
      hoverable
      style={{
        borderRadius: "15px",
        height: "100%",
      }}
      cover={
        props.data.profile ? (
          <img
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "15px 15px 0 0",
            }}
            alt="example"
            src={"http://localhost:3001/api/" + props.data.profile}
          />
        ) : (
          <Avatar size={280} icon={<UserOutlined />} />
        )
      }
    >
      <h3>
        {props.data.firstname} {props.data.lastname}
      </h3>
      <span> {props.data.age} years old</span>
      <div>
        <Tooltip title={props.data.fame + "%"}>
          <Progress
            strokeColor={{
              "0%": "#d3ea13",
              "100%": "#68d083",
            }}
            percent={props.data.fame}
            showInfo={false}
          ></Progress>
        </Tooltip>
      </div>
      <EnvironmentTwoTone style={{ marginRight: "3px" }} />
      <h3
        style={{
          display: "inline-block",
          fontSize: "0.8rem",
          marginTop: "10px",
        }}
      >
        {props.data.distance} km from you
      </h3>
      <div
        id="tags"
        style={{
          padding: "15px",
        }}
      >
        {props.data?.tags.map((tag, index) => (
          <Tag
            style={{
              borderRadius: "15px",
              width: "auto",
              textAlign: "center",
            }}
            key={index}
          >
            {tag.name}
          </Tag>
        ))}
      </div>
    </Card>
  );
};
