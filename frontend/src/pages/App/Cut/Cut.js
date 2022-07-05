import React, { useState } from "react";
import _ from 'lodash'
import Countdown from 'react-countdown';
import { showError } from "utils";
import useDDContract from "hooks/useDDContract";
import { BigNumber, utils as ethersUtils } from "ethers";
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import { tokenByIdSelector } from "store/tokensReducer";
import { systemSelector } from "store/systemReducer";

const Cut = () => {
  const [actionTxId, setActionTxId] = useState(false)
  const contract = useDDContract()
  const { selectedTokenId } = useSelector(uiSelector)
  const token = useSelector(tokenByIdSelector(selectedTokenId))
  const { cutPrice } = useSelector(systemSelector)

  if (!token) return null

  const cut = async () => {
    try {
      const tx = await contract.cut(selectedTokenId, { value: token.cutable ? BigNumber.from(0) : cutPrice })
      const receipt = await tx.wait()

      setActionTxId(receipt.transactionHash)
    }
    catch (e) {
      showError(e, 'Cut Failed')
    }
  }

  return (
    <div className="action-view mine">
      <div className="leading-text">Cut is open:</div>
      <div className="action">
        {_.isEmpty(actionTxId)
          ? (
            <>
              <div className="button action-button" onClick={cut}>CUT{token.cutable ? '' : ` (${ethersUtils.formatUnits(cutPrice)} ETH)`}</div>
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
