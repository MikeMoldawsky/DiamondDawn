import React, { useEffect, useState } from "react";
import _ from "lodash";
import useDDContract from "hooks/useDDContract";
import { useNavigate, useParams } from "react-router-dom";
import ActionButton from "components/ActionButton";
import { dawnApi } from "api/contractApi";
import { SYSTEM_STAGE } from "consts";
import ActionView from "components/ActionView";
import { useDispatch, useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import { setSelectedTokenId } from "store/uiReducer";
import useNavigateToDefault from "hooks/useNavigateToDefault";
import { signDawnApi } from "api/serverApi";
import { useAccount } from "wagmi";
import { getCDNImageUrl, getCDNVideoUrl } from "utils";
import Page from "containers/Page";

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
        if (token.stage === SYSTEM_STAGE.DAWN) {
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
      signature = await signDawnApi(account.address, tokenId);
    } catch (e) {
      navigateToDefault();
      throw new Error(e);
    }

    return dawnApi(contract, tokenId, signature);
  };

  return (
    <Page
      pageName="collector"
      images={[getCDNImageUrl("/collector/collector-bg.png")]}
      waitForTokens
    >
      <div className="page rebirth-page">
        <div className="inner-page">
          <ActionView
            isRebirth
            transact={executeRebirth}
            videoUrl={getCDNVideoUrl("post_rebirth.mp4")}
          >
            <RebirthContent />
          </ActionView>
        </div>
      </div>
    </Page>
  );
}

export default RebirthPage;
