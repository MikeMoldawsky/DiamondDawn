import React, { useEffect, useState } from "react";
import useDDContract from "hooks/useDDContract";
import { useDispatch, useSelector } from "react-redux";
import VideoPlayer from "components/VideoPlayer";
import { setTokenUri, tokenByIdSelector } from "store/tokensReducer";
import { useProvider } from "wagmi";
import { useNavigate } from "react-router-dom";
import Loading from "components/Loading";
import classNames from "classnames";
import { loadConfig, systemSelector } from "store/systemReducer";
import _ from "lodash";
import { setShouldIgnoreTokenTransferWatch, uiSelector } from "store/uiReducer";
import { getTokenUriApi } from "api/contractApi";
import { getStageName, isTokenActionable } from "utils";
import useNavigateToDefault from "hooks/useNavigateToDefault";

const ActionView = ({
  children,
  className,
  videoUrl,
  watch,
  transact,
  isBurn,
  isRebirth,
  requireActionable,
}) => {
  const [actionTxId, setActionTxId] = useState(false);
  const [showCompleteVideo, setShowCompleteVideo] = useState(false);
  const [completeVideoEnded, setCompleteVideoEnded] = useState(false);
  const [processedTokenId, setProcessedTokenId] = useState(-1);
  const [processedTokenUri, setProcessedTokenUri] = useState(null);
  const provider = useProvider();
  const contract = useDDContract();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { systemStage, isActive, config } = useSelector(systemSelector);
  const { selectedTokenId } = useSelector(uiSelector);
  const token = useSelector(tokenByIdSelector(selectedTokenId));
  const endTime = config.stageTime;
  const withWatch = _.isFunction(watch);
  const navigateToDefault = useNavigateToDefault();

  useEffect(() => {
    dispatch(loadConfig());

    return () => {
      dispatch(setShouldIgnoreTokenTransferWatch(false));
    };
  }, []);

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
      dispatch(setShouldIgnoreTokenTransferWatch(false));
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
    dispatch(setShouldIgnoreTokenTransferWatch(true));

    const tx = await transact();

    setShowCompleteVideo(true);

    try {
      const receipt = await tx.wait();

      if (!withWatch) {
        onSuccess(selectedTokenId);
      }

      setActionTxId(receipt.transactionHash);
    } catch (e) {
      setShowCompleteVideo(false);
      throw new Error(e);
    }
  };

  const renderContent = () => {
    if (showCompleteVideo) {
      const stageNameUpper = isRebirth
        ? "REBIRTH"
        : _.upperCase(getStageName(systemStage));
      return (
        <div className="backdrop">
          <VideoPlayer
            onEnded={() => {
              setCompleteVideoEnded(true);
              setShowCompleteVideo(false);
            }}
            src={videoUrl}
          >
            {stageNameUpper} VIDEO
          </VideoPlayer>
        </div>
      );
    }

    if (completeVideoEnded) {
      return <Loading />;
    }

    // Make sure stage is active OR rebirth (which doesn't require active stage)
    if (!isActive && !isRebirth) return navigateToDefault();

    // Handle requireActionable
    if (requireActionable && !isTokenActionable(token, systemStage, isActive))
      return navigateToDefault();

    return React.cloneElement(children, { execute, endTime });
  };

  return (
    <div className={classNames("action-view mine", className)}>
      {renderContent()}
    </div>
  );
};

export default ActionView;
