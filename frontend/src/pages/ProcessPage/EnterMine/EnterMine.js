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
import { enterApi } from "api/contractApi";
import { useNavigate } from "react-router-dom";
import { confirmInviteUsedApi, signInviteApi } from "api/serverApi";
import {showError} from "utils";

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

const EnterMine = ({ invite }) => {
  const [selectedPackage, setSelectedPackage] = useState(0);
  const { minePrice } = useSelector(systemSelector);
  const account = useAccount();
  const contract = useDDContract();
  const dispatch = useDispatch();
  const tokens = useSelector(tokensSelector);
  const navigate = useNavigate();

  const maxTokenId = _.max(_.map(tokens, "id"));

  useMountLogger("EnterMine");

  useEffect(() => {
    dispatch(loadMinePrice(contract));
  }, []);

  if (!invite || invite.revoked || invite.used) return null;

  const onInviteExpired = () => navigate("/");

  const executeEnterMine = async () => {
    let signature
    try {
      const response = await signInviteApi(invite._id, account.address);
      signature = response.signature
    }
    catch (e) {
      navigate("/")
      throw new Error("Invite expired or already used")
    }
    const tx = await enterApi(contract, minePrice, signature);
    await tx.wait();
    await confirmInviteUsedApi(invite._id);
    return tx;
  };

  const EnterMineContent = ({ execute }) => {
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
        <Countdown
          date={invite.expires}
          text={["Invite Expires in"]}
          onComplete={onInviteExpired}
          renderParts={{
            days: true,
            hours: true,
            minutes: true,
            seconds: true,
          }}
        />
      </>
    );
  };

  return (
    <ActionView
      watch={watchTokenMinedBy(account.address, maxTokenId)}
      transact={executeEnterMine}
      videoUrl={DUMMY_VIDEO_URL}
    >
      <EnterMineContent />
    </ActionView>
  );
};

export default EnterMine;
