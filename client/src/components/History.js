import React, { useState, useEffect, useContext } from "react";
import { List, Avatar, Spin, Tag } from "antd";
import { Context } from "../Contexts/Context";
import { historyAction } from "../actions/editActions";
import { EnvironmentOutlined } from "@ant-design/icons";

export const History = () => {
  const { state } = useContext(Context);
  const [Historique, setHistorique] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await historyAction(state.token);

      if (res.success) {
        await setHistorique(res.data);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <List
        dataSource={Historique}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              avatar={
                <Avatar src={"http://localhost:3001/api/" + item.profile} />
              }
              title={
                // eslint-disable-next-line
                <a href="">
                  {item.firstname} {item.lastname}
                </a>
              }
              description={item.age + " y.o"}
            />
            <div id="location">
              <Tag
                icon={<EnvironmentOutlined />}
              >{`${item.city}, ${item.country}`}</Tag>
            </div>
          </List.Item>
        )}
      >
        {Historique.loading && Historique.hasMore && (
          <div className="demo-loading-container">
            <Spin />
          </div>
        )}
      </List>
    </>
  );
};
