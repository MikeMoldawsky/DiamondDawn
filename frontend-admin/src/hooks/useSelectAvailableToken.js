import { useEffect } from "react";
import _ from 'lodash'
import { useDispatch, useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import { setSelectedTokenId } from "store/uiReducer";

function useSelectAvailableToken(stage) {

  const dispatch = useDispatch()
  const tokens = useSelector(tokensSelector)

  useEffect(() => {
    if (_.size(tokens) > 0) {
      // first look for a token that can be processed
      let availableToken = _.find(tokens, token => token.stage === stage - 1)
      if (!availableToken) {
        // if no token can be processed look for a processed token for this stage
        availableToken = _.find(tokens, token => token.stage === stage)
      }
      dispatch(setSelectedTokenId(availableToken?.id))
    }
  }, [tokens, stage])
}

export default useSelectAvailableToken;
