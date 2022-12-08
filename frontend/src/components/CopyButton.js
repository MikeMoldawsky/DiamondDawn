import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Button from "components/Button";
import { useDispatch } from "react-redux";
import { updateUiState } from "store/uiReducer";

const CopyButton = ({ content, children, onCopy, ...props }) => {
  const dispatch = useDispatch();

  const onClick = (e) => {
    if (props?.disabled) return

    dispatch(
      updateUiState({ copyNotification: { left: e.pageX, top: e.pageY - 10 } })
    );

    onCopy &&
      setTimeout(() => {
        onCopy();
      }, 250);
  };

  return (
    <div onClick={onClick}>
      <CopyToClipboard text={content}>
        <Button className="sm icon-after gold" sfx="utility" {...props}>
          {children} <ContentCopyIcon />
        </Button>
      </CopyToClipboard>
    </div>
  );
};

export default CopyButton;
