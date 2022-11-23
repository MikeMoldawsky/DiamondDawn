import React from "react";
import "./MintAddressRow.scss";
import { useAccount } from "wagmi";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const MintAddressRow = () => {
  const account = useAccount();

  return account?.address ? (
    <div className="center-aligned-row minting-address-row">
      <div className="left-centered-aligned-column">
        <div className="text-sm">MINTING ADDRESS</div>
        <div className="address text-gold disabled">{account.address}</div>
      </div>
      <div className="center-aligned-column">
        <div className="button link icon-after" disabled title="Coming soon...">
          Change <ExitToAppIcon/>
        </div>
      </div>
    </div>
  ) : null;
};

export default MintAddressRow;
