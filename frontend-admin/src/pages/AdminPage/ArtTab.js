import React, { useEffect, useState } from "react";
import useDDContract from "hooks/useDDContract";
import { CONTRACTS, SYSTEM_STAGE } from "consts";
import _ from "lodash";
import { getSystemStageName } from "utils";
import ActionButton from "components/ActionButton";
import {
  getVideoUrlsByStageApi,
  setVideoUrlsByStageApi,
} from "api/contractApi";

const SystemStageArt = ({ systemStage }) => {
  const [stageArtData, setStageArtData] = useState({});

  const mineContract = useDDContract(CONTRACTS.DiamondDawnMine);

  const fetchStageArtData = async () => {
    const stageArt = await getVideoUrlsByStageApi(mineContract, systemStage);
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
    await setVideoUrlsByStageApi(mineContract, systemStage, urls);
  };

  return (
    <div className="center-aligned-row stage-art">
      <div className="inputs">
        {_.map(stageArtData, (videoUrl, shapeName) => (
          <div
            key={`stage-art-input-${systemStage}-${shapeName}`}
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
        actionKey={`set-stage-art-${systemStage}`}
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
      {_.map(
        SYSTEM_STAGE,
        (systemStage) =>
          systemStage < SYSTEM_STAGE.COMPLETE && (
            <div key={`stage-art-${systemStage}`}>
              <div className="caption">{getSystemStageName(systemStage)}</div>
              <SystemStageArt systemStage={systemStage} />
            </div>
          )
      )}
    </div>
  );
};

export default ArtTab;
