import React from 'react'
import { Dialog , DialogTitle, DialogContent, Button, DialogActions } from "@mui/material";

const Prompt = ({ text, handleYes, handleNo }) => {

  const noButtonRef = React.useRef(null);

  const handleEntered = () => {
    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
    // noButtonRef.current?.focus();
  };

  return (
    <Dialog
      maxWidth="xs"
      TransitionProps={{ onEntered: handleEntered }}
      open={true}
    >
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent dividers>{text}</DialogContent>
      <DialogActions>
        <Button ref={noButtonRef} onClick={handleNo}>No</Button>
        <Button onClick={handleYes}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Prompt