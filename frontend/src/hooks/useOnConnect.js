import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const useOnConnect = (onConnect, onDisconnect) => {
  const account = useAccount();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (account?.address) {
      if (isConnected) {
        // user switched
        onDisconnect && onDisconnect();
      }
      onConnect && onConnect(account?.address);
      setIsConnected(true);
    } else {
      onDisconnect && onDisconnect();
      setIsConnected(false);
    }
  }, [account?.address]);
};

export default useOnConnect;
