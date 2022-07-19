import React, { useEffect } from "react";
import classNames from "classnames";
import Wallet from "pages/Wallet";
import Header from "components/Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchPricing, fetchStage, fetchStagesConfig, setStage, systemSelector } from "store/systemReducer";
import Mine from "./Mine";
import Cut from "./Cut";
import Polish from "./Polish";
import Burn from "./Burn";
import useDDContract from "hooks/useDDContract";
import DiamondList from "components/DiamondList";
import ProgressBar from "components/ProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from "@fortawesome/free-solid-svg-icons";
import { loadAccountNfts } from "store/tokensReducer";
import { useAccount, useProvider } from "wagmi";
import useEffectWithAccount from "hooks/useEffectWithAccount";
import { EVENTS } from 'consts'

function App() {
  const { stage } = useSelector(systemSelector)
  const { data: account } = useAccount()
  const provider = useProvider();
  const dispatch = useDispatch()
  const contract = useDDContract()

  useEffect(() => {
    dispatch(fetchStage(contract))
    dispatch(fetchPricing(contract))
    dispatch(fetchStagesConfig())

    provider.once('block', () => {
      contract.on(EVENTS.StageChanged, (_stage, _isStageActive) => {
        dispatch(setStage(_stage, _isStageActive))
      })
    })

    return () => {
      contract .removeAllListeners()
    }
  }, [])

  useEffectWithAccount(() => {
    dispatch(loadAccountNfts(contract, provider, account?.address))
  })

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
      case 4:
        return (
          <div className="action-view">
            <div className="diamond-art">
              <FontAwesomeIcon icon={faGem} />
            </div>
            <div className="leading-text">SYSTEM IS COMPLETE AND CLOSED</div>
          </div>
        )
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
      <footer>
        <ProgressBar />
      </footer>
    </div>
  );
}

export default App;
