import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import useWindowDimensions from "hooks/useWindowDimensions";
import useScrollTop from "hooks/useScrollTop";

const AnimatedText = ({ className, children }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const { height } = useWindowDimensions();
  const scrollTop = useScrollTop();

  useEffect(() => {
    if (visible) return

    const { top } = ref.current.getBoundingClientRect();

    if (top < height * 0.9) {
      setVisible(true)
    }

  }, [visible, scrollTop]);

  return (
    <div
      ref={ref}
      className={classNames(className, "animated-text", { visible })}
    >
      {children}
    </div>
  );
};

export default AnimatedText;
