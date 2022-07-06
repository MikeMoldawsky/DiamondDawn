import React, { useEffect } from "react";
import "./App.scss";
import classNames from "classnames";
import Wallet from "pages/Wallet";
import Header from "components/Header";
import AdminPanel from 'components/AdminPanel'
import { useDispatch, useSelector } from "react-redux";
import { fetchPricing, systemSelector } from "store/systemReducer";
import Countdown from 'react-countdown';
import Mine from "./Mine";
import Cut from "./Cut";
import Polish from "./Polish";
import Burn from "./Burn";
import useDDContract from "hooks/useDDContract";

const stageByName = {
  0: 'Mine',
  1: 'Cut',
  2: 'Polish',
  3: 'Burn',
}

const CountdownView = ({ stage }) => {
  return (
    <div className="countdown-view">
      <div className="leading-text">{stageByName[stage]} opens in:</div>
      <div className="countdown">
        <Countdown date={Date.now() + 10000} />
      </div>
    </div>
  )
}

function App() {

  const { stage, isStageActive } = useSelector(systemSelector)

  const contract = useDDContract()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPricing(contract))
  }, [])

  const renderStage = () => {
    if (!isStageActive) {
      return (<CountdownView stage={stage} />)
    }
    switch (stage) {
      case 0:
        return <Mine />
      case 1:
        return <Cut />
      case 2:
        return <Polish />
      case 3:
        return <Burn />
      default:
        return null
    }
  }

  return (
    <div className={classNames("app")}>
      <Header>
        <Wallet />
      </Header>
      <main>{renderStage()}</main>
      <AdminPanel />
    </div>
  );
}

export default App;
