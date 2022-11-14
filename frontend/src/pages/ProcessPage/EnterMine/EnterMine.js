import React, { useEffect } from "react";
import _ from "lodash";
import useDDContract from "hooks/useDDContract";
import "./EnterMine.scss";
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
import {confirmMintedApi, signMintApi} from "api/serverApi";
import useNavigateToDefault from "hooks/useNavigateToDefault";
import {getCDNVideoUrl, isNoContractMode} from "utils";
import EnterMineView from "pages/ProcessPage/EnterMine/EnterMineView";
import { SYSTEM_STAGE } from "consts";
import {collectorSelector} from "store/collectorReducer";

const EnterMine = () => {
  const { systemStage, isActive, minePrice, maxDiamonds, diamondCount } =
    useSelector(systemSelector);
  const account = useAccount();
  const contract = useDDContract();
  const dispatch = useDispatch();
  const tokens = useSelector(tokensSelector);
  const navigateToDefault = useNavigateToDefault();
  const collector = useSelector(collectorSelector)

  const maxTokenId = _.max(_.map(tokens, "id"));

  useMountLogger("EnterMine");

  useEffect(() => {
    dispatch(loadMinePrice(contract));
    dispatch(loadMaxDiamonds(contract));
    dispatch(loadDiamondCount(contract));
  }, []);

  if (!collector || collector.minted || collector.mintClosed) return null;

  const onMintWindowClose = () => navigateToDefault();

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

  const EnterMineContent = ({ execute }) => (
    <EnterMineView
      minePrice={minePrice}
      maxDiamonds={maxDiamonds}
      diamondCount={diamondCount}
      canMint={systemStage === SYSTEM_STAGE.KEY && isActive}
      enterMine={execute}
      expiresAt={collector.mintWindowClose}
      onCountdownEnd={onMintWindowClose}
    />
  );

  return (
    <ActionView
      isEnter
      watch={watchTokenMinedBy(account.address, maxTokenId)}
      transact={executeEnterMine}
      videoUrl={getCDNVideoUrl("post_enter.mp4")}
    >
      <EnterMineContent />
    </ActionView>
  );
};

export default isNoContractMode() ? EnterMineView : EnterMine;
