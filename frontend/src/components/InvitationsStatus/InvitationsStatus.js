import React from 'react'
import map from 'lodash/map'
import './InvitationsStatus.scss'

const InvitationsStatus = () => {
  const invitations = []

  return (
    <div className="invitations-status">
      {map(invitations, ({}, i) => (
        <div className="status-row">{i}</div>
      ))}
    </div>
  )
}

export default InvitationsStatus