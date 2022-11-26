import React, { useState } from "react";
import { useNetwork } from "wagmi";
import get from "lodash/get";
import map from "lodash/map";
import includes from "lodash/includes";
import { chainNameById } from "utils";
import PageCover from "components/PageCover";

const SHOW_TEXT_TIME = 100;

const NetworkGuard = ({ children }) => {
  const { chain, chains } = useNetwork();
  const [showText, setShowText] = useState(false);

  // TODO - remove this after setting up app-shell caching
  setTimeout(() => {
    setShowText(true);
  }, SHOW_TEXT_TIME);

  if (chain?.id && !includes(map(chains, "id"), chain.id))
    return (
      <PageCover
        showText={showText}
        title={<span className="text-red">WRONG NETWORK</span>}
        text={
          <span className="">
            please switch to {chainNameById(get(chains, [0, "id"]))}
          </span>
        }
      />
    );

  return children;
};

export default NetworkGuard;
