import React from 'react'

const InviteStatus = ({ invite }) => {
  return invite ? (
    <div className="invite-status">You have an invite</div>
  ) : null
}

export default InviteStatus