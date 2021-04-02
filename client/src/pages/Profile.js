import React from "react";
import "../assets/css/Profile.less";
import Layout from "../layout/default";
import UserProfile from "../components/UserProfile";

const Profile = function (props) {
  return (
    <Layout>
      <UserProfile data={props.match.params} />
    </Layout>
  );
};

export default Profile;
