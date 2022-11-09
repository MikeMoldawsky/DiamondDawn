import React, { useState } from "react";
import "./FAQs.scss";
import { Collapse } from "react-collapse";
import map from "lodash/map";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const FAQS = {
  "The Project": [
    {
      title: "How many NFT per wallet?",
      content: () => (
        <p>
          Only 1 per wallet To keep the social experiment as fair as possible{" "}
        </p>
      ),
    },
  ],
  "The Diamonds": [
    {
      title: "Are the diamonds real?",
      content: () => <p>Yes!!!</p>,
    },
  ],
  "The Final Choice": [
    {
      title: "What countries do you ship to?",
      content: () => (
        <p>We offer worldwide shipping. Restrictions apply please see here.</p>
      ),
    },
    {
      title: "Will I have to pay VAT, Duties, and Fees?",
      content: () => <p></p>,
    },
  ],
};

const FAQ = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <div
        className="center-aligned-row faq-title"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <FontAwesomeIcon icon={isOpen ? faMinus : faPlus} />
      </div>
      <Collapse isOpened={isOpen}>
        <div>{content()}</div>
      </Collapse>
    </div>
  );
};

const FAQGroup = ({ faqs, groupName }) => {
  return (
    <>
      <div className="secondary-text">{groupName}</div>
      <div className="faqs">
        {map(faqs, (faq) => (
          <FAQ key={`faq-${groupName}-${faq.title}`} {...faq} />
        ))}
      </div>
    </>
  );
};

const FAQs = () => {
  return map(FAQS, (faqs, groupName) => (
    <FAQGroup
      key={`faq-group-${groupName}`}
      faqs={faqs}
      groupName={groupName}
    />
  ));
};

export default FAQs;
