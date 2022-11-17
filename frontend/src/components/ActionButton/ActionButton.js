import React from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import {
  clearActionStatus,
  isActionPendingSelector,
  setActionPending,
} from "store/actionStatusReducer";
import BeatLoader from "react-spinners/BeatLoader";
import { showError } from "utils";
import Button from "components/Button";

const ActionButton = ({
  actionKey,
  className,
  onClick,
  disabled,
  isLoading,
  children,
  ...props
}) => {
  const isPending = useSelector(isActionPendingSelector(actionKey));
  const dispatch = useDispatch();

  const clickHandler = async (e) => {
    e.preventDefault();
    if (isPending || disabled || !onClick) return;
    dispatch(setActionPending(actionKey));
    try {
      await onClick();
    } catch (e) {
      showError(e, `${actionKey} Failed`);
    }
    dispatch(clearActionStatus(actionKey));
  };

  return (
    <Button className={classNames(actionKey, className)} onClick={clickHandler} disabled={disabled || isLoading || isPending} {...props}>
      {isLoading || isPending ? (
        <BeatLoader color={"#fff"} loading={true} size={10} />
      ) : children}
    </Button>
  )
};

export default ActionButton;
