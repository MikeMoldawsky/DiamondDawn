import React from "react";
import map from "lodash/map";
import padStart from "lodash/padStart";
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import { NFT_NAME_BY_STAGE, SYSTEM_STAGE } from "consts";
import InlineVideo from "components/VideoPlayer/InlineVideo";
import { createVideoSources } from "utils";

const NFTPlate = () => {
  const { selectedTokenId } = useSelector(uiSelector);

  const renderPlateEntry = (stage, name) => {
    switch (stage) {
      case SYSTEM_STAGE.KEY:
        return (
          <>
            <div>{name}</div>
            <div># {padStart(selectedTokenId, 3, "0")} / 333</div>
          </>
        );
      case SYSTEM_STAGE.DAWN:
      case SYSTEM_STAGE.MINE:
        return (
          <>
            <div>{name}</div>
            <div># 000 / ?</div>
          </>
        );
      default:
        return (
          <div className="unrevealed">
            ?{/*<InlineVideo src={createVideoSources("question-mark")} />*/}
          </div>
        );
    }
  };

  return (
    <div className="nft-plate">
      <div className="bg">
        <div className="nail" />
        <div className="nail" />
        <div className="nail" />
        <div className="nail" />
      </div>
      <div className="center-aligned-row phases">
        {map(NFT_NAME_BY_STAGE, (name, stage) => (
          <div
            key={`plate-phase-${stage}`}
            className="center-aligned-column phase-info"
          >
            <div className="left-centered-aligned-column">
              {renderPlateEntry(parseInt(stage), name)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTPlate;
