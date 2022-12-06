import React from "react";
import "./InfoPage.scss";
import Footer from "components/Footer";
import PageSizeLimit from "components/PageSizeLimit";
import VideoBackground from "components/VideoBackground";
import classNames from "classnames";
import { getCDNImageUrl } from "utils";
import Page from "containers/Page";
import useMusic from "hooks/useMusic";
import ScrollingPage from "components/ScrollingPage";

const InfoPage = ({ className, teaser, children }) => {
  useMusic("homepage.mp3");

  return (
    <PageSizeLimit>
      <Page
        pageName="info"
        images={[
          getCDNImageUrl("/about/mine-walls.png"),
          getCDNImageUrl("/about/cave.png"),
        ]}
      >
        <ScrollingPage>
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
        </ScrollingPage>
      </Page>
    </PageSizeLimit>
  );
};

export default InfoPage;
