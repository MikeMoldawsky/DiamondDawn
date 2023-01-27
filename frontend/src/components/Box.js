import React from "react";
import classNames from "classnames";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {useNavigate} from "react-router-dom";
import map from "lodash/map"
import isEmpty from "lodash/isEmpty"
import identity from "lodash/identity"

const CloseBoxIcon = () => {
  const navigate = useNavigate();

  return (
    <HighlightOffIcon
      className="close"
      onClick={() => navigate("/explore")}
    />
  )
}

const Box = ({ className, style, icons = [<CloseBoxIcon/>], children }) => (
  <div className={classNames("box", className)} style={style}>
    {children}
    {!isEmpty(icons) && (
      <div className="right-center-aligned-row icons-menu">
        {map(icons, identity)}
      </div>
    )}
  </div>
);

export default Box;
