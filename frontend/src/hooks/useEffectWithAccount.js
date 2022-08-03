import { useEffect } from "react";
import { useAccount } from "wagmi";

const useEffectWithAccount = (func) => {
  const account = useAccount();

  useEffect(() => {
    if (account?.address) {
      func && func();
    }
  }, [account?.address]);
};

export default useEffectWithAccount;
