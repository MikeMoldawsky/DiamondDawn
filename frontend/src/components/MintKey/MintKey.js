import React, { useCallback, useEffect } from "react";
import _ from "lodash";
import useDDContract from "hooks/useDDContract";
import { useDispatch, useSelector } from "react-redux";
import {
  loadDiamondCount,
  loadMaxDiamonds,
  loadMinePrice,
  systemSelector,
} from "store/systemReducer";
import { tokensSelector, watchTokenMinedBy } from "store/tokensReducer";
import { useAccount } from "wagmi";
import ActionView from "components/ActionView";
import useMountLogger from "hooks/useMountLogger";
import { forgeApi } from "api/contractApi";
import { confirmMintedApi, signMintApi } from "api/serverApi";
import useNavigateToDefault from "hooks/useNavigateToDefault";
import { getCDNVideoUrl, isNoContractMode } from "utils";
import MintKeyView from "components/MintKey/MintKeyView";
import { SYSTEM_STAGE } from "consts";
import {
  collectorSelector,
  loadCollectorByAddress,
} from "store/collectorReducer";
import useActionDispatch from "hooks/useActionDispatch";

const MintKey = () => {
  const { systemStage, isActive, minePrice, maxDiamonds, diamondCount } =
    useSelector(systemSelector);
  const account = useAccount();
  const contract = useDDContract();
  const dispatch = useDispatch();
  const actionDispatch = useActionDispatch();
  const tokens = useSelector(tokensSelector);
  const navigateToDefault = useNavigateToDefault();
  const collector = useSelector(collectorSelector);

  const maxTokenId = _.max(_.map(tokens, "id"));

  useMountLogger("MintKey");

  useEffect(() => {
    dispatch(loadMinePrice(contract));
    dispatch(loadMaxDiamonds(contract));
    dispatch(loadDiamondCount(contract));
  }, []);

  const canMint = systemStage === SYSTEM_STAGE.KEY && isActive;

  const MintKeyContent = useCallback(
    ({ execute }) => (
      <MintKeyView
        mintPrice={minePrice}
        maxDiamonds={maxDiamonds}
        diamondCount={diamondCount}
        canMint={canMint}
        mint={execute}
        expiresAt={collector.mintWindowClose}
        onCountdownEnd={onMintWindowClose}
      />
    ),
    [minePrice, maxDiamonds, diamondCount, canMint]
  );

  if (!collector || collector.minted || collector.mintClosed) return null;

  const onMintWindowClose = () => {
    actionDispatch(
      loadCollectorByAddress(account.address),
      "get-collector-by-address"
    );
  };

  const executeEnterMine = async () => {
    let signature;
    try {
      const response = await signMintApi(collector._id, account.address);
      signature = response.signature;
    } catch (e) {
      navigateToDefault();
      throw new Error(e);
    }
    const tx = await forgeApi(contract, minePrice, signature);
    await tx.wait();
    try {
      await confirmMintedApi(collector._id, account.address);
    } catch (e) {
      // do not show error not to confuse the user
    }
    return tx;
  };

  return (
    <ActionView
      isEnter
      watch={watchTokenMinedBy(account.address, maxTokenId)}
      transact={executeEnterMine}
      videoUrl={getCDNVideoUrl("post_enter.mp4")}
    >
      <MintKeyContent />
    </ActionView>
  );
};

export default isNoContractMode() ? MintKeyView : MintKey;
