import React from 'react'
import Countdown from "react-countdown";

const CountdownComp = ({ date, text }) => (
  <div className="center-aligned-row countdown-row">
    <div>{text[0]}</div>
    <Countdown date={date} />
    <div>{text[1]}</div>
  </div>
)

export default CountdownComp