import { useContract, useProvider, useSigner } from "wagmi";
import diamondDawnObject from "contracts/DiamondDawn.json";

function useDDContract() {
  const network = process.env.REACT_APP_NETWORK;
  if(!network){
    throw new Error("Deployment network is NOT configured. Set env variable")
  }
  const diamondDawn = diamondDawnObject[network];
  if(!network){
    throw new Error("Diamond Dawn contract object does NOT exist.")
  }

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
