import React, { useEffect, useState } from "react";
import useDDContract from "hooks/useDDContract";
import { CONTRACTS, ROUGH_SHAPE, SHAPE, STAGE } from "consts";
import _ from "lodash";
import { getShapeName, getStageName, showError, showSuccess } from "utils";
import ActionButton from "components/ActionButton";

const ART_MAPPING = {
  [STAGE.MINE]: {
    shapes: [ROUGH_SHAPE.MAKEABLE],
    setter: "setRoughVideoUrl",
    getter: "roughShapeToVideoUrls",
  },
  [STAGE.CUT]: {
    shapes: [SHAPE.PEAR, SHAPE.ROUND, SHAPE.OVAL, SHAPE.RADIANT],
    setter: "setCutVideoUrl",
    getter: "cutShapeToVideoUrls",
  },
  [STAGE.POLISH]: {
    shapes: [SHAPE.PEAR, SHAPE.ROUND, SHAPE.OVAL, SHAPE.RADIANT],
    setter: "setPolishVideoUrl",
    getter: "polishShapeToVideoUrls",
  },
  [STAGE.BURN]: {
    shapes: [undefined],
    setter: "setBurnVideoUrl",
    getter: "burnVideoUrl",
  },
  [STAGE.REBIRTH]: {
    shapes: [undefined],
    setter: "setRebirthVideoUrl",
    getter: "rebirthVideoUrl",
  },
};

const StageArt = ({ stage }) => {
  const [stageArtData, setStageArtData] = useState({});

  const mineContract = useDDContract(CONTRACTS.DiamondDawnMine);
  const { shapes, setter, getter } = ART_MAPPING[stage];

  const fetchStageArtData = async () => {
    try {
      const stageArt = await Promise.all(
        _.map(shapes, (shape) => {
          if (shape !== undefined) {
            return mineContract[getter](shape);
          } else {
            return mineContract[getter]();
          }
        })
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
