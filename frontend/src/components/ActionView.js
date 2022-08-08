import React, { useEffect, useState } from "react";
import useDDContract from "hooks/useDDContract";
import { useSelector } from "react-redux";
import VideoPlayer from "components/VideoPlayer";
import {
  loadAccountShippingTokens,
  loadAccountNfts,
} from "store/tokensReducer";
import { useAccount, useProvider } from "wagmi";
import { useNavigate } from "react-router-dom";
import { isActionSuccessSelector } from "components/ActionButton/ActionButton.module";
import Loading from "components/Loading";
import classNames from "classnames";
import { systemSelector } from "store/systemReducer";
import _ from "lodash";
import { uiSelector } from "store/uiReducer";
import useActionDispatch from "hooks/useActionDispatch";

const ActionView = ({ children, className, videoUrl, watch, transact }) => {
  const [actionTxId, setActionTxId] = useState(false);
  const [showCompleteVideo, setShowCompleteVideo] = useState(false);
  const [completeVideoEnded, setCompleteVideoEnded] = useState(false);
  const [processedTokenId, setProcessedTokenId] = useState(-1);
  const account = useAccount();
  const provider = useProvider();
  const contract = useDDContract();
  const actionDispatch = useActionDispatch();
  const navigate = useNavigate();
  const isFetchNftsSuccess = useSelector(isActionSuccessSelector("load-nfts"));
  const { systemStage, systemSchedule } = useSelector(systemSelector);
  const { selectedTokenId } = useSelector(uiSelector);
  const endTime = _.get(systemSchedule, systemStage + 1);

  useEffect(() => {
    if (completeVideoEnded && processedTokenId > -1 && isFetchNftsSuccess) {
      navigate(`/nft/${processedTokenId}`);
    }
  }, [completeVideoEnded, processedTokenId, isFetchNftsSuccess]);

  const onSuccess = (tokenId) => {
    actionDispatch(
      loadAccountNfts(contract, provider, account.address),
      "load-nfts"
    );
    actionDispatch(
      loadAccountShippingTokens(contract, account.address),
      "load-shipping-nfts"
    );
    setProcessedTokenId(tokenId);
  };

  const execute = async () => {
    const requireWatch = _.isFunction(watch);
    if (requireWatch) {
      watch(contract, provider, onSuccess);
    }

    const tx = await transact();

    setShowCompleteVideo(true);

    const receipt = await tx.wait();

    if (!requireWatch) {
      onSuccess(selectedTokenId);
    }

    setActionTxId(receipt.transactionHash);
  };

  const renderContent = () => {
    if (showCompleteVideo)
      return (
        <VideoPlayer
          onEnded={() => {
            setCompleteVideoEnded(true);
            setShowCompleteVideo(false);
          }}
          src={videoUrl}
        >
          03 - MINE VIDEO
        </VideoPlayer>
      );

    if (completeVideoEnded) {
      return <Loading />;
    }

    return React.cloneElement(children, { execute, endTime });
  };

  return (
    <div className={classNames("action-view mine", className)}>
      {renderContent()}
    </div>
  );
};

export default ActionView;
