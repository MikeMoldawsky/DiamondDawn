import React from "react";
import "./CreditsPage.scss";
import Footer from "components/Footer";
import PageSizeLimit from "components/PageSizeLimit";
import map from 'lodash/map'
import Link from 'components/Links'

const CREDITS = {
  "MUSIC": [{ name: "Abel", link: "" }],
  "MARKETING": [{ name: "Daniel Moldawski", link: "" }],
  "SMART CONTRACTS": [{ name: "Gal Klineman", link: "" }],
  "SITE DESIGN": [{ name: "Yanay Halevy", link: "" }],
}

const CreditsPage = () => (
  <PageSizeLimit>
    <div className="page credits-page">
      <div className="inner-page">
        <h1>CREDITS</h1>
        {map(CREDITS, (creditsTo, category) => (
          <div key={`credits-category-${category}`} className="center-aligned-row credits-category">
            <div className="category-name">{category}</div>
            <div className="center-spaced-column">
              {map(creditsTo, ({ name, link }) => (
                <div className={`credit-to-${name}`}>
                  <Link href={link}>{name}</Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  </PageSizeLimit>
);

export default CreditsPage;
