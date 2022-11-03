import React from "react";
import Countdown from "react-countdown";
import "./Countdown.scss";
import toLower from "lodash/toLower";
import isNil from "lodash/isNil";
import get from "lodash/get";
import classNames from "classnames";

const CountdownComp = ({
  date,
  renderParts,
  smallParts = {},
  onComplete,
  parts,
  zeroMode = "fill",
  smallMinAndSec,
  customMode,
}) => {
  const renderValue = (value) => {
    if (zeroMode === "no" || value.toString().length !== 1) return value;
    if (zeroMode === "fill" || (zeroMode === "zeroOnly" && value === 0)) {
      return "0" + value;
    }
    return value;
  };

  const renderPart = (caption, value) => {
    const key = toLower(caption);
    return !renderParts || !isNil(get(parts, key)) || get(renderParts, key) ? (
      <div
        className={classNames("center-aligned-column countdown-part", {
          small: smallParts[key],
        })}
      >
        <div className="value">{renderValue(value)}</div>
        <div className="caption">{caption}</div>
      </div>
    ) : null;
  };

  const renderer = ({ days, hours, minutes, seconds }) => {
    const weeks = Math.floor(days / 7);
    days = days % 7;

    if (customMode)
      return (
        <div className="center-aligned-row countdown custom">
          <div className="center-spaced-column w-d">
            {renderPart("WEEKS", weeks)}
            {renderPart("DAYS", days)}
          </div>
          <div className="center-aligned-row h-m-s">
            {renderPart("HOURS", hours)}
            <div className="colon">:</div>
            {renderPart("MINUTES", minutes)}
            <div className="colon">:</div>
            {renderPart("SECONDS", seconds)}
          </div>
        </div>
      );

    const renderSmallParts = () => (
      <>
        {renderPart("MINUTES", minutes)}
        {renderPart("SECONDS", seconds)}
      </>
    );

    return (
      <div className="center-aligned-row countdown">
        {renderPart("WEEKS", weeks)}
        {renderPart("DAYS", days)}
        {renderPart("HOURS", hours)}
        {smallMinAndSec ? (
          <div className="small-parts">{renderSmallParts()}</div>
        ) : (
          renderSmallParts()
        )}
      </div>
    );
  };

  if (parts) return renderer(parts);

  if (!date) return null;

  return <Countdown date={date} renderer={renderer} onComplete={onComplete} />;
};

export default CountdownComp;
