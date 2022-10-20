import { useEffect } from "react";
import { useAccount } from "wagmi";

const useOnConnect = (onConnect, onDisconnect) => {
  const account = useAccount();

  useEffect(() => {
    if (account?.address) {
      onConnect && onConnect(account?.address);
    } else {
      onDisconnect && onDisconnect();
    }
  }, [account?.address]);
};

export default useOnConnect;
