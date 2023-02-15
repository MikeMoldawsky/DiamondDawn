import React, {useEffect} from "react";
import "./CommunityPage.scss";
import Footer from "components/Footer";
import Page from "containers/Page";
import MemberList from "components/MemberList";
import useActionDispatch from "hooks/useActionDispatch";
import {ACTION_KEYS} from "consts";
import {communitySelector, loadCommunityMembers} from "store/communityReducer";
import {useSelector} from "react-redux";

const CommunityPage = () => {
  const actionDispatch = useActionDispatch();
  const {members} = useSelector(communitySelector)

  useEffect(() => {
    actionDispatch(
      loadCommunityMembers(),
      ACTION_KEYS.GET_COMMUNITY_MEMBERS
    );
  }, [])

  return (
    <Page pageName="community" requireAccess={false} actions={[{ key: ACTION_KEYS.GET_COMMUNITY_MEMBERS, isFirstComplete: true }]}>
      <div className="page community-page">
        <div className="inner-page">
          <h1>DIAMOND DAWN MEMBERS</h1>
          <MemberList members={members} />
        </div>
        <Footer withMenu={false} />
      </div>
    </Page>
  )
};

export default CommunityPage;
