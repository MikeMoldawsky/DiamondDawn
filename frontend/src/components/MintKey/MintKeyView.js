import React, {useCallback} from "react";
import "components/MintKey/MintKey.scss";
import Countdown from "components/Countdown";
import ActionButton from "components/ActionButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons/faEthereum";
import isFunction from "lodash/isFunction";
import { BigNumber, utils as ethersUtils } from "ethers";
import InvitationsStatus from "components/InvitationsStatus";
import { useDispatch, useSelector } from "react-redux";
import { getCDNImageUrl, getCDNVideoUrl } from "utils";
import { uiSelector, updateUiState } from "store/uiReducer";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Button from "components/Button";
import MintAddressRow from "components/MintAddressRow";
import InlineVideo from "components/VideoPlayer/InlineVideo";
import useMusic from "hooks/useMusic";
import {Desktop, MobileOrTablet} from "hooks/useMediaQueries";

const MintKeyView = ({
  mintPrice = 4.44,
  maxDiamonds = 333,
  diamondCount = 0,
  canMint,
  mint,
  expiresAt,
  onCountdownEnd,
}) => {
  const dispatch = useDispatch();
  const { mintViewShowInvites: showInvites } = useSelector(uiSelector);

  const toggleInvites = (show) => {
    dispatch(updateUiState({ mintViewShowInvites: show }));
  };

  useMusic("accepted.mp3");

  const mintPriceText = BigNumber.isBigNumber(mintPrice)
    ? ethersUtils.formatUnits(mintPrice)
    : "4.44";

  const countdownProps = canMint
    ? {
        date: expiresAt,
      }
    : {
        parts: { days: 3, hours: 3, minutes: 3, seconds: 0 },
      };

  const renderTitle = () => (
    <div className="congrats-box">
      <div className="left-top-aligned-column">
        <div className="leading-text">CONGRATULATIONS</div>
        <div className="congrats-text">
          You’ve been accepted to participate in Diamond Dawn’s
          historical journey.
          <br />
          The key grants you <b>full access</b> to the 4 phases of
          DD's journey, starting in the virtual mine, where your
          journey begins.
        </div>
      </div>
    </div>
  )

  const renderInlineVideo = useCallback(() => {
    console.log("RENDERING hand-key video")
    return (
      <InlineVideo
        src={getCDNVideoUrl("hand-key-particles.webm")}
        showThreshold={0}
        withLoader={false}
      />
    )
  }, [])

  return (
    <div className="action-view enter">
      <div className="layout-box">
        <MobileOrTablet>{renderTitle()}</MobileOrTablet>
        <div className="image-box">
          {renderInlineVideo()}
        </div>
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
                <div className="center-aligned-column button-column">
                  <div className="left-center-aligned-row price-text">
                    ACTIVATE YOUR KEY
                  </div>
                  <div>
                    <ActionButton
                      actionKey="MintKey"
                      className="gold mint-button"
                      disabled={!canMint || !isFunction(mint)}
                      onClick={() => isFunction(mint) && mint()}
                    >
                      {mintPriceText} <FontAwesomeIcon icon={faEthereum} /> MINT
                    </ActionButton>
                  </div>
                </div>
                {!canMint && (
                  <div className="left-center-aligned-row open-soon">
                    Diamond Dawn private sale will open soon!
                  </div>
                )}
              </div>
              <div className="center-aligned-row invites-box">
                <div className="image">
                  <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
                </div>
                <div className="text">You’ve been granted 2 invitations</div>
                <Button className="gold" onClick={() => toggleInvites(true)}>
                  INVITE A FRIEND
                </Button>
              </div>
              <div className="timer-box">
                <div className="text-comment">
                  When the time runs out, you'll no longer be able to join
                  Diamond Dawn
                </div>
                <Countdown
                  flat
                  onComplete={() =>
                    isFunction(onCountdownEnd) && onCountdownEnd()
                  }
                  renderParts={{
                    days: true,
                    hours: true,
                    minutes: true,
                    seconds: true,
                  }}
                  {...countdownProps}
                />
              </div>
              <div className="status-box">
                {diamondCount} / {maxDiamonds} MINTED
              </div>
              <MintAddressRow />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MintKeyView;
