import React, { useCallback, useEffect, useState } from "react";
import "./ComingSoonPage.scss";
import ReactPlayer from "react-player";
import { updateUiState } from "store/uiReducer";
import { useDispatch, useSelector } from "react-redux";
import {getCDNImageUrl, getCDNVideoUrl, isInviteOnly, showError} from "utils";
import classNames from "classnames";
import { useNavigate, useSearchParams } from "react-router-dom";
import useMusic from "hooks/useMusic";
import Page from "containers/Page";
import useWindowDimensions from "hooks/useWindowDimensions";
import { inviteSelector, loadInviteById } from "store/inviteReducer";
import InvitedModal from "components/InvitedModal/InvitedModal";
import useActionDispatch from "hooks/useActionDispatch";
import InlineVideo from "components/VideoPlayer/InlineVideo";
import useButtonSFX from "hooks/useButtonSFX";
import {
  getDDTextVideo,
  getPSTextVideo,
  getMobileBGVideo,
  getPSDateVideo,
} from "assets/videos";
import { GetPasswordLink } from "components/Links";
import {canEnterDDApi, viewInviteApi} from "api/serverApi";
import FeaturedIn from "components/FeaturedIn";
import useCollectorReady from "hooks/useCollectorReady";
import ActionButton from "components/ActionButton";

const ComingSoonPage = () => {
  const dispatch = useDispatch();
  const actionDispatch = useActionDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteId = searchParams.get("invite");
  const invite = useSelector(inviteSelector);
  const isCollectorReady = useCollectorReady();
  const [pageReady, setPageReady] = useState(false);
  const [showInvitedModal, setShowInvitedModal] = useState(false);
  const [videoProgress, setVideoProgress] = useState({});
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;
  const usePortraitAsset = isPortrait && width <= 768;

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

  useEffect(() => {
    if (inviteId) {
      loadInvite();
    }
  }, [inviteId]);

  useEffect(() => {
    if (invite?._id && !invite.viewed) {
      viewInviteApi(inviteId);
    }
  }, [invite?._id]);

  useEffect(() => {
    if (inviteId && invite && pageReady && isCollectorReady) {
      setShowInvitedModal(true);
    }
  }, [inviteId, pageReady, isCollectorReady, invite?._id]);

  const bgVideoUrl = usePortraitAsset
    ? getMobileBGVideo(width)
    : getCDNVideoUrl("coming-soon-2-loops.mp4");

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

  const enter = async () => {
    if (!invite) return;

    const isAuth = await canEnterDDApi(inviteId);
    if (isAuth) {
      dispatch(updateUiState({ privateSaleAuth: true }));
      navigate("/explore");
    } else {
      showError("Invalid invite")
    }
  };

  return (
    <Page
      pageName="coming-soon"
      requireAccess={false}
      images={[getCDNImageUrl("envelop-wings.png")]}
      videos={[{ progress: videoProgress, threshold: 0.1 }]}
      onReady={() => setPageReady(true)}
    >
      <div className={classNames("page coming-soon")}>
        {renderBgPlayer()}
        <div className="center-aligned-column content-column">
          <div className="cs-section project-title">
            <InlineVideo className="dd-text" src={getDDTextVideo(width)} />
            <div className="center-center-aligned-row ps-row">
              <InlineVideo className="ps-text" src={getPSTextVideo(width)} />
              <InlineVideo className="ps-date" src={getPSDateVideo(width)} />
            </div>
          </div>
          <div className="center-aligned-column cs-section text-column">
            <div className="tagline-text">
              <div className="secondary-lg">Physical or Digital</div>
              Which diamond will you choose?
            </div>
          </div>
          <div className={classNames("cs-section password-box", { "with-invite": !!inviteId })}>
            <ActionButton
              actionKey="Enter Diamond Dawn"
              className="transparent"
              disabled={!inviteId}
              onClick={enter}
              sfx="explore"
            >
              ENTER
            </ActionButton>
          </div>
        </div>
        <div
          className={classNames("cs-section invite-image", {
            "no-invite": !inviteId,
          })}
          onClick={(e) => !!inviteId && clickWithSFX(e)}
        >
          {!!inviteId ? (
            <>
              <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
              <div className="text-center your-invite-text">YOUR INVITE</div>
            </>
          ) : (
            isInviteOnly() && <GetPasswordLink />
          )}
        </div>
        <FeaturedIn />
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
