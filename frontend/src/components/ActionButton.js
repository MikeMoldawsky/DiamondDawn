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
  onError,
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
      onError && onError(e);
    }
    dispatch(clearActionStatus(actionKey));
  };

  const showLoader = isLoading || isPending;

  return (
    <Button
      className={classNames(actionKey, className, { "is-loading": showLoader })}
      onClick={clickHandler}
      disabled={disabled || isLoading || isPending}
      {...props}
    >
      <span>{children}</span>
      {showLoader && (
        <BeatLoader
          className="btn-loader"
          color={"#fff"}
          loading={true}
          size={10}
        />
      )}
    </Button>
  );
};

export default ActionButton;
