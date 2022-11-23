import React, {useState} from "react";
import "./MintAddressRow.scss";
import { useAccount } from "wagmi";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ChangeMintAddressModal from "components/ChangeMintAddressModal/ChangeMintAddressModal";

const MintAddressRow = () => {
  const account = useAccount();
  const [modalOpen, setModalOpen] = useState(false)

  return account?.address ? (
    <>
      <div className="center-aligned-row minting-address-row">
        <div className="left-centered-aligned-column">
          <div className="text-sm">MINTING ADDRESS</div>
          <div className="address text-gold disabled">{account.address}</div>
        </div>
        <div className="center-aligned-column">
          <div className="button link icon-after" onClick={() => setModalOpen(true)}>
            Change <ExitToAppIcon />
          </div>
        </div>
      </div>
      {modalOpen && (
        <ChangeMintAddressModal close={() => setModalOpen(false)} />
      )}
    </>
  ) : null;
};

export default MintAddressRow;
