import React, { useEffect, useState } from "react";
import classNames from "classnames";
import useDDContract from "hooks/useDDContract";
import { useNavigate, useParams } from "react-router-dom";
import ActionButton from "components/ActionButton";
import {rebirthApi} from "api/contractApi";

function RebirthPage() {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const contract = useDDContract();
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const events = await contract.queryFilter(contract.filters.Transfer());
      console.log({ events });
    };
    if (tokenId) {
      fetch();
    }
  }, [tokenId]);

  if (!tokenId) navigate("/");

  const rebirth = async () => {
    const tx = await rebirthApi(contract, tokenId);
    await tx.wait();

    setShowComplete(true);
  };

  return (
    <div className={classNames("page rebirth-page")}>
      <div className="action-view">
        <div className="leading-text">DIAMOND REBIRTH</div>
        {showComplete ? (
          <div className="secondary-text">Complete</div>
        ) : (
          <ActionButton actionKey="Rebirth" onClick={rebirth}>
            Rebirth
          </ActionButton>
        )}
      </div>
    </div>
  );
}

export default RebirthPage;
