import React, {useEffect, useState} from "react";
import Countdown from "react-countdown";
import "./Countdown.scss";
import classNames from "classnames";
import useSystemCountdown, {COUNTDOWN_PHASES} from "hooks/useSystemCountdown";
import padStart from "lodash/padStart";
import useSound from "use-sound";
import mintOpenSFX from "assets/audio/mint-open.mp3";

const CountdownComp = ({ className, date, defaultParts, onComplete }) => {
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
      <div className="center-aligned-row countdown">
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

  if (date)
    return (
      <Countdown className={className} date={date} renderer={renderer} onComplete={onComplete} />
    );
  if (defaultParts) return renderer(defaultParts);

  return null;
};

export const CountdownWithText = ({ className, text, ...props }) => {
  return (
    <div className={classNames("countdown-container", className)}>
      <div className="text">{text || text}</div>
      <CountdownComp {...props} />
    </div>
  );
};

export const SystemCountdown = ({ className, text, onComplete, ...props }) => {
  const [overridePhase, setOverridePhase] = useState(null)
  const { countdownPhase, countdownText, ...countdownProps } = useSystemCountdown(overridePhase);
  const [playMintOpenSFX] = useSound(mintOpenSFX, { volume: 1, interrupt: false });
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => {
        setOverridePhase(countdownPhase + 1)
        setIsComplete(false)
      }, 3000)
    }
  }, [isComplete])

  useEffect(() => {
    if (overridePhase && overridePhase === countdownPhase) {
      setOverridePhase(null)
    }
  }, [countdownPhase, overridePhase])

  // console.log({ countdownPhase })
  const onCountdownComplete = () => {
    if (countdownPhase === COUNTDOWN_PHASES.BEFORE_MINT) {
      playMintOpenSFX()
    }
    setIsComplete(true)
    onComplete && onComplete()
  }

  return (
    <CountdownWithText
      text={text || countdownText}
      {...countdownProps}
      {...props}
      className={classNames(className, { 'complete': isComplete })}
      onComplete={onCountdownComplete}
    />
  );
};

export default CountdownComp;
