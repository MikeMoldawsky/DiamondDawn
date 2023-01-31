import React, { useEffect, useRef, useState, forwardRef } from "react";
import Countdown from "react-countdown";
import "./Countdown.scss";
import classNames from "classnames";
import useSystemCountdown, { COUNTDOWN_PHASES } from "hooks/useSystemCountdown";
import padStart from "lodash/padStart";
import useSound from "use-sound";
import mintOpenSFX from "assets/audio/mint-open.mp3";
// import usePollingEffect from "hooks/usePollingEffect";
import {
  // loadIsMintOpen,
  systemSelector
} from "store/systemReducer";
import { useDispatch, useSelector } from "react-redux";

const CountdownComp = forwardRef(
  ({ className, date, defaultParts, onComplete }, ref) => {
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
        <Countdown
          ref={ref}
          className={className}
          date={date}
          renderer={renderer}
          onComplete={onComplete}
        />
      );
    if (defaultParts) return renderer(defaultParts);

    return null;
  }
);

export const CountdownWithText = forwardRef(
  ({ className, text, ...props }, ref) => {
    return (
      <div className={classNames("countdown-container", className)}>
        <div className="text">{text || text}</div>
        <CountdownComp ref={ref} {...props} />
      </div>
    );
  }
);

export const SystemCountdown = ({ className, text, onComplete, ...props }) => {
  const { countdownPhase, countdownText, ...countdownProps } =
    useSystemCountdown();
  const [playMintOpenSFX] = useSound(mintOpenSFX, {
    volume: 1,
    interrupt: false,
  });
  const [isComplete, setIsComplete] = useState(false);
  const dispatch = useDispatch();
  const { isMintOpen } = useSelector(systemSelector);
  const countdown = useRef(null);

  // usePollingEffect(
  //   () => {
  //     if (countdownPhase === COUNTDOWN_PHASES.BEFORE_MINT) {
  //       dispatch(loadIsMintOpen());
  //     }
  //   },
  //   [countdownPhase],
  //   {
  //     interval: 3_000,
  //     stopPolling: !isComplete,
  //   }
  // );

  useEffect(() => {
    if (isComplete && isMintOpen) {
      const countdownApi = countdown.current.getApi();
      countdownApi.start();
      playMintOpenSFX();
      setIsComplete(false);
    }
  }, [isComplete, isMintOpen]);

  const onCountdownComplete = () => {
    setIsComplete(true);
    onComplete && onComplete();
  };

  return (
    <CountdownWithText
      ref={countdown}
      text={text || countdownText}
      {...countdownProps}
      {...props}
      className={classNames(className, { complete: isComplete })}
      onComplete={onCountdownComplete}
    />
  );
};

export default CountdownComp;
