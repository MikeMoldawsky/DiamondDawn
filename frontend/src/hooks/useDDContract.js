import { useContract, useProvider, useSigner } from "wagmi";
import { useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";

function useDDContract() {
  const { ddContractData } = useSelector(systemSelector)
  const provider = useProvider()
  const { data: signer } = useSigner()

  const contractConfig = {
    addressOrName: ddContractData.address,
    contractInterface: ddContractData.artifact.abi,
    signerOrProvider: signer || provider,
  }

  return useContract(contractConfig)
}

export default useDDContract;
