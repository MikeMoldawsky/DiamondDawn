import { useContract, useProvider, useSigner } from "wagmi";
import { useSelector } from "react-redux";
import { contractSelector } from "store/systemReducer";
import { CONTRACTS } from "consts";

function useDDContract(contractType = CONTRACTS.DiamondDawn) {
  const contractData = useSelector(contractSelector(contractType));
  const provider = useProvider();
  const { data: signer } = useSigner();

  const contractConfig = {
    address: contractData.address,
    abi: contractData.artifact.abi,
    signerOrProvider: signer || provider,
  };
  return useContract(contractConfig);
}

export default useDDContract;
