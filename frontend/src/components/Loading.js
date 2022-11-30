import React, { useCallback } from "react";
import AnimatedLogo from "components/AnimatedLogo";

const Loading = () => {
  const renderAnimation = useCallback(() => <AnimatedLogo />, []);
  return (
    <div className="center-aligned-column loader-container">
      {renderAnimation()}
    </div>
  );
};

export default Loading;
