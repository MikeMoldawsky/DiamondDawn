import React, { useEffect, useState } from "react";
import classNames from "classnames";
import map from "lodash/map";
import size from "lodash/size";
import "./CollectorPage.scss";
import { useDispatch, useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import { NavLink, useNavigate } from "react-router-dom";
import {getCDNObjectUrl, getTokenNextStageName, isDemo, isTokenActionable, shortenEthAddress} from "utils";
import { setSelectedTokenId } from "store/uiReducer";
import { systemSelector } from "store/systemReducer";
import Diamond from "components/Diamond";
import RequestForm from "components/RequestForm";
import InviteStatus from "components/InviteStatus";
import { createInviteRequestApi } from "api/serverApi";
import useOnConnect from "hooks/useOnConnect";
import { useAccount } from "wagmi";
import useActionDispatch from "hooks/useActionDispatch";
import {
  clearActionStatus,
  isActionFirstCompleteSelector,
} from "store/actionStatusReducer";
import {
  clearInvite,
  inviteSelector,
  loadInviteByAddress,
} from "store/inviteReducer";
import AccountProvider from "containers/AccountProvider";
import TokensProvider from "containers/TokensProvider";
import { SYSTEM_STAGE } from "consts";
import Wallet from "components/Wallet";
import ReactPlayer from "react-player";
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import Box from "components/Box";

function CollectorPage() {
  const tokens = useSelector(tokensSelector);
  const { systemStage, isActive } = useSelector(systemSelector);
  const actionDispatch = useActionDispatch();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const account = useAccount();
  const invite = useSelector(inviteSelector);
  const isInviteFetched = useSelector(
    isActionFirstCompleteSelector("get-invite-by-address")
  );

  const isInviteStage = systemStage === SYSTEM_STAGE.INVITE && isActive;

  const loadInvite = async (address) => dispatch(loadInviteByAddress(address));

  const clearInviteState = () => {
    dispatch(clearInvite());
    dispatch(clearActionStatus("get-invite-by-address"));
  };

  useOnConnect(
    async (address) => {
      clearInviteState();
      actionDispatch(() => loadInvite(address), "get-invite-by-address");
    },
    () => {
      clearInviteState();
    }
  );

  useEffect(() => {
    return clearInviteState;
  }, []);

  const goToProcess = (tokenId) => (e) => {
    e.stopPropagation();
    dispatch(setSelectedTokenId(tokenId));
    navigate("/process");
  };

  const renderTokenCard = (token) => {
    const { name, id } = token;
    return (
      <div key={`token-card-${id}`} className="card-container">
        <div className="token-card">
          <NavLink to={`/nft/${id}`}>
            <div className="token-id">{name}</div>
            <Diamond diamond={token} />
            <div className="card-footer" />
          </NavLink>
          {isTokenActionable(token, systemStage, isActive) && (
            <div className="button" onClick={goToProcess(token.id)}>
              {getTokenNextStageName(token)}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (size(tokens) > 0)
      return <div className="cards">{map(tokens, renderTokenCard)}</div>;
    if (systemStage > SYSTEM_STAGE.INVITE)
      return (
        <>
          <div className="secondary-text">Invitations stage is complete</div>
          <div className="button link-opensea">BUY ON OPENSEA</div>
        </>
      );
    if (!isInviteStage)
      return (
        <>
          <div className="secondary-text">
            Invitations stage not started yet
          </div>
        </>
      );
    if (!isInviteFetched) return null;
    return (
      <div className="invite-view">
        {invite ? (
          <InviteStatus />
        ) : (
          <RequestForm
            createInviteApi={createInviteRequestApi}
            text="Request Invitation"
            onSuccess={() => loadInvite(account.address)}
          />
        )}
      </div>
    );
  };

  const renderDemoContent = () => {
    if (!account?.address) return (
      <div className="center-aligned-column not-connected">
        <div className="heading">
          <div className="leading-text">WELCOME</div>
          <div className="leading-text">TO THE COLLECTORS ROOM</div>
        </div>
        <div className="center-aligned-column bottom-content">
          <AllInclusiveIcon />
          <div className="secondary-text">CONNECT WALLET TO CONTINUE</div>
          <Wallet label="connect" />
        </div>
      </div>
    )

    return (
      <div className="layout-box">
        <div className="box image-box">
          <ReactPlayer
            url={getCDNObjectUrl("/videos/infinity_logo.mp4")}
            playing
            playsinline
            controls={false}
            muted
            loop
            className="react-player loader"
            width="100%"
            height="100%"
          />
          <div className="description">
            A video showing the evolution of the stone? The different types of cutting? Something intriguing and mysterious
          </div>
        </div>
        <div className="title-box">
          <div className="secondary-text">Hello {shortenEthAddress(account.address)}</div>
        </div>
        <div className="content-box">
          <div className="leading-text">JOIN DIAMOND DAWN</div>
          <div className="text">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the</div>
          <RequestForm
            createInviteApi={createInviteRequestApi}
            text="Request Invitation"
            onSuccess={() => loadInvite(account.address)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={classNames("page collector-page")}>
      <div className="inner-page">
        <h1>The Collector's Room</h1>
        <Box className="main-box">
          {!isDemo() ? (
            <AccountProvider>
              <TokensProvider withLoader>{renderContent()}</TokensProvider>
            </AccountProvider>
          ) : renderDemoContent()}
        </Box>
      </div>
    </div>
  );
}

export default CollectorPage;
