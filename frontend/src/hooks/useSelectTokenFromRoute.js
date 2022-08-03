import { useEffect } from "react";
import _ from 'lodash'
import { useDispatch, useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import { setSelectedTokenId } from "store/uiReducer";
import {useNavigate, useParams} from "react-router-dom";

function useSelectTokenFromRoute(notFoundRedirect = '/process') {
  const { tokenId: tokenIdString } = useParams()
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const tokens = useSelector(tokensSelector)

  useEffect(() => {
    if (!_.isEmpty(tokenIdString)) {
      const tokenId = parseInt(tokenIdString)
      if (_.has(tokens, tokenId)) {
        dispatch(setSelectedTokenId(tokenId))
        return
      }
    }
    navigate(notFoundRedirect)
  }, [tokens, tokenIdString, dispatch])
}

export default useSelectTokenFromRoute;
