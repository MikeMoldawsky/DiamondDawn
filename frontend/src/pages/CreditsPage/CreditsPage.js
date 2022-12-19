import React from "react";
import "./CreditsPage.scss";
import Footer from "components/Footer";
import map from "lodash/map";
import Link from "components/Links";
import classNames from "classnames";

const CREDITS = [
  {
    id: "mike",
    title: "Project Creator",
    name: "Mike Moldawsky",
    link: "https://www.linkedin.com/in/mike-moldawsky-608a2098/",
  },
  {
    id: "david",
    title: "Artist",
    name: "David Ariew",
    link: "https://twitter.com/DavidAriew",
  },
  {
    id: "asaf",
    title: "Frontend Master",
    name: "Asaf Snir",
    link: "https://www.linkedin.com/in/asaf-snir-87b581b6/",
  },
  { id: "aviva", title: "Designer", name: "Aviva Moldawsky", link: "" },
  {
    id: "tony",
    title: "Advisor",
    name: "Tony Herrera",
    link: "https://twitter.com/tonyherrera",
  },
  {
    id: "abel",
    title: "Sound Wizard",
    name: "Abel Okugawa",
    link: "https://twitter.com/Abel_Okugawa",
  },
  {
    id: "daniel",
    title: "Advisor",
    name: "Daniel Moldawsky",
    link: "https://twitter.com/DanielMoldawsky",
  },
  {
    id: "danny",
    title: "Community Leader",
    name: "Danny",
    link: "https://twitter.com/BrainEmojis",
  },
  {
    id: "coy",
    title: "Community Wizard",
    name: "The Digital Coy",
    link: "https://twitter.com/TheDigitalCoy",
  },
  {
    id: "gals",
    title: "Marketing",
    name: "Gal Shriki",
    link: "https://twitter.com/Shrikmeister",
  },
  {
    id: "galk",
    title: "Smart Contracts",
    name: "Gal Kleinman",
    link: "https://www.linkedin.com/in/gal-kleinman-16898384/",
  },
  {
    id: "alan",
    title: "Smart Contracts Audit",
    name: "Alan Boost",
    link: "https://twitter.com/ltsCuzzo",
  },
  { id: "yanay", title: "Web Designer", name: "Yanay Halevy", link: "" },
  { id: "mor", title: "Project Manager", name: "Mor Lupa", link: "" },
  {
    id: "zen",
    title: "The Physical Trailer",
    name: "Zen",
    link: "https://www.zenvideopro.com",
  },
];

const CreditsPage = () => (
  <div className="page credits-page">
    <div className="inner-page">
      <h1>CREDITS</h1>
      <div className="credits">
        {map(CREDITS, ({ id, title, name, link }) => (
          <div
            key={`credits-category-${name}`}
            className="start-start-aligned-row credits-category"
          >
            <div className={classNames("profile-image", id)} />
            <div className="left-top-aligned-column">
              <div className="category-name">{title}</div>
              <div className="right-spaced-column">
                <div key={`credit-to-${name}`} className="credit-to">
                  <Link href={link}>{name}</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

export default CreditsPage;
