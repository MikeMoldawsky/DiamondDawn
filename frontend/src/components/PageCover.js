import React from "react";
import useNoScrollView from "hooks/useNoScrollView";
import classNames from "classnames";
import Loading from "components/Loading";

const PageCover = ({ fade, title = "DIAMOND DAWN", text = "Loading..." }) => {
  useNoScrollView();

  return (
    <div
      className={classNames("center-aligned-column page-cover", {
        hide: fade,
      })}
    >
      <Loading />
      <div className="tagline-text">
        {title}
        <br />
        {text}
      </div>
    </div>
  );
};

export default PageCover;
