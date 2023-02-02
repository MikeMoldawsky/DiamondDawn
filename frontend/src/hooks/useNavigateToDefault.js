import { useSelector } from "react-redux";
import { ownedTokensSelector } from "store/tokensReducer";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import size from "lodash/size";

function useNavigateToDefault() {
  const navigate = useNavigate();
  const account = useAccount();
  const tokens = useSelector(ownedTokensSelector);

  return () => {
    navigate(account?.address && size(tokens) > 0 ? "/collector" : "/");
  };
}

export default useNavigateToDefault;
