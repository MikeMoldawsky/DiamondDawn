import React from "react";
import classNames from "classnames";
import "../App/App.scss";
import "./AdminPage.scss";
import CollectorsTab from "./CollectorsTab";
import InvitationsTab from "./InvitationsTab";
import Tabs from "components/Tabs";
import Header from "components/Header/Header";
import Wallet from "components/Wallet";
import DiamondsTab from "./DiamondsTab";
import StageTab from "./StageTab";
import ConfigTab from "pages/AdminPage/ConfigTab";
import { SYSTEM_STAGE } from "consts";
import _ from "lodash";
import { isNoContractMode } from "utils";

const TABS = [
  {
    title: "Key",
    requireContract: true,
    component: () => <StageTab stage={SYSTEM_STAGE.KEY} />,
  },
  {
    title: "Mine",
    requireContract: true,
    component: () => <StageTab stage={SYSTEM_STAGE.MINE} />,
  },
  {
    title: "Cut",
    requireContract: true,
    component: () => <StageTab stage={SYSTEM_STAGE.CUT} />,
  },
  {
    title: "Polish",
    requireContract: true,
    component: () => <StageTab stage={SYSTEM_STAGE.POLISH} />,
  },
  {
    title: "Dawn",
    requireContract: true,
    component: () => <StageTab stage={SYSTEM_STAGE.DAWN} />,
  },
  { title: "Config", component: () => <ConfigTab /> },
  { title: "Invitations", component: () => <InvitationsTab /> },
  {
    title: "Pending Approval",
    component: () => <CollectorsTab approved={false} />,
  },
  { title: "Collectors", component: () => <CollectorsTab approved={true} /> },
  { title: "Diamonds", component: () => <DiamondsTab /> },
];

const AdminPage = () => {
  const tabs = isNoContractMode()
    ? _.filter(TABS, (t) => !t.requireContract)
    : TABS;

  return (
    <div className={classNames("page admin-page")}>
      <Header>
        <Wallet />
      </Header>
      <main>
        <Tabs tabs={tabs} activeTab={0} />
      </main>
    </div>
  );
};

export default AdminPage;
