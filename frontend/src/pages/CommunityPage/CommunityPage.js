import React, {useEffect, useState} from "react";
import "./CommunityPage.scss";
import Footer from "components/Footer";
import Page from "containers/Page";
import MemberList from "components/MemberList";
import {useDispatch} from "react-redux";
import {getCommunityMembersApi} from "api/serverApi";
import {getCollectorTwitterName} from "utils";
import includes from "lodash/includes"
import map from "lodash/map"

export const MEMBERS = [
  {
    id: "mike",
    name: "Mike Moldawsky",
    link: "https://twitter.com/tweezers0x",
    labels: ["Team"],
  },
  {
    id: "david",
    name: "David Ariew",
    link: "https://twitter.com/DavidAriew",
    labels: ["Team", "Honorary"],
  },
  {
    id: "asaf",
    name: "Asaf Snir",
    link: "https://www.linkedin.com/in/asaf-snir-87b581b6/",
    labels: ["Member"],
  },
  {
    id: "aviva",
    name: "Aviva Moldawsky",
    link: "https://www.linkedin.com/in/aviva-moldawsky-12589315/",
  },
  {
    id: "tony",
    name: "Tony Herrera",
    link: "https://twitter.com/tonyherrera",
  },
  {
    id: "daniel",
    name: "Daniel Moldawsky",
    link: "https://twitter.com/DanielMoldawsky",
  },
  {
    id: "abel",
    name: "Abel Okugawa",
    link: "https://twitter.com/Abel_Okugawa",
  },
  {
    id: "danny",
    name: "Danny",
    link: "https://twitter.com/BrainEmojis",
  },
  {
    id: "coy",
    name: "The Digital Coy",
    link: "https://twitter.com/TheDigitalCoy",
  },
  {
    id: "gals",
    name: "Gal Shriki",
    link: "https://twitter.com/Shrikmeister",
  },
  {
    id: "galk",
    name: "Gal Kleinman",
    link: "https://www.linkedin.com/in/gal-kleinman-16898384/",
  },
  {
    id: "alan",
    name: "Alan Boothe",
    link: "https://twitter.com/ltsCuzzo",
  },
  { id: "yanay", name: "Yanay Halevy", link: "" },
  { id: "mor", name: "Mor Lupa", link: "" },
  {
    id: "zen",
    name: "Zen Video Production",
    link: "https://www.zenvideopro.com",
  },
];

const TEAM_TWITTERS = ["@tweezers0x", "@DavidAriew", "@sniirr0x", "@tonyherrera"]

const collectorToMember = collector => {
  const labels = []
  if (includes(TEAM_TWITTERS, collector.twitter)) {
    labels.push("Team")
  }
  if (collector.honorary) {
    labels.push("Honorary")
  }
  labels.push("Member")

  return {
    id: collector._id,
    name: collector.twitter,
    link: `https://twitter.com/${getCollectorTwitterName(collector)}`,
    labels,
    hasImage: false,
  }
}

const CreditsPage = () => {
  const [members, setMembers] = useState([])

  console.log({ members })

  const loadMembers = async () => {
    const _collectors = await getCommunityMembersApi()
    console.log({ _collectors })
    setMembers(map(_collectors, collectorToMember))
  }

  useEffect(() => {
    loadMembers()
  }, [])

  return (
    <Page pageName="community" requireAccess={false}>
      <div className="page community-page">
        <div className="inner-page">
          <h1>THE COMMUNITY</h1>
          <MemberList members={members} />
        </div>
        <Footer />
      </div>
    </Page>
  )
};

export default CreditsPage;
