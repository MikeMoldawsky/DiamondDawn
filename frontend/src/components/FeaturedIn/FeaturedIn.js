import React from "react";
import "./FeaturedIn.scss";
import map from "lodash/map";
import Link from "components/Links";
import SVG from "components/SVG";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import logos from "assets/images/featured";

const FEATURED_IN = [
  {
    name: "fortune",
    link: "https://fortune.com/crypto/2022/12/09/this-week-in-the-metaverse-alameda-research-ceo-reportedly-spotted-china-nfts-atlanta-braves-metaverse/",
  },
  {
    name: "cointelegraph",
    link: "https://cointelegraph.com/news/nfts-could-help-solve-diamond-certification-fraud",
  },
  {
    name: "coinmarketcap",
    link: "https://coinmarketcap.com/community/articles/639d8e9ba9652350656a2720",
  },
  {
    name: "investing",
    link: "https://m.investing.com/news/cryptocurrency-news/nfts-could-help-solve-diamond-certification-fraud-2961569",
  },
];

const FeaturedIn = () => {
  return (
    <div className="featured-in">
      <div className="center-aligned-row">
        <div className="horizontal-line" />
        <div className="featured-title">FEATURED IN</div>
        <div className="horizontal-line" />
      </div>
      <div className="center-aligned-row articles">
        {map(FEATURED_IN, ({ name, link }) => (
          <Link
            className="center-aligned-row article"
            key={`featured-article-${name}`}
            href={link}
          >
            <SVG src={logos[name]} className={name} wrapper="div" />
            <ArrowForwardIosIcon />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedIn;
