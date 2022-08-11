import React, { useEffect, useState } from "react";
import useDDContract from "hooks/useDDContract";
import { CONTRACTS } from "consts";
import _ from "lodash";
import ActionButton from "components/ActionButton";
import {
  getVideoUrlsByStageApi,
  setVideoUrlsByStageApi,
} from "api/contractApi";
import rdiff from "recursive-diff"

const StageArt = ({ systemStage }) => {
  const [contractStageArt, setContractStageArt] = useState({});
  const [stageArtData, setStageArtData] = useState({});

  console.log({ stageArtData })

  const mineContract = useDDContract(CONTRACTS.DiamondDawnMine);

  const fetchStageArtData = async () => {
    const stageArt = await getVideoUrlsByStageApi(mineContract, systemStage);
    setStageArtData(stageArt);
    setContractStageArt(stageArt);
  };

  useEffect(() => {
    fetchStageArtData();
  }, [systemStage]);

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

  const diff = rdiff.getDiff(contractStageArt, stageArtData)

  return (
    <div className="stage-art">
      <div className="inputs">
        {_.map(stageArtData, (videoUrl, shapeName) => (
          <div
            key={`stage-art-input-${systemStage}-${shapeName}`}
            className="center-aligned-row input-row"
          >
            <div className="caption">{shapeName}</div>
            <input
              type="text"
              placeholder={shapeName}
              value={videoUrl}
              onChange={(e) => setVideoUrl(shapeName, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="button-row">
        <ActionButton
          className="save-button"
          actionKey={`set-stage-art-${systemStage}`}
          onClick={saveVideoUrls}
          disabled={_.isEmpty(diff)}
        >
          SAVE
        </ActionButton>
      </div>
    </div>
  );
};

export default StageArt;
