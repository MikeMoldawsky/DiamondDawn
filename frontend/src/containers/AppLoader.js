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
import { isBlockedCountry, isNoContractMode, isVATCountry } from "utils";
import { getGeoLocationApi } from "api/externalApi";
import { setSelectedTokenId, updateUiState } from "store/uiReducer";
import CollectorLoader from "containers/CollectorLoader";
import ContractProvider from "containers/ContractProvider";

const ServerAppLoader = () => {
  const dispatch = useDispatch();

  const getGeoLocation = async () => {
    try {
      const geoLocation = await getGeoLocationApi();
      dispatch(
        updateUiState({
          geoLocation: {
            ...geoLocation,
            blocked: isBlockedCountry(geoLocation.country_code),
            vat: isVATCountry(geoLocation.country_code),
          },
        })
      );
    } catch (e) {
      // do nothing
    }
  };

  useEffect(() => {
    getGeoLocation();
    dispatch(loadConfig());
  }, []);

  return (
    <CollectorLoader
      onDisconnect={() => {
        dispatch({ type: "RESET_STATE" });
      }}
    />
  );
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
      dispatch(setSelectedTokenId(-1));
    }
  );

  return null;
};

export default () => (
  <>
    <ServerAppLoader />
    {!isNoContractMode() && (
      <ContractProvider>
        <ChainAppLoader />
      </ContractProvider>
    )}
  </>
);
