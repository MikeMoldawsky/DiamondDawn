import React from "react";
import Countdown from "react-countdown";
import "./Countdown.scss";
import toLower from "lodash/toLower";
import isNil from "lodash/isNil";
import get from "lodash/get";
import classNames from "classnames";
import useMineOpenCountdown from "hooks/useMineOpenCountdown";

const CountdownComp = ({
  date,
  parts,
  renderParts,
  flat,
  align = "",
  onComplete,
}) => {
  const formatValue = (value) => {
    switch (value.toString().length) {
      case 0:
        return "00";
      case 1:
        return "0" + value;
      default:
        return value + "";
    }
  };

  const renderPart = (caption, value) => {
    const key = toLower(caption);
    return !renderParts || !isNil(get(parts, key)) || get(renderParts, key) ? (
      <div className="center-aligned-column countdown-part">
        <div className="value">{formatValue(value)}</div>
        <div className="caption">{caption}</div>
      </div>
    ) : null;
  };

  const renderer = ({ days, hours, minutes, seconds }) => {
    const weeks = Math.floor(days / 7);
    days = days % 7;

    if (flat) {
      return (
        <div className="center-aligned-row countdown">
          {renderPart("WEEKS", weeks)}
          {renderPart("DAYS", days)}
          {renderPart("HOURS", hours)}
          {renderPart("MINUTES", minutes)}
          {renderPart("SECONDS", seconds)}
        </div>
      );
    }
    return (
      <div
        className={classNames("center-aligned-row countdown custom", {
          "left-aligned": align === "left",
        })}
      >
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
  };

  if (parts) return renderer(parts);

  if (!date) return null;

  return <Countdown date={date} renderer={renderer} onComplete={onComplete} />;
};

export const StageCountdown = (props) => {
  const { countdownText, ...countdownProps } = useMineOpenCountdown();

  return (<CountdownComp {...countdownProps} {...props} />)
}

export const StageCountdownWithText = (props) => {
  const { countdownText, ...countdownProps } = useMineOpenCountdown();

  return (
    <div className="countdown-container">
      <div className="text">{countdownText}</div>
      <CountdownComp {...countdownProps} {...props} />
    </div>
  )
}

export default CountdownComp;
