import React, {useEffect, useState} from 'react'
import useOnConnect from "hooks/useOnConnect";
import {getInviteByAddressApi} from "api/serverApi";

const InviteStatus = () => {
  const [invite, setInvite] = useState(null)

  console.log('Invite Status', {invite})

  useOnConnect(async (address) => {
    setInvite(await getInviteByAddressApi(address))
  }, () => {
    setInvite(null)
  })
}

export default InviteStatus