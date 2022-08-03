import React from "react";
import Countdown from "react-countdown";

const CountdownComp = ({ date, text }) =>
  date ? (
    <div className="center-aligned-row countdown-row">
      <div>{text[0]}</div>
      <Countdown date={date} />
      <div>{text[1]}</div>
    </div>
  ) : null;

export default CountdownComp;
