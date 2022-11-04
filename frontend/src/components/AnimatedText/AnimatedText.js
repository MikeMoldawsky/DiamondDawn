import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import classNames from "classnames";

const AnimatedText = ({ children, animationDirection = "rtl" }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const { scroll } = useSelector(uiSelector);

  useEffect(() => {
    if (!visible) {
      const currRef = ref.current;
      const textTop = currRef.offsetTop + currRef.offsetParent.offsetTop;
      const showAt = textTop + currRef.offsetHeight / 1.75;

      if (scroll > showAt) {
        setVisible(true);
      }
    }
  }, [visible, scroll]);

  return (
    <div
      ref={ref}
      className={classNames(
        "text-section animated-text",
        { visible },
        animationDirection
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedText;
