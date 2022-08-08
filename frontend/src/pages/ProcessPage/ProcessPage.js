import React, { useCallback, useEffect } from "react";
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

const ProcessPage = () => {
  const { stage } = useSelector(systemSelector);
  const dispatch = useDispatch();

  useAutoSelectToken(stage);

  useEffect(() => {
    return () => {
      dispatch(setSelectedTokenId(-1));
    };
  }, []);

  useMountLogger("ProcessPage");

  const renderStage = useCallback(() => {
    switch (stage) {
      case 0:
        return <Mine />;
      case 1:
        return <Cut />;
      case 2:
        return <Polish />;
      case 3:
        return <Ship />;
      case 4:
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
  }, [stage]);

  return stage !== -1 ? renderStage() : null;
};

export default ProcessPage;
