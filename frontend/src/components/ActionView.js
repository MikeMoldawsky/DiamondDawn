import React, { useEffect, useState } from "react";
import useDDContract from "hooks/useDDContract";
import { useDispatch, useSelector } from "react-redux";
import VideoPlayer from "components/VideoPlayer";
import { setTokenUri } from "store/tokensReducer";
import { useProvider } from "wagmi";
import { useNavigate } from "react-router-dom";
import Loading from "components/Loading";
import classNames from "classnames";
import { systemSelector } from "store/systemReducer";
import _ from "lodash";
import { uiSelector } from "store/uiReducer";
import { getTokenUriApi } from "api/contractApi";

const ActionView = ({ children, className, videoUrl, watch, transact, isBurn }) => {
  const [actionTxId, setActionTxId] = useState(false);
  const [showCompleteVideo, setShowCompleteVideo] = useState(false);
  const [completeVideoEnded, setCompleteVideoEnded] = useState(false);
  const [processedTokenId, setProcessedTokenId] = useState(-1);
  const [processedTokenUri, setProcessedTokenUri] = useState(null);
  const provider = useProvider();
  const contract = useDDContract();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { systemStage, systemSchedule } = useSelector(systemSelector);
  const { selectedTokenId } = useSelector(uiSelector);
  const endTime = _.get(systemSchedule, systemStage + 1);
  const withWatch = _.isFunction(watch);

  useEffect(() => {
    let unwatch = null;
    if (withWatch) {
      unwatch = watch(contract, provider, onSuccess);
    }

    return () => {
      _.isFunction(unwatch) && unwatch();
    };
  }, [withWatch]);

  useEffect(() => {
    if (completeVideoEnded && processedTokenId > -1 && processedTokenUri) {
      dispatch(setTokenUri(processedTokenId, processedTokenUri));
      navigate(`/nft/${processedTokenId}`);
    }
  }, [completeVideoEnded, processedTokenId, processedTokenUri]);

  const onSuccess = async (tokenId) => {
    // fetch and store tokenUri in local state until video has ended
    const tokenUri = await getTokenUriApi(contract, tokenId, isBurn);
    setProcessedTokenId(tokenId);
    setProcessedTokenUri(tokenUri);
  };

  const execute = async () => {
    const tx = await transact();

    setShowCompleteVideo(true);

    const receipt = await tx.wait();

    if (!withWatch) {
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
