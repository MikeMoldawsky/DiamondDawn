import React, {useCallback, useEffect, useState} from "react";
import "./ComingSoonPage.scss";
import ReactPlayer from "react-player";
import PasswordBox from "components/PasswordBox";
import { updateUiState } from "store/uiReducer";
import {useDispatch, useSelector} from "react-redux";
import { getCDNImageUrl, getCDNVideoUrl } from "utils";
import classNames from "classnames";
import {useNavigate, useSearchParams} from "react-router-dom";
import useMusic from "hooks/useMusic";
import PageLoader from "components/PageLoader";
import useWindowDimensions from "hooks/useWindowDimensions";
import {inviteSelector, loadInviteById} from "store/inviteReducer";
import InvitedModal from "components/InvitedModal/InvitedModal";
import {isActionSuccessSelector} from "store/actionStatusReducer";
import {canAccessDDSelector} from "store/selectors";

const ComingSoonPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams()
  const inviteId = searchParams.get("invite")
  const invite = useSelector(inviteSelector)
  const isCollectorFetched = useSelector(
    isActionSuccessSelector("get-collector-by-address")
  );
  const canAccessDD = useSelector(canAccessDDSelector);
  const [showInvitedModal, setShowInvitedModal] = useState(false)
  const [startTransition, setStartTransition] = useState(false);
  const [videoProgress, setVideoProgress] = useState({});
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;
  const usePortraitAsset = (isPortrait && width <= 1024) || width <= 768;

  useMusic("coming-soon.mp3");

  useEffect(() => {
    if (inviteId) {
      dispatch(loadInviteById(inviteId))
    }
  }, [inviteId])

  useEffect(() => {
    if (invite && !invite.usedBy && !invite.revoked) {
      setShowInvitedModal(true)
    }
  }, [invite])

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
    if (!isCollectorFetched) return null

    if (canAccessDD) return (
      <div className="button transparent" onClick={transition}>
        EXPLORE
      </div>
    )

    return (
      <PasswordBox
        inviteId={invite?._id}
        onCorrect={onCorrectPassword}
        passwordLength={8}
        buttonText="EXPLORE"
      />
    )
  }

  return (
    <PageLoader
      pageName="coming-soon"
      requireAccess={false}
      images={[getCDNImageUrl("envelop-wings.png")]}
      videos={[{ progress: videoProgress, threshold: 0.5 }]}
      timeout={7000}
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
            <div className="leading-text">COMING SOON</div>
            <div className="secondary-text">
              <div className="secondary-2">Physical or Digital</div>
              Which diamond will you choose?
            </div>
          </div>
          {renderEntrance()}
        </div>
        {showInvitedModal && (<InvitedModal invite={invite} close={() => setShowInvitedModal(false)}/>)}
      </div>
    </PageLoader>
  );
};

export default ComingSoonPage;
