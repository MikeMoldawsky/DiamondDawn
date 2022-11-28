import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {uiSelector} from "store/uiReducer";
import classNames from "classnames";

const CopyNotification = () => {
  const { copyNotification } = useSelector(uiSelector)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    setTimeout(() => {
      setVisible(true)
    }, 10)
  }, [copyNotification?.left, copyNotification?.top])

  if (!copyNotification) return null

  return (
    <div className={classNames("local-notification", { visible })} style={copyNotification}>
      COPIED!
    </div>
  );
};

export default CopyNotification;
