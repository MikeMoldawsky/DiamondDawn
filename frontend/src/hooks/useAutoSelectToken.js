import { useEffect } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { ownedTokensSelector } from "store/tokensReducer";
import { setSelectedTokenId, uiSelector } from "store/uiReducer";
import { getActionableTokens } from "utils";
import { systemSelector } from "store/systemReducer";

function useAutoSelectToken(systemStage) {
  const dispatch = useDispatch();
  const { selectedTokenId } = useSelector(uiSelector);
  const tokens = useSelector(ownedTokensSelector);
  const { isActive } = useSelector(systemSelector);

  useEffect(() => {
    if (_.size(tokens) > 0) {
      const actionableTokens = getActionableTokens(
        tokens,
        systemStage,
        isActive
      );

      if (selectedTokenId !== -1) {
        const selectedActionable = _.find(
          actionableTokens,
          (token) => token.id === selectedTokenId
        );
        if (selectedActionable) {
          return;
        }
      }

      const tokenId =
        !_.isEmpty(actionableTokens) &&
        actionableTokens[0].id !== selectedTokenId
          ? actionableTokens[0].id
          : -1;
      dispatch(setSelectedTokenId(tokenId));
    }
  }, [tokens, systemStage, dispatch, selectedTokenId]);
}

export default useAutoSelectToken;
