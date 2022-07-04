import React from "react";
import { useContract, useProvider, useSigner } from "wagmi";
import contractAddress from "contracts/contract-address.json";
import ddContract from "contracts/DiamondDawn.json";

function useDDContract() {

  const provider = useProvider()
  const { data: signer } = useSigner()
  const contractConfig = {
    addressOrName: contractAddress.DiamondDawn,
    contractInterface: ddContract.abi,
    signerOrProvider: signer || provider,
  }

  return useContract(contractConfig)
}

export default useDDContract;
