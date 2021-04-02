import React from "react";
import "../assets/css/Profile.less";
import Layout from "../layout/default";
import UserInfo from "../components/UserInfo";

const Profile = function (props) {
  return (
    <Layout>
      <UserInfo data={props.match.params} />
    </Layout>
  );
};

export default Profile;
