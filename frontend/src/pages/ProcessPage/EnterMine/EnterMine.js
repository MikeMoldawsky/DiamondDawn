import React, { useEffect, useState } from "react";
import _ from "lodash";
import useDDContract from "hooks/useDDContract";
import { utils as ethersUtils } from "ethers";
import classNames from "classnames";
import "./EnterMine.scss";
import { useDispatch, useSelector } from "react-redux";
import { loadMinePrice, systemSelector } from "store/systemReducer";
import Countdown from "components/Countdown";
import { tokensSelector, watchTokenMinedBy } from "store/tokensReducer";
import { useAccount } from "wagmi";
import ActionButton from "components/ActionButton";
import ActionView from "components/ActionView";
import { DUMMY_VIDEO_URL } from "consts";
import useMountLogger from "hooks/useMountLogger";
import {enterMineApi} from "api/contractApi";

const PackageBox = ({ selected, select, index, text, cost }) => {
  return (
    <div
      className={classNames("package", { selected: selected === index })}
      onClick={() => select(index)}
    >
      <div className="package-content">
        <div>{text}</div>
        <div>{ethersUtils.formatUnits(cost)} ETH</div>
      </div>
    </div>
  );
};

const EnterMine = () => {
  const [selectedPackage, setSelectedPackage] = useState(0);
  const { minePrice } = useSelector(systemSelector);
  const account = useAccount();
  const contract = useDDContract();
  const dispatch = useDispatch();
  const tokens = useSelector(tokensSelector);

  const maxTokenId = _.max(_.map(tokens, "id"));

  useMountLogger("EnterMine");

  useEffect(() => {
    dispatch(loadMinePrice(contract));
  }, []);

  const EnterMineContent = ({ execute, endTime }) => {
    return (
      <>
        <div className="leading-text">You are invited...</div>
        <div className="secondary-text">The first one is to believe</div>
        <div className="center-aligned-row packages">
          <PackageBox
            selected={selectedPackage}
            select={setSelectedPackage}
            index={0}
            text="Enter Mine"
            cost={minePrice}
          />
        </div>
        <div className="action">
          <ActionButton
            actionKey="EnterMine"
            className="action-button"
            onClick={execute}
          >
            ENTER MINE
          </ActionButton>
        </div>
        <Countdown date={endTime} text={["You have", "to enter"]} />
      </>
    )
  };

  // const bytesPassword = ethersUtils.formatBytes32String('201854')
  // console.log({ bytesPassword })

  return (
    <ActionView
      watch={watchTokenMinedBy(account.address, maxTokenId)}
      transact={() => enterMineApi(contract, minePrice)}
      videoUrl={DUMMY_VIDEO_URL}
    >
      <EnterMineContent />
    </ActionView>
  );
};

export default EnterMine;
