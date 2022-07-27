import { useEffect } from "react";
import { useAccount } from "wagmi";

const useEffectWithAccount = (func, deps = []) => {

  const account = useAccount()

  useEffect(() => {
    if (account?.address) {
      func && func()
    }
  }, [account?.address, ...deps])
}

export default useEffectWithAccount