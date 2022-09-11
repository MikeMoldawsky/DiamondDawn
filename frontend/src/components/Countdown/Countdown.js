import React from "react";
import Countdown from "react-countdown";
import './Countdown.scss'

const CountdownComp = ({ date, text }) => {
  if (!date) return null

  const renderPart = (caption, value) => (
    <div className="center-aligned-column">
      <div className="value">{value}</div>
      <div className="caption">{caption}</div>
    </div>
  )

  const renderer = ({ days, hours, minutes, seconds }) => {
    const weeks = Math.floor(days / 7)
    days = days % 7

    return (
      <div className="center-aligned-row countdown">
        {renderPart("WEEKS", weeks)}
        {renderPart("DAYS", days)}
        {renderPart("HOURS", hours)}
        {renderPart("MINUTES", minutes)}
        {renderPart("SECONDS", seconds)}
      </div>
    )
  }

 return (
   <div className="center-aligned-row countdown-row">
     <div>{text[0]}</div>
     <Countdown date={date} renderer={renderer} />
     <div>{text[1]}</div>
   </div>
 );
}

export default CountdownComp;
