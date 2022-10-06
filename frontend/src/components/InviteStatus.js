import React from 'react'
import {useSelector} from "react-redux";
import {inviteSelector} from "store/inviteReducer";

const InviteStatus = () => {
  const invite = useSelector(inviteSelector)

  return invite ? (
    <div className="invite-status">You have an invite</div>
  ) : null
}

export default InviteStatus