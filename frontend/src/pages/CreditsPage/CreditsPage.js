import React from "react";
import "./CreditsPage.scss";
import Footer from "components/Footer";
import PageSizeLimit from "components/PageSizeLimit";
import map from "lodash/map";
import Link from "components/Links";

const CREDITS = {
  "Project Creator": [
    {
      name: "Mike Moldawsky",
      link: "https://www.linkedin.com/in/mike-moldawsky-608a2098/",
    },
  ],
  Artist: [{ name: "David Ariew", link: "https://twitter.com/DavidAriew" }],
  "Frontend Wizard": [
    {
      name: "Asaf Snir",
      link: "https://www.linkedin.com/in/asaf-snir-87b581b6/",
    },
  ],
  Designer: [{ name: "Aviva Moldawsky", link: "" }],
  Advisor: [
    { name: "Tony Herrera", link: "https://twitter.com/tonyherrera" },
    { name: "Daniel Moldawsky", link: "https://twitter.com/DanielMoldawsky" },
  ],
  "Sound Wizard": [
    { name: "Abel Okugawa", link: "https://twitter.com/Abel_Okugawa" },
  ],
  Marketing: [{ name: "Gal Shriki", link: "https://twitter.com/Shrikmeister" }],
  "Art Piece Videos": [{ name: "Zen", link: "https://www.zenvideopro.com" }],
  "Smart Contracts": [
    {
      name: "Gal Kleinman",
      link: "https://www.linkedin.com/in/gal-kleinman-16898384/",
    },
  ],
  "Smart Contracts Audit": [
    { name: "Alan Boost", link: "https://twitter.com/ltsCuzzo" },
  ],
  "Web Designer": [{ name: "Yanay Halevy", link: "" }],
  "Project Manager": [{ name: "Mor Lupa", link: "" }],
};

const CreditsPage = () => (
  <PageSizeLimit>
    <div className="page credits-page">
      <div className="inner-page">
        <h1>CREDITS</h1>
        <div className="credits">
          {map(CREDITS, (creditsTo, category) => (
            <div
              key={`credits-category-${category}`}
              className="top-spaced-row credits-category"
            >
              <div className="category-name">{category}</div>
              <div className="right-spaced-column">
                {map(creditsTo, ({ name, link }) => (
                  <div key={`credit-to-${name}`} className="credit-to">
                    <Link href={link}>{name}</Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  </PageSizeLimit>
);

export default CreditsPage;
