import React, { useCallback, useEffect, useState } from "react";
import "./ComingSoonPage.scss";
import ReactPlayer from "react-player";
import PasswordBox from "components/PasswordBox";
import { updateUiState } from "store/uiReducer";
import { useDispatch, useSelector } from "react-redux";
import {
  getCDNImageUrl,
  getCDNVideoUrl,
  isInviteOnly,
} from "utils";
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
import useCanAccessDD from "hooks/useCanAccessDD";
import InlineVideo from "components/VideoPlayer/InlineVideo";
import useButtonSFX from "hooks/useButtonSFX";
import {
  getDDTextVideo,
  getPSTextVideo,
  getMobileBGVideo,
  getPSDateVideo,
} from "assets/videos";
import { GetPasswordLink } from "components/Links";
import { viewInviteApi } from "api/serverApi";
import FeaturedIn from "components/FeaturedIn";

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
  const canAccessDD = useCanAccessDD();
  const [autoFillPassword, setAutoFillPassword] = useState("");
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

  const onPasswordCopy = (pwd) => {
    setAutoFillPassword(pwd);
  };

  const { clickWithSFX } = useButtonSFX(onInviteClick, "explore");

  useEffect(() => {
    if (inviteId) {
      loadInvite();
      viewInviteApi(inviteId);
    }
  }, [inviteId]);

  const isCollectorReady = !account?.address || isCollectorFetched;

  useEffect(() => {
    if (inviteId && invite && pageReady && isCollectorReady) {
      setShowInvitedModal(true);
    }
  }, [inviteId, pageReady, isCollectorReady, invite?._id]);

  useEffect(() => {
    if (canAccessDD && !autoFillPassword) {
      setAutoFillPassword("12345678");
    }
  }, [canAccessDD, autoFillPassword]);

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

  const explore = () => navigate("/explore");

  const onCorrectPassword = (pwdDisabled) => {
    if (!pwdDisabled) {
      dispatch(updateUiState({ privateSaleAuth: true }));
      localStorage.setItem("privateSaleAuth", "true");
    }
    explore();
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
            <InlineVideo
              withLoader={false}
              className="dd-text"
              src={getDDTextVideo(width)}
              showThreshold={0}
            />
            <div className="center-center-aligned-row ps-row">
              <InlineVideo
                withLoader={false}
                className="ps-text"
                src={getPSTextVideo(width)}
                showThreshold={0}
              />
              <InlineVideo
                withLoader={false}
                className="ps-date"
                src={getPSDateVideo(width)}
                showThreshold={0}
              />
            </div>
          </div>
          <div className="center-aligned-column cs-section text-column">
            <div className="tagline-text">
              <div className="secondary-lg">Physical or Digital</div>
              Which diamond will you choose?
            </div>
          </div>
          <PasswordBox
            className={classNames("cs-section", { "with-invite": !!inviteId })}
            disabled={!isInviteOnly()}
            autoFill={autoFillPassword}
            inviteId={invite?._id}
            onCorrect={onCorrectPassword}
            passwordLength={8}
            buttonText="ENTER"
          />
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
          onCopy={onPasswordCopy}
          close={() => setShowInvitedModal(false)}
        />
      )}
    </Page>
  );
};

export default ComingSoonPage;
