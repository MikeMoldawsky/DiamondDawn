import React, { useEffect, useState } from "react";
import _ from "lodash";
import useDDContract from "hooks/useDDContract";
import { useNavigate, useParams } from "react-router-dom";
import ActionButton from "components/ActionButton";
import { rebirthApi } from "api/contractApi";
import { SYSTEM_STAGE } from "consts";
import ActionView from "components/ActionView";
import { useDispatch, useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import { setSelectedTokenId } from "store/uiReducer";
import useNavigateToDefault from "hooks/useNavigateToDefault";
import { signRebirthApi } from "api/serverApi";
import { useAccount } from "wagmi";
import { getCDNObjectUrl } from "utils";

function RebirthPage() {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const contract = useDDContract();
  const tokens = useSelector(tokensSelector);
  const [isReady, setIsReady] = useState(false);
  const dispatch = useDispatch();
  const navigateToDefault = useNavigateToDefault();
  const account = useAccount();

  useEffect(() => {
    const fetch = async () => {
      const events = await contract.queryFilter(contract.filters.Transfer());
      console.log({ events });
    };
    if (tokenId) {
      fetch();
    }
  }, [tokenId]);

  useEffect(() => {
    try {
      const intTokenId = parseInt(tokenId);
      if (!_.isEmpty(tokens)) {
        const token = _.find(tokens, (t) => t.id === intTokenId);
        if (token.stage === SYSTEM_STAGE.SHIP) {
          navigate(`/nft/${tokenId}`);
        } else if (!token || !token.isBurned) {
          navigateToDefault();
        } else {
          dispatch(setSelectedTokenId(intTokenId));
          setIsReady(true);
        }
      }
    } catch (e) {
      navigateToDefault();
    }
  }, []);

  if (!isReady) return null;

  const RebirthContent = ({ execute }) => (
    <>
      <div className="leading-text">DIAMOND REBIRTH</div>
      <ActionButton actionKey="Rebirth" onClick={execute}>
        Rebirth
      </ActionButton>
    </>
  );

  const executeRebirth = async () => {
    let signature;
    try {
      signature = await signRebirthApi(account.address);
    } catch (e) {
      navigateToDefault();
      throw new Error(e);
    }

    return rebirthApi(contract, tokenId, signature);
  };

  return (
    <div className="page rebirth-page">
      <div className="inner-page">
        <ActionView
          isRebirth
          transact={executeRebirth}
          videoUrl={getCDNObjectUrl("/videos/post_rebirth.mp4")}
        >
          <RebirthContent />
        </ActionView>
      </div>
    </div>
  );
}

export default RebirthPage;
