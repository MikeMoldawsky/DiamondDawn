import { makeReducer, reduceSetFull } from "./reduxUtils";
import {getInviteApi} from "api/serverApi";

const INITIAL_STATE = null;

export const updateInvite = (invite) => ({
  type: "INVITE.SET",
  payload: invite,
});

export const loadInviteById = (inviteId) => async (dispatch) => {
  const invite = await getInviteApi(inviteId);
  dispatch(updateInvite(invite));
};

export const clearInvite = () => ({
  type: "INVITE.CLEAR",
});

export const inviteSelector = (state) => state.invite;

export const inviteReducer = makeReducer(
  {
    "INVITE.SET": reduceSetFull,
    "INVITE.CLEAR": () => INITIAL_STATE,
  },
  INITIAL_STATE
);
