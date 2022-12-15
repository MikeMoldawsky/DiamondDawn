import React from "react";
import "./InfoPage.scss";
import Footer from "components/Footer";
import VideoBackground from "components/VideoBackground";
import classNames from "classnames";
import { getCDNImageUrl } from "utils";
import Page from "containers/Page";
import useMusic from "hooks/useMusic";
import PageSizeLimit from "components/PageSizeLimit";

const InfoPage = ({ className, teaser, children }) => {
  useMusic("homepage.mp3");

  return (
    <PageSizeLimit>
      <Page
        pageName="info"
        images={[
          getCDNImageUrl("/about/mine-walls.png"),
          getCDNImageUrl("/cave.jpg"),
        ]}
      >
        <div className={classNames("page info-page", className)}>
          <div className="inner-page">
            <div className="bg mine-background">
              <div className="bg walls" />
              <div className="bg cave" />
            </div>
            {children}
            {teaser && <VideoBackground {...teaser} />}
            <Footer />
          </div>
        </div>
      </Page>
    </PageSizeLimit>
  );
};

export default InfoPage;
