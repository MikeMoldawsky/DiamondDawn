import React, { useEffect, useState } from "react";
import useDDContract from "hooks/useDDContract";
import { CONTRACTS, SHAPE, STAGE } from "consts";
import _ from "lodash";
import { getShapeName, getStageName, showError, showSuccess } from "utils";
import ActionButton from "components/ActionButton";

const ART_MAPPING = {
  [STAGE.MINE]: { shapes: [SHAPE.MAKEABLE], setter: "setRoughVideoUrl" },
  [STAGE.CUT]: {
    shapes: [SHAPE.PEAR, SHAPE.ROUND, SHAPE.OVAL, SHAPE.RADIANT],
    setter: "setCutVideoUrl",
  },
  [STAGE.POLISH]: {
    shapes: [SHAPE.PEAR, SHAPE.ROUND, SHAPE.OVAL, SHAPE.RADIANT],
    setter: "setPolishVideoUrl",
  },
  [STAGE.BURN]: { shapes: [SHAPE.NO_SHAPE], setter: "setBurnVideoUrl" },
  [STAGE.REBIRTH]: { shapes: [SHAPE.NO_SHAPE], setter: "setRebirthVideoUrl" },
};

const StageArt = ({ stage }) => {
  const [stageArtData, setStageArtData] = useState({});

  const mineContract = useDDContract(CONTRACTS.DiamondDawnMine);
  const { shapes, setter } = ART_MAPPING[stage];

  const fetchStageArtData = async () => {
    try {
      const stageArt = await Promise.all(
        _.map(shapes, (shape) => mineContract.getDiamondVideoUrl(stage, shape))
      );
      setStageArtData(_.zipObject(_.map(shapes, getShapeName), stageArt));
    } catch (e) {
      console.error("fetchArtData Failed", e);
    }
  };

  useEffect(() => {
    fetchStageArtData();
  }, []);

  const setVideoUrl = (shapeName, videoUrl) => {
    setStageArtData({
      ...stageArtData,
      [shapeName]: videoUrl,
    });
  };

  const saveVideoUrls = async () => {
    try {
      const urls = _.values(stageArtData);
      console.log("saving urls", { urls });
      const tx = await mineContract[setter](...urls);

      await tx.wait();

      showSuccess(`Video urls for ${getStageName(stage)} saved successfully`);
      console.log("saveVideoUrls SUCCESS");
    } catch (e) {
      showError(e, "saveVideoUrls Error");
    }
  };

  return (
    <div className="center-aligned-row stage-art">
      <div className="inputs">
        {_.map(stageArtData, (videoUrl, shapeName) => (
          <div
            key={`stage-art-input-${stage}-${shapeName}`}
            className="input-container"
          >
            <input
              type="text"
              placeholder={shapeName}
              value={videoUrl}
              onChange={(e) => setVideoUrl(shapeName, e.target.value)}
            />
          </div>
        ))}
      </div>
      <ActionButton
        actionKey={`set-stage-art-${stage}`}
        onClick={saveVideoUrls}
      >
        SAVE
      </ActionButton>
    </div>
  );
};

const ArtTab = () => {
  return (
    <div className="admin-art">
      <h1>Art Mapping</h1>
      {_.map(ART_MAPPING, ({ shapes }, stage) => (
        <div key={`stage-art-${stage}`}>
          <div className="caption">{getStageName(stage)}</div>
          <StageArt stage={stage} />
        </div>
      ))}
    </div>
  );
};

export default ArtTab;
