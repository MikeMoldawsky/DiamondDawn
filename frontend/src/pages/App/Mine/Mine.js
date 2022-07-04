import React, { useEffect, useState } from "react";
import _ from 'lodash'
import classNames from "classnames";
import Countdown from 'react-countdown';
import { parseError } from 'utils'
import useDDContract from "hooks/useDDContract";
import { BigNumber } from "ethers";

const Mine = () => {
  const [actionTxId, setActionTxId] = useState(false)

  const contract = useDDContract()

  const [miningPrice, setMiningPrice] = useState(BigNumber.from(0))
  const [prepaidProcessingPrice, setPrepaidProcessingPrice] = useState(BigNumber.from(0))
  const creditsInput = 0

  const loadPrices = async () => {
    setMiningPrice(await contract.MINING_PRICE())
    setPrepaidProcessingPrice(await contract.PREPAID_PROCESSING_PRICE())
  }

  useEffect(() => {
    loadPrices()
  }, [])

  const mine = async () => {
    try {
      const totalCost = miningPrice.add(prepaidProcessingPrice.mul(creditsInput))

      const tx = await contract.mine(creditsInput, { value: totalCost })
      const receipt = await tx.wait()

      setActionTxId(receipt.transactionHash)
    }
    catch (e) {
      console.error(`Mine failed`, parseError(e))
    }
  }

  return (
    <div className="action-view mine">
      <div className="leading-text">Mine is open:</div>
      <div className="action">
        {_.isEmpty(actionTxId)
          ? (
            <>
              <div className="button" onClick={mine}>MINE</div>
              <div className="leading-text">Mine ends in in:</div>
            </>
          )
          : (<div className="result">
              <div>Mine Success!</div>
              <div>TX: {actionTxId}</div>
              <div className="next-stage">
                <div className="leading-text">Cut stage will be open in:</div>
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

export default Mine;
