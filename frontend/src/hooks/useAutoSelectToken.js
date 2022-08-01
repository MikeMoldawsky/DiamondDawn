import { useEffect } from "react";
import _ from 'lodash'
import { useDispatch, useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import {setSelectedTokenId, uiSelector} from "store/uiReducer";
import {getTypeByStage, isTokenOfType} from 'utils'
import {useParams} from "react-router-dom";

function useAutoSelectToken(stage) {
  const { tokenId: tokenIdString } = useParams()

  const dispatch = useDispatch()
  const { selectedTokenId } = useSelector(uiSelector)
  const tokens = useSelector(tokensSelector)

  useEffect(() => {
    if (_.size(tokens) > 0) {
      const prevTokenType = getTypeByStage(stage - 1)
      const tokenType = getTypeByStage(stage)
      // first look for a token that can be processed
      let availableToken = _.find(tokens, token => isTokenOfType(token, prevTokenType))
      if (!availableToken) {
        // if no token can be processed look for a processed token for this stage
        availableToken = _.find(tokens, token => isTokenOfType(token, tokenType))
      }
      if (availableToken?.id !== selectedTokenId) {
        dispatch(setSelectedTokenId(availableToken?.id))
      }
    }
  }, [tokens, stage, tokenIdString, dispatch, selectedTokenId])
}

export default useAutoSelectToken;
