import { useEffect } from "react";
import { useAccount } from "wagmi";

const useEffectWithAccount = (func) => {

  const { data: account } = useAccount()

  useEffect(() => {
    if (account?.address) {
      func && func()
    }
  }, [account?.address])
}

export default useEffectWithAccount