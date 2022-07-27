import React, { useEffect, useState } from "react";
import classNames from "classnames";
import Wallet from "components/Wallet";
import Header from "components/Header";
import useDDContract from "hooks/useDDContract";
import { useNavigate, useParams } from "react-router-dom";
import ActionButton from "components/ActionButton";

function RebirthPage() {

  const { token } = useParams()
  const navigate = useNavigate()
  const contract = useDDContract()
  const [showComplete, setShowComplete] = useState(false)
  const [metadata, setMetadata] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      const md = await contract.tokenURI(token)
      setMetadata(JSON.parse(atob(md.split(",")[1])))

      const events = await contract.queryFilter(contract.filters.Transfer())
      console.log({ events })
    }
    if (token) {
      fetch()
    }
  }, [token])

  if (!token) navigate('/')

  const rebirth = async () => {
    const tx = await contract.rebirth(token)
    const receipt = await tx.wait()

    setShowComplete(true)
  }

  return (
    <div className={classNames("app")}>
      <Header>
        <Wallet />
      </Header>
      <main>
        <div className="action-view">
          <div className="leading-text">DIAMOND REBIRTH</div>
          {showComplete
            ? (<div className="secondary-text">Complete</div>)
            : (<ActionButton actionKey="Rebirth" onClick={rebirth}>Rebirth</ActionButton>)
          }
        </div>
      </main>
    </div>
  );
}

export default RebirthPage;
