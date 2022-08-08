import React, { useEffect, useState } from "react";
import useDDContract from "hooks/useDDContract";
import { CONTRACTS, SYSTEM_STAGE } from "consts";
import _ from "lodash";
import { getStageName } from "utils";
import ActionButton from "components/ActionButton";
import { getStageVideoUrls, setStageVideoUrls } from "api/contractApi";

const StageArt = ({ stage }) => {
  const [stageArtData, setStageArtData] = useState({});

  const mineContract = useDDContract(CONTRACTS.DiamondDawnMine);

  const fetchStageArtData = async () => {
    const stageArt = await getStageVideoUrls(mineContract, stage);
    setStageArtData(stageArt);
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
    const urls = _.values(stageArtData);
    await setStageVideoUrls(mineContract, stage, urls);
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
      {_.map(SYSTEM_STAGE, (stage) => (
        <div key={`stage-art-${stage}`}>
          <div className="caption">{getStageName(stage)}</div>
          <StageArt stage={stage} />
        </div>
      ))}
    </div>
  );
};

export default ArtTab;
