import React, { useEffect, useState } from "react";
import "./OwnerNfts.scss";
import { useDispatch, useSelector } from "react-redux";
import { systemSelector } from "store/systemReducer";
import contractAddress from "contracts/contract-address.json";
import ddContract from "contracts/DiamondDawn.json";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import axios from "axios";

const OwnerNfts = () => {
  const provider = useProvider();
  const { data: addressData } = useAccount();
  const { data: signer } = useSigner();

  const contractConfig = {
    addressOrName: contractAddress.DiamondDawn,
    contractInterface: ddContract.abi,
    signerOrProvider: signer || provider,
  };

  const contract = useContract(contractConfig);

  const [walletNfts, SetwalletNfts] = useState([]);

  const loadData = async () => {
    console.log(provider);
    if (addressData?.address) {
      if (provider?._network?.chainId === 1) {
        let finalNfts = [];
        // for mainnet   "https://eth-mainnet.alchemyapi.io/nft/v2/demo/getNFTs/?owner=${addressData?.address}&contractAddresses[]=${contractAddress.DiamondDawn}"
        let response = await axios.get(
          "https://eth-mainnet.alchemyapi.io/nft/v2/demo/getNFTs/?owner=0x9469c98Be5AFD94cD601E094bc401dDD37F480a3&contractAddresses[]=0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"
        );
        response = response.data.ownedNfts;
        response.map((object) => {
          console.log(object?.id?.tokenId && parseInt(object?.id?.tokenId, 16));
          finalNfts.push({
            nftId: object?.id?.tokenId && parseInt(object?.id?.tokenId, 16),
            tokenUri: object?.tokenUri?.gateway || object?.tokenUri?.raw,
            metadata: object?.metadata,
          });
        });

        SetwalletNfts(finalNfts);
      } else {
        console.log("shello");
        const nftsOwnedByOwner = await contract.walletOfOwner(
          addressData?.address
        );
        let wallet = [];
        nftsOwnedByOwner &&
          nftsOwnedByOwner?.length > 0 &&
          (await nftsOwnedByOwner.forEach(async (element) => {
            const tokenUri = await contract.tokenURI(element.toNumber());
            wallet.push({ nftId: element.toNumber(), tokenUri });
          }));
        SetwalletNfts(wallet);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [addressData]);

  return <div></div>;
};

export default OwnerNfts;
