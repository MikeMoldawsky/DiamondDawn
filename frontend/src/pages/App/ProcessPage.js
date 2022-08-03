import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import useAutoSelectToken from "hooks/useAutoSelectToken";
import Process from "pages/App/Process";
import useMountLogger from "hooks/useMountLogger";

const ProcessPage = () => {
  const { stage } = useSelector(systemSelector);

  useAutoSelectToken(stage);

  useMountLogger("ProcessPage");

  return <Process />;
};

export default ProcessPage;
