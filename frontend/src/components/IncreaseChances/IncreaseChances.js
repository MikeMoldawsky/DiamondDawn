import React, {useRef, useState} from "react"
import useOnClickOutside from "hooks/useClickOutside";
import {TwitterLink} from "components/Links";
import "./IncreaseChances.scss"

const IncreaseChancesPopup = ({ hide }) => {
  const popup = useRef(null)

  useOnClickOutside(popup, hide)

  return (
    <div className="popup" ref={popup}>
      <ul>
        <li>
          Follow{" "}
          <TwitterLink className="text-gold">
            <b>@DiamondDawnNFT</b>
          </TwitterLink>
          .
        </li>
        <li>Get an invite from an accepted collector.</li>
        <li>Submit a genuine reason for joining.</li>
        <li>
          Prove your ability to participate in a high mint project (having
          4.44 ETH is 10/10)
        </li>
      </ul>
    </div>
  )
}

const IncreaseChances = () => {
  const [showPopup, setShowPopup] = useState(false)

  return (
    <div className="increase-chances">
      <div className="increase-text" onClick={() => setShowPopup(true)}>How to increase your chances of getting approved?</div>
      {showPopup && (
        <IncreaseChancesPopup hide={() => setShowPopup(false)} />
      )}
    </div>
  )
}

export default IncreaseChances