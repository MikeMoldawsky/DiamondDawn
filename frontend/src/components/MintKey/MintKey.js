import React, { useEffect, useState } from "react";
import map from "lodash/map";
import max from "lodash/max";
import useDDContract from "hooks/useDDContract";
import { useDispatch, useSelector } from "react-redux";
import {
  isPhaseActiveSelector,
  phaseSelector,
} from "store/systemReducer";
import {
  setTokenUri,
  tokensSelector,
  watchTokenMinedBy,
} from "store/tokensReducer";
import { useAccount, useProvider } from "wagmi";
import { mintApi, getTokenUriApi } from "api/contractApi";
import { signMintApi } from "api/serverApi";
import { isNoContractMode, showError } from "utils";
import MintKeyView from "components/MintKey/MintKeyView";
import {
  collectorSelector,
  updateCollector,
} from "store/collectorReducer";
import {
  setSelectedTokenId,
  setShouldIgnoreTokenTransferWatch,
  uiSelector,
  updateUiState,
} from "store/uiReducer";
import Loading from "components/Loading";
import useSound from "use-sound";
import mintOpenSFX from "assets/audio/mint-open.mp3";
import {BigNumber} from "ethers";
import { useNavigate } from "react-router-dom"

const MintKey = ({ isHonorary }) => {
  const {
    maxSupply,
    price,
    evolved,
  } = useSelector(phaseSelector("mint"))
  const canMint = useSelector(isPhaseActiveSelector("mint"))
  const account = useAccount();
  const contract = useDDContract();
  const dispatch = useDispatch();
  const tokens = useSelector(tokensSelector);
  const collector = useSelector(collectorSelector);
  const provider = useProvider();
  const [isMinting, setIsMinting] = useState(false);
  const [isForging, setIsForging] = useState(false);
  const { geoLocation } = useSelector(uiSelector);
  const navigate = useNavigate()

  const maxTokenId = max(map(tokens, "id"));
  const [playMintOpenSFX] = useSound(mintOpenSFX, {
    volume: 1,
    interrupt: false,
  });
  const [canMintOnMount] = useState(canMint);

  const mint = async (numNfts) => {
    if (geoLocation?.blocked || !canMint) return;

    setIsMinting(true);
    const { signature } = await signMintApi(collector._id, account.address, isHonorary);
    dispatch(setShouldIgnoreTokenTransferWatch(true));
    const tx = await mintApi(
      contract,
      isHonorary,
      numNfts,
      price.mul(numNfts),
      signature
    );
    dispatch(updateUiState({ collectorBoxAnimation: "close" }));
    setTimeout(() => {
      setIsForging(true);
    }, 500);
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
      navigate("/collector")
    } catch (e) {
      showError(e);
    }
  };

  useEffect(() => {
    if (isForging) {
      dispatch(updateUiState({ collectorBoxAnimation: "" }));
    }
  }, [isForging]);

  useEffect(() => {
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

  if (!collector || collector.minted) return null;

  if (isForging) return <Loading />;

  return (
    <MintKeyView
      mintPrice={price || BigNumber.from(0)}
      maxEntrance={maxSupply || 0}
      tokensMinted={evolved || 0}
      canMint={canMint}
      mint={mint}
      forceButtonLoading={isMinting}
      onMintError={() => {
        setIsMinting(false);
        setIsForging(false);
      }}
    />
  );
};

export default isNoContractMode() ? MintKeyView : MintKey;
