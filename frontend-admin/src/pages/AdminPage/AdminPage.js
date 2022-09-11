import React, { useEffect } from "react";
import classNames from "classnames";
import "../App/App.scss";
import "./AdminPage.scss";
import InvitationsTab from "./InvitationsTab";
import Tabs from "components/Tabs";
import Header from "components/Header/Header";
import Wallet from "components/Wallet";
import PasswordsTab from "./PasswordsTab";
import DiamondsTab from "./DiamondsTab";
import StageTab from "./StageTab";
import ConfigTab from "pages/AdminPage/ConfigTab";
import { CONTRACTS, SYSTEM_STAGE } from "consts";
import {
  loadDiamondCount,
  loadMaxDiamonds,
  loadConfig,
  loadSystemPaused,
  loadSystemStage,
} from "store/systemReducer";
import useDDContract from "hooks/useDDContract";
import { useDispatch } from "react-redux";
import _ from "lodash";

const TABS = [
  {
    title: "Invite",
    component: () => <StageTab stage={SYSTEM_STAGE.INVITE} />,
  },
  {
    title: "Mine",
    component: () => <StageTab stage={SYSTEM_STAGE.MINE} />,
  },
  { title: "Cut", component: () => <StageTab stage={SYSTEM_STAGE.CUT} /> },
  {
    title: "Polish",
    component: () => <StageTab stage={SYSTEM_STAGE.POLISH} />,
  },
  { title: "Ship", component: () => <StageTab stage={SYSTEM_STAGE.SHIP} /> },
  { title: "Config", component: () => <ConfigTab /> },
  { title: "Invitations", component: () => <InvitationsTab /> },
  { title: "Passwords", component: () => <PasswordsTab /> },
  { title: "Diamonds", component: () => <DiamondsTab /> },
];

const AdminPage = () => {
  const contract = useDDContract();
  const mineContract = useDDContract(CONTRACTS.DiamondDawnMine);

  const dispatch = useDispatch();

  const contractReady = !_.isNil(contract) && !_.isNil(mineContract);

  useEffect(() => {
    if (contractReady) {
      dispatch(loadSystemStage(contract));
      dispatch(loadSystemPaused(contract));
      dispatch(loadMaxDiamonds(mineContract));
      dispatch(loadDiamondCount(mineContract));
    }
  }, [contractReady]);

  useEffect(() => {
    dispatch(loadConfig());
  }, [])

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
