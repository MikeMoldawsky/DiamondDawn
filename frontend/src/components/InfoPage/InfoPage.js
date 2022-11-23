import React from "react";
import "./InfoPage.scss";
import Footer from "components/Footer";
import PageSizeLimit from "components/PageSizeLimit";
import VideoBackground from "components/VideoBackground";
import classNames from "classnames";
import FAQs from "components/FAQs";
import { getCDNImageUrl } from "utils";
import Page from "containers/Page";
import useMusic from "hooks/useMusic";

const InfoPage = ({ className, teaser, withFAQ, children }) => {
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
        <div className={classNames("page info-page", className)}>
          <div className="inner-page">
            <div className="bg mine-background">
              <div className="bg walls" />
              <div className="bg cave" />
            </div>
            {children}
            {teaser && <VideoBackground {...teaser} />}
            {withFAQ && (
              <div className="faq">
                <div id="faq" className="leading-text">
                  FAQ
                </div>
                <FAQs />
              </div>
            )}
            <Footer />
          </div>
        </div>
      </Page>
    </PageSizeLimit>
  );
};

export default InfoPage;
