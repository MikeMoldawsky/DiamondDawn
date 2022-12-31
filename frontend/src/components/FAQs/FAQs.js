import React, { useState } from "react";
import "./FAQs.scss";
import { Collapse } from "react-collapse";
import map from "lodash/map";
import take from "lodash/take";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from "components/Button";
import classNames from "classnames";
import { NavLink, useNavigate } from "react-router-dom";
import { TwitterLink } from "components/Links";

const FAQS = [
  {
    title: "How do I increase my chances of getting accepted?",
    content: () => (
      <p>
        <ul>
          <li>
            Follow{" "}
            <TwitterLink className="text-gold">
              <b>@DiamondDawnNFT</b>
            </TwitterLink>
            .
          </li>
          <li>Get an invite from an accepted collector.</li>
          <li>Submit a genuine reason for joining.</li>
          <li>
            Prove your ability to participate in a high mint project (having
            4.44 ETH is 10/10)
          </li>
        </ul>
      </p>
    ),
  },
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
    title: "How's the physical art piece designed?",
    content: () => (
      <p>
        If you choose the physical art piece, expect a heavy shipment. <br />
        The art piece weighs ~8 kg (17.6 lb) and measures 25 x 25 x 25 cm (9.8 x
        9.8 x 9.8 in.).
        <br />
        Diamond Dawn's art piece is crafted from high-quality black wood and
        acrylic panes.
        <br />
        At the center of the piece is your diamond with a special (web3) design.
        <br />
        All of Diamond Dawn's diamonds are:
        <ul>
          <li>Natural diamonds.</li>
          <li>GIA-certified.</li>
          <li>
            High quality diamonds with a good to excellent grade, none or faint
            fluorescence, and a clarity of VS2 to FL.
          </li>
          <li>Cape diamonds (graded K-Z color).</li>
          <li>Carat weight 0.4-0.8 (averages 0.6 carats).</li>
          <li>Round, pear, oval or cushion shapes.</li>
        </ul>
        Diamond Dawn is a work of art that you can proudly display as a
        centerpiece on a desk, bookcase, or in any room.
      </p>
    ),
  },
  {
    title: "What's the mint price?",
    content: () => (
      <p>
        4.44 ETH. <br /> That’s the cost for the entire Diamond Dawn journey,
        including the physical diamond art piece and shipping (if you choose to
        take it).{" "}
      </p>
    ),
  },
  {
    title: "What's the supply?",
    content: () => <p>333 Editions.</p>,
  },
  {
    title: "How many NFTs can I mint?",
    content: () => (
      <p>
        There is a maximum of 2 NFTs per wallet. <br />
        It is your decision whether to keep them digital or transform them into
        a physical diamond art piece.
      </p>
    ),
  },
  {
    title: "Is Diamond Dawn 100% decentralized?",
    content: () => (
      <p>
        Yes. <br />
        Diamond Dawn's NFT attributes live on the Ethereum blockchain, and the
        videos are stored on the Arweave decentralized network (read{" "}
        <NavLink to="/technology">
          <span className="link">Timeless Technology</span>
        </NavLink>{" "}
        for additional info).{" "}
      </p>
    ),
  },
  {
    title: "How many NFTs are reserved for the team?",
    content: () => (
      <p>
        None.
        <br />
        The Diamond Dawn team has no reserved NFTs - we will be minting NFTs
        just like any other collector.
      </p>
    ),
  },
  {
    title: "When does the private sale start?",
    content: () => (
      <p>
        Diamond Dawn's private sale will start on January 11.
        <br />
        The sale will be open for only ONE week.
      </p>
    ),
  },
  {
    title: "When does the public sale start?",
    content: () => <p>Diamond Dawn's public sale will start on January 18.</p>,
  },
  {
    title: "What's a Diamond Certification?",
    content: () => (
      <p>
        A diamond certification is a process where an independent gem lab tests
        and assesses your diamond attributes, such as its carat, color, clarity,
        and cut grading.
      </p>
    ),
  },
  {
    title: "What's a GIA certificate?",
    content: () => (
      <p>
        Diamond Dawn uses GIA certifications to back all of the project's
        diamonds.
        <br />
        The Gemological Institute of America (GIA) is one of the best diamond
        grading labs in the world. <br />
        GIA has the best reputation for accurate diamond grading due to its
        strict standards.
      </p>
    ),
  },
  {
    title: "What's DD’s blockchain?",
    content: () => <p>Ethereum.</p>,
  },
  {
    title: "What's the NFT standard?",
    content: () => (
      <p>
        ERC-721.
        <br /> Every NFT has a unique edition number (token ID).
      </p>
    ),
  },
  {
    title: "What's a Diamond Dawn Phase?",
    content: () => (
      <p>
        A phase is a limited time window where you need to decide if you want to
        change (evolve) your NFT to its next form or not. <br /> If you do NOT
        evolve your NFT in that time frame, it'll stay in its current state for
        eternity.
      </p>
    ),
  },
  {
    title: "How long is a Diamond Dawn Phase?",
    content: () => (
      <p>
        Every Diamond Dawn Phase is exactly 3 weeks, 3 days and 3 hours long.{" "}
        <br /> An exception to that is the last phase (The Final Choice), where
        you need to choose between the physical and the digital worlds.
      </p>
    ),
  },
  {
    title: "How much time will I have to wait between DD’s phases?",
    content: () => (
      <p>
        When a Diamond Dawn Phase ends, we’ll notify on @DiamondDawnNFT when the
        next phase starts.
        <br /> The “cool-down” period between phases will be shorter than 3
        weeks.
      </p>
    ),
  },
  {
    title: "What do you mean by Evolving NFTs?",
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
        We have zero control over it, for better or worse.
      </p>
    ),
  },
  {
    title: "I accidentally burned my NFT. Can I revert my decision?",
    content: () => (
      <p>
        No. <br /> Your decisions are ONLY between you, the blockchain and
        Diamond Dawn's smart contracts.
        <br />
        We have zero control over it, for better or worse.
      </p>
    ),
  },
  {
    title: "What countries do you ship to?",
    content: () => (
      <p>
        We offer global shipping to any non-OFAC sanctioned country. <br /> Feel
        free to contact support@diamonddawn.art or @DiamondDawnNFT with any
        further questions, and we'll do our best to help.
      </p>
    ),
  },
  {
    title: "How much time will I wait for Diamond Dawn's physical art piece?",
    content: () => (
      <p>
        Diamond Dawn's delivery times are under 3 weeks, 3 days, and 3 hours.{" "}
        <br />
        Diamond Dawn's shipments are operated by FedEx Express and will be
        delivered directly to your specified address.
      </p>
    ),
  },
  {
    title:
      "What will happen to my NFT if I choose Diamond Dawn’s physical art piece?",
    content: () => (
      <p>
        Your NFT will be burned (it’ll be sent to the “dead” address).
        <br />
        This means that a physical art piece is born ONLY if its digital
        counterpart is destroyed.
      </p>
    ),
  },
];

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

const FAQs = ({ collapsed }) => {
  const navigate = useNavigate();

  const faqs = !collapsed ? FAQS : take(FAQS, 8);

  return (
    <div className={classNames("faqs", { collapsed })}>
      <div className="faq-groups">
        <div className="faq-items">
          {map(faqs, (faq) => (
            <FAQ key={`faq-${faq.title}`} {...faq} />
          ))}
        </div>
      </div>
      {collapsed && (
        <div className="text-center">
          <Button
            className="transparent"
            onClick={() => navigate("/faq")}
            sfx="utility"
          >
            VIEW ALL
          </Button>
        </div>
      )}
    </div>
  );
};

export default FAQs;
