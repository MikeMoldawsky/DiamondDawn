import React, { useEffect, useState } from "react";
import map from "lodash/map";
import max from "lodash/max";
import useDDContract from "hooks/useDDContract";
import { useDispatch, useSelector } from "react-redux";
import {
  loadMaxEntrance,
  loadMintPrice,
  systemSelector,
} from "store/systemReducer";
import {
  setTokenUri,
  tokensSelector,
  watchTokenMinedBy,
} from "store/tokensReducer";
import { useAccount, useProvider } from "wagmi";
import { forgeApi, getTokenUriApi } from "api/contractApi";
import { signMintApi } from "api/serverApi";
import { calcTokensMinted, isNoContractMode, showError } from "utils";
import MintKeyView from "components/MintKey/MintKeyView";
import { ACTION_KEYS, CONTRACTS, SYSTEM_STAGE } from "consts";
import {
  collectorSelector,
  loadCollectorByAddress,
  openMintWindow,
  updateCollector,
} from "store/collectorReducer";
import useActionDispatch from "hooks/useActionDispatch";
import {
  setSelectedTokenId,
  setShouldIgnoreTokenTransferWatch,
  uiSelector,
} from "store/uiReducer";
import Loading from "components/Loading";
import usePollingEffect from "hooks/usePollingEffect";

const MintKey = () => {
  const {
    mintPrice,
    maxEntrance,
    tokensMinted,
    systemStage,
    isActive,
    isMintOpen,
    config,
  } = useSelector(systemSelector);
  const account = useAccount();
  const contract = useDDContract();
  const dispatch = useDispatch();
  const actionDispatch = useActionDispatch();
  const tokens = useSelector(tokensSelector);
  const collector = useSelector(collectorSelector);
  const provider = useProvider();
  const [isMinting, setIsMinting] = useState(false);
  const [isForging, setIsForging] = useState(false);
  const { geoLocation } = useSelector(uiSelector);

  const maxTokenId = max(map(tokens, "id"));
  const canMint = systemStage === SYSTEM_STAGE.KEY && isActive && isMintOpen;

  const mint = async (numNfts) => {
    if (geoLocation?.blocked || !canMint) return;

    setIsMinting(true);
    const { signature } = await signMintApi(collector._id, account.address);
    dispatch(setShouldIgnoreTokenTransferWatch(true));
    const tx = await forgeApi(
      contract,
      geoLocation?.vat,
      numNfts,
      mintPrice.mul(numNfts),
      signature
    );
    setIsForging(true);
    return await tx.wait();
  };

  const onMintSuccess = async (tokenId) => {
    dispatch(setShouldIgnoreTokenTransferWatch(false));
    try {
      const tokenUri = await getTokenUriApi(contract, tokenId);
      dispatch(setTokenUri(tokenId, tokenUri));
      dispatch(setSelectedTokenId(tokenId, true));
      setIsMinting(false);
      dispatch(updateCollector({ minted: true }));
    } catch (e) {
      showError(e);
    }
  };

  useEffect(() => {
    dispatch(loadMintPrice(contract, geoLocation));
    dispatch(loadMaxEntrance(contract));

    const unwatch = watchTokenMinedBy(
      contract,
      provider,
      account.address,
      maxTokenId,
      onMintSuccess
    );

    return () => {
      unwatch();
    };
  }, []);

  const [offset, setOffset] = useState(config.offset);
  usePollingEffect(
    () => {
      setOffset(calcTokensMinted(tokensMinted, config));
    },
    [],
    {
      interval: 10_000,
      stopPolling: !canMint,
    }
  );
  console.log({ offset, canMint });

  useEffect(() => {
    if (canMint && collector?.approved && !collector?.mintWindowStart) {
      dispatch(openMintWindow(collector._id, account.address));
    }
  }, [canMint, collector?.approved, collector?.mintWindowStart]);

  const onMintWindowClose = () => {
    actionDispatch(
      loadCollectorByAddress(account.address, contract),
      ACTION_KEYS.GET_COLLECTOR_BY_ADDRESS
    );
  };

  if (!collector || collector.minted || collector.mintClosed) return null;

  if (isForging) return <Loading />;

  return (
    <MintKeyView
      mintPrice={mintPrice}
      maxEntrance={maxEntrance}
      tokensMinted={canMint ? offset : 0}
      canMint={canMint}
      mint={mint}
      expiresAt={collector.mintWindowClose}
      onMintWindowClose={onMintWindowClose}
      forceButtonLoading={isMinting}
      onMintError={() => {
        setIsMinting(false);
        setIsForging(false);
      }}
    />
  );
};

export default isNoContractMode() ? MintKeyView : MintKey;
