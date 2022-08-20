import React, { useEffect } from "react";
import classNames from "classnames";
import "../App/App.scss";
import "./AdminPage.scss";
import InvitationsTab from "./InvitationsTab";
// import ControlTab from "./ControlTab";
import Tabs from "components/Tabs";
import Header from "components/Header/Header";
import Wallet from "components/Wallet";
import DiamondsTab from "./DiamondsTab";
// import ScheduleTab from "./ScheduleTab";
// import ArtTab from "pages/AdminPage/ArtTab";
import StageTab from "./StageTab";
import { CONTRACTS, SYSTEM_STAGE } from "consts";
import {
  loadDiamondCount,
  loadSchedule,
  loadSystemPaused,
  loadSystemStage,
} from "store/systemReducer";
import useDDContract from "hooks/useDDContract";
import { useDispatch } from "react-redux";
import _ from "lodash";

const TABS = [
  {
    title: "Invite",
    component: () => <StageTab stage={SYSTEM_STAGE.INVITATIONS} />,
  },
  {
    title: "Mine",
    component: () => <StageTab stage={SYSTEM_STAGE.MINE_OPEN} />,
  },
  { title: "Cut", component: () => <StageTab stage={SYSTEM_STAGE.CUT_OPEN} /> },
  {
    title: "Polish",
    component: () => <StageTab stage={SYSTEM_STAGE.POLISH_OPEN} />,
  },
  { title: "Ship", component: () => <StageTab stage={SYSTEM_STAGE.SHIP} /> },
  // { title: "Control", component: () => <ControlTab /> },
  // { title: "Art", component: () => <ArtTab /> },
  // { title: "Schedule", component: () => <ScheduleTab /> },
  { title: "Invitations", component: () => <InvitationsTab /> },
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
      dispatch(loadDiamondCount(mineContract));
      dispatch(loadSchedule());
    }
  }, [contractReady]);

  return (
    <div className={classNames("page admin-page")}>
      <Header>
        <Wallet />
      </Header>
      <main>
        <Tabs tabs={TABS} activeTab={5} />
      </main>
    </div>
  );
};

export default AdminPage;
