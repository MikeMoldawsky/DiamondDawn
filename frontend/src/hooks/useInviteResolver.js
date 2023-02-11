import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {useNavigate, useSearchParams} from "react-router-dom";
import { inviteSelector, loadInviteById } from "store/inviteReducer";
import useActionDispatch from "hooks/useActionDispatch";
import { viewInviteApi } from "api/serverApi";

const useInviteResolver = (inviteRequired) => {
  const actionDispatch = useActionDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteId = searchParams.get("invite");
  const invite = useSelector(inviteSelector);

  useEffect(() => {
    if (inviteId) {
      actionDispatch(loadInviteById(inviteId), "get-invite-by-id");
    }
    else if (inviteRequired) {
      navigate("/");
    }
  }, [inviteId]);

  useEffect(() => {
    if (invite?._id && !invite.viewed) {
      viewInviteApi(inviteId);
    }
  }, [invite?._id]);

  return invite
};

export default useInviteResolver;
