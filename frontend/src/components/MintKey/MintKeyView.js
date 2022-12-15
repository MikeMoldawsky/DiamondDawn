import React, {useCallback, useEffect} from "react";
import "components/MintKey/MintKey.scss";
import Countdown from "components/Countdown";
import ActionButton from "components/ActionButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons/faEthereum";
import isFunction from "lodash/isFunction";
import { BigNumber, utils as ethersUtils } from "ethers";
import InvitationsStatus from "components/InvitationsStatus";
import { useDispatch, useSelector } from "react-redux";
import {createVideoSources, getCDNImageUrl, getCDNVideoUrl} from "utils";
import { uiSelector, updateUiState } from "store/uiReducer";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Button from "components/Button";
import MintAddressRow from "components/MintAddressRow";
import InlineVideo from "components/VideoPlayer/InlineVideo";
import useMusic from "hooks/useMusic";
import { Desktop, MobileOrTablet } from "hooks/useMediaQueries";
import useMineOpenCountdown from "hooks/useMineOpenCountdown";
import {useSearchParams} from "react-router-dom";

const MintKeyView = ({
  mintPrice = 4.44,
  maxDiamonds = 333,
  diamondCount = 0,
  canMint,
  mint,
  expiresAt,
  onCountdownEnd,
}) => {
  const [searchParams] = useSearchParams();
  const showInvitesParam = searchParams.get("invites") === "true";
  const dispatch = useDispatch();
  const { mintViewShowInvites: showInvites } = useSelector(uiSelector);

  const toggleInvites = (show) => {
    dispatch(updateUiState({ mintViewShowInvites: show }));
  };

  useMusic("accepted.mp3");

  useEffect(() => {
    if (showInvitesParam) {
      toggleInvites(true)
    }
  }, [showInvitesParam])
  
  const mintPriceText = BigNumber.isBigNumber(mintPrice)
    ? ethersUtils.formatUnits(mintPrice)
    : "4.44";

  const renderTitle = () => (
    <div className="congrats-box">
      <div className="left-top-aligned-column">
        <div className="leading-text">CONGRATULATIONS</div>
        <div className="congrats-text">
          You’ve been accepted to participate in Diamond Dawn’s historical
          journey.
          <br />
          The key grants you <b>full access</b> to the 4 phases of DD's journey,
          starting in the virtual mine, where your journey begins.
        </div>
      </div>
    </div>
  );

  const renderHandAndKeyVideo = useCallback(() => {
    return (
      <div className="image-box">
        <InlineVideo
          src={createVideoSources("hand-key-particles")}
          showThreshold={0}
          withLoader={false}
        />
      </div>
    );
  }, []);

  const renderMintButton = () => (
    <div className="center-aligned-column button-column">
      <div className="left-center-aligned-row price-text">
        ACTIVATE YOUR KEY
      </div>
      <div>
        <ActionButton
          actionKey="MintKey"
          className="gold lg mint-button"
          disabled={!canMint || !isFunction(mint)}
          onClick={() => isFunction(mint) && mint()}
        >
          {mintPriceText} <FontAwesomeIcon icon={faEthereum} /> MINT
        </ActionButton>
      </div>
    </div>
  )

  const { countdownText, date: countdownEnd } = useMineOpenCountdown()

  const countdownEndDate = canMint ? expiresAt : countdownEnd
  const countdownTextLine = canMint ? "When the time runs out, you'll no longer be able to join Diamond Dawn" : countdownText

  return (
    <div className="action-view enter">
      <div className="layout-box">
        {!showInvites && (
          <MobileOrTablet>{renderTitle()}</MobileOrTablet>
        )}
        <Desktop>{renderHandAndKeyVideo()}</Desktop>
        <div className="content-box">
          {showInvites ? (
            <div className="center-aligned-column invites-view">
              <div className="back-button" onClick={() => toggleInvites(false)}>
                <ArrowBackIosNewIcon />
              </div>
              <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
              <div className="text">
                As a future Diamond Dawn participant, you can invite 2
                collectors to Diamond Dawn’s historical journey.
                <br />
                These unique links will allow them to bypass Diamond Dawn’s
                password into the private sale.
                <br />
                <br />
                <b>
                  These links can only be used ONCE - make sure to use them
                  wisely.
                </b>
              </div>
              <InvitationsStatus />
            </div>
          ) : (
            <>
              <Desktop>{renderTitle()}</Desktop>
              <div className="left-center-aligned-row mint-box">
                <MobileOrTablet>
                  <div className="center-aligned-row">
                    {renderHandAndKeyVideo()}
                    {renderMintButton()}
                  </div>
                </MobileOrTablet>
                <Desktop>{renderMintButton()}</Desktop>
                <div className="center-aligned-column open-soon">
                  <div className="timer-box">
                    <div className="text-comment">{countdownTextLine}</div>
                    <Countdown
                      date={countdownEndDate}
                      onComplete={() =>
                        isFunction(onCountdownEnd) && onCountdownEnd()
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="center-aligned-row invites-box">
                <div className="image">
                  <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
                </div>
                <div className="center-aligned-row invites-box-text">
                  <div className="text">You’ve been granted 2 invitations</div>
                  <Button className="gold" onClick={() => toggleInvites(true)}>
                    INVITE A FRIEND
                  </Button>
                </div>
              </div>
              <MintAddressRow />
            </>
          )}
        </div>
      </div>
      {!showInvites && (
        <div className="status-box">
          {diamondCount} / {maxDiamonds} MINTED
        </div>
      )}
    </div>
  );
};

export default MintKeyView;
