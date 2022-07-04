import React, { useEffect, useState } from "react";
import _ from 'lodash'
import Countdown from 'react-countdown';
import { parseError } from 'utils'
import useDDContract from "hooks/useDDContract";
import { BigNumber } from "ethers";

const Polish = () => {
  const [actionTxId, setActionTxId] = useState(false)

  const contract = useDDContract()

  const [prepaidProcessingPrice, setPrepaidProcessingPrice] = useState(BigNumber.from(0))

  const loadPrices = async () => {
    setPrepaidProcessingPrice(await contract.PREPAID_PROCESSING_PRICE())
  }

  useEffect(() => {
    loadPrices()
  }, [])

  const polish = async () => {
    try {
      const tx = await contract.polish(0, { value: prepaidProcessingPrice })
      const receipt = await tx.wait()

      setActionTxId(receipt.transactionHash)
    }
    catch (e) {
      console.error(`Polish failed`, parseError(e))
    }
  }

  return (
    <div className="action-view mine">
      <div className="leading-text">Polish is open:</div>
      <div className="action">
        {_.isEmpty(actionTxId)
          ? (
            <>
              <div className="button" onClick={polish}>POLISH</div>
              <div className="leading-text">Polish ends in in:</div>
            </>
          )
          : (<div className="result">
              <div>Polish Success!</div>
              <div>TX: {actionTxId}</div>
              <div className="next-stage">
                <div className="leading-text">Burn stage will be open in:</div>
              </div>
            </div>
          )
        }
        <div className="countdown">
          <Countdown date={Date.now() + 10000} />
        </div>
      </div>
    </div>
  )
}

export default Polish;
