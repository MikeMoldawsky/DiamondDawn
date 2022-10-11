import { makeReducer, reduceSetFull } from "./reduxUtils";
import { getInviteByAddressApi } from "api/serverApi";

const INITIAL_STATE = null;

export const updateInvite = (invite) => ({
  type: "INVITE.SET",
  payload: invite,
});

export const loadInviteByAddress = (address) => async (dispatch) => {
  const invite = await getInviteByAddressApi(address);
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
