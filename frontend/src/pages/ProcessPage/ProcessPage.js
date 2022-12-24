import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import useAutoSelectToken from "hooks/useAutoSelectToken";
import { setSelectedTokenId } from "store/uiReducer";
import Mine from "./Mine";
import Cut from "./Cut";
import Polish from "./Polish";
import Ship from "./Burn";
import { SYSTEM_STAGE } from "consts";
import "./ProcessPage.scss";
import useNavigateToDefault from "hooks/useNavigateToDefault";

const ProcessPage = () => {
  const { systemStage } = useSelector(systemSelector);
  const dispatch = useDispatch();
  const navigateToDefault = useNavigateToDefault();

  useAutoSelectToken(systemStage);

  useEffect(() => {
    return () => {
      dispatch(setSelectedTokenId(-1));
    };
  }, []);

  const renderByStage = useCallback(() => {
    switch (systemStage) {
      case SYSTEM_STAGE.MINE:
        return <Mine />;
      case SYSTEM_STAGE.CUT:
        return <Cut />;
      case SYSTEM_STAGE.POLISH:
        return <Polish />;
      case SYSTEM_STAGE.DAWN:
        return <Ship />;
      default:
        navigateToDefault();
        return null;
    }
  }, [systemStage]);

  return (
    <div className="page process-page">
      <div className="inner-page">{renderByStage()}</div>
    </div>
  );
};

export default ProcessPage;
