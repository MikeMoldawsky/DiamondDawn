import React from "react";
import {useSelector} from "react-redux";
import { systemSelector } from "store/systemReducer";
import Mine from "./Mine";
import Cut from "./Cut";
import Polish from "./Polish";
import Burn from "./Burn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem } from "@fortawesome/free-solid-svg-icons";
import useSelectToken from "hooks/useSelectToken";

function App() {
  const { stage } = useSelector(systemSelector)

  useSelectToken(stage)

  const renderStage = () => {
    switch (stage) {
      case 0:
        return <Mine />
      case 1:
        return <Cut />
      case 2:
        return <Polish />
      case 3:
        return <Burn />
      case 4:
        return (
          <div className="action-view">
            <div className="diamond-art">
              <FontAwesomeIcon icon={faGem} />
            </div>
            <div className="leading-text">SYSTEM IS COMPLETE AND CLOSED</div>
          </div>
        )
      default:
        return null
    }
  }

  return stage !== -1 ? renderStage() : null
}

export default App;
