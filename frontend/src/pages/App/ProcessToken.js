import React from "react";
import Process from "pages/App/Process";
import useSelectTokenFromRoute from "hooks/useSelectTokenFromRoute";

const ProcessToken = () => {
  useSelectTokenFromRoute();

  return <Process />;
};

export default ProcessToken;
