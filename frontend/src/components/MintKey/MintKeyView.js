import React, { useCallback, useEffect } from "react";
import "./MintKey.scss";
import ActionButton from "components/ActionButton";
import isFunction from "lodash/isFunction";
import InvitationsStatus from "components/InvitationsStatus";
import { useDispatch, useSelector } from "react-redux";
import { createVideoSources, getCDNImageUrl } from "utils";
import { uiSelector, updateUiState } from "store/uiReducer";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Button from "components/Button";
import MintAddressRow from "components/MintAddressRow";
import InlineVideo from "components/VideoPlayer/InlineVideo";
import useMusic from "hooks/useMusic";
import { Desktop, MobileOrTablet } from "hooks/useMediaQueries";
import { useSearchParams } from "react-router-dom";
import classNames from "classnames";
import { BLOCKED_COUNTRY_TEXT } from "consts";
import {collectorSelector} from "store/collectorReducer";

const MintKeyView = ({
  maxSupply,
  tokensMinted,
  canMint,
  isHonorary,
  mint,
  forceButtonLoading,
  onMintError,
}) => {
  const [searchParams] = useSearchParams();
  const showInvitesParam = searchParams.get("invites") === "true";
  const dispatch = useDispatch();
  const { mintViewShowInvites: showInvites, geoLocation } =
    useSelector(uiSelector);
  const { numNFTs } = useSelector(collectorSelector)

  const toggleInvites = (show) => {
    dispatch(updateUiState({ mintViewShowInvites: show }));
  };

  useMusic("accepted.mp3");

  useEffect(() => {
    if (showInvitesParam) {
      toggleInvites(true);
    }
  }, [showInvitesParam]);

  const renderHandAndKeyVideo = useCallback(() => {
    return (
      <div className="image-box">
        <InlineVideo src={createVideoSources("hand-2-keys")} />
      </div>
    );
  }, []);

  const renderTitle = () => (
    <div className="congrats-box">
      <div className="left-top-aligned-column">
        <div className="leading-text">CONGRATULATIONS</div>
        <div className="congrats-text">
          You’ve been accepted to participate in Diamond Dawn’s historical
          journey.
          <br />
          The key grants you <b>full access</b> to the 5 phases of DD's journey,
          starting in the virtual mine, where your journey begins.
        </div>
      </div>
    </div>
  );

  const renderMintButton = () => {
    const text = isHonorary
      ? "ACTIVATE HONORARY KEY"
      : `ACTIVATE ${numNFTs} KEY${numNFTs > 1 ? "S" : ""}`
    return (
      <div className="center-aligned-column button-column">
        <div className="left-center-aligned-row price-text">{text}</div>
        <div>
          <ActionButton
            actionKey="MintKey"
            className="gold lg mint-button"
            sfx="action"
            disabled={!canMint || !isFunction(mint) || geoLocation?.blocked}
            title={geoLocation?.blocked ? BLOCKED_COUNTRY_TEXT : ""}
            isLoading={forceButtonLoading}
            onClick={mint}
            onError={onMintError}
          >
            MINT FOR FREE
          </ActionButton>
        </div>
        {geoLocation?.vat && (
          <div className="vat-text">* VAT included in Price</div>
        )}
      </div>
    )
  };

  return (
    <div className={classNames("action-view enter", { minting: canMint })}>
      <div className="layout-box">
        {!showInvites && <MobileOrTablet>{renderTitle()}</MobileOrTablet>}
        <Desktop>{renderHandAndKeyVideo()}</Desktop>
        <div className="content-box">
          {showInvites ? (
            <div className="center-aligned-column invites-view">
              <div className="back-button" onClick={() => toggleInvites(false)}>
                <ArrowBackIosNewIcon />
              </div>
              <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
              <div className="text">
                Diamond Dawn's invitation system is designed to ensure fairness
                by granting you the power to choose who should join the project.
                <br />
                <br />
                <b>These invitations are extremely valuable.</b>
                <br />
                <br />
                Why?
                <br />
                Because your invited friends will get priority in the review
                process over other collectors.
              </div>
              <InvitationsStatus />
            </div>
          ) : (
            <>
              <Desktop>{renderTitle()}</Desktop>
              <div className="left-center-aligned-row mint-box">
                <div className="spaced-bottom-row">
                  <MobileOrTablet>
                    <div className="center-aligned-row">
                      {renderHandAndKeyVideo()}
                      {renderMintButton()}
                    </div>
                  </MobileOrTablet>
                  <Desktop>{renderMintButton()}</Desktop>
                  <div className="center-aligned-column open-soon">
                    {/*{renderCountdown()}*/}
                  </div>
                </div>
              </div>
              <div className="center-aligned-row invites-box">
                <div className="image">
                  <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
                </div>
                <div className="center-aligned-row invites-box-text">
                  <div className="text">
                    Increase your friend's chances of being accepted
                  </div>
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
          {tokensMinted} / {maxSupply} MINTED
        </div>
      )}
    </div>
  );
};

export default MintKeyView;
