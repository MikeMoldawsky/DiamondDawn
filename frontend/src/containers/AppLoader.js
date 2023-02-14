import React from "react";
import { useEffect } from "react";
import { useProvider } from "wagmi";
import { useDispatch } from "react-redux";
import useActionDispatch from "hooks/useActionDispatch";
import useDDContract from "hooks/useDDContract";
import { loadConfig, loadPhases } from "store/systemReducer";
import { ACTION_KEYS, EVENTS } from "consts";
import useOnConnect from "hooks/useOnConnect";
import { readAndWatchAccountTokens, clearTokens } from "store/tokensReducer";
import { clearActionStatus } from "store/actionStatusReducer";
import { isBlockedCountry, isNoContractMode, isVATCountry } from "utils";
import { getGeoLocationApi } from "api/externalApi";
import { setSelectedTokenId, updateUiState } from "store/uiReducer";
import CollectorLoader from "containers/CollectorLoader";
import ContractProvider from "containers/ContractProvider";
// import usePollingEffect from "hooks/usePollingEffect";

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

  return null;
  // return (
  //   <CollectorLoader
  //     onDisconnect={() => {
  //       dispatch({ type: "RESET_STATE" });
  //     }}
  //   />
  // );
};

const ChainAppLoader = () => {
  const provider = useProvider();
  const dispatch = useDispatch();
  const actionDispatch = useActionDispatch();
  const contract = useDDContract();
  // const canMint = useSelector(isPhaseActiveSelector("mint"))

  useEffect(() => {
    dispatch(loadPhases(contract));
    // dispatch(loadIsMintOpen());

    // provider.once("block", () => {
    //   contract.on(EVENTS.StageChanged, (_stage) => {
    //     dispatch(loadPhases(contract));
    //     setTimeout(() => dispatch(loadConfig()), 5000);
    //   });
    // });

    return () => {
      contract.removeAllListeners();
    };
  }, []);

  // usePollingEffect(
  //   () => {
  //     dispatch(loadTotalSupply(contract));
  //   },
  //   [canMint],
  //   {
  //     interval: 60_000,
  //     stopPolling: !canMint,
  //   }
  // );

  useOnConnect(
    (address) => {
      dispatch(clearTokens());
      dispatch(
        readAndWatchAccountTokens(actionDispatch, contract, provider, address)
      );
    },
    () => {
      dispatch(clearActionStatus(ACTION_KEYS.LOAD_NFTS));
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
