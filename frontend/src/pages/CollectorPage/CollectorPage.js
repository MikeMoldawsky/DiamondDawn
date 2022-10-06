import React, {useState} from "react";
import classNames from "classnames";
import map from "lodash/map";
import size from "lodash/size";
import "./CollectorPage.scss";
import { useDispatch, useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import { NavLink, useNavigate } from "react-router-dom";
import { getTokenNextStageName, isTokenActionable } from "utils";
import { setSelectedTokenId } from "store/uiReducer";
import { systemSelector } from "store/systemReducer";
import Diamond from "components/Diamond";
import RequestForm from "components/RequestForm";
import InviteStatus from 'components/InviteStatus'
import {createInviteRequestApi} from "api/serverApi";
import useOnConnect from "hooks/useOnConnect";
import {useAccount} from "wagmi";
import useActionDispatch from "hooks/useActionDispatch";
import {isActionFirstCompleteSelector} from "store/actionStatusReducer";
import {clearInvite, inviteSelector, loadInviteByAddress} from "store/inviteReducer";

function CollectorPage() {
  const tokens = useSelector(tokensSelector);
  const { systemStage, isActive } = useSelector(systemSelector);
  const actionDispatch = useActionDispatch();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const account = useAccount();
  const invite = useSelector(inviteSelector)
  const isInviteFetched = useSelector(isActionFirstCompleteSelector("get-invite-by-address"))

  console.log({ isInviteFetched, invite })

  const loadInvite = async (address) => dispatch(loadInviteByAddress(address))

  useOnConnect(async (address) => {
    actionDispatch(
      () => loadInvite(address),
      "get-invite-by-address"
    )
  }, () => {
    dispatch(clearInvite())
  })

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
    if (size(tokens) > 0) return (
      <div className="cards">{map(tokens, renderTokenCard)}</div>
    )
    if (!isInviteFetched) return null
    return (
      <div className="invite-view">
        {invite ? (
          <InviteStatus />
        ) : (
          <RequestForm createInviteApi={createInviteRequestApi} text="Request Invitation" onSuccess={() => loadInvite(account.address)} />
        )}
      </div>
    )
  }

  return (
    <div className={classNames("page collector-page")}>
      <div className="inner-page">
        <div className="leading-text">Collector's Room</div>
        {renderContent()}
      </div>
    </div>
  );
}

export default CollectorPage;
