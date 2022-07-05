import React, { useState } from "react";
import _ from 'lodash'
import Countdown from 'react-countdown';
import { showError } from 'utils'
import useDDContract from "hooks/useDDContract";
import { utils as ethersUtils } from "ethers";
import classNames from "classnames";
import './Mine.scss'
import { useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";

const PackageBox = ({ selected, select, index, text, cost }) => {
  return (
    <div className={classNames("package", { selected: selected === index })} onClick={() => select(index)}>
      <div className="package-content">
        <div>{text}</div>
        <div>{ethersUtils.formatUnits(cost)} ETH</div>
      </div>
    </div>
  )
}

const Mine = () => {
  const [actionTxId, setActionTxId] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(0)
  const { minePrice, mineAndCutPrice, fullPrice } = useSelector(systemSelector)

  const contract = useDDContract()

  const mine = async () => {
    try {
      let totalCost = minePrice
      if (selectedPackage === 1) {
        totalCost = mineAndCutPrice
      }
      else if (selectedPackage === 2) {
        totalCost = fullPrice
      }

      const tx = await contract.mine(selectedPackage, { value: totalCost })
      const receipt = await tx.wait()

      setActionTxId(receipt.transactionHash)
    }
    catch (e) {
      showError(e, 'Mine Failed')
    }
  }

  return (
    <div className="action-view mine">
      <div className="leading-text">Mine is open:</div>
      <div className="center-aligned-row packages">
        <PackageBox selected={selectedPackage} select={setSelectedPackage} index={0} text="Mine" cost={minePrice} />
        <PackageBox selected={selectedPackage} select={setSelectedPackage} index={1} text="Mine and Cut" cost={mineAndCutPrice} />
        <PackageBox selected={selectedPackage} select={setSelectedPackage} index={2} text="Mine, Cut, Polish and Diamond" cost={fullPrice} />
      </div>
      <div className="action">
        {_.isEmpty(actionTxId)
          ? (
            <>
              <div className="button action-button" onClick={mine}>MINE</div>
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
