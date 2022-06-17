import React from 'react'

export function NoNFTsMessage({ selectedAddress }) {
  return (
    <>
      <p>{selectedAddress}</p>
      <p>You don't own any Tweezers NFTs...</p>
    </>
  )
}
