import React from "react";
import Countdown from "react-countdown";
import "./Countdown.scss";
import classNames from "classnames";
import useSystemCountdown from "hooks/useSystemCountdown";
import padStart from 'lodash/padStart'

const CountdownComp = ({
  date,
  defaultParts,
  onComplete,
}) => {

  const renderPart = (caption, value) => {
    return (
      <div className="center-aligned-column countdown-part">
        <div className="value">{padStart(value.toString(), 2, "0")}</div>
        <div className="caption">{caption}</div>
      </div>
    );
  };

  const renderer = ({ days, hours, minutes, seconds }) => {
    const weeks = Math.floor(days / 7);
    days = days % 7;

    return (
      <div
        className="center-aligned-row countdown"
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

  if (date) return (
    <Countdown date={date} renderer={renderer} onComplete={onComplete} />
  )
  if (defaultParts) return renderer(defaultParts)

  return null
};

export const CountdownWithText = ({ className, text, ...props }) => {
  return (
    <div className={classNames("countdown-container", className)}>
      <div className="text">{text || text}</div>
      <CountdownComp {...props} />
    </div>
  )
}

export const SystemCountdown = ({ text, ...props }) => {
  const { countdownText, ...countdownProps } = useSystemCountdown();

  return (
    <CountdownWithText text={text || countdownText} {...countdownProps} {...props} />
  );
};

export default CountdownComp;
