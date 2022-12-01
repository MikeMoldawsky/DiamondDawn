import React, { useCallback, useEffect, useState } from "react";
import "./ComingSoonPage.scss";
import ReactPlayer from "react-player";
import PasswordBox from "components/PasswordBox";
import { updateUiState } from "store/uiReducer";
import { useDispatch, useSelector } from "react-redux";
import { getCDNImageUrl, getCDNVideoUrl } from "utils";
import classNames from "classnames";
import { useNavigate, useSearchParams } from "react-router-dom";
import useMusic from "hooks/useMusic";
import Page from "containers/Page";
import useWindowDimensions from "hooks/useWindowDimensions";
import { inviteSelector, loadInviteById } from "store/inviteReducer";
import InvitedModal from "components/InvitedModal/InvitedModal";
import { isActionSuccessSelector } from "store/actionStatusReducer";
import { useAccount } from "wagmi";
import useActionDispatch from "hooks/useActionDispatch";
import usePermission from "hooks/usePermission";
import InlineVideo from "components/VideoPlayer/InlineVideo";
import useButtonSFX from "hooks/useButtonSFX";

const getVideoPair = (fileName) => [
  {src: getCDNVideoUrl(`${fileName}.webm`), type: "video/webm"},
  {src: getCDNVideoUrl(`${fileName}.mp4`), type: "video/mp4"},
];

const getDDTextVideo = (width) => {
  let fileName = "dd-text";
  // if (width <= 480) fileName += "-480";
  // else
  if (width <= 1024) fileName += "-1440";

  return getVideoPair(fileName);
};

const getPSTextVideo = (width) => {
  let fileName = "ps-text";
  // if (width <= 480) fileName += "-240";
  // else
  if (width <= 1024) fileName += "-480";

  return getVideoPair(fileName);
};

const getMobileBGVideo = width => {
  let fileName = "coming_soon_mobile";
  // if (width <= 400) fileName += "-300";
  // else if (width <= 600) fileName += "-400";
  // else if (width <= 768) fileName += "-588";
  if (width <= 360) fileName += "-300";
  else if (width <= 480) fileName += "-400";
  else if (width <= 768) fileName += "-588";

  return [{src: getCDNVideoUrl(`${fileName}.mp4`), type: "video/mp4"}]
}

const ComingSoonPage = () => {
  const dispatch = useDispatch();
  const actionDispatch = useActionDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const account = useAccount();
  const inviteId = searchParams.get("invite");
  const invite = useSelector(inviteSelector);
  const isCollectorFetched = useSelector(
    isActionSuccessSelector("get-collector-by-address")
  );
  const canAccessDD = usePermission();
  const [pageReady, setPageReady] = useState(false);
  const [showInvitedModal, setShowInvitedModal] = useState(false);
  const [startTransition, setStartTransition] = useState(false);
  const [videoProgress, setVideoProgress] = useState({});
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;
  const usePortraitAsset = (isPortrait && width <= 1024) || width <= 768;

  useMusic("homepage.mp3");

  const loadInvite = () => {
    if (!inviteId) return;
    actionDispatch(loadInviteById(inviteId), "get-invite-by-id");
  };

  const onInviteClick = () => {
    if (!invite) {
      loadInvite();
    }
    setShowInvitedModal(true);
  };

  const { clickWithSFX } = useButtonSFX(onInviteClick, "explore");

  useEffect(loadInvite, [inviteId]);

  const isCollectorReady = !account?.address || isCollectorFetched;

  useEffect(() => {
    if (pageReady && isCollectorReady && !canAccessDD && invite) {
      setShowInvitedModal(true);
    }
  }, [pageReady, isCollectorReady, canAccessDD, invite?._id]);

  const bgVideoUrl = usePortraitAsset
    ? getMobileBGVideo(width)
    : getCDNVideoUrl("coming-soon.webm");

  const renderBgPlayer = useCallback(() => {
    return (
      <ReactPlayer
        url={bgVideoUrl}
        playing
        playsinline
        controls={false}
        className="react-player bg-video"
        muted
        loop
        width=""
        height=""
        onProgress={setVideoProgress}
      />
    );
  }, [JSON.stringify(bgVideoUrl)]);

  const transition = () => {
    if (process.env.REACT_APP_ENABLE_TRANSITIONS !== "true") {
      return navigate("/explore");
    }

    setStartTransition(true);

    const EFFECT_TIME_MULTIPLIER = 2;

    setTimeout(() => {
      navigate("/explore");
    }, 2850 * EFFECT_TIME_MULTIPLIER);
  };

  const onCorrectPassword = () => {
    dispatch(updateUiState({ privateSaleAuth: true }));
    localStorage.setItem("privateSaleAuth", "true");
    transition();
  };

  return (
    <Page
      pageName="coming-soon"
      requireAccess={false}
      images={[getCDNImageUrl("envelop-wings.png")]}
      videos={[{ progress: videoProgress, threshold: 0.5 }]}
      onReady={() => setPageReady(true)}
    >
      <div
        className={classNames("page coming-soon", {
          horizontal: true,
          "transition-out": startTransition,
        })}
      >
        {renderBgPlayer()}
        <div className="cs-section project-title">
          <InlineVideo
            withLoader={false}
            className="dd-text"
            src={getDDTextVideo(width)}
            showThreshold={0}
          />
          <InlineVideo
            withLoader={false}
            className="ps-text"
            src={getPSTextVideo(width)}
            showThreshold={0}
          />
        </div>
        <div className="center-aligned-column cs-section text-column">
          <div className="secondary-text">
            <div className="secondary-lg">Physical or Digital</div>
            Which diamond will you choose?
          </div>
        </div>
        <PasswordBox
          className="cs-section"
          autoFill={canAccessDD}
          inviteId={invite?._id}
          onCorrect={onCorrectPassword}
          passwordLength={8}
          buttonText="ENTER"
        />
        <div className="cs-section invite-image" onClick={clickWithSFX}>
          {inviteId && (
            <>
              <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
              <div className="text-center text-comment">YOUR INVITE</div>
            </>
          )}
        </div>
      </div>
      {showInvitedModal && (
        <InvitedModal
          invite={invite}
          close={() => setShowInvitedModal(false)}
        />
      )}
    </Page>
  );
};

export default ComingSoonPage;
