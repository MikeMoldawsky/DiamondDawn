import React from "react";
import Countdown from "react-countdown";
import "./Countdown.scss";
import toLower from "lodash/toLower";

const CountdownComp = ({ date, renderParts, onComplete, parts }) => {
  const renderPart = (caption, value) =>
    !renderParts || renderParts[toLower(caption)] ? (
      <div className="center-aligned-column">
        <div className="value">
          {value.toString().length === 1 ? "0" + value : value}
        </div>
        <div className="caption">{caption}</div>
      </div>
    ) : null;

  const renderer = ({ days, hours, minutes, seconds }) => {
    const weeks = Math.floor(days / 7);
    days = days % 7;

    return (
      <div className="center-aligned-row countdown">
        {renderPart("WEEKS", weeks)}
        {renderPart("DAYS", days)}
        {renderPart("HOURS", hours)}
        {renderPart("MINUTES", minutes)}
        {renderPart("SECONDS", seconds)}
      </div>
    );
  };

  if (parts) return renderer(parts);

  if (!date) return null;

  return (
    <Countdown date={date} renderer={renderer} onComplete={onComplete} />
  )
};

export default CountdownComp;
