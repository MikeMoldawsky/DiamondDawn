import React, { useEffect } from "react";
import _ from 'lodash'
import { useDispatch, useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import { setSelectedTokenId } from "store/uiReducer";

function useSelectAvailableToken(stage) {

  const dispatch = useDispatch()
  const tokens = useSelector(tokensSelector)

  useEffect(() => {
    const availableToken = _.find(tokens, token => token.stage === stage - 1)
    dispatch(setSelectedTokenId(availableToken?.id))
  }, [])
}

export default useSelectAvailableToken;
