import { useEffect } from "react";
import _ from 'lodash'
import { useDispatch, useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import { setSelectedTokenId } from "store/uiReducer";

function useSelectAvailableToken(stage) {

  const dispatch = useDispatch()
  const tokens = useSelector(tokensSelector)

  useEffect(() => {
    let availableToken = _.find(tokens, token => token.stage === stage - 1)
    // if (!availableToken) {
    //   availableToken = _.find(tokens, token => token.stage === stage)
    // }
    dispatch(setSelectedTokenId(availableToken?.id))
  }, [tokens, stage])
}

export default useSelectAvailableToken;
