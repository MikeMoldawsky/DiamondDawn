import { useEffect } from "react";
import { useAccount } from "wagmi";

const useEffectWithAccount = (onConnect, onDisconnect) => {
  const account = useAccount();

  useEffect(() => {
    if (account?.address) {
      onConnect && onConnect();
    } else {
      onDisconnect && onDisconnect();
    }
  }, [account?.address]);
};

export default useEffectWithAccount;
