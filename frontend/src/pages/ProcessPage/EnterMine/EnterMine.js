import React, { useEffect } from "react";
import _ from "lodash";
import useDDContract from "hooks/useDDContract";
import "./EnterMine.scss";
import { useDispatch, useSelector } from "react-redux";
import {loadDiamondCount, loadMaxDiamonds, loadMinePrice, systemSelector} from "store/systemReducer";
import { tokensSelector, watchTokenMinedBy } from "store/tokensReducer";
import { useAccount } from "wagmi";
import ActionView from "components/ActionView";
import useMountLogger from "hooks/useMountLogger";
import { forgeApi } from "api/contractApi";
import { confirmInviteUsedApi, signInviteApi } from "api/serverApi";
import useNavigateToDefault from "hooks/useNavigateToDefault";
import { isDemo, getCDNObjectUrl } from "utils";
import EnterMineView from "pages/ProcessPage/EnterMine/EnterMineView";

const EnterMine = ({ invite }) => {
  const { minePrice, maxDiamonds, diamondCount } = useSelector(systemSelector);
  const account = useAccount();
  const contract = useDDContract();
  const dispatch = useDispatch();
  const tokens = useSelector(tokensSelector);
  const navigateToDefault = useNavigateToDefault();

  const maxTokenId = _.max(_.map(tokens, "id"));

  useMountLogger("EnterMine");

  useEffect(() => {
    dispatch(loadMinePrice(contract));
    dispatch(loadMaxDiamonds(contract));
    dispatch(loadDiamondCount(contract));
  }, []);

  if (!invite || invite.revoked || invite.used) return null;

  const onInviteExpired = () => navigateToDefault();

  const executeEnterMine = async () => {
    let signature;
    try {
      const response = await signInviteApi(invite._id, account.address);
      signature = response.signature;
    } catch (e) {
      navigateToDefault();
      throw new Error(e);
    }
    const tx = await forgeApi(contract, minePrice, signature);
    await tx.wait();
    try {
      await confirmInviteUsedApi(invite._id, account.address);
    } catch (e) {
      // do not show error not to confuse the user
    }
    return tx;
  };

  const EnterMineContent = ({ execute }) => (
    <EnterMineView minePrice={minePrice}
                   maxDiamonds={maxDiamonds}
                   diamondCount={diamondCount}
                   enterMine={execute}
                   expiresAt={invite.expires}
                   onCountdownEnd={onInviteExpired} />
  );

  return (
    <ActionView
      watch={watchTokenMinedBy(account.address, maxTokenId)}
      transact={executeEnterMine}
      videoUrl={getCDNObjectUrl("/videos/post_enter.mp4")}
    >
      <EnterMineContent />
    </ActionView>
  );
};

export default isDemo() ? EnterMineView : EnterMine
