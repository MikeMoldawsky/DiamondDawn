import React, {useCallback, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import useAutoSelectToken from "hooks/useAutoSelectToken";
import useMountLogger from "hooks/useMountLogger";
import { setSelectedTokenId } from "store/uiReducer";
import Mine from "./Mine";
import Cut from "./Cut";
import Polish from "./Polish";
import Ship from "./Burn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from "@fortawesome/free-solid-svg-icons";
import { SYSTEM_STAGE } from "consts";
import "./ProcessPage.scss";

const ProcessPage = () => {
  const { systemStage } = useSelector(systemSelector);
  const dispatch = useDispatch();

  useAutoSelectToken(systemStage);

  useEffect(() => {
    return () => {
      dispatch(setSelectedTokenId(-1));
    };
  }, []);

  useMountLogger("ProcessPage");

  const renderByStage = useCallback(() => {
    switch (systemStage) {
      case SYSTEM_STAGE.MINE_OPEN:
        return <Mine />;
      case SYSTEM_STAGE.CUT_OPEN:
        return <Cut />;
      case SYSTEM_STAGE.POLISH_OPEN:
        return <Polish />;
      case SYSTEM_STAGE.SHIP:
        return <Ship />;
      case SYSTEM_STAGE.COMPLETE:
        return (
          <div className="action-view">
            <div className="diamond-art">
              <FontAwesomeIcon icon={faGem} />
            </div>
            <div className="leading-text">SYSTEM IS COMPLETE AND CLOSED</div>
          </div>
        );
      default:
        return null;
    }
  }, [systemStage]);

  return (
    <div className="page process-page">
      <div className="inner-page">
        {systemStage >= SYSTEM_STAGE.MINE_OPEN ? renderByStage() : null}
      </div>
    </div>
  );
};

export default ProcessPage;
