import React, { useState, useEffect, useContext } from "react";
import { List, Avatar, Spin, Button, message } from "antd";
import { blackListAction, unBlockAction } from "../actions/editActions";
import { Context } from "../Contexts/Context";
import { useHistory } from "react-router-dom";
import { openMessageSuccess, openMessageError } from "../helper/Verifications";
export const Blacklist = () => {
  const { state } = useContext(Context);
  const [blacklist, setBlacklist] = useState([]);
  let history = useHistory();

  const handleUserClicked = (username) => {
    history.push("/profile/" + username);
  };
  const handlUnBlockUser = async (id) => {
    const res = await unBlockAction(state.token, id);

    message.loading("Loading...", 2);
    if (res.success) {
      openMessageSuccess(res.message);
      setBlacklist(
        // eslint-disable-next-line
        blacklist.filter((item) => {
          if (item.id !== id) return item;
        })
      );
    } else {
      openMessageError(res.error);
    }
  };

  useEffect(() => {
    async function fetchBlacklist() {
      const response = await blackListAction(state.token);
      if (response.success) {
        await setBlacklist(response.data);
      }
    }
    fetchBlacklist();
  }, [state.token]);

  return (
    <>
      <List
        dataSource={blacklist}
        renderItem={(item) => (
          <List.Item style={{ display: "flex" }} key={item.id}>
            <List.Item.Meta
              style={{ flexBasis: "70%" }}
              avatar={
                <Avatar
                  src={"http://localhost:3001/api/" + item.profile}
                  onClick={() => handleUserClicked(item.username)}
                />
              }
              title={item.username}
              description={item.country + ", " + item.city}
            />
            <div>
              <Button
                onClick={() => handlUnBlockUser(item.id)}
                type="primary"
                style={{ fontSize: "0.6em", borderRadius: "4px" }}>
                Unblock
              </Button>
            </div>
          </List.Item>
        )}>
        {blacklist.loading && blacklist.hasMore && (
          <div className="demo-loading-container">
            <Spin />
          </div>
        )}
      </List>
    </>
  );
};
