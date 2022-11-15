import { useEffect } from "react";
import { useAccount } from "wagmi";

const useOnConnect = (onConnect, onDisconnect) => {
  const account = useAccount();

  useEffect(() => {
    if (account?.address) {
      console.log("USER CONNECTED");
      onConnect && onConnect(account?.address);
    } else {
      console.log("USER DISCONNECTED");
      onDisconnect && onDisconnect();
    }
  }, [account?.address]);
};

export default useOnConnect;
