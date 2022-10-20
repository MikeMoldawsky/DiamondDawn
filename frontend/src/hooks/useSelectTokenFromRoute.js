import { useEffect } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import { setSelectedTokenId } from "store/uiReducer";
import { useParams } from "react-router-dom";
import useNavigateToDefault from "hooks/useNavigateToDefault";

function useSelectTokenFromRoute() {
  const { tokenId: tokenIdString } = useParams();
  const navigateToDefault = useNavigateToDefault();

  const dispatch = useDispatch();
  const tokens = useSelector(tokensSelector);

  useEffect(() => {
    if (!_.isEmpty(tokenIdString)) {
      const tokenId = parseInt(tokenIdString);
      if (_.has(tokens, tokenId)) {
        dispatch(setSelectedTokenId(tokenId));
        return;
      }
    }
    navigateToDefault();
  }, [tokens, tokenIdString, dispatch]);
}

export default useSelectTokenFromRoute;
