import React, {useEffect, useState} from "react";
import "./CommunityPage.scss";
import Footer from "components/Footer";
import Page from "containers/Page";
import MemberList from "components/MemberList";
import {getCommunityMembersApi} from "api/serverApi";
import {getCollectorTwitterName} from "utils";
import includes from "lodash/includes"
import map from "lodash/map"
import isEmpty from "lodash/isEmpty"

const TEAM_TWITTERS = ["@tweezers0x", "@DavidAriew", "@sniirr0x", "@tonyherrera"]

const collectorToMember = collector => {
  const labels = []
  if (includes(TEAM_TWITTERS, collector.twitter)) {
    labels.push("Team")
  }
  if (collector.honorary) {
    labels.push("Honorary")
  }
  if (isEmpty(labels)) {
    labels.push("Member")
  }

  return {
    id: collector._id,
    name: collector.twitter,
    link: `https://twitter.com/${getCollectorTwitterName(collector)}`,
    labels,
    image: collector.image,
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
