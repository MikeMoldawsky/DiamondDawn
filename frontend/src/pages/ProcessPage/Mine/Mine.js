import React, { useEffect, useState } from "react";
import useDDContract from "hooks/useDDContract";
import { utils as ethersUtils } from "ethers";
import classNames from "classnames";
import "./Mine.scss";
import { useDispatch, useSelector } from "react-redux";
import { loadMinePrice, systemSelector } from "store/systemReducer";
import Countdown from "components/Countdown";
import { watchTokenMinedBy } from "store/tokensReducer";
import { useAccount } from "wagmi";
import useOnConnect from "hooks/useOnConnect";
import ActionButton from "components/ActionButton";
import ActionView from "components/ActionView";
import { DUMMY_VIDEO_URL } from "consts";
import useMountLogger from "hooks/useMountLogger";
import { mineApi } from "api/contractApi";

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

const Mine = () => {
  const [selectedPackage, setSelectedPackage] = useState(0);
  const { minePrice } = useSelector(systemSelector);
  const account = useAccount();
  const contract = useDDContract();
  const dispatch = useDispatch();
  const [canMine, setCanMine] = useState(true);

  useMountLogger("Mine");

  useEffect(() => {
    dispatch(loadMinePrice(contract));
  }, []);

  useOnConnect(async () => {
    // TODO - apply whitelist once developed
    // const isWhitelisted = await contract.mintAllowedAddresses(account.address);
    setCanMine(true);
  });

  const MineContent = ({ execute, endTime }) => {
    return canMine ? (
      <>
        <div className="leading-text">A DIAMONDS JOURNEY HAS MANY STEPS</div>
        <div className="secondary-text">The first one is to believe</div>
        <div className="center-aligned-row packages">
          <PackageBox
            selected={selectedPackage}
            select={setSelectedPackage}
            index={0}
            text="Mine"
            cost={minePrice}
          />
        </div>
        <div className="action">
          <ActionButton
            actionKey="Mine"
            className="action-button"
            onClick={execute}
          >
            MINE
          </ActionButton>
        </div>
        <Countdown date={endTime} text={["You have", "to mine"]} />
      </>
    ) : (
      <div className="">
        <div className="leading-text">ADDRESS NOT ALLOWED TO MINE</div>
        <div className="button action-button">REQUEST WHITELIST</div>
        <Countdown date={endTime} text={["You have", "to mine"]} />
      </div>
    );
  };

  return (
    <ActionView
      watch={watchTokenMinedBy(account.address)}
      transact={() => mineApi(contract, minePrice)}
      videoUrl={DUMMY_VIDEO_URL}
    >
      <MineContent />
    </ActionView>
  );
};

export default Mine;
