import React from "react";
import FAQs from "components/FAQs";
import Footer from "components/Footer";
import "./FAQsPage.scss";

const FAQsPage = () => (
  <div className="page faqs-page">
    <div className="inner-page">
      <div className="leading-text">FAQs</div>
      <FAQs />
    </div>
    <Footer />
  </div>
);

export default FAQsPage;
