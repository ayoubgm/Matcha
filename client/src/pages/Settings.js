import Layout from "../layout/default";
import "../assets/css/settings.less";
import { Tabs } from "antd";
import { General } from "../components/General";
import { Security } from "../components/Security";

import { History } from "../components/History";
import { Blacklist } from "../components/Blacklist";

const { TabPane } = Tabs;

const Settings = () => {
  return (
    <Layout>
      <div id="main-container">
        <Tabs defaultActiveKey="1">
          <TabPane tab="General" key="1">
            <General />
          </TabPane>
          <TabPane tab="Security" key="2">
            <Security />
          </TabPane>
          <TabPane tab="History" key="3">
            <History />
          </TabPane>
          <TabPane tab="Blacklist" key="4">
            <Blacklist />
          </TabPane>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
