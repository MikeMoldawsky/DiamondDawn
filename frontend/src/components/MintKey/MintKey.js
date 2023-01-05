import React, { useEffect, useState } from "react";
import map from "lodash/map";
import max from "lodash/max";
import useDDContract from "hooks/useDDContract";
import { useDispatch, useSelector } from "react-redux";
import {
  loadMaxEntrance,
  loadMinePrice,
  loadTokenCount,
  systemSelector,
} from "store/systemReducer";
import {
  setTokenUri,
  tokensSelector,
  watchTokenMinedBy,
} from "store/tokensReducer";
import { useAccount, useProvider } from "wagmi";
import { forgeApi, getTokenUriApi } from "api/contractApi";
import { confirmMintedApi, signMintApi } from "api/serverApi";
import { isNoContractMode, showError } from "utils";
import MintKeyView from "components/MintKey/MintKeyView";
import { CONTRACTS, SYSTEM_STAGE } from "consts";
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
} from "store/uiReducer";
import Loading from "components/Loading";

const MintKey = () => {
  const { systemStage, isActive, minePrice, maxEntrance, tokensMinted } =
    useSelector(systemSelector);
  const account = useAccount();
  const contract = useDDContract();
  const mineContract = useDDContract(CONTRACTS.DiamondDawnMine);
  const dispatch = useDispatch();
  const actionDispatch = useActionDispatch();
  const tokens = useSelector(tokensSelector);
  const collector = useSelector(collectorSelector);
  const provider = useProvider();
  const [isMinting, setIsMinting] = useState(false);
  const [isForging, setIsForging] = useState(false);

  const maxTokenId = max(map(tokens, "id"));
  const canMint = systemStage === SYSTEM_STAGE.KEY && isActive;

  const mint = async (numNfts) => {
    setIsMinting(true);
    const { signature } = await signMintApi(collector._id, account.address);
    dispatch(setShouldIgnoreTokenTransferWatch(true));
    const tx = await forgeApi(
      contract,
      numNfts,
      minePrice.mul(numNfts),
      signature
    );
    setIsForging(true);
    return await tx.wait();
  };

  const onMintSuccess = async (tokenId) => {
    dispatch(setShouldIgnoreTokenTransferWatch(false));
    try {
      confirmMintedApi(collector._id, account.address);
      const tokenUri = await getTokenUriApi(contract, tokenId);
      dispatch(setTokenUri(tokenId, tokenUri));
      dispatch(setSelectedTokenId(tokenId));
      setIsMinting(false);
      dispatch(updateCollector({ minted: true }));
    } catch (e) {
      showError(e);
    }
  };

  useEffect(() => {
    dispatch(loadMinePrice(contract));
    dispatch(loadMaxEntrance(contract));
    dispatch(loadTokenCount(mineContract));

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
    if (canMint && collector?.approved && !collector?.mintWindowStart) {
      dispatch(openMintWindow(collector._id, account.address));
    }
  }, [canMint, collector?.approved, collector?.mintWindowStart]);

  const onMintWindowClose = () => {
    actionDispatch(
      loadCollectorByAddress(account.address),
      "get-collector-by-address"
    );
  };

  if (!collector || collector.minted || collector.mintClosed) return null;

  if (isForging) return <Loading />;

  return (
    <MintKeyView
      mintPrice={minePrice}
      maxEntrance={maxEntrance}
      tokensMinted={tokensMinted}
      canMint={canMint}
      mint={mint}
      expiresAt={collector.mintWindowClose}
      onCountdownEnd={onMintWindowClose}
      forceButtonLoading={isMinting}
      onMintError={() => {
        setIsMinting(false);
        setIsForging(false);
      }}
    />
  );
};

export default isNoContractMode() ? MintKeyView : MintKey;
