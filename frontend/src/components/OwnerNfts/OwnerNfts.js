import React, { useEffect, useState } from "react";
import "./OwnerNfts.scss";
import { Network, initializeAlchemy, getNftsForOwner } from "@alch/alchemy-sdk";
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

  // Optional Config object, but defaults to demo api-key and eth-mainnet.
  const settings = {
    apiKey: process.env.REACT_ALCHEMY_KEY, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
    maxRetries: 10,
  };

  const alchemy = initializeAlchemy(settings);

  const contractConfig = {
    addressOrName: contractAddress.DiamondDawn,
    contractInterface: ddContract.abi,
    signerOrProvider: signer || provider,
  };

  const contract = useContract(contractConfig);

  const [walletNfts, SetwalletNfts] = useState([]);

  const loadData = async () => {
    if (addressData?.address) {
      if (provider?._network?.chainId === 1) {
        let finalNfts = [];
        // for mainnet   "https://eth-mainnet.alchemyapi.io/nft/v2/demo/getNFTs/?owner=${addressData?.address}&contractAddresses[]=${contractAddress.DiamondDawn}"
        await getNftsForOwner(
          alchemy,
          "0x9469c98Be5AFD94cD601E094bc401dDD37F480a3",
          {
            contractAddresses: ["0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"],
          }
        ).then((result) => {
          let response = result?.ownedNfts;
          response.map((object) => {
            finalNfts.push({
              nftId: object?.tokenId,
              tokenUri: object?.tokenUri?.gateway || object?.tokenUri?.raw,
              metadata: object?.rawMetadata,
            });
          });
        });

        SetwalletNfts(finalNfts);
      } else {
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
