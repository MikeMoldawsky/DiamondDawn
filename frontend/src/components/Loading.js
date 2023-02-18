import React, { useCallback } from "react";
import AnimatedLogo from "components/AnimatedLogo";

const Loading = ({ text }) => {
  const renderAnimation = useCallback(() => <AnimatedLogo />, []);
  return (
    <div className="center-aligned-column loader-container">
      {renderAnimation()}
      {text && (
        <div className="tagline-text">{text}</div>
      )}
    </div>
  );
};

export default Loading;
