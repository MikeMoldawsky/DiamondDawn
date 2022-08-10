import {useEffect} from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import {setSelectedTokenId, uiSelector} from "store/uiReducer";
import {getActionableTokens} from "utils";

function useAutoSelectToken(systemStage) {
  const dispatch = useDispatch();
  const { selectedTokenId } = useSelector(uiSelector);
  const tokens = useSelector(tokensSelector);

  useEffect(() => {
    if (_.size(tokens) > 0) {
      const actionableTokens = getActionableTokens(tokens, systemStage)

      if (selectedTokenId !== -1) {
        const selectedActionable = _.find(actionableTokens, token => token.id === selectedTokenId)
        if (selectedActionable) {
          return
        }
      }

      const tokenId = !_.isEmpty(actionableTokens) && actionableTokens[0].id !== selectedTokenId ? actionableTokens[0].id : -1
      dispatch(setSelectedTokenId(tokenId));
    }
  }, [tokens, systemStage, dispatch, selectedTokenId]);
}

export default useAutoSelectToken;
