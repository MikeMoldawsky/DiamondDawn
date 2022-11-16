import React from "react";
import "./InfoPage.scss";
import Footer from "components/Footer";
import PageSizeLimit from "components/PageSizeLimit";
import TeaserVideo from "components/TeaserVideo"
import classNames from "classnames";
import FAQs from "components/FAQs";
import {getCDNImageUrl} from "utils";
import PageLoader from "components/PageLoader";

const InfoPage = ({ className, teaser, withFAQ, children }) => {
  return (
    <PageSizeLimit>
      <PageLoader
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
            {teaser && <TeaserVideo {...teaser} />}
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
      </PageLoader>
    </PageSizeLimit>
  );
};

export default InfoPage;
