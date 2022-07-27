import React, { useEffect } from "react";
import Wallet from "components/Wallet";
import Header from "components/Header";
import { useDispatch } from "react-redux";
import { fetchPricing, fetchStage, fetchStagesConfig, setStage } from "store/systemReducer";
import useDDContract from "hooks/useDDContract";
import DiamondList from "components/DiamondList";
import ProgressBar from "components/ProgressBar";
import { loadAccountNfts } from "store/tokensReducer";
import { useAccount, useProvider } from "wagmi";
import useEffectWithAccount from "hooks/useEffectWithAccount";
import { EVENTS } from 'consts'
import ContractProvider from "layout/ContractProvider";
import WagmiWrapper from "layout/WagmiWrapper";

const AppInternal = ({ children }) => {
  const account = useAccount()
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
      contract.removeAllListeners()
    }
  }, [])

  useEffectWithAccount(() => {
    dispatch(loadAccountNfts(contract, provider, account?.address))
  })

  return (
    <main>{children}</main>
  )
}

const AppLayout = ({ children, showTimeline }) => {
  return (
    <WagmiWrapper>
      <div className="app">
        <Header>
          <ContractProvider>
            <DiamondList />
          </ContractProvider>
          <Wallet />
        </Header>
        <ContractProvider>
          <AppInternal>{children}</AppInternal>
        </ContractProvider>
        {showTimeline && (
          <footer>
            <ProgressBar />
          </footer>
        )}
      </div>
    </WagmiWrapper>
  );
}

export default AppLayout;
