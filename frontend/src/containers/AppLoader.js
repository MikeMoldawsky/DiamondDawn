import React from "react";
import { useEffect } from "react";
import { useProvider } from "wagmi";
import { useDispatch } from "react-redux";
import useActionDispatch from "hooks/useActionDispatch";
import useDDContract from "hooks/useDDContract";
import { loadConfig, loadSystemStage } from "store/systemReducer";
import { EVENTS } from "consts";
import useOnConnect from "hooks/useOnConnect";
import { readAndWatchAccountTokens, clearTokens } from "store/tokensReducer";
import { clearActionStatus } from "store/actionStatusReducer";
import { loadCollectorByAddress } from "store/collectorReducer";
import {isBlockedCountry, isNoContractMode} from "utils";
import ContractProvider from "containers/ContractProvider";
import { getGeoLocationApi } from "api/externalApi";
import { updateUiState } from "store/uiReducer";

const ServerAppLoader = () => {
  const dispatch = useDispatch();
  const actionDispatch = useActionDispatch();

  const getGeoLocation = async () => {
    try {
      const geoLocation = await getGeoLocationApi();
      dispatch(updateUiState({
        geoLocation: {
          ...geoLocation,
          blocked: isBlockedCountry(geoLocation.country_code)
        }
      }))
    } catch (e) {
      // do nothing
    }
  };

  useEffect(() => {
    getGeoLocation();
    dispatch(loadConfig());
  }, []);

  useOnConnect(
    (address) => {
      actionDispatch(
        loadCollectorByAddress(address),
        "get-collector-by-address"
      );
    },
    () => {
      dispatch({ type: "RESET_STATE" });
    }
  );

  return null;
};

const ChainAppLoader = () => {
  const provider = useProvider();
  const dispatch = useDispatch();
  const actionDispatch = useActionDispatch();
  const contract = useDDContract();

  useEffect(() => {
    dispatch(loadSystemStage(contract));

    provider.once("block", () => {
      contract.on(EVENTS.StageChanged, (_stage) => {
        console.log("EVENT StageChanged fired", { _stage });
        dispatch(loadSystemStage(contract));
        setTimeout(() => dispatch(loadConfig()), 5000);
      });
    });

    return () => {
      contract.removeAllListeners();
    };
  }, []);

  useOnConnect(
    (address) => {
      dispatch(clearTokens());
      dispatch(
        readAndWatchAccountTokens(actionDispatch, contract, provider, address)
      );
    },
    () => {
      dispatch(clearActionStatus("load-nfts"));
    }
  );

  return null;
};

export default isNoContractMode()
  ? ServerAppLoader
  : () => (
      <>
        <ServerAppLoader />
        <ContractProvider>
          <ChainAppLoader />
        </ContractProvider>
      </>
    );
