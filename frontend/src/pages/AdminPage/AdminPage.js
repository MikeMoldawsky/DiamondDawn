import React from "react";
import classNames from "classnames";
import './AdminPage.scss'
import InvitationsTab from "./InvitationsTab";
import ControlTab from "./ControlTab";
import Tabs from "components/Tabs";
import Header from "components/Header/Header";
import Wallet from "pages/Wallet";
import DiamondsTab from "./DiamondsTab";

const TABS = [
  { title: 'Control', component: () => <ControlTab /> },
  { title: 'Invitations', component: () => <InvitationsTab /> },
  { title: 'Diamonds', component: () => <DiamondsTab /> },
]

const AdminPage = () => {
  return (
    <div className={classNames("page admin-page")}>
      <Header>
        <Wallet />
      </Header>
      <main>
        <Tabs tabs={TABS} activeTab={0} />
      </main>
    </div>
  );
};

export default AdminPage;
