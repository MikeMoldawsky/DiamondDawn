import { useContract, useProvider, useSigner } from "wagmi";
import diamondDawn from "contracts/DiamondDawn.json";
import axios from "axios";

async function useDDContract() {
  if(!diamondDawn){
    throw new Error("Diamond Dawn contract object does NOT exist.")
  }
  axios.get(`/api/get_contract`)
      .then(res => console.log("Successfully got contract", res.data))
      .catch(e => console.log("Failed to get contract!!!!", e))

  const provider = useProvider()
  const { data: signer } = useSigner()
  const contractConfig = {
    addressOrName: diamondDawn.address,
    contractInterface: diamondDawn.artifact.abi,
    signerOrProvider: signer || provider,
  }

  return useContract(contractConfig)
}

export default useDDContract;
