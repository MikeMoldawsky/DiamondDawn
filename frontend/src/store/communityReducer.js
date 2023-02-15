import { makeReducer, reduceUpdateFull } from "./reduxUtils";
import {getCommunityMembersApi} from "api/serverApi";
import includes from "lodash/includes";
import {getCollectorTwitterName} from "utils";

const INITIAL_STATE = {
  members: [],
};

const TEAM_TWITTERS = ["@tweezers0x", "@DavidAriew", "@sniirr0x", "@tonyherrera"]

const collectorToMember = collector => {
  let label = "Member"
  if (includes(TEAM_TWITTERS, collector.twitter)) {
    label = "Team"
  }
  else if (collector.honorary) {
    label = "Honorary"
  }
  else if (collector.seed) {
    label = "Seed"
  }

  return {
    id: collector._id,
    name: collector.twitter,
    link: `https://twitter.com/${getCollectorTwitterName(collector)}`,
    label,
    image: collector.image,
  }
}

export const loadCommunityMembers = () => async (dispatch) => {
  const members = await getCommunityMembersApi();
  dispatch({
    type: "COMMUNITY.SET_MEMBERS",
    payload: { members: members.map(collectorToMember) },
  })
};

export const communitySelector = state => state.community;

export const communityReducer = makeReducer(
  {
    "COMMUNITY.SET_MEMBERS": reduceUpdateFull,
  },
  INITIAL_STATE
);
