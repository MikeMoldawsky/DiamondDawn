import { useEffect } from "react";
import { useAccount } from "wagmi";

const useOnConnect = (onConnect, onDisconnect) => {
  const account = useAccount();

  useEffect(() => {
    onDisconnect && onDisconnect();
    if (account?.address) {
      onConnect && onConnect();
    }
  }, [account?.address]);
};

export default useOnConnect;
