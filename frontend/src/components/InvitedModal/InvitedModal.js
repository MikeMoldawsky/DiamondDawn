import React, {useEffect} from "react";
import Modal from "components/Modal";
import { getCDNImageUrl } from "utils";
import "./InvitedModal.scss";
import { CollectorLink, TwitterLink } from "components/Links";
import WaitFor from "containers/WaitFor";
import Button from "components/Button";
import classNames from "classnames";
import {useSelector} from "react-redux";
import {isActionPendingSelector} from "store/actionStatusReducer";
import Scrollbar from "react-scrollbars-custom";
import useActionDispatch from "hooks/useActionDispatch";
import {communitySelector, loadCommunityMembers} from "store/communityReducer";
import {ACTION_KEYS} from "consts";
import MemberList from "components/MemberList";
import { NavLink } from "react-router-dom"

const InvitedModalContent = ({ close, invite }) => {
  const actionDispatch = useActionDispatch();
  const {members} = useSelector(communitySelector)

  useEffect(() => {
    actionDispatch(
      loadCommunityMembers(),
      ACTION_KEYS.GET_COMMUNITY_MEMBERS
    );
  }, [])

  if (!invite)
    return (
      <>
        <div className="center-aligned-row modal-title">
          <div className="leading-text">JOIN WAITING LIST</div>
          <div className="image">
            <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
          </div>
        </div>
        <div className="text">
          Diamond Dawn is an invite-only project. There are only 2 ways to join:
        </div>
        <div className="stretched-column invite-options">
          <div className="left-center-aligned-row invite-option">
            <div className="option-num">1.</div>
            <div className="option-content">
              Request to <NavLink to="/join" className="text-gold">Join</NavLink> without an invite
            </div>
          </div>
          <div className="start-start-aligned-row invite-option">
            <div className="option-num">2.</div>
            <div className="stretched-column option-content">
              <div>Get an invite from a community member<span className="text-sm"> (recommended)</span></div>
              <div className="members-wrapper">
                <WaitFor actions={[{ key: ACTION_KEYS.GET_COMMUNITY_MEMBERS, isFirstComplete: true }]} loaderText="Loading Members...">
                  <Scrollbar noDefaultStyles disableTracksWidthCompensation removeTracksWhenNotUsed>
                    <MemberList members={members} limit={15} />
                  </Scrollbar>
                </WaitFor>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <NavLink to="/community" className="text-gold">All Community Members >></NavLink>
        </div>
      </>
    );

  const { inviter, inviterName, collector, revoked } = invite;

  if (collector || revoked)
    return (
      <>
        <div className="image">
          <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
        </div>
        <div className="leading-text">INVITATION USED</div>
        <div className="text">
          This invitation has already been used.
          <br />
          You can contact{" "}
          <TwitterLink className="text-gold">
            <b>@DiamondDawnNFT</b>
          </TwitterLink>{" "}
          for a new invitation
        </div>
        <div className="text-center">
          <Button className="gold" onClick={close} sfx="explore">
            CLOSE
          </Button>
        </div>
      </>
    );

  return (
    <>
      <div className="image">
        <img src={getCDNImageUrl("envelop-wings.png")} alt="" />
      </div>
      <div className="leading-text">CONGRATULATIONS</div>
      <div className="text">
        You’ve been invited by{" "}
        <CollectorLink collector={inviter} twitter={inviterName} /> to
        participate in Diamond Dawn’s journey.
      </div>
      <div className="text">
        Your invitation means you're a top candidate for the project, and you'll
        get priority in the review process over other collectors.
      </div>
      <div className="text-center">
        <Button className="gold" onClick={close}>
          Continue
        </Button>
      </div>
    </>
  );
};

const InvitedModal = ({ close, onCopy, invite }) => {

  const isGetInvitePending = useSelector(isActionPendingSelector("get-invite-by-id"))
  const isNoInvite = !isGetInvitePending && !invite

  return (
    <Modal
      className={classNames("invited-modal", { "no-invite": isNoInvite })}
      close={close}
      backdropClose={!invite}
      withCloseBtn
    >
      <div className="center-aligned-column modal-content">
        {/*<WaitFor actions={["get-invite-by-id"]}>*/}
        <InvitedModalContent close={close} onCopy={onCopy} invite={invite} />
        {/*</WaitFor>*/}
      </div>
    </Modal>
  );
};

export default InvitedModal;
