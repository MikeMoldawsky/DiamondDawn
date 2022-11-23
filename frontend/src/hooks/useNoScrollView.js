import React, { useEffect } from "react";

const useNoScrollView = (disabled) => {
  useEffect(() => {
    !disabled && document.body.classList.add("no-scroll");

    return () => {
      !disabled && document.body.classList.remove("no-scroll");
    };
  }, []);
};

export default useNoScrollView;
