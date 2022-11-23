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
import PageLoader from "components/PageLoader";
import useWindowDimensions from "hooks/useWindowDimensions";
import { inviteSelector, loadInviteById } from "store/inviteReducer";
import InvitedModal from "components/InvitedModal/InvitedModal";
import { isActionSuccessSelector } from "store/actionStatusReducer";
import { collectorSelector } from "store/collectorReducer";
import { useAccount } from "wagmi";
import Button from "components/Button";
import useActionDispatch from "hooks/useActionDispatch";
import usePermission from "hooks/usePermission";

const ComingSoonPage = () => {
  const dispatch = useDispatch();
  const actionDispatch = useActionDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const account = useAccount();
  const inviteId = searchParams.get("invite");
  const invite = useSelector(inviteSelector);
  const collector = useSelector(collectorSelector);
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

  useEffect(() => {
    if (inviteId) {
      actionDispatch(loadInviteById(inviteId), "get-invite-by-id");
    }
  }, [inviteId]);

  useEffect(() => {
    if (
      pageReady &&
      !canAccessDD &&
      invite &&
      !invite.usedBy &&
      !invite.revoked
    ) {
      setShowInvitedModal(true);
    }
  }, [invite, isCollectorFetched, collector, pageReady]);

  const renderBgPlayer = useCallback(
    () => (
      <ReactPlayer
        url={getCDNVideoUrl(
          usePortraitAsset ? "coming_soon_mobile.webm" : "coming_soon.mp4"
        )}
        playing
        playsinline
        controls={false}
        className="react-player"
        muted
        loop
        width=""
        height=""
        onProgress={setVideoProgress}
      />
    ),
    [usePortraitAsset]
  );

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

  const renderEntrance = () => {
    if (!isCollectorFetched && account?.address) return null;

    if (canAccessDD)
      return (
        <Button className="transparent" onClick={transition} sfx="explore">
          EXPLORE
        </Button>
      );

    return (
      <PasswordBox
        inviteId={invite?._id}
        onCorrect={onCorrectPassword}
        passwordLength={8}
        buttonText="EXPLORE"
      />
    );
  };

  return (
    <PageLoader
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
        <div className="center-aligned-column content">
          <div className="center-aligned-column">
            <div className="leading-text">PRIVATE SALE</div>
            <div className="secondary-text">
              <div className="secondary-2">Physical or Digital</div>
              Which diamond will you choose?
            </div>
          </div>
          {renderEntrance()}
        </div>
        {showInvitedModal && (
          <InvitedModal
            invite={invite}
            close={() => setShowInvitedModal(false)}
          />
        )}
      </div>
    </PageLoader>
  );
};

export default ComingSoonPage;
