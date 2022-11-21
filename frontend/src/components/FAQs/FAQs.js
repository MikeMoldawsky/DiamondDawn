import React, { useState } from "react";
import "./FAQs.scss";
import { Collapse } from "react-collapse";
import map from "lodash/map";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const FAQS = {
  "The Digital": [
    {
      title: "What is DD?",
      content: () => <p>Diamond Dawn.</p>,
    },
    {
      title: "What is DD’s blockchain?",
      content: () => <p>Ethereum.</p>,
    },
    {
      title: "What is DD's NFT standard?",
      content: () => (
        <p>
          ERC-721.
          <br /> Every NFT has a unique edition number (token id).
        </p>
      ),
    },
    {
      title: "What is DD’s supply?",
      content: () => <p>333 Editions.</p>,
    },
    {
      title: "What is DD’s mint price?",
      content: () => (
        <p>
          3.33 ETH. <br /> That’s the cost for the entire Diamond Dawn journey -
          including the physical diamond artwork and shipping (if you choose to
          take it).{" "}
        </p>
      ),
    },
    {
      title: "How many NFTs per wallet?",
      content: () => <p>There is a maximum of 1 NFT per wallet.</p>,
    },
    {
      title: "Is DD 100% decentralized?",
      content: () => (
        <p>
          Yes. <br />
          Diamond Dawn's NFT attributes live on the Ethereum blockchain, and the
          videos are stored on the Arweave decentralized network (read Timeless
          Technology for additional info).{" "}
        </p>
      ),
    },
    {
      title: "What is a Diamond Dawn Step?",
      content: () => (
        <p>
          A step is a limited time window where you need to decide if you want
          to change (evolve) your NFT to its next form or not. <br /> If you do
          NOT evolve your NFT in that time frame, it'll stay in its current
          state for eternity.
        </p>
      ),
    },
    {
      title: "How long is a Diamond Dawn Step?",
      content: () => (
        <p>
          Diamond Every step is exactly 3 weeks, 3 days and 3 hours long. <br />{" "}
          An exception to that is the last step (The Final Choice), where you
          need to choose between the physical and the digital worlds.
        </p>
      ),
    },
    {
      title: "How much time I’ll have to wait between DD’s steps?",
      content: () => (
        <p>
          When a Diamond Dawn Step ends, we’ll notify on @DiamondDawnNFT when
          the next step starts.
          <br /> The “cool-down” period between steps will be shorter than 3
          weeks.
        </p>
      ),
    },
    {
      title: "What do you mean by evolving NFTs?",
      content: () => (
        <p>
          According to your (blockchain) decisions, your NFT can change its
          visuals and attributes. <br /> Only you can evolve your NFT.
        </p>
      ),
    },
    {
      title:
        "I accidentally evolved my NFT. Can DD’s team help me revert my decision?",
      content: () => (
        <p>
          No. <br /> Your decisions are ONLY between you, the blockchain and
          Diamond Dawn's smart contracts.
          <br />
          We have 0 control over it (for the better and worse).
        </p>
      ),
    },
  ],
  "The Physical": [
    {
      title: "Are the diamonds real?",
      content: () => (
        <p>
          Yes. <br /> Diamond Dawn's diamonds are real, natural diamonds, and a
          GIA diamond certificate backs each stone.
        </p>
      ),
    },
    {
      title: "What is Diamond Dawn’s physical artwork?",
      content: () => (
        <p>
          If you choose the physical artwork, expect a heavy shipment! The art
          piece weighs 8 kg (17.6 lb) and measures 25 x 25 x 25 cm (9.8 x 9.8 x
          9.8 in.).
          <br />
          Diamond Dawn’s artwork is made from high-quality black wood and
          acrylic panes, and in its heart, you’ll find your GIA-certified
          diamond. <br />
          Diamond Dawn’s diamonds are high-quality natural Cape Diamonds (graded
          M-Z color), weighing between 0.4-0.8 carat (according to your
          randomly-chosen NFT attributes).
          <br />
          Diamond Dawn is a work of art that you can proudly display as a
          centerpiece on a desk, bookcase, or in any room.
        </p>
      ),
    },
    {
      title: "What is a Diamond Certification?",
      content: () => (
        <p>
          A diamond certification is a process where an independent gem lab
          tests and assesses your diamond attributes, such as its carat, color,
          clarity, and cut grading.
        </p>
      ),
    },
    {
      title: "What is GIA?",
      content: () => (
        <p>
          The Gemological Institute of America (GIA) is one of the best diamond
          grading labs in the world. <br />
          GIA has the best reputation for accurate diamond grading due to its
          strict standards.
        </p>
      ),
    },
  ],
  "The Final Choice": [
    {
      title: "What countries do you ship to?",
      content: () => <p>We offer worldwide shipping.</p>,
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
