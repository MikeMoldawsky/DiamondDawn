import { useEffect } from "react";
import _ from 'lodash'
import { useDispatch, useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import { setSelectedTokenId } from "store/uiReducer";
import { isTokenInStage } from 'utils'
import {useNavigate, useParams} from "react-router-dom";

function useSelectToken(stage) {
  const { tokenId: tokenIdString } = useParams()
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const tokens = useSelector(tokensSelector)

  useEffect(() => {
    if (_.size(tokens) > 0) {
      let selectedId
      if (!_.isEmpty(tokenIdString)) {
        const tokenId = parseInt(tokenIdString)
        if (!_.has(tokens, tokenId)) {
          return navigate('/process')
        }
        selectedId = tokenId
      }
      else {
        // first look for a token that can be processed
        let availableToken = _.find(tokens, token => isTokenInStage(token, stage - 1))
        if (!availableToken) {
          // if no token can be processed look for a processed token for this stage
          availableToken = _.find(tokens, token => isTokenInStage(token, stage))
        }
        selectedId = availableToken?.id
      }
      dispatch(setSelectedTokenId(selectedId))
    }
  }, [tokens, stage, tokenIdString, dispatch])
}

export default useSelectToken;
