import React, { useState } from "react";
import _ from 'lodash'
import Countdown from 'react-countdown';
import { showError } from "utils";
import useDDContract from "hooks/useDDContract";
import { BigNumber, utils as ethersUtils } from "ethers";
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import { systemSelector } from "store/systemReducer";
import { tokenByIdSelector } from "store/tokensReducer";

const Polish = () => {
  const [actionTxId, setActionTxId] = useState(false)
  const contract = useDDContract()
  const { selectedTokenId } = useSelector(uiSelector)
  const token = useSelector(tokenByIdSelector(selectedTokenId))
  const { polishPrice } = useSelector(systemSelector)

  const polish = async () => {
    try {
      const tx = await contract.polish(selectedTokenId, { value: token.polishable ? BigNumber.from(0) : polishPrice })
      const receipt = await tx.wait()

      setActionTxId(receipt.transactionHash)
    }
    catch (e) {
      showError(e, 'Polish Failed')
    }
  }

  return (
    <div className="action-view mine">
      <div className="leading-text">Polish is open:</div>
      <div className="action">
        {_.isEmpty(actionTxId)
          ? (
            <>
              <div className="button action-button" onClick={polish}>POLISH{token.polishable ? '' : ` (${ethersUtils.formatUnits(polishPrice)} ETH)`}</div>
              <div className="leading-text">Polish ends in:</div>
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
