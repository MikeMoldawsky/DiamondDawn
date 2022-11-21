import { useContract, useProvider, useSigner } from "wagmi";
import { useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";

function useDDContract() {
  const { ddContractInfo } = useSelector(systemSelector);
  const provider = useProvider();
  const { data: signer } = useSigner();

  const contractConfig = {
    address: ddContractInfo.address,
    abi: ddContractInfo.artifact.abi,
    signerOrProvider: signer || provider,
  };

  return useContract(contractConfig);
}

export default useDDContract;
