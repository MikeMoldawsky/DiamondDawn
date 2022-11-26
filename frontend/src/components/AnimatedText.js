import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import useWindowDimensions from "hooks/useWindowDimensions";
import useScrollTop from "hooks/useScrollTop";

const AnimatedText = ({ className, children }) => {
  const [visibilityClass, setVisibilityClass] = useState("");
  const ref = useRef(null);
  const { height } = useWindowDimensions();
  const scrollTop = useScrollTop();

  useEffect(() => {
    const { top, bottom } = ref.current.getBoundingClientRect();

    let newVisibilityClass = "hidden-up";
    if (top < height * 0.8) {
      newVisibilityClass = "visible";
    }
    if (bottom < height * 0.3) {
      newVisibilityClass += " hidden";
    }

    if (newVisibilityClass && newVisibilityClass !== visibilityClass) {
      setVisibilityClass(newVisibilityClass);
    }
  }, [scrollTop]);

  return (
    <div
      ref={ref}
      className={classNames(className, "animated-text", visibilityClass)}
    >
      {children}
    </div>
  );
};

export default AnimatedText;
