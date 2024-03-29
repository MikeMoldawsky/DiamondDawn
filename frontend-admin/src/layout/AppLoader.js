import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import useDDContract from "hooks/useDDContract";
import {
  loadConfig,
  loadDiamondCount,
  loadMaxDiamonds,
  loadSystemPaused,
  loadSystemStage,
  watchMintedAddresses,
} from "store/systemReducer";
import { CONTRACTS } from "consts";
import { isNoContractMode } from "utils";
import ContractProvider from "./ContractProvider";
import _ from "lodash";
import { useProvider } from "wagmi";

const ServerAppLoader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadConfig());
  }, []);

  return null;
};

const ChainAppLoader = () => {
  const contract = useDDContract();
  const mineContract = useDDContract(CONTRACTS.DiamondDawnMine);
  const provider = useProvider();

  const dispatch = useDispatch();

  const contractReady = !_.isNil(contract) && !_.isNil(mineContract);

  useEffect(() => {
    if (contractReady) {
      dispatch(loadSystemStage(contract));
      dispatch(loadSystemPaused(contract));
      dispatch(loadMaxDiamonds(mineContract));
      dispatch(loadDiamondCount(mineContract));
      dispatch(watchMintedAddresses(contract, provider));
    }
  }, [contractReady]);

  return null;
};

const AppLoader = ({ children }) => {
  return isNoContractMode() ? (
    <>
      <ServerAppLoader />
      {children}
    </>
  ) : (
    <>
      <ServerAppLoader />
      <ContractProvider>
        <ChainAppLoader />
        {children}
      </ContractProvider>
    </>
  );
};

export default AppLoader;
