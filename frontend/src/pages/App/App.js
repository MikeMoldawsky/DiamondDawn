import React, { useEffect } from "react";
import "./App.scss";
import classNames from "classnames";
import Wallet from "pages/Wallet";
import Header from "components/Header";
import AdminPanel from 'components/AdminPanel'
import { useDispatch, useSelector } from "react-redux";
import { fetchPricing, fetchStage, systemSelector } from "store/systemReducer";
import Mine from "./Mine";
import Cut from "./Cut";
import Polish from "./Polish";
import Burn from "./Burn";
import useDDContract from "hooks/useDDContract";
import DiamondList from "components/DiamondList";

function App() {

  const { stage } = useSelector(systemSelector)

  const contract = useDDContract()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPricing(contract))
    dispatch(fetchStage(contract))
  }, [])

  const renderStage = () => {
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
        <DiamondList />
        <Wallet />
      </Header>
      <main>{stage !== -1 && renderStage()}</main>
      <AdminPanel />
    </div>
  );
}

export default App;
