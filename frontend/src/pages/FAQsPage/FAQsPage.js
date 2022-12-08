import React from "react";
import PageSizeLimit from "components/PageSizeLimit";
import FAQs from "components/FAQs";
import Footer from "components/Footer";
import "./FAQsPage.scss";

const FAQsPage = () => (
  <PageSizeLimit>
    <div className="page faqs-page">
      <div className="inner-page">
        <div className="leading-text">FAQs</div>
        <FAQs />
      </div>
      <Footer />
    </div>
  </PageSizeLimit>
);

export default FAQsPage;