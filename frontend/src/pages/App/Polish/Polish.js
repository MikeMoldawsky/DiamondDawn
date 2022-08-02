import React from "react";
import Countdown from 'components/Countdown';
import useDDContract from "hooks/useDDContract";
import { useSelector } from "react-redux";
import { uiSelector } from "store/uiReducer";
import {tokenByIdSelector, watchTokenProcessed} from "store/tokensReducer";
import { systemSelector } from "store/systemReducer";
import {DUMMY_VIDEO_URL, NFT_TYPE, STAGE} from "consts";
import NoDiamondView from "components/NoDiamondView";
import Diamond from "components/Diamond";
import _ from "lodash";
import ActionButton from "components/ActionButton";
import {isTokenOfType} from "utils";
import ActionView from "components/ActionView";

const Polish = () => {
  const contract = useDDContract()
  const { selectedTokenId } = useSelector(uiSelector)
  const token = useSelector(tokenByIdSelector(selectedTokenId))
  const { stageStartTimes } = useSelector(systemSelector)

  const endTime = _.get(stageStartTimes, 3)

  const PolishContent = ({ execute }) => isTokenOfType(token, NFT_TYPE.Cut) ? (
    <>
      <Diamond diamond={token} />
      <div className="leading-text">
        A GEM CANNOT BE POLISHED WITHOUT FRICTION,<br/>
        NOR MAN PERFECTED WITHOUT TRIALS
      </div>
      <div className="secondary-text">Discover the beauty, a billion years in the making</div>
      <div className="action">
        <ActionButton actionKey="Polish" className="action-button" onClick={execute}>POLISH</ActionButton>
      </div>
      <Countdown date={endTime} text={['You have', 'to polish']} />
    </>
  ) : <NoDiamondView stageName="polish" />

  return (
    <ActionView transact={() => contract.polish(selectedTokenId)}
                watch={watchTokenProcessed(selectedTokenId, STAGE.POLISH)}
                videoUrl={DUMMY_VIDEO_URL}>
      <PolishContent />
    </ActionView>
  )
}

export default Polish;
