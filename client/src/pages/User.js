import React from "react";
import "../assets/css/Profile.less";
import Layout from "../layout/default";
import UserInfo from "../components/UserInfo";

const User = (props) => {
  return (
    <Layout>
      <UserInfo username={props.match.params.username} />
    </Layout>
  );
};

export default User;
