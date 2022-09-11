import React, { useEffect, useState } from "react";
import _ from "lodash";
import useDDContract from "hooks/useDDContract";
import { useNavigate, useParams } from "react-router-dom";
import ActionButton from "components/ActionButton";
import { rebirthApi } from "api/contractApi";
import { DUMMY_VIDEO_URL } from "consts";
import ActionView from "components/ActionView";
import { useDispatch, useSelector } from "react-redux";
import { tokensSelector } from "store/tokensReducer";
import { setSelectedTokenId } from "store/uiReducer";

function RebirthPage() {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const contract = useDDContract();
  const tokens = useSelector(tokensSelector);
  const [isReady, setIsReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetch = async () => {
      const events = await contract.queryFilter(contract.filters.Transfer());
      console.log({ events });
    };
    if (tokenId) {
      fetch();
    }
  }, [tokenId]);

  useEffect(() => {
    try {
      const intTokenId = parseInt(tokenId);
      if (!_.isEmpty(tokens)) {
        const token = _.find(tokens, (t) => t.id === intTokenId);
        if (!token) {
          navigate("/");
        } else {
          dispatch(setSelectedTokenId(intTokenId));
          setIsReady(true);
        }
      }
    } catch (e) {
      navigate("/");
    }
  }, []);

  if (!isReady) return null;

  const RebirthContent = ({ execute }) => (
    <>
      <div className="leading-text">DIAMOND REBIRTH</div>
      <ActionButton actionKey="Rebirth" onClick={execute}>
        Rebirth
      </ActionButton>
    </>
  );

  return (
    <div className="page rebirth-page">
      <div className="inner-page">
        <ActionView
          transact={() => rebirthApi(contract, tokenId)}
          videoUrl={DUMMY_VIDEO_URL}
        >
          <RebirthContent />
        </ActionView>
      </div>
    </div>
  );
}

export default RebirthPage;
