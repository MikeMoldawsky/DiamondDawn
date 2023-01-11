import React, { useEffect, useState } from "react";
import map from "lodash/map";
import max from "lodash/max";
import useDDContract from "hooks/useDDContract";
import { useDispatch, useSelector } from "react-redux";
import {
  loadMaxEntrance,
  loadMintPrice,
  loadTotalSupply,
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
import { isNoContractMode, showError } from "utils";
import MintKeyView from "components/MintKey/MintKeyView";
import { ACTION_KEYS, SYSTEM_STAGE } from "consts";
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
import useSound from "use-sound";
import mintOpenSFX from "assets/audio/mint-open.mp3";

const MintKey = () => {
  const {
    mintPrice,
    maxEntrance,
    tokensMinted,
    systemStage,
    isActive,
    isMintOpen,
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
  const [playMintOpenSFX] = useSound(mintOpenSFX, {
    volume: 1,
    interrupt: false,
  });
  const [canMintOnMount] = useState(canMint);

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

  useEffect(() => {
    if (canMint && !canMintOnMount) {
      playMintOpenSFX();
    }
  }, [canMint, canMintOnMount]);

  usePollingEffect(
    () => {
      dispatch(loadTotalSupply(contract));
    },
    [],
    {
      interval: 3_000,
      stopPolling: !canMint,
    }
  );

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
      tokensMinted={canMint ? tokensMinted : 0}
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
