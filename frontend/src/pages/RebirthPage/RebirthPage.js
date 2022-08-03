import React, { useEffect, useState } from "react";
import classNames from "classnames";
import useDDContract from "hooks/useDDContract";
import { useNavigate, useParams } from "react-router-dom";
import ActionButton from "components/ActionButton";

function RebirthPage() {

  const { tokenId } = useParams()
  const navigate = useNavigate()
  const contract = useDDContract()
  const [showComplete, setShowComplete] = useState(false)
  const [metadata, setMetadata] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      const md = await contract.tokenURI(tokenId)
      setMetadata(JSON.parse(atob(md.split(",")[1])))

      const events = await contract.queryFilter(contract.filters.Transfer())
      console.log({ events })
    }
    if (tokenId) {
      fetch()
    }
  }, [tokenId])

  if (!tokenId) navigate('/')

  const rebirth = async () => {
    const tx = await contract.rebirth(tokenId)
    const receipt = await tx.wait()

    setShowComplete(true)
  }

  return (
    <div className={classNames("page rebirth-page")}>
      <div className="action-view">
        <div className="leading-text">DIAMOND REBIRTH</div>
        {showComplete
          ? (<div className="secondary-text">Complete</div>)
          : (<ActionButton actionKey="Rebirth" onClick={rebirth}>Rebirth</ActionButton>)
        }
      </div>
    </div>
  );
}

export default RebirthPage;
