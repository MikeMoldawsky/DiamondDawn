import React, {useCallback, useEffect, useState} from "react";
import "./ComingSoonPage.scss";
import ReactPlayer from "react-player";
import PasswordBox from "components/PasswordBox";
import { updateUiState } from "store/uiReducer";
import {useDispatch, useSelector} from "react-redux";
import { getCDNImageUrl, getCDNVideoUrl, isDemo } from "utils";
import classNames from "classnames";
import {useNavigate, useSearchParams} from "react-router-dom";
import HomeBackground from "components/HomeBackground";
import useMusic from "hooks/useMusic";
import PageLoader from "components/PageLoader";
import useWindowDimensions from "hooks/useWindowDimensions";
import {inviteSelector, loadInviteByAddress, loadInviteById} from "store/inviteReducer";
import InvitedModal from "components/InvitedModal/InvitedModal";

const ComingSoonPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams()
  const inviteId = searchParams.get("invite")
  const invite = useSelector(inviteSelector)
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
    if (invite && !invite.used && !invite.revoked) {
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
    console.log("process.env", process.env);
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
    <PageLoader
      pageName="coming-soon"
      images={[getCDNImageUrl("envelop-wings.png")]}
      videos={[{ progress: videoProgress, threshold: 0.5 }]}
      timeout={5000}
    >
      <div
        className={classNames("page coming-soon", {
          horizontal: true,
          "transition-out": startTransition,
        })}
      >
        {renderBgPlayer()}
        <div className="curtain-left" />
        <div className="curtain-right" />
        <div className="curtain-behind">
          <PageLoader
            pageName="homepage"
            withLoader={false}
            timeout={-1}
            images={[
              getCDNImageUrl("/homepage/sky.png"),
              getCDNImageUrl("/homepage/homepage-mountains-back.png"),
              getCDNImageUrl("/homepage/homepage-mountains-front.png"),
            ]}
          >
            <HomeBackground />
          </PageLoader>
        </div>
        <div className="center-aligned-column content">
          <div className="center-aligned-column">
            <div className="leading-text">COMING SOON</div>
            <div className="secondary-text">
              <div className="secondary-2">Physical or Digital</div>
              Which diamond will you choose?
            </div>
          </div>
          {isDemo() ? (
            <PasswordBox
              inviteId={invite?._id}
              onCorrect={onCorrectPassword}
              passwordLength={8}
              buttonText="EXPLORE"
            />
          ) : (
            <div className="button transparent" onClick={transition}>
              EXPLORE
            </div>
          )}
        </div>
        {showInvitedModal && (<InvitedModal invite={invite} close={() => setShowInvitedModal(false)}/>)}
      </div>
    </PageLoader>
  );
};

export default ComingSoonPage;
