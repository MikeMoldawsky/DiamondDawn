import React from "react";
import "./HomeBackground.scss";
import useWindowDimensions from "hooks/useWindowDimensions";
import ScrollMarker from "components/ScrollMarker";
import useScrollTop from "hooks/useScrollTop";
import Link, {CollectorLink, TwitterLink} from "components/Links";
import classNames from "classnames";

const HomeBackground = ({ mousePos }) => {
  const scroll = useScrollTop();
  const { width, height } = useWindowDimensions();

  const parallaxRef = 0.05;

  const scrollWithMouse = scroll * 12 + mousePos[1] / 2;

  const winHeightLimit = height / 1.5;
  const scrollMarkerStyles = {
    opacity: 1 - (scroll * 1.5) / winHeightLimit,
  };

  return (
    <div className="bg home-background">
      <div
        className="bg leaves-left"
        style={{
          transform: `translate3D(${(width - mousePos[0] * 8) / 90}px, -${
            scrollWithMouse * parallaxRef * 1.5
          }px, 0px)`,
        }}
      />
      <div
        className="bg leaves-right"
        style={{
          transform: `translate3D(${
            (width - mousePos[0] * 8) / 90 + width / 40
          }px, -${scrollWithMouse * parallaxRef * 1.5}px, 0px)`,
        }}
      />
      <div className="bg sky" />
      <div
        className="bg mountains-back"
        style={{
          transform: `translate3D(${(width - mousePos[0] * 1) / 90}px, -${
            (scrollWithMouse * parallaxRef) / 5
          }px, 0px)`,
        }}
      />
      <div
        className="bg mountains-front"
        style={{
          transform: `translate3D(${(width - mousePos[0] * 4) / 90}px, -${
            scrollWithMouse * parallaxRef
          }px, 0px)`,
        }}
      />
      <ScrollMarker style={scrollMarkerStyles} />
      <div
        className="bg black-box"
        style={{
          transform: `translate3D(0px, -${
            scrollWithMouse * parallaxRef
          }px, 0px)`,
        }}
      >
        <div className="center-aligned-column art-by-david">
          <div className="left-centered-aligned-column">
            <div className="art-by">Art by</div>
            <div className="leading-text by-david">
              <Link
                href={`https://twitter.com/DavidAriew`}
                className="text-gold"
              >
                DAVID ARIEW
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg stars" />
    </div>
  );
};

export default HomeBackground;
