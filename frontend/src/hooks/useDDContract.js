import { useContract, useProvider, useSigner } from "wagmi";
import { useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";

function useDDContract() {
  const { ddContractInfo } = useSelector(systemSelector);
  const provider = useProvider();
  const { data: signer } = useSigner();

  const contractConfig = {
    addressOrName: ddContractInfo.address,
    contractInterface: ddContractInfo.artifact.abi,
    signerOrProvider: signer || provider,
  };

  return useContract(contractConfig);
}

export default useDDContract;
