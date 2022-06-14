import React, { useEffect, useRef, useState } from "react";
import _ from 'lodash'
import ReactPlayer from "react-player";
import videos from "./video";
import "./css/app.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVolumeHigh,
  faVolumeXmark,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
  wallet,
} from "@rainbow-me/rainbowkit";
import {
  chain,
  configureChains,
  createClient,
  infuraRpcUrls,
  WagmiConfig,
  defaultChains, useContract, useAccount, useBalance, useProvider, useContractWrite, useSigner
} from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import Wallet from "pages/Wallet";
import "@rainbow-me/rainbowkit/dist/index.css";
import Button from "components/Button";
import contractAddress from "contracts/contract-address.json";
import p2sContract from "contracts/PhysicalToDigital.json"
import { formatUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";

const renderStep = (step, gotoNextStep) => {
  switch (step) {
    case 0:
      return (<Mine gotoNextStep={gotoNextStep} />)
    case 1:
      return (
        <Button onClick={gotoNextStep}>CUT</Button>
      )
    case 2:
      return (
        <Button onClick={gotoNextStep}>POLISH</Button>
      )
    default:
      return null
  }
}

// const InternalApp = () => {
//   const { data: account } = useAccount()
//
//   return account ? <InternalApp2 /> : null
// }

const parseError = e => {
  let message = _.get(e, 'error.data.message', '')
  if (!message) return 'Unknown error'
  message = message.replace('Error: VM Exception while processing transaction: reverted with reason string \'P2D: ', '').substring(0)
  return message.substring(0, message.length - 1)
}

const Mine = ({ gotoNextStep }) => {
  const { data: account } = useAccount()
  const { data: balance } = useBalance({
    addressOrName: account?.address,
  })

  const provider = useProvider()
  const { data: signer } = useSigner()

  console.log({ signer })

  const contractConfig = {
    addressOrName: contractAddress.PhysicalToDigital,
    contractInterface: p2sContract.abi,
    signerOrProvider: signer || provider,
  }

  const [miningPrice, setMiningPrice] = useState(BigNumber.from(0))
  const [prepaidProcessingPrice, setPrepaidProcessingPrice] = useState(BigNumber.from(0))
  const [creditsInput, setCreditsInput] = useState(2)

  console.log({ prepaidProcessingPrice: formatUnits(prepaidProcessingPrice) })

  const contract = useContract(contractConfig)

  const totalCost = miningPrice.add(prepaidProcessingPrice.mul(creditsInput))

  // const { data: mineRes, isError, isLoading, write: mine } = useContractWrite(
  //   contractConfig,
  //   'mine',
  //   {
  //     args: [creditsInput],
  //     overrides: {
  //       // from: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  //       value: totalCost,
  //     },
  //   }
  // )
  //
  // console.log({ mineRes, isError, isLoading })

  const loadData = async () => {
    setMiningPrice(await contract.MINING_PRICE())
    setPrepaidProcessingPrice(await contract.PREPAID_PROCESSING_PRICE())
  }

  const mine = async () => {
    try {
      const response = await contract.mine(creditsInput, {value: totalCost})
      console.log('mine', { response })
      gotoNextStep()
    }
    catch (e) {
      console.error('MINE FAILED', parseError(e))
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="step-content">
      <div className="info">
        <div className="data-field">
          Mining Price: {miningPrice ? formatUnits(miningPrice) + 'ETH' : '-'}
        </div>
        <div className="data-field">
          Prepaid Processing Price: {prepaidProcessingPrice ? formatUnits(prepaidProcessingPrice) + 'ETH' : '-'}
        </div>
      </div>
      <div className="input-panel">
        <div className="data-field">
          <span>Process Credits</span>
          <select value={creditsInput} onChange={e => setCreditsInput(e.target.value)}>
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </div>
        <div className="data-field">
          Total cost: {formatUnits(totalCost)}ETH
        </div>
      </div>
      <div className="action">
        <Button onClick={() => mine(creditsInput)}>MINE</Button>
      </div>
    </div>
  )
}

function App() {
  const [step, setStep] = useState(0);
  const [muted, setMuted] = useState(true);
  const [hideContent, setHideContent] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [src, setSrc] = useState(videos[0]);
  let player = useRef(null);

  const gotoNextStep = () => {
    if (step > 1) return;
    handleHideContent();
    setTimeout(() => {
      // player.current.seekTo(0)
      setStep(step + 1);
    }, 250);
  };

  const handleHideContent = (onEnd) => {
    setHideContent(true);
    setTimeout(() => {
      setHideContent(false);
      onEnd && onEnd();
      setIsPlaying(true);
    }, 500);
  };

  const replayVideo = () => {
    handleHideContent(() => player.current.seekTo(0));
  };

  useEffect(() => {
    setTimeout(() => {
      // player.current.seekTo(8)
      setIsPlaying(false);
    }, 7000);
  }, [step]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     player.current.seekTo(8)
  //   }, 500)
  // }, [])

  // console.log({ step, isPlaying, hideContent });

  const localChain = {
    id: 31337,
    name: 'Local',
    network: 'local',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: 'http://127.0.0.1:8545/',
    },
    // blockExplorers: {
    //   default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
    // },
    testnet: true,
  }

  const { chains, provider } = configureChains(
    [chain.mainnet, chain.polygon, localChain],
    [
      infuraProvider({ infuraId: "dbe63b3bdfc84f3abdf38cdc8e22f492" }),
      publicProvider(),
    ]
  );

  // const { connectors } = getDefaultWallets({
  //   appName: "tweezers",
  //   chains,
  // });

  // const connectors = connectorsForWallets([
  //   {
  //     groupName: "Recommended",
  //     wallets: [
  //       wallet.metaMask({ chains }),
  //       wallet.coinbase({ chains }),
  //       wallet.walletConnect({ chains }),
  //     ],
  //   },
  // ]);
  const { connectors } = getDefaultWallets({
    appName: "tweezers App",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div
          className={classNames("app", {
            "show-content": !isPlaying,
            "hide-content": hideContent,
          })}
        >
          <header>
            <Wallet />
            <FontAwesomeIcon
              icon={muted ? faVolumeXmark : faVolumeHigh}
              onClick={() => setMuted(!muted)}
            />
          </header>
          <ReactPlayer
            ref={player}
            url="https://media.niftygateway.com/video/upload/v1638166907/Andrea/DavidAriew/DecVerified/SIRENSVERSE_yocjuq.mp4"
            playing={isPlaying}
            controls={false}
            muted={muted}
            volume={1}
            className="react-player"
            // width='unset'
            // height='unset'
            // onPlay={() => setIsPlaying(true)}
            // onEnded={() => setIsPlaying(false)}
          />
          <div className="content">
            {renderStep(step, gotoNextStep)}
          </div>
          {/*<InternalApp />*/}
          {/*<div className="content" onClick={gotoNextStep}>*/}
          {/*  Step {step}*/}
          {/*</div>*/}
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
