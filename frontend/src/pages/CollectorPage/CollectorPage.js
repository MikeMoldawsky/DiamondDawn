import React, { useEffect } from "react";
import classNames from "classnames";
import map from "lodash/map";
import size from "lodash/size";
import "./CollectorPage.scss";
import { useDispatch, useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import { NavLink, useNavigate } from "react-router-dom";
import {
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
import Box from "components/Box";
import Loading from "components/Loading";
import EnterMine from "pages/ProcessPage/EnterMine";
import Suspense from "components/Suspense";

const InviteView = ({ invite, loadInvite }) => {
  const account = useAccount();

  const title = invite ? "REQUEST STATUS" : "JOIN DIAMOND DAWN";

  return (
    <div className="box-content opaque invite">
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
            Hello {shortenEthAddress(account?.address)}
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
    </div>
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
        <div className="box-content nfts">{map(tokens, renderTokenCard)}</div>
      );

    if (systemStage > SYSTEM_STAGE.FORGE)
      return (
        <div className="box-content opaque opensea">
          <div className="secondary-text">Invitations stage is complete</div>
          <div className="button link-opensea">BUY ON OPENSEA</div>
        </div>
      );

    if (!isInviteFetched || (invite.approved && !invite.opened))
      return (
        <div className="box-content box-loading">
          <Loading />
        </div>
      );

    if (invite.used)
      return (
        <div className="box-content opaque">
          <div className="center-center-aligned-row secondary-text">
            Invitations Used
          </div>
        </div>
      );

    if (invite.revoked)
      return (
        <div className="box-content opaque">
          <div className="center-center-aligned-row secondary-text">
            Invitations Expired
          </div>
        </div>
      );

    if (invite.approved)
      return (
        <div className="box-content approved">
          <EnterMine invite={invite} />
        </div>
      );

    return <InviteView invite={invite} loadInvite={loadInvite} />;
  };

  const suspenseActions = ["get-contract"];
  if (account?.address) {
    suspenseActions.push({ isFirstComplete: true, key: "load-nfts" });
  }

  return (
    <div className={classNames("page collector-page")}>
      <div className="inner-page">
        <h1>The Collector's Room</h1>
        <Box className={"main-box"}>
          <Suspense withLoader actions={suspenseActions} viewName={"THE COLLECTORS ROOM"}>
            {renderContent()}
          </Suspense>
        </Box>
      </div>
    </div>
  );
}

export default CollectorPage;
