import React from "react";
import FAQs from "components/FAQs";
import Footer from "components/Footer";
import "./FAQsPage.scss";
import Page from "containers/Page";

const FAQsPage = () => (
  <Page pageName="credits">
    <div className="page faqs-page">
      <div className="inner-page">
        <div className="leading-text">FAQs</div>
        <FAQs />
      </div>
      <Footer />
    </div>
  </Page>
);

export default FAQsPage;
