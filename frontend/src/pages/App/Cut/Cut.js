import React, { useEffect, useState } from "react";
import _ from 'lodash'
import Countdown from 'react-countdown';
import { parseError } from 'utils'
import useDDContract from "hooks/useDDContract";
import { BigNumber } from "ethers";

const Cut = () => {
  const [actionTxId, setActionTxId] = useState(false)

  const contract = useDDContract()

  const [prepaidProcessingPrice, setPrepaidProcessingPrice] = useState(BigNumber.from(0))

  const loadPrices = async () => {
    setPrepaidProcessingPrice(await contract.PREPAID_PROCESSING_PRICE())
  }

  useEffect(() => {
    loadPrices()
  }, [])

  const cut = async () => {
    try {
      const tx = await contract.cut(0, { value: prepaidProcessingPrice })
      const receipt = await tx.wait()

      setActionTxId(receipt.transactionHash)
    }
    catch (e) {
      console.error(`Cut failed`, parseError(e))
    }
  }

  return (
    <div className="action-view mine">
      <div className="leading-text">Cut is open:</div>
      <div className="action">
        {_.isEmpty(actionTxId)
          ? (
            <>
              <div className="button" onClick={cut}>CUT</div>
              <div className="leading-text">Cut ends in in:</div>
            </>
          )
          : (<div className="result">
              <div>Cut Success!</div>
              <div>TX: {actionTxId}</div>
              <div className="next-stage">
                <div className="leading-text">Polish stage will be open in:</div>
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

export default Cut;
