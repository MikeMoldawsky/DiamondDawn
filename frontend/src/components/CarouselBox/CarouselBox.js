import React from "react";
import get from "lodash/get";
import head from "lodash/head";
import last from "lodash/last";
import {safeParseInt} from "utils";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import classNames from "classnames";

const CarouselBox = ({ className, items, activeItemId, onChange, children }) => {
  const activeItem = get(items, activeItemId)
  if (!activeItem) return null

  const itemIds = Object.keys(items).map(safeParseInt)
  const activeIndex = itemIds.indexOf(activeItemId)
  const firstId = safeParseInt(head(itemIds))
  const lastId = safeParseInt(last(itemIds))


  const showBackButton = activeItemId !== firstId
  const showForwardButton = activeItemId !== lastId
  const middleBorderClassNames = {
    "with-back-btn": showBackButton,
    "with-forward-btn": showForwardButton,
  }

  return (
    <div className={classNames("carousel-box", className)}>
      <div className={classNames("border-box top-border-box")} />
      <div className={classNames("border-box middle-border-box", middleBorderClassNames)} />
      <div className={classNames("border-box bottom-border-box")} />
      {showBackButton && (
        <div className="box-button back" onClick={() => onChange("prev", itemIds[activeIndex - 1])}>
          <ArrowBackIosNewIcon />
        </div>
      )}
      {children}
      {showForwardButton && (
        <div className="box-button forward" onClick={() => onChange("next", itemIds[activeIndex + 1])}>
          <ArrowForwardIosIcon />
        </div>
      )}
    </div>
  )
};

export default CarouselBox;
