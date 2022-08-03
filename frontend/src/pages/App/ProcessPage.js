import React from "react";
import {useSelector} from "react-redux";
import { systemSelector } from "store/systemReducer";
import useAutoSelectToken from "hooks/useAutoSelectToken";
import Process from "pages/App/Process";

const ProcessPage = () => {
  const { stage } = useSelector(systemSelector)

  useAutoSelectToken(stage)

  return <Process />
}

export default ProcessPage;
