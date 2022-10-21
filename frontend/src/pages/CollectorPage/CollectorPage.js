import React, { useEffect } from "react";
import classNames from "classnames";
import map from "lodash/map";
import size from "lodash/size";
import "./CollectorPage.scss";
import { useDispatch, useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import { NavLink, useNavigate } from "react-router-dom";
import {
  getCDNObjectUrl,
  getTokenNextStageName,
  isTokenActionable,
  shortenEthAddress,
} from "utils";
import { setSelectedTokenId } from "store/uiReducer";
import { systemSelector } from "store/systemReducer";
import Diamond from "components/Diamond";
import RequestForm from "components/RequestForm";
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
  openInvite,
} from "store/inviteReducer";
import { SYSTEM_STAGE } from "consts";
import Wallet from "components/Wallet";
import Box from "components/Box";
import Loading from "components/Loading";
import EnterMine from "pages/ProcessPage/EnterMine";
import Suspense, { useIsReady } from "components/Suspense";

const NotConnectedView = ({ name }) => {
  return (
    <div className="center-aligned-column not-connected">
      <div className="heading">
        <div className="leading-text">WELCOME</div>
        <div className="leading-text">TO {name}</div>
      </div>
      <div className="center-aligned-column bottom-content">
        <img src={getCDNObjectUrl("/images/infinity_icon.png")} alt="" />
        <div className="secondary-text">CONNECT WALLET TO CONTINUE</div>
        <Wallet label="connect" className="button" />
      </div>
    </div>
  );
};

const ContentBox = ({ className, children }) => {
  const account = useAccount();

  const suspense = ["get-contract"];
  if (account?.address) {
    suspense.push({ isFirstComplete: true, key: "load-nfts" });
  }

  const isReady = useIsReady(suspense);

  return (
    <Box
      className={classNames(
        "main-box",
        { opaque: !account?.address },
        isReady && className
      )}
    >
      {account?.address ? (
        <Suspense withLoader actions={suspense}>
          {children}
        </Suspense>
      ) : (
        <NotConnectedView name="THE COLLECTORS ROOM" />
      )}
    </Box>
  );
};

const InviteView = ({ invite, loadInvite }) => {
  const account = useAccount();

  const title = invite ? "REQUEST STATUS" : "JOIN DIAMOND DAWN";

  return (
    <ContentBox className="opaque invite">
      <div className="layout-box">
        <div className="image-box">
          <div className="image-placeholder" />
          <div className="description">
            A video showing the evolution of the stone? The different types of
            cutting? Something intriguing and mysterious
          </div>
        </div>
        <div className="title-box">
          <div className="secondary-text">
            Hello {shortenEthAddress(account.address)}
          </div>
        </div>
        <div className="content-box">
          <div className="leading-text">{title}</div>
          <div className="text">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the
          </div>
          {invite ? (
            <div className="request-status">
              <div className="text-comment">Your request has been sent</div>
              <div className="text-comment">STATUS: Pending</div>
            </div>
          ) : (
            <RequestForm onSuccess={() => loadInvite(account.address)} />
          )}
        </div>
      </div>
    </ContentBox>
  );
};

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

  useEffect(() => {
    if (invite?.approved && !invite?.opened) {
      dispatch(openInvite(invite._id, account.address));
    }
  }, [invite?.approved, invite?.opened]);

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
      return (
        <ContentBox>
          <div className="cards">{map(tokens, renderTokenCard)}</div>
        </ContentBox>
      );

    if (systemStage > SYSTEM_STAGE.FORGE)
      return (
        <ContentBox className="opaque">
          <div className="secondary-text">Invitations stage is complete</div>
          <div className="button link-opensea">BUY ON OPENSEA</div>
        </ContentBox>
      );

    if (!isInviteFetched || (invite.approved && !invite.opened))
      return (
        <ContentBox>
          <Loading />
        </ContentBox>
      );

    if (invite.revoked)
      return (
        <ContentBox className="opaque">
          <div className="center-center-aligned-row secondary-text">
            Invitations Used
          </div>
        </ContentBox>
      );

    if (invite.revoked)
      return (
        <ContentBox className="opaque">
          <div className="center-center-aligned-row secondary-text">
            Invitations Expired
          </div>
        </ContentBox>
      );

    if (invite.approved)
      return (
        <ContentBox>
          <EnterMine invite={invite} />
        </ContentBox>
      );

    return <InviteView invite={invite} loadInvite={loadInvite} />;
  };

  return (
    <div className={classNames("page collector-page")}>
      <div className="inner-page">
        <h1>The Collector's Room</h1>
        {renderContent()}
      </div>
    </div>
  );
}

export default CollectorPage;
