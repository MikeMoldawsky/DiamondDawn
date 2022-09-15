import React from "react";
import _ from "lodash";
import classNames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import {
  clearActionStatus,
  isActionPendingSelector,
  setActionPending,
} from "store/actionStatusReducer";
import BeatLoader from "react-spinners/BeatLoader";
import { showError } from "utils";

const ActionButton = ({
  actionKey,
  className,
  onClick,
  disabled,
  children,
  ...props
}) => {
  const isPending = useSelector(isActionPendingSelector(actionKey));
  const dispatch = useDispatch();

  const clickHandler = async () => {
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
    <div
      className={classNames("button", _.kebabCase(actionKey), className, {
        disabled: disabled || isPending,
      })}
      onClick={clickHandler}
      {...props}
    >
      {isPending ? (
        <BeatLoader color={"#fff"} loading={true} size={10} />
      ) : (
        <div className="button-content">{children}</div>
      )}
    </div>
  );
};

export default ActionButton;
