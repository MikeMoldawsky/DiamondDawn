import React, { useState } from "react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";

const useScrollTop = () => {
  const [scrollTop, setScrollTop] = useState(0);

  useScrollPosition(({ prevPos, currPos }) => {
    setScrollTop(Math.abs(currPos.y));
  }, []);

  return scrollTop;
};

export default useScrollTop;
